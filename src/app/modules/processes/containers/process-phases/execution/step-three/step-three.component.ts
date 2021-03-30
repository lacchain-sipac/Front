import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { NotificationService } from '@shared/components/notification/notification.service';
import { Router } from '@angular/router';
import { ProjectsService } from '@modules/processes/projects.service';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { Subscription } from 'rxjs';
import { PHASE_CODES, Keys } from '@shared/helpers';
import { RulesService } from '@core/services/rules.service';
import { AccessType, IExecution, IProject } from '@shared/models/common/interfaces';
import { RoleService } from '@core/services/role.service';

@Component({
  selector: 'kt-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StepThreeComponent implements OnInit, OnDestroy {

  isPaymentComplete: boolean;
  isFinalPaymentComplete: boolean;
  isRetainerComplete: boolean;
  contractComplete: boolean;
  nextStepNumber = 4;
  codeStep = 'paso_03_03';
  isAccreditStepThree: boolean;
  selectedExecution: IExecution;
  hasAccesToUpload: boolean;
  textButtonNext: string;
  hasAccesEdit: boolean;
  updateExecutionSubscribtion: Subscription;

  constructor(
    private rulesService: RulesService,
    private roleService: RoleService,
    private notificationService: NotificationService,
    private router: Router,
    private projectService: ProjectsService,
    private executionService: ExecutionService
  ) { }

  ngOnInit() {
    this.projectService.project$.subscribe((project) => {
      this.selectedExecution = project.execution;
      const currentActiveRole = this.roleService.currentActiveRole;
      const currentUserId = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).id;
      this.isAccreditStepThree = project.execution.payment && project.execution.payment.accredited;
      this.hasAccesToUpload = currentActiveRole === 'ROLE_CONT'
        && project.execution.assignContractor.contractor.includes(currentUserId);

      this.hasAccesEdit = this.hasAccesEditProject(project);

      this.textButtonNext = !this.isAccreditStepThree ? 'Guardar y continuar' : 'Continuar';
    });
  }

  hasAccesEditProject(project: IProject): boolean {
    const hasAccessToWriteByRole = this.rulesService.userHasAccessToAction(PHASE_CODES.execution, this.codeStep, AccessType.write);
    const currentActiveRole = this.roleService.currentActiveRole;
    const currentUserId = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).id;
    const isContractorOrSupervisor = currentActiveRole === 'ROLE_CONT' || currentActiveRole === 'ROLE_SUP';

    if (isContractorOrSupervisor) {
      const usersWithAccesInproject = currentActiveRole === 'ROLE_CONT'
        ? project.execution.assignContractor.contractor
        : project.execution.assignContractor.supervising;

      return hasAccessToWriteByRole && usersWithAccesInproject.includes(currentUserId);
    }
    return hasAccessToWriteByRole;
  }

  ngOnDestroy() {
    if (this.updateExecutionSubscribtion) {
      this.updateExecutionSubscribtion.unsubscribe();
    }
  }

  paymentSection(event) {
    this.isPaymentComplete = event;
  }

  finalPaymentSection(event) {
    this.isFinalPaymentComplete = event;
  }

  retainerSection(event) {
    this.isRetainerComplete = event;
  }

  contractSection(event) {
    this.contractComplete = event;
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

  private updateProcess() {
    const currentStep = this.projectService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: IExecution = {
      ...this.selectedExecution, currentStep, codeStep
    };
    this.updateExecutionSubscribtion = this.executionService.updateExecution(payload).subscribe((response) => {
      if (response.status === '00000') {
        this.handleSuccessfulUpdate();
      } else {
        this.notificationService.error(response.message);
      }
    });
  }

  goBack() {
    this.router.navigate([`home/processes/${this.selectedExecution.idProject}/execution/step-two`]);
  }

  navigateNextStep(): void {
    this.router.navigate([`home/processes/${this.selectedExecution.idProject}/execution/step-four`]);
  }

  next(): void {
    if (this.isAccreditStepThree) { return this.navigateNextStep(); }
    if (!this.hasAccesEdit && !this.isAccreditStepThree) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }

    this.validateNextStepByDocs();
  }

  get tabsCompleted() {
    return this.isPaymentComplete && this.isFinalPaymentComplete && this.isRetainerComplete && this.contractComplete;
  }

  validateNextStepByDocs() {
    if (this.tabsCompleted) { return this.updateProcess(); }
    this.notificationService.warn('Por favor, asegurese que los documentos que subió esten con sus adjuntos completos. Los documentos de la sección de pagos y pago final son obligatorios');
  }

}
