import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectsService } from '@modules/processes/projects.service';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { ISolicitude, ICCRequestStepFive, IExecution, QualityGuarantee, AccessType } from '@shared/models/common/interfaces';
import { CC_REQUEST_STEP_FIVE, PHASE_CODES, Keys } from '@shared/helpers';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { RulesService } from '@core/services/rules.service';
import { NotificationService } from '@shared/components/notification/notification.service';

@Component({
  selector: 'kt-step-five',
  templateUrl: './step-five.component.html',
  styleUrls: ['./step-five.component.scss']
})
export class StepFiveComponent implements OnInit {

  ccRequestStepFive: ICCRequestStepFive = CC_REQUEST_STEP_FIVE;
  codeStep = 'paso_03_05';
  textButtonNext: string;
  stepFiveIsAccredited: boolean;
  hasAccesEdit: boolean;
  qualityQuaranteeForm: FormGroup;
  selectedSolicitude: ISolicitude;
  selectedExecution: IExecution;

  constructor(
    private rulesService: RulesService,
    private dialog: MatDialog,
    private router: Router,
    private projectsService: ProjectsService,
    private executionService: ExecutionService,
    private notificationService: NotificationService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.selectedSolicitude = this.projectsService.currentProject.solicitude;
    this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.execution, this.codeStep, AccessType.write);
    this.qualityQuaranteeForm = this.createForm();
    this.selectedExecution = this.projectsService.currentProject.execution;
    this.stepFiveIsAccredited = this.selectedExecution.qualityGuarantee && this.selectedExecution.qualityGuarantee.accredited;
    this.textButtonNext = (this.hasAccesEdit && !this.stepFiveIsAccredited) ? 'Guardar y Terminar' : 'Terminar';

    if (!this.hasAccesEdit || this.stepFiveIsAccredited) {
      this.qualityQuaranteeForm.disable();
    }

    this.setValuesToForm(this.selectedExecution);
  }

  createForm() {
    return this.fb.group({
      hasQualityGuarantee: [false, [Validators.required]],
      observation: ['', Validators.compose([
        Validators.maxLength(this.ccRequestStepFive.additionalComment.maxlength),
        Validators.minLength(this.ccRequestStepFive.additionalComment.minlength)
      ])]
    });
  }

  errorForm(field: string, type: string) {
    return this.qualityQuaranteeForm.get(field).hasError(type);
  }

  setValuesToForm(values) {
    if (values.qualityGuarantee) {
      const { hasQualityGuarantee, observation } = values.qualityGuarantee;
      this.qualityQuaranteeForm.patchValue({
        hasQualityGuarantee,
        observation
      });
    }
  }

  updateExecution() {
    const observation = this.qualityQuaranteeForm.value.observation;
    const codeStep = this.codeStep;
    const finishExecute = true;
    this.qualityQuaranteeForm.value.observation = !!observation ? observation : '';
    const qualityGuarantee: QualityGuarantee = this.qualityQuaranteeForm.value;
    const payload: IExecution = {
      ...this.selectedExecution, qualityGuarantee, finishExecute, codeStep
    };

    this.executionService.updateExecution(payload).subscribe({
      next: (response) => {
        if (response.status === '00000') {
          const userName = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).fullname;
          this.notificationService.success(`Estimado(a) ${userName}, se han guardado los cambios realizados,
          se enviará un correo al siguiente ROL para cerrar el ciclo financiero.`);
          setTimeout(
            () => this.router.navigate([`home/processes`]),
            8000);
        } else {
          this.notificationService.error(response.message);
        }
      }
    });
  }

  goBack() {
    this.router.navigate([`home/processes/${this.selectedExecution.idProject}/execution/step-four`]);
  }

  validateForm() {
    if (!this.hasAccesEdit && !this.stepFiveIsAccredited) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (this.stepFiveIsAccredited) { return this.router.navigate([`home/processes`]); }
    if (this.qualityQuaranteeForm.valid && this.qualityQuaranteeForm.value.hasQualityGuarantee) {
      this.openModalConfirmation();
    }
  }

  openModalConfirmation(): void {
    const processName = this.selectedSolicitude.dataProcess.processName ? this.selectedSolicitude.dataProcess.processName : '';

    const dialogRef = this.dialog.open(ModalConfirmationComponent, {
      data: {
        textButtonExecution: 'Si, guardar',
        textButtonReject: 'Volver',
        title: 'CONFIRMAR',
        description: `¿Está seguro que desea terminar la Fase de Pagos del proceso ${processName}?`,
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'execution') {
          this.updateExecution();
        }
      }
    });
  }

}
