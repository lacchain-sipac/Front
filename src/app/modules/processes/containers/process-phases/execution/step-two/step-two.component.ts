import { Component, OnInit } from '@angular/core';
import { CC_EXECUTION_STEP_TWO, PHASE_CODES } from '@shared/helpers';
import { ICCExecutionStepTwo, IUser, IExecution, AssignContractor, AccessType } from '@shared/models/common/interfaces';
import { ISelectsContractorAndSupervisor, IHttpResponse } from '@shared/models/response/interfaces';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { NotificationService } from '@shared/components/notification/notification.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { ProjectsService } from '@modules/processes/projects.service';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { RulesService } from '@core/services/rules.service';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';

@Component({
  selector: 'kt-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})
export class StepTwoComponent implements OnInit {

  ccExecutionStepTwo: ICCExecutionStepTwo = CC_EXECUTION_STEP_TWO;
  selects$: Observable<ISelectsContractorAndSupervisor>;
  contractorUsers: IUser[];
  supervisorUsers: IUser[];
  codeStep = 'paso_03_02';
  textButtonNext: string;
  hasAccesEdit: boolean;
  phaseCode: string;
  nextStepNumber = 3;
  contractorAndSupervisorForm: FormGroup;
  selectedExecution: IExecution;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private rulesService: RulesService,
    private projectsService: ProjectsService,
    private executionService: ExecutionService,
    private notificationService: NotificationService,
  ) { }

  ngOnInit() {
    this.openModaConfirmation();
    this.phaseCode = PHASE_CODES.processes;
    this.selectedExecution = this.projectsService.currentProject.execution;
    this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.execution, this.codeStep, AccessType.write);
    const isAccreditStepTwo = this.selectedExecution.assignContractor && this.selectedExecution.assignContractor.accredited;
    this.textButtonNext = !isAccreditStepTwo ? 'Guardar y continuar' : 'Continuar';
    this.contractorAndSupervisorForm = this.createForm();
    this.chargeSelects();
    this.setValuesToForm(this.selectedExecution);

    if (!this.hasAccesEdit || isAccreditStepTwo) {
      this.contractorAndSupervisorForm.disable();
    }
  }

  openModaConfirmation(): void {
    const dialogRef = this.dialog.open(ModalConfirmationComponent, {
      data: {
        isInformative: true,
        textButtonExecution: 'Cerrar',
        title: 'ADVERTENCIA',
        description:
          'El tiempo de espera para guardar cada usuario contratista o supervisor que se seleccione es de 20 segundos por cada uno'
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => { }
    });
  }

  createForm(): FormGroup {
    return this.fb.group({
      contractor: [[], [Validators.required]],
      supervising: [[], [Validators.required]],
    });
  }

  setValuesToForm(values) {
    if (values.assignContractor) {
      const { contractor, supervising } = values.assignContractor;
      this.contractorAndSupervisorForm.patchValue({
        contractor,
        supervising,
      });
    }
  }

  errorForm(field: string, type: string) {
    return this.contractorAndSupervisorForm.get(field).hasError(type);
  }

  chargeSelects() {
    this.selects$ = forkJoin(
      this.executionService.getsUsersByRole('ROLE_CONT'),
      this.executionService.getsUsersByRole('ROLE_SUP'),
    ).pipe(
      map(([
        idContractor,
        idSupervising,
      ]) => {
        return {
          idContractor: idContractor.data,
          idSupervising: idSupervising.data,
        };
      })
    );
  }

  updateExecution() {
    const assignContractor: AssignContractor = this.contractorAndSupervisorForm.value;
    assignContractor.accredited = true;
    const codeStep = this.codeStep;
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const payload: IExecution = {
      ...this.selectedExecution, assignContractor, currentStep, codeStep
    };

    this.executionService.updateExecution(payload).subscribe({
      next: (response: IHttpResponse) => {
        if (response.status === '00000') {
          this.handleSuccessfulUpdate();
        } else {
          this.notificationService.warn(response.message);
        }
      }
    });
  }

  navigateNextStep() {
    this.router.navigate([`home/processes/${this.selectedExecution.idProject}/execution/step-three`]);
  }

  handleSuccessfulUpdate() {
    this.notificationService.success(`Estimado Usuario,
    es necesario que los contratistas y supervisores adjunten y aprueben, los anticipos de pagos, pago de estimación y pago final`);
    setTimeout(
      () => this.navigateNextStep(),
      8000
    );
  }

  goBack() {
    this.router.navigate([`home/processes/${this.selectedExecution.idProject}/execution/step-one`]);
  }

  validateForm() {
    const isAccreditStepTwo = this.selectedExecution.assignContractor && this.selectedExecution.assignContractor.accredited;

    if (!this.hasAccesEdit && !isAccreditStepTwo) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (isAccreditStepTwo) { return this.navigateNextStep(); }
    if (this.contractorAndSupervisorForm.valid) { return this.updateExecution(); }
    this.notificationService.warn('Por favor, debe seleccionar al menos un contratista y un supervisor.');
  }

}
