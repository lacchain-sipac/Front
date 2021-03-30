import { Component, OnInit, OnDestroy } from '@angular/core';
import { IMenuEvent, IExecution, AccessType, ModifiedContract, IProject, IReviewAndDocument, IApprovalPayload } from '@shared/models/common/interfaces';
import { ProjectsService } from '@modules/processes/projects.service';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/components/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { MatDialog } from '@angular/material';
import { MODIFY_CONTRACT_MENU, CONFIRM_MODAL_PAYLOAD, DOCUMENT_PAYLOADS, PHASE_CODES, UPLOAD_MODAL_ACTIONS } from '@shared/helpers/constants';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { ModalUploadViewer } from '@shared/models/common/classes';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { Keys } from '@shared/helpers';
import { RulesService } from '@core/services/rules.service';
import { RoleService } from '@core/services/role.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'kt-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})
export class StepFourComponent implements OnInit, OnDestroy {

  selectedExecution: IExecution;
  projectSubscription: Subscription;
  updateSubscription: Subscription;
  reviewSubscription: Subscription;
  hasAccesToUpload: boolean;
  codeStep = 'paso_03_04';
  isAccreditModifiedContract: boolean;
  textButtonNext: string;
  nextStepNumber = 5;
  hasAccesEdit: boolean;
  modifiedContract: ModifiedContract;
  menuActions = {
    REPLACE_CONTRACT_MODIFY: this.replaceFile.bind(this),
    ACCREDIT_MODIFY_CONTRACT: this.accreditFile.bind(this),
    UPPLOAD_FINAL_MODIFY_CONTRACT: this.replaceFile.bind(this),
    APPROVE: this.openApproveAndObservationModal.bind(this),
    OBSERVE: this.openApproveAndObservationModal.bind(this),
    SAVE: this.saveFile.bind(this)
  };

  constructor(
    private rulesService: RulesService,
    private roleService: RoleService,
    private executionService: ExecutionService,
    private projectsService: ProjectsService,
    private router: Router,
    private dialog: MatDialog,
    private documentService: DocumentsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.projectSubscription = this.projectsService.project$.subscribe((project) => {
      this.selectedExecution = project.execution;
      this.setAccesses(project);

      this.modifiedContract = this.contracts;
    });
  }

  setAccesses(project) {
    const currentActiveRole = this.roleService.currentActiveRole;
    const currentUserId = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).id;

    this.isAccreditModifiedContract = this.contracts && this.contracts.accredited && this.selectedExecution.currentStep > 4;
    this.hasAccesToUpload = currentActiveRole === 'ROLE_SUP'
      && project.execution.assignContractor.supervising.includes(currentUserId);

    this.hasAccesEdit = this.hasAccesEditProject(project);
    this.textButtonNext = !this.isAccreditModifiedContract ? 'Guardar y continuar' : 'Continuar';

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
    if (this.updateSubscription) { this.updateSubscription.unsubscribe(); }
    if (this.reviewSubscription) { this.reviewSubscription.unsubscribe(); }
    this.projectSubscription.unsubscribe();
  }

  get areThereDocuments() {
    return this.contracts && this.contracts.document && this.contracts.document.length > 0;
  }

  accreditFile(selectedDocument, event) {
    const typeDocument = UPLOAD_MODAL_ACTIONS[event.action].documentType;
    const documentCode = DOCUMENT_PAYLOADS[typeDocument].documentType;
    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentCode, PHASE_CODES.execution, this.codeStep, AccessType.acreditted).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (response.data.auth) {
              const dialogRef = this.dialog.open(
                ModalAccreditComponent, {
                data: CONFIRM_MODAL_PAYLOAD.ACCREDIT
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result) {
                  this.accredtModifiedContract(selectedDocument, result);
                }
              });
            } else {
              this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
            }
          } else {
            this.notificationService.warn(response.message);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  accredtModifiedContract(selectedDocument: IReviewAndDocument, modalPayload) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.contractModification.documentType,
      idProject: this.selectedExecution.idProject,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: 0,
      codeStep: this.codeStep,
      type: 'accredit'
    };

    this.executionService.accreditDocument(this.selectedExecution.id, payload).subscribe(
      (data) => { },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event): void {
    const documentDetails = DOCUMENT_PAYLOADS.contractModification;

    if (this.isAccreditModifiedContract) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }
    if (!this.hasAccesEdit) {
      return this.hasNotAccessNotification();
    }

    this.projectsService.openApproveAndObservationModal(
      event, selectedDocument, documentDetails, PHASE_CODES.execution, this.codeStep, this.selectedExecution.idProject)
      .then((payload: IApprovalPayload) => {
        this.reviewSubscription = this.executionService.reviewDocument(this.selectedExecution.id, payload).subscribe(
          (data) => { },
          (error: HttpErrorResponse) => {
            console.error(error);
          }
        );
      });
  }

  menuEvent(event: IMenuEvent): void {
    const currentExecution = this.projectsService.currentProject.execution;
    const selectedFile = currentExecution.modifiedContract.document[event.index];
    this.menuActions[event.action](selectedFile, event);
  }

  replaceFile(selectedDocument, event) {
    const files = this.documentService.getSelectedFiles(event.files);
    const typeDocument = UPLOAD_MODAL_ACTIONS[event.action].documentType;
    const documentCode = DOCUMENT_PAYLOADS[typeDocument].documentType;
    const actionType = UPLOAD_MODAL_ACTIONS[event.action].action;

    if (this.isAccreditModifiedContract) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentCode, PHASE_CODES.execution, this.codeStep, actionType).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (!response.data.auth) {
              return this.hasNotAccessNotification();
            }
            if (response.data.auth && files) {
              this.validateUploaFinalDocument(event, documentCode, files);
            }
          } else {
            this.notificationService.warn(response.message);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  validateUploaFinalDocument = (event, documentCode, files) => {
    const isTechnicalCoordinator = this.roleService.currentActiveRole === 'ROLE_COO_TEC';
    if (event.action !== 'UPPLOAD_FINAL_MODIFY_CONTRACT' && this.hasAccesEdit) {
      this.contractorOrSupervisorhasAcces(files, documentCode, event);
    }

    if (event.action === 'UPPLOAD_FINAL_MODIFY_CONTRACT') {
      if (isTechnicalCoordinator && this.hasAccesEdit) {
        this.contractorOrSupervisorhasAcces(files, documentCode, event);
      }
    }
  }

  contractorOrSupervisorhasAcces = (files, documentCode, event) => {
    if (documentCode === DOCUMENT_PAYLOADS.contractModification.documentType
      && UPLOAD_MODAL_ACTIONS[event.action].action === AccessType.upload) {
      return this.hasAccesEdit ? this.openModalUploadFiles(files, event.action) : this.hasNotAccessNotification();
    } else {
      this.openModalUploadFiles(files, event.action);
    }
  }

  hasNotAccessNotification = () => this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);

  get menuOptions() {
    const approvalsNumber = this.getApprovalsNumber();

    if (this.lastReviewIsObservation) { return [MODIFY_CONTRACT_MENU[1], MODIFY_CONTRACT_MENU[5]]; }
    if (this.modifiedContractLastDocument.approved) {
      return [MODIFY_CONTRACT_MENU[MODIFY_CONTRACT_MENU.length - 2]];
    }
    if (!!this.isLatestVersion) {
      return [...MODIFY_CONTRACT_MENU].slice(-1);
    }
    if (approvalsNumber < environment.approvalsRequired.modifiedContract) {
      const menu = [...MODIFY_CONTRACT_MENU].slice(0, 4);
      menu.splice(0, 1);
      return menu;
    }
    return MODIFY_CONTRACT_MENU.slice(0, 4);
  }

  getApprovalsNumber(): number {
    let approvalsNumber = 0;
    if (!!this.modifiedContractLastDocument && Array.isArray(this.modifiedContractLastDocument.review)) {
      const approvalsList = this.modifiedContractLastDocument.review.filter(review => review.type === 'approval');
      approvalsNumber = approvalsList.length;
    }
    return approvalsNumber;
  }

  saveFile(selectedDocument, event) {
    const idStorage = selectedDocument.document ? selectedDocument.document.idStorage : selectedDocument.idStorage;
    const fileName = selectedDocument.document ? selectedDocument.document.fileName : selectedDocument.fileName;

    this.executionService.downloadFile(idStorage, fileName)
      .subscribe(
        (data) => {
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.notificationService.error(error);
        }
      );
  }

  get modifiedContractLastDocument() {
    return this.areThereDocuments ? this.contracts.document[this.contracts.document.length - 1] : null;
  }

  get contracts() {
    const modifiedContract = this.selectedExecution.modifiedContract;
    if (!!modifiedContract) { return modifiedContract; }
    return this.selectedExecution.modifiedContract;
  }

  get isLatestVersion() {
    return this.contracts.document.length > 1
      ? !!this.contracts.document[this.contracts.document.length - 2].approved
      : false;
  }

  get accreditedContract() {
    return this.contracts.accredited;
  }

  get historyDocuments() {
    const modifiedContractDocuments = [...this.contracts.document];
    modifiedContractDocuments.pop();
    return modifiedContractDocuments;
  }

  get lastReviewIsObservation(): boolean {
    const modifiedContractLastDocument = this.contracts.document[this.contracts.document.length - 1];
    if (modifiedContractLastDocument && Array.isArray(modifiedContractLastDocument.review)) {
      const lastReview = [...modifiedContractLastDocument.review][0];
      return lastReview.type === 'observation';
    }
    return false;
  }

  goBack(): void {
    this.router.navigate([`home/processes/${this.selectedExecution.idProject}/execution/step-three`]);
  }

  handleSuccessfulUpdate() {
    const userName = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).fullname;
    this.notificationService.success(`Estimado(a) ${userName}, se han guardado los cambios realizados,
     se enviará un correo al siguiente ROL para terminar la Fase de Pagos del proceso.`);
    setTimeout(
      () => this.navigateNextStep(),
      8000
    );
  }

  navigateNextStep(): void {
    this.router.navigate([`home/processes/${this.selectedExecution.idProject}/execution/step-five`]);
  }

  next() {
    if (this.isAccreditModifiedContract) { return this.navigateNextStep(); }
    if (!this.hasAccesEdit && !this.isAccreditModifiedContract) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }

    this.validateNextStepByDocs();
  }

  validateNextStepByDocs() {
    if (!this.areThereDocuments) {
      return this.updateProcess();
    } else {
      return this.isLatestVersion
        ? this.updateProcess()
        : this.notificationService.warn(
          'Es necesario que la modificación de contrato sea acreditada y tenga su versión final para poder continuar');
    }
  }

  private updateProcess() {
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    let modifiedContract = this.selectedExecution.modifiedContract;
    if (!modifiedContract) {
      modifiedContract = {
        accredited: false,
        document: []
      };
    }
    const payload: IExecution = { ...this.selectedExecution, currentStep, codeStep, modifiedContract };
    this.updateSubscription = this.executionService.updateExecution(payload).subscribe((response) => {
      if (response.status === '00000') { return this.handleSuccessfulUpdate(); }
      return this.notificationService.error(response.message);
    });
  }

  openModalUploadFiles(fileList: FileList, action): void {
    const dialogRef = this.dialog.open(ModalUploadFilesComponent, {
      data: new ModalUploadViewer(action, 'execution', fileList)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
