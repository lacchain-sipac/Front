import { Component, OnInit, OnDestroy } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ParametersService } from '@core/services/parameters.service';
import { ISelectsAcquisitionMethodForm, IHttpResponse } from '@shared/models/response/interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NotificationService } from '@shared/components/notification/notification.service';
import { CC_REQUEST_STEP_THREE } from '@shared/helpers';
import { ICCRequestStepThree, ISolicitude, AccessType } from '@shared/models/common/interfaces';
import { ProjectsService } from '@modules/processes/projects.service';
import { RulesService } from '@core/services/rules.service';

@Component({
  selector: 'kt-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit, OnDestroy {

  acquisitionMethodForm: FormGroup;
  private customMethod = '99';
  hasAccesEdit: boolean;
  textButtonNext: string;
  selects$: Observable<ISelectsAcquisitionMethodForm>;

  selectedSolicitude: ISolicitude;
  ccRequestStepThree: ICCRequestStepThree = CC_REQUEST_STEP_THREE;
  nextStepNumber = 4;
  codeStep = 'paso_01_03';

  constructor(
    private parametersService: ParametersService,
    private projectsService: ProjectsService,
    private rulesService: RulesService,
    private router: Router,
    private fb: FormBuilder,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.chargeSelects();
    this.hasAccesEdit = this.rulesService.userHasAccessToAction('fase_01', 'paso_01_03', AccessType.write);
    this.textButtonNext = 'Guardar y continuar';
    this.acquisitionMethodForm = this.createForm();
    if (!this.hasAccesEdit) {
      this.acquisitionMethodForm.disable();
    }
    this.selectedSolicitude = this.projectsService.currentProject.solicitude;
    this.updateForm(this.selectedSolicitude);
  }

  chargeSelects() {
    this.selects$ = forkJoin(
      this.parametersService.getParameterByType('Method'),
      this.parametersService.getParameterByType('TypeContract'),
    ).pipe(
      map(([
        acquisitionMethod,
        contractType,
      ]) => {
        return {
          acquisitionMethod: acquisitionMethod.data,
          contractType: contractType.data,
        };
      })
    );
  }

  updateForm(values) {
    if (values.acquisitionMethod) {
      const { acquisitionMethod, contractType, newMethod } = values.acquisitionMethod;
      this.acquisitionMethodForm.patchValue({
        acquisitionMethod,
        contractType,
        newMethod
      });

      if (this.acquisitionMethodForm.value.acquisitionMethod !== this.customMethod) {
        this.acquisitionMethodForm.controls.newMethod.disable();
      }
    }
  }

  createForm() {
    return this.fb.group({
      acquisitionMethod: ['', [Validators.required]],
      contractType: ['', [Validators.required]],
      newMethod: ['', [Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccRequestStepThree.newMethod.maxlength),
        Validators.minLength(this.ccRequestStepThree.newMethod.minlength)
      ])]]
    });
  }

  acquisitionMethodSelected(event): void {
    if (event.value !== this.customMethod) {
      this.acquisitionMethodForm.controls.newMethod.disable();
      this.acquisitionMethodForm.get('newMethod').reset();
    } else {
      this.acquisitionMethodForm.controls.newMethod.enable();
    }
  }

  errorForm(field: string, type: string) {
    return this.acquisitionMethodForm.get(field).hasError(type);
  }

  goBack() {
    this.router.navigate([`home/processes/${this.selectedSolicitude.idProject}/request/step-two`]);
  }

  handleSuccessfulUpdate() {
    this.notificationService.success('Los datos registrados se han guardado exitosamente.');
    setTimeout(
      () => this.navigateNextStep(),
      5000
    );
  }

  navigateNextStep(): void {
    this.router.navigate([`home/processes/${this.selectedSolicitude.idProject}/request/step-four`]);
  }

  updateSolicitude(): void {
    const acquisitionMethod = this.acquisitionMethodForm.value;
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: ISolicitude = {
      ...this.selectedSolicitude,
      acquisitionMethod,
      currentStep,
      codeStep
    };
    this.projectsService.updateSolicitude(payload).subscribe({
      next: (response: IHttpResponse) => {
        if (response.status === '00000') {
          this.handleSuccessfulUpdate();
        } else {
          this.notificationService.warn(response.message);
        }
      }
    });
  }

  next() {
    if (!this.hasAccesEdit) { return this.navigateNextStep(); }
    if (this.acquisitionMethodForm.valid) { return this.updateSolicitude(); }
  }

  ngOnDestroy() {
  }

}
