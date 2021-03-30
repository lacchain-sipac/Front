import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IProcess, ICCRequestStepFive, ILoadStructure, ISolicitude, IBudgetStructure, AccessType } from '@shared/models/common/interfaces';
import { ProcessService } from '@modules/processes/process.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ProjectsService } from '@modules/processes/projects.service';
import { CC_REQUEST_STEP_FIVE, PHASE_CODES, Keys } from '@shared/helpers';
import { RulesService } from '@core/services/rules.service';

@Component({
  selector: 'kt-step-five',
  templateUrl: './step-five.component.html',
  styleUrls: ['./step-five.component.scss']
})

export class StepFiveComponent implements OnInit {

  selectedProcess: IProcess;
  codeStep = 'paso_02_05';
  textButtonNext: string;
  hasAccesEdit: boolean;
  phaseCode: string;
  selectedSolicitude: ISolicitude;
  nextStepNumber = 6;
  budgetStructureBurden: FormGroup;
  ccRequestStepFive: ICCRequestStepFive = CC_REQUEST_STEP_FIVE;


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private rulesService: RulesService,
    private notificationService: NotificationService,
    private projectsService: ProjectsService,
    private processService: ProcessService,
  ) { }

  ngOnInit() {
    this.phaseCode = PHASE_CODES.processes;
    this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.processes, this.codeStep, AccessType.write);
    let budgetStructure: ILoadStructure | IBudgetStructure;
    this.budgetStructureBurden = this.createForm();
    this.selectedProcess = this.projectsService.currentProject.process;
    const stepFiveIsAccredited = this.selectedProcess.loadStructure && this.selectedProcess.loadStructure.accredited;
    this.textButtonNext = !stepFiveIsAccredited ? 'Guardar y continuar' : 'Continuar';
    this.selectedSolicitude = this.projectsService.currentProject.solicitude;

    if (!this.hasAccesEdit || stepFiveIsAccredited) { this.budgetStructureBurden.disable(); }

    budgetStructure = (this.selectedProcess.loadStructure)
      ? this.selectedProcess.loadStructure
      : this.selectedSolicitude.budgetStructure;

    this.setValuesToForm(budgetStructure);
  }

  createForm() {
    return this.fb.group({
      availabilityStructure: [false, [Validators.required]],
      budgetStructure: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccRequestStepFive.budgetStructure.maxlength),
        Validators.minLength(this.ccRequestStepFive.budgetStructure.minlength)
      ])],
      additionalComment: ['', Validators.compose([
        Validators.maxLength(this.ccRequestStepFive.additionalComment.maxlength),
        Validators.minLength(this.ccRequestStepFive.additionalComment.minlength)
      ])]
    });
  }

  errorForm(field: string, type: string) {
    return this.budgetStructureBurden.get(field).hasError(type);
  }

  setValuesToForm(values: ILoadStructure | IBudgetStructure) {
    const { availabilityStructure, budgetStructure, additionalComment } = values;
    this.budgetStructureBurden.patchValue({
      availabilityStructure,
      budgetStructure,
      additionalComment
    });

    if (this.budgetStructureBurden.value.availabilityStructure) {
      if (!this.selectedProcess.loadStructure) {
        this.budgetStructureBurden.controls.budgetStructure.disable();
        this.budgetStructureBurden.controls.availabilityStructure.disable();
        this.budgetStructureBurden.controls.additionalComment.disable();
      }
    } else {
      this.budgetStructureBurden.controls.budgetStructure.disable();
    }
  }

  goBack() {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-four`]);
  }

  changeHaveBudgeStructure(event): void {
    if (event.target.checked) {
      this.budgetStructureBurden.controls.budgetStructure.enable();
    } else {
      this.budgetStructureBurden.controls.budgetStructure.disable();
      this.budgetStructureBurden.controls.budgetStructure.reset('');
    }
  }

  handleSuccessfulUpdate() {
    const userName = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).fullname;
    this.notificationService.success(`Estimado(a) ${userName}, se han guardado los cambios realizados,
     se enviará un correo al siguiente ROL para continuar con el proceso.`);
    setTimeout(
      () => this.navigateNextStep(),
      8000
    );
  }

  navigateNextStep() {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-six`]);
  }

  validateCorrectStructure(budgetStructure) {
    if (this.budgetStructureBurden.valid) {
      if (budgetStructure) { return this.updateProcess(); }
      return this.notificationService.warn('Para continuar, se necesita tener una estructura presupuestaria');
    }

    if (!this.selectedProcess.loadStructure && this.selectedSolicitude.budgetStructure.availabilityStructure) {
      return this.updateProcess();
    }
  }

  validateForm() {
    const stepFiveIsAccredited = this.selectedProcess.loadStructure && this.selectedProcess.loadStructure.accredited;
    const budgetStructure = this.budgetStructureBurden.value.budgetStructure;
    if (!this.hasAccesEdit && !stepFiveIsAccredited) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (stepFiveIsAccredited) { return this.navigateNextStep(); }
    return this.validateCorrectStructure(budgetStructure);
  }

  updateProcess() {
    const loadStructure: ILoadStructure = this.budgetStructureBurden.value;
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: IProcess = {
      ...this.selectedProcess, currentStep, loadStructure, codeStep
    };
    this.processService.updateProcess(payload).subscribe({
      next: (response) => {
        if (response.status === '00000') {
          this.handleSuccessfulUpdate();
        } else {
          this.notificationService.error(response.message);
        }
      }
    });
  }
}
