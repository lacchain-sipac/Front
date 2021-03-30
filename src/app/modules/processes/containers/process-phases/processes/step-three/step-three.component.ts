import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { ModalCreateCommitteeComponent } from '../../../../components/modals/modal-create-committee/modal-create-committee.component';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ListColumn, CommitteeViewer, RoleSelect } from '@shared/models/common/classes';
import { ProcessService } from '@modules/processes/process.service';
import { ProjectsService } from '@modules/processes/projects.service';
import { IProcess, AccessType } from '@shared/models/common/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { Subscription } from 'rxjs';
import { NotificationService } from '@shared/components/notification/notification.service';
import { COLUMNS_EVALUATION_COMMITTEE, PHASE_CODES, Keys } from '@shared/helpers';
import { ParametersService } from '@core/services/parameters.service';
import { Router } from '@angular/router';
import { RulesService } from '@core/services/rules.service';

@Component({
  selector: 'kt-step-three',
  templateUrl: './step-three.component.html',
  styleUrls: ['./step-three.component.scss']
})
export class StepThreeComponent implements OnInit, AfterViewInit, OnDestroy {

  dataRoles: RoleSelect[];
  codeStep = 'paso_02_03';
  textButtonNext: string;
  hasAccesEdit: boolean;
  stepThreeIsAccredited: boolean;
  phaseCode: string;
  selectedProcess: IProcess;
  projectSubscription: Subscription;
  columns: ListColumn[] = COLUMNS_EVALUATION_COMMITTEE as ListColumn[];
  dataSource = new MatTableDataSource<CommitteeViewer>();
  nextStepNumber = 4;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private router: Router,
    private rulesService: RulesService,
    private notificationService: NotificationService,
    private parametersService: ParametersService,
    private processService: ProcessService,
    private projectsService: ProjectsService,
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnInit() {
    this.phaseCode = PHASE_CODES.processes;
    this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.processes, this.codeStep, AccessType.write);
    this.loadDataRoles();

    this.projectSubscription = this.projectsService.project$.subscribe((project) => {
      this.selectedProcess = project.process;
      this.stepThreeIsAccredited = project.process.committee && project.process.committee.accredited;
      this.textButtonNext = !this.stepThreeIsAccredited ? 'Guardar y continuar' : 'Continuar';

      if (this.selectedProcess.committee) {
        this.dataSource.data = this.selectedProcess.committee.committee
          .map(item => new CommitteeViewer(item));
      }
    });
  }

  getValueRow(row: CommitteeViewer, col: ListColumn) {
    if (col.property === 'rol') {
      return row.role.name;
    } else {
      return row[col.property];
    }
  }

  async loadDataRoles() {
    const response: IHttpResponse = await this.parametersService.getRoles().toPromise();
    const roles = response.data.sort((a, b) => (a.id > b.id) ? 1 : ((b.id > a.id) ? -1 : 0));
    roles.push({ code: '99', name: 'Otro' });

    this.dataRoles = roles.map(item => new RoleSelect(item));
  }

  openModaDelete(memberName: string, idCommittee: string) {
    if (this.stepThreeIsAccredited) {
      return this.notificationService.info(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    if (this.hasAccesEdit) {
      const dialogRef = this.dialog.open(ModalConfirmationComponent, {
        data: {
          textButtonExecution: 'Eliminar',
          textButtonReject: 'Cancelar',
          title: 'CONFIRMAR',
          description: `¿Está seguro que desea eliminar a ${memberName} del comité de evaluación?`
        }
      });

      dialogRef.afterClosed().subscribe({
        next: (result) => {
          if (result === 'execution') {
            this.deleteMemberCommittee(idCommittee);
          }
        }
      });
    } else {
      this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
  }

  validateHasAccesToCreateEdit(memberCommittee = null) {
    if (this.stepThreeIsAccredited) {
      return this.notificationService.info(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    if (this.hasAccesEdit) {
      this.openModalCreateEditMember(memberCommittee);
    } else {
      this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
  }

  openModalCreateEditMember(memberCommittee): void {
    const title = memberCommittee ? 'EDITAR MIEMBRO DEL COMITÉ' : 'AGREGAR MIEMBRO AL COMITÉ';
    const description = memberCommittee
      ? 'Modifique los datos necesarios del miembro del comité'
      : 'Ingrese los datos para el nuevo miembro del comité';

    const dialogRef = this.dialog.open(ModalCreateCommitteeComponent, {
      data: {
        memberCommittee,
        dataRoles: this.dataRoles,
        textButtonExecution: 'Guardar',
        textButtonReject: 'Cancelar',
        title,
        description
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          if (!result.detailRole) {
            result.detailRole = '';
          }

          result.role = this.dataRoles.find(role => role.id === result.role);
          result.id ? this.updateMemberCommittee(result) : this.createMemberCommittee(result);
        }
      }
    });
  }

  createMemberCommittee(memberCommittee) {
    this.processService.addUserCommittee(memberCommittee, this.selectedProcess.id).subscribe(
      (response: IHttpResponse) => {
        if (response.status !== '00000') {
          this.notificationService.warn(response.message);
        }
      });
  }

  updateMemberCommittee(memberCommittee) {
    this.processService.updateUserCommitte(memberCommittee, this.selectedProcess.id).subscribe(
      (response: IHttpResponse) => {
        if (response.status !== '00000') {
          this.notificationService.warn(response.message);
        }
      });
  }

  deleteMemberCommittee(idCommittee) {
    this.processService.deleteUserCommiittee(idCommittee, this.selectedProcess.id).subscribe(
      (response: IHttpResponse) => {
        if (response.status !== '00000') {
          this.notificationService.warn(response.message);
        }
      });
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

  goBack() {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-two`]);
  }

  private updateProcess() {
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: IProcess = {
      ...this.selectedProcess, currentStep, codeStep
    };

    this.processService.updateProcess(payload).subscribe((response) => {
      if (response.status === '00000') {
        this.handleSuccessfulUpdate();
      } else {
        this.notificationService.error(response.message);
      }
    });
  }

  navigateNextStep() {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-four`]);
  }

  next() {
    if (!this.hasAccesEdit && !this.stepThreeIsAccredited) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (this.stepThreeIsAccredited) { return this.navigateNextStep(); }
    if (!this.enableBtn) {
      return this.notificationService.warn('Por favor, agregue un mínimo de tres miembros del comité de evaluación.');
    }
    this.updateProcess();
  }

  get hasData() {
    return this.dataSource && this.dataSource.data.length > 0;
  }

  get enableBtn() {
    return this.dataSource && this.dataSource.data.length > 2;
  }

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }

}
