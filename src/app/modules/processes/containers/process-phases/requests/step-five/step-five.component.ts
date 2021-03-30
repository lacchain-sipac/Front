import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { ICCRequestStepFive, ISolicitude, AccessType } from '@shared/models/common/interfaces';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CC_REQUEST_STEP_FIVE, Keys } from '@shared/helpers';
import { MatDialog } from '@angular/material';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { Router } from '@angular/router';
import { RulesService } from '@core/services/rules.service';
import { RoleService } from '@core/services/role.service';
import { IHttpResponse } from '@shared/models/response/interfaces';

@Component({
  selector: 'kt-step-five',
  templateUrl: './step-five.component.html',
  styleUrls: ['./step-five.component.scss']
})

export class StepFiveComponent implements OnInit {

  availabilityStructureForm: FormGroup;
  selectedSolicitude: ISolicitude;
  processName: string;
  textButtonNext: string;
  hasAccesEdit: boolean;
  stepNumber = 5;
  codeStep = 'paso_01_05';

  ccRequestStepFive: ICCRequestStepFive = CC_REQUEST_STEP_FIVE;

  constructor(
    private router: Router,
    private roleService: RoleService,
    private projectsService: ProjectsService,
    private rulesService: RulesService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.availabilityStructureForm = this.createForm();
    this.selectedSolicitude = this.projectsService.currentProject.solicitude;
    this.hasAccesEdit = this.rulesService.userHasAccessToAction('fase_01', 'paso_01_05', AccessType.write);
    this.textButtonNext = 'Confirmar';
    const processName = this.selectedSolicitude.dataProcess.processName;
    this.processName = processName ? processName : '';

    if (!this.hasAccesEdit) {
      this.availabilityStructureForm.disable();
    }

    this.setValuesToForm(this.selectedSolicitude);
  }

  createForm() {
    return this.fb.group({
      viable: [false, [Validators.required]],
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

  changeHaveBudgeStructure(event): void {
    if (event.target.checked) {
      this.availabilityStructureForm.controls.budgetStructure.enable();
    } else {
      this.availabilityStructureForm.controls.budgetStructure.disable();
      this.availabilityStructureForm.controls.budgetStructure.reset();
    }
  }

  setValuesToForm(values) {
    if (values.budgetStructure) {
      const { availabilityStructure, budgetStructure, viable, additionalComment } = values.budgetStructure;
      this.availabilityStructureForm.patchValue({
        availabilityStructure,
        budgetStructure,
        viable,
        additionalComment
      });

      if (!this.availabilityStructureForm.value.availabilityStructure) {
        this.availabilityStructureForm.controls.budgetStructure.disable();
      }
    } else {
      this.availabilityStructureForm.controls.budgetStructure.disable();
    }
  }

  errorForm(field: string, type: string) {
    return this.availabilityStructureForm.get(field).hasError(type);
  }

  goBack() {
    this.router.navigate([`home/processes/${this.selectedSolicitude.idProject}/request/step-four`]);
  }

  handleSuccessfulUpdate() {
    const userName = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).fullname;
    this.notificationService.success(`Estimado(a) ${userName}, se han guardado los cambios que has ingresado,
    se enviará un correo al siguiente ROL para que continúe con el registro de la solicitud.`);
    setTimeout(() => this.router.navigate([`home/processes`]), 8000);
  }

  validateForm() {
    const currentRole = this.roleService.currentActiveRole;

    if (!this.hasAccesEdit) {
      return (currentRole === 'ROLE_COO_TEC' && !!this.selectedSolicitude.budgetStructure)
        ? this.openModaConfirmation(true)
        : this.router.navigate([`home/processes`]);
    }

    if (this.availabilityStructureForm.valid) {
      this.openModaConfirmation(false);
    }
  }

  updateSolicitude(finishSolicitude) {
    const budgetStructure = this.availabilityStructureForm.value;
    const currentStep = this.stepNumber;
    const codeStep = this.codeStep;
    const payload: ISolicitude = {
      ...this.selectedSolicitude, budgetStructure, currentStep, codeStep, finishSolicitude
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

  openModaConfirmation(finishSolicitude): void {
    const dialogRef = this.dialog.open(ModalConfirmationComponent, {
      data: {
        textButtonExecution: 'Sí',
        textButtonReject: 'Volver',
        title: 'CONFIRMAR',
        description: '¿Está seguro que desea confirmar la solicitud?'
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'execution') {
          this.updateSolicitude(finishSolicitude);
        }
      }
    });
  }

}
