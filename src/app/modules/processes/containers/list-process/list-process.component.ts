import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DateAgoPipe } from '@shared/pipes/date-ago.pipe';
import { MatTableDataSource, MatPaginator, MatSort, TooltipPosition } from '@angular/material';
import { NavigationExtras, Router } from '@angular/router';
import { ProjectsService } from '../../projects.service';
import { ProjectViewer } from '@shared/models/common/classes/index';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { ListColumn } from '@shared/models/common/classes';
import { NotificationService } from '@shared/components/notification/notification.service';
import { COLUMNS_PROCESS, ProjectCodes, Keys } from '@shared/helpers';
import { IMenuEvent, IMenu, AccessType } from '@shared/models/common/interfaces';
import { PROCESS_STATES, STEPS_ROUTES, ACTIONS_CODES, MENU_EXECUTION, MENU_PROCESS, MENU_REQUEST } from '@shared/helpers/constants';
import { MatDialog } from '@angular/material';
import { Subscription, Observable } from 'rxjs';
import { RoleService } from '@core/services/role.service';
import { RulesService } from '@core/services/rules.service';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { ProcessService } from '@modules/processes/process.service';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { PhaseService } from '@modules/processes/services/phase.service';

@Component({
  selector: 'kt-list-process',
  templateUrl: './list-process.component.html',
  styleUrls: ['./list-process.component.scss'],
  providers: [DateAgoPipe, DatePipe]
})

export class ListProcessComponent implements OnInit, AfterViewInit, OnDestroy {

  title = 'BANDEJA DE PROCESOS';
  defaultProcessName = 'Proceso sin datos';
  isActionsToPhases = true;
  position: TooltipPosition = 'above';
  roleSubscription: Subscription;
  isLoadingData = true;
  access$: Observable<any>;
  dataSource = new MatTableDataSource<ProjectViewer>();
  navigationExtras: NavigationExtras;
  currentActiveRole: string;
  columns: ListColumn[] = COLUMNS_PROCESS as ListColumn[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  menuActionsList = {
    SEE_REQUEST: (process) => this.seePhase(process, ACTIONS_CODES.seeRequest, 'request'),
    EDIT_REQUEST: (process) => this.editPhase(process, ACTIONS_CODES.editRequest),
    ACCREDIT: (process) => this.showAcreditModal(process),
    START_BIDDING: (process) => this.openModalConfimationToInitPhase(process, 'startBidding'),
    EDIT_BIDDING: (process) => this.editPhase(process, ACTIONS_CODES.editBidding),
    EDIT_PAYMENT: (process) => this.editPhase(process, ACTIONS_CODES.editPayment),
    START_PAYMENT: (process) => this.openModalConfimationToInitPhase(process, 'startPayment'),
    SEE_PAYMENT: (process) => this.seePhase(process, ACTIONS_CODES.seePayment, 'execution'),
    FINISH_CYCLE: (process) => this.finishCycleValidate(process),
    SEE_BIDDING: (process) => this.seePhase(process, ACTIONS_CODES.seeBidding, 'process'),
  };

  colDefs = {
    lastModifiedDate: (row, col) => this.DateAgo.transform(row[col.property]),
    createdDate: (row, col) => this.datePipe.transform(row[col.property], 'yyyy-MM-dd'),
    entryDate: (row, col) => this.datePipe.transform(row[col.property], 'yyyy-MM-dd'),
    default: (row, col) => row[col.property]
  };

  constructor(
    private router: Router,
    private rulesService: RulesService,
    private processService: ProcessService,
    private projectsService: ProjectsService,
    private notificationService: NotificationService,
    private datePipe: DatePipe,
    public dialog: MatDialog,
    private DateAgo: DateAgoPipe,
    private roleService: RoleService,
    private executionService: ExecutionService,
    private phaseService: PhaseService
  ) { }

  ngOnInit() {
    this.currentActiveRole = this.roleService.currentActiveRole;
    this.validateRoleIsContractOrSupToGetProcess();
  }

  validateRoleIsContractOrSupToGetProcess() {
    this.roleSubscription = this.roleService.activeRole.subscribe(
      role => {
        const currentRoleIsContractOrSup = this.currentActiveRole === 'ROLE_CONT' || this.currentActiveRole === 'ROLE_SUP';
        const newRoleIsContractOrSup = role === 'ROLE_CONT' || role === 'ROLE_SUP';
        if (role) {
          if (currentRoleIsContractOrSup && !newRoleIsContractOrSup) {
            this.currentActiveRole = role;
          }
          if (!currentRoleIsContractOrSup && newRoleIsContractOrSup) {
            this.currentActiveRole = role;
          }
        }
        this.getProcess();
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy() {
    this.roleSubscription.unsubscribe();
  }

  userHasAccessToPhaseOption(phaseCode, phaseOptionCode) {
    return new Promise((resolve, reject) => {
      const userHasAccesSubscription: Subscription = this.rulesService.userHasAccessToPhaseAction(phaseCode, phaseOptionCode).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (response.data.auth) {
              resolve(response.data.auth);
            } else {
              this.messageHasNotAccess();
            }
          } else {
            this.notificationService.warn(response.message);
          }
          userHasAccesSubscription.unsubscribe();
        }
      });
    });
  }

  openModalConfimationToInitPhase(project: ProjectViewer, startPhaseCode: string) {
    this.userHasAccessToPhaseOption(ACTIONS_CODES[startPhaseCode].phaseCode, ACTIONS_CODES[startPhaseCode].faseOptionCode)
      .then((hasAcces) => {
        const dialogRef = this.dialog.open(ModalConfirmationComponent, {
          data: {
            textButtonExecution: 'Sí',
            textButtonReject: 'Volver',
            title: 'CONFIRMAR',
            description: `¿Está seguro que desea iniciar la fase de ${startPhaseCode === 'startBidding' ? 'proceso' : 'ejecución'}?`
          }
        });

        dialogRef.afterClosed().subscribe({
          next: (result) => {
            if (result === 'execution') {
              return startPhaseCode === 'startBidding' ? this.startBidding(project) : this.startPayment(project);
            }
          }
        });
      });
  }

  startBidding(project: ProjectViewer) {
    const initProcessSubscribe: Subscription = this.processService.initProcess(project.id).subscribe({
      next: (response: IHttpResponse) => {
        if (response.status === '00000') {
          this.router.navigate([`home/processes/${response.data.idProject}/process/step-one`]);
        } else {
          this.notificationService.warn(response.message);
        }
        initProcessSubscribe.unsubscribe();
      }
    });
  }

  startPayment(project: ProjectViewer) {
    const createExecutionSubscription: Subscription = this.executionService.createExecution(project.id).subscribe(
      (response: IHttpResponse) => {
        if (response.status === '00000') {
          this.router.navigate([`home/processes/${response.data.idProject}/execution/step-one`]);
        } else {
          this.notificationService.warn(response.message);
        }
        createExecutionSubscription.unsubscribe();
      });
  }

  messageHasNotAccess = () => this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);

  captureEvent(event: IMenuEvent): void {
    this.menuActionsList[event.action](this.dataSource.filteredData[event.index]);
  }

  finishCycleValidate(project: ProjectViewer) {
    this.userHasAccessToPhaseOption(ACTIONS_CODES.finishCycle.phaseCode, ACTIONS_CODES.finishCycle.faseOptionCode)
      .then((hasAcces) => {
        if (project.hasQualityGuarantee && project.finishExecute) {
          const dialogRef = this.dialog.open(ModalConfirmationComponent, {
            data: {
              textButtonExecution: 'Sí',
              textButtonReject: 'Volver',
              title: 'CONFIRMAR',
              description: `¿Está seguro que desea terminar el ciclo financiero?`
            }
          });

          dialogRef.afterClosed().subscribe({
            next: (result) => {
              if (result === 'execution') {
                this.finishProject(project);
              }
            }
          });
        } else {
          this.notificationService.info(`Asegurese de que todos los pasos estén culminados para poder cerrar el ciclo financiero`);
        }
      });
  }

  finishProject(project: ProjectViewer) {
    const codeStep = { codeStep: 'fase_03' };

    const finishProjectSubscription: Subscription = this.projectsService.finishProject(project.id, codeStep).subscribe(
      (response: IHttpResponse) => {
        if (response.status === '00000') {
          this.getProcess();
          this.notificationService.success(`El ciclo ha sido finalizado correctamente`, 8000);
        } else {
          this.notificationService.warn(response.message);
        }
        finishProjectSubscription.unsubscribe();
      });
  }

  getProcess(): void {
    let data: ProjectViewer[];
    this.isLoadingData = true;
    const currentActiveRole = this.currentActiveRole;
    this.projectsService.listProjects().subscribe((response: IHttpResponse) => {
      if (response.status === '00000') {
        data = response.data.map(process => {
          return new ProjectViewer(process);
        });

        if (currentActiveRole === 'ROLE_CONT' || currentActiveRole === 'ROLE_SUP') {
          data = data.filter(process => process.currentStatus === ProjectCodes.execution);
        }

        this.isLoadingData = false;
        this.dataSource.data = data;
      } else {
        this.notificationService.warn(response.message);
      }
    });
  }

  seePhase(process: ProjectViewer, actionCodePhase, phaseName: string): void {
    this.userHasAccessToPhaseOption(actionCodePhase.phaseCode, actionCodePhase.faseOptionCode)
      .then((hasAcces) => {
        this.phaseService.phaseName = phaseName;
        this.router.navigate([`home/processes/${process.id}/see-details/${phaseName}`]);
      }
      );
  }

  editPhase(process: ProjectViewer, actionCodePhase): void {
    const processPhase = PROCESS_STATES[process.currentStatus].phase;
    const processStep = STEPS_ROUTES[process.currentStep];

    this.userHasAccessToPhaseOption(actionCodePhase.phaseCode, actionCodePhase.faseOptionCode)
      .then((hasAcces) => this.router.navigate([`home/processes/${process.id}/${processPhase}/${processStep}`]));
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  getValueRow(row: ProjectViewer, col: ListColumn) {
    const colDef = this.colDefs[col.property] || this.colDefs.default;
    return colDef(row, col);
  }

  getMenuRequest(process: ProjectViewer): IMenu[] {
    const status = process.currentStatus;
    const isNotInFirstPhase = status !== ProjectCodes.initiated && status !== ProjectCodes.available && status !== ProjectCodes.returned;
    if (isNotInFirstPhase) { return [MENU_REQUEST[0]]; }
    return process.finishSolicitude ? MENU_REQUEST : [MENU_REQUEST[0], MENU_REQUEST[1]];
  }

  getMenuProcess(process: ProjectViewer): IMenu[] {
    if (process.finishProcess) { return [MENU_PROCESS[1]]; }
    if (process.currentStatus === ProjectCodes.bidding) {
      return process.initialized ? [MENU_PROCESS[1], MENU_PROCESS[2]] : [MENU_PROCESS[0]];
    }
  }

  getMenuExecution(process: ProjectViewer) {
    if (process.currentStatus === ProjectCodes.finished) { return [MENU_EXECUTION[1]]; }
    if (process.currentStatus === ProjectCodes.bidding && process.finishProcess) { return [MENU_EXECUTION[0]]; }
    if (process.currentStatus === ProjectCodes.execution) {
      return process.currentStep === 5 ? MENU_EXECUTION.slice(1, MENU_EXECUTION.length) : [MENU_EXECUTION[1], MENU_EXECUTION[2]];
    }
  }

  sortData(event) {
    // TODO: por Implementar
  }

  onFilterChange(filterValue: string) {
    if (!this.dataSource) { return; }
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  get hasData() {
    return this.dataSource && this.dataSource.data.length > 0;
  }

  isProcessBtnDisabled(project: ProjectViewer): boolean {
    return project.currentStatus === ProjectCodes.initiated
      || project.currentStatus === ProjectCodes.available
      || project.currentStatus === ProjectCodes.returned
      || !project.finishSolicitude;
  }

  isExecutionBtnDisabled(project: ProjectViewer): boolean {
    return !project.finishProcess;
  }

  createProcess(): void {
    this.userHasAccessToPhaseOption(ACTIONS_CODES.createSolicitude.phaseCode, ACTIONS_CODES.createSolicitude.faseOptionCode)
      .then(() => {
        const createSolicitudeSubscription: Subscription = this.projectsService.addSolicitude().subscribe((response: IHttpResponse) => {
          if (response.status === '00000') {
            this.router.navigate([`home/processes/${response.data.idProject}/request/step-one`]);
          } else {
            this.notificationService.warn(response.message);
          }
          createSolicitudeSubscription.unsubscribe();
        });
      });
  }

  acreditRequest(modalData, process: ProjectViewer): void {
    const payload = {
      accredited: modalData.isAccredit,
      observation: modalData.observation,
      idSolicitude: modalData.idSolicitude,
      codeStep: ACTIONS_CODES.accreditRequest.phaseCode,
      accredit: true
    };

    const accreditationSubscription: Subscription = this.projectsService.acreditRequest(payload, modalData.id)
      .subscribe((response) => {
        if (response.status === '00000') {
          this.handleSuccessAccreditation(modalData.isAccredit, process.processName);
        }
        accreditationSubscription.unsubscribe();
      });
  }

  handleSuccessAccreditation(isAccredit, processName): void {
    this.getProcess();
    if (isAccredit) {
      this.notificationService.success(`La solicitud del proceso "${processName}" ha sido acreditada correctamente`, 8000);
    } else {
      this.notificationService.success('Se envió una notificación al coordinador técnico.', 8000);
    }
  }

  showAcreditModal(process: ProjectViewer): void {
    this.userHasAccessToPhaseOption(ACTIONS_CODES.accreditRequest.phaseCode, ACTIONS_CODES.accreditRequest.faseOptionCode)
      .then(() => {
        const dialogRef = this.dialog.open(
          ModalAccreditComponent, {
          data: {
            textButtonExecution: 'Guardar',
            textButtonReject: 'Cancelar',
            title: 'Acreditar proyecto',
            isAccreditRequest: true,
            description: `¿Está seguro que quiere acreditar la solicitud de proceso para ${process.processName}?`,
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.acreditRequest({ ...result, id: process.id, idSolicitude: process.currentIdNavigation }, process);
          }
        });
      });
  }

}
