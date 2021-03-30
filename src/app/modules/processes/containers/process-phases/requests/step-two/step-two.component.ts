import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ParametersService } from '@core/services/parameters.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ICCRequestStepTwo, IUnit, ISolicitude, AccessType, IFinancingLine } from '@shared/models/common/interfaces';
import { CC_REQUEST_STEP_TWO } from '@shared/helpers';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { ThousandFormatPipe } from '@shared/pipes/thousand-format.pipe';
import { ProjectsService } from '@modules/processes/projects.service';
import { RulesService } from '@core/services/rules.service';

@Component({
  selector: 'kt-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss'],
  providers: [ThousandFormatPipe]

})
export class StepTwoComponent implements OnInit, OnDestroy {

  fgRequestStepTwo: FormGroup;
  units$: Observable<IUnit[]>;
  ccRequestStepTwo: ICCRequestStepTwo = CC_REQUEST_STEP_TWO;
  selectedSolicitude: ISolicitude;
  processSubscription: Subscription;
  nextStepNumber = 3;
  codeStep = 'paso_01_02';
  textButtonNext: string;
  hasAccesEdit: boolean;
  codeAmount = 'USD';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private parametersService: ParametersService,
    private rulesService: RulesService,
    private projectsService: ProjectsService,
    public notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.fgRequestStepTwo = this.createForm();
    this.hasAccesEdit = this.rulesService.userHasAccessToAction('fase_01', 'paso_01_02', AccessType.write);
    this.textButtonNext = 'Guardar y continuar';
    if (!this.hasAccesEdit) {
      this.fgRequestStepTwo.disable();
    }

    this.units$ = this.parametersService.getParameterByType('Unit').pipe(
      map(response => {
        return response.data;
      })
    );

    this.processSubscription = this.projectsService.project$.subscribe((project) => {
      this.selectedSolicitude = project.solicitude;
      this.setValuesToForm();
    });
  }

  ngOnDestroy() {
    this.processSubscription.unsubscribe();
  }

  createForm(): FormGroup {
    return this.fb.group({
      pacLine: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccRequestStepTwo.pacLine.maxlength),
        Validators.minLength(this.ccRequestStepTwo.pacLine.minlength),
      ])],
      quantity: ['', Validators.compose([
        Validators.required,
        Validators.max(this.ccRequestStepTwo.quantity.maxLimitNumber),
        Validators.maxLength(this.ccRequestStepTwo.quantity.maxlength),
        Validators.minLength(this.ccRequestStepTwo.quantity.minlength),
      ])],
      unit: ['', Validators.compose([
        Validators.required,
      ])],
      description: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccRequestStepTwo.description.maxlength),
        Validators.minLength(this.ccRequestStepTwo.description.minlength),
      ])],
      estimatedAmount: ['', Validators.compose([
        Validators.required,
        Validators.max(this.ccRequestStepTwo.estimatedAmount.maxLimitNumber),
        Validators.maxLength(this.ccRequestStepTwo.estimatedAmount.maxlength),
        Validators.minLength(this.ccRequestStepTwo.estimatedAmount.minlength),
      ])],
    });
  }

  setValuesToForm() {
    if (this.selectedSolicitude.financingLine) {
      const financingLine = this.selectedSolicitude.financingLine;
      this.fgRequestStepTwo.patchValue({
        pacLine: financingLine.pacLine,
        quantity: financingLine.quantity,
        unit: financingLine.unit,
        description: financingLine.description,
        estimatedAmount: financingLine.estimatedAmount.amount
      });
    }
  }

  errorForm(field: string, type: string) {
    return this.fgRequestStepTwo.get(field).hasError(type);
  }

  goBack() {
    this.router.navigate([`home/processes/${this.selectedSolicitude.idProject}/request/step-one`]);
  }

  handleSuccessfulUpdate() {
    this.notificationService.success('Los datos registrados se han guardado exitosamente.');
    setTimeout(
      () => this.navigateNextStep(),
      5000
    );
  }

  navigateNextStep(): void {
    this.router.navigate([`home/processes/${this.selectedSolicitude.idProject}/request/step-three`]);
  }

  formatNumberToSave(value) {
    value = value.replace(/,/g, '');
    if (value % 1 === 0) {
      return value;
    } else {
      const integer = value.toString().split('.')[0];
      const fraction = value.toString().split('.')[1];
      return integer + '.' + fraction.substring(0, 2);
    }
  }

  updateSolicitude(): void {
    const financingLine: IFinancingLine = this.fgRequestStepTwo.value;
    financingLine.quantity = this.formatNumberToSave(financingLine.quantity);
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;

    financingLine.estimatedAmount = {
      amount: this.formatNumberToSave(financingLine.estimatedAmount),
      code: this.codeAmount
    };

    const payload: ISolicitude = {
      ...this.selectedSolicitude, financingLine, currentStep, codeStep
    };

    this.projectsService.updateSolicitude(payload).subscribe((response) => {
      if (response.status === '00000') {
        this.handleSuccessfulUpdate();
      } else {
        this.notificationService.error(response.message);
      }
    });
  }

  next(): void {
    if (!this.hasAccesEdit) { return this.navigateNextStep(); }
    if (this.fgRequestStepTwo.valid) { this.updateSolicitude(); }
  }

}
