import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IExecution, AccessType, IMenuEvent, IReviewAndDocument, IApprovalPayload } from '@shared/models/common/interfaces';
import { Subscription } from 'rxjs';
import { Keys, PHASE_CODES, MODIFY_CONTRACT_MENU_STEP_3, UPLOAD_MODAL_ACTIONS, DOCUMENT_PAYLOADS, CONFIRM_MODAL_PAYLOAD } from '@shared/helpers';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { ModalUploadViewer } from '@shared/models/common/classes';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { RulesService } from '@core/services/rules.service';
import { RoleService } from '@core/services/role.service';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { ProjectsService } from '@modules/processes/projects.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { environment } from '@environments/environment';

@Component({
  selector: 'kt-modified-contract',
  templateUrl: './modified-contract.component.html',
  styleUrls: ['./modified-contract.component.scss']
})
export class ModifiedContractComponent implements OnInit, OnDestroy {

  @Input() codeStep: string;
  @Input() isAccreditStepThree: boolean;
  @Input() hasAccesEdit: boolean;
  @Output() enableNextBtn = new EventEmitter<boolean>();
  hasAccesToUpload: boolean;
  selectedExecution: IExecution;
  projectSubscription: Subscription;
  updateSubscription: Subscription;
  reviewSubscription: Subscription;
  menuActions = {
    REPLACE_CONTRACT_MODIFY_STEP_3: this.replaceFile.bind(this),
    ACCREDIT_MODIFY_CONTRACT_STEP_3: this.accreditFile.bind(this),
    UPPLOAD_FINAL_MODIFY_CONTRACT_STEP_3: this.replaceFile.bind(this),
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
      const currentActiveRole = this.roleService.currentActiveRole;
      const currentUserId = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).id;

      this.hasAccesToUpload = currentActiveRole === 'ROLE_SUP'
        && project.execution.assignContractor.supervising.includes(currentUserId);

      this.validateContracts();
    });
  }

  validateContracts() {
    if (!this.thereIsNoDocuments) {
      return this.enableNextBtn.emit(!!this.isLatestVersion);
    }
    this.enableNextBtn.emit(true);
  }

  ngOnDestroy() {
    if (this.updateSubscription) { this.updateSubscription.unsubscribe(); }
    if (this.reviewSubscription) { this.reviewSubscription.unsubscribe(); }
    this.projectSubscription.unsubscribe();
  }

  get thereIsNoDocuments() {
    const documentsExist = this.selectedExecution && this.selectedExecution.payment && this.selectedExecution.payment.modifiedContract;
    const thereIsNoDocuments = this.selectedExecution && this.selectedExecution.payment
      && this.selectedExecution.payment.modifiedContract && this.selectedExecution.payment.modifiedContract.document.length === 0;
    return !documentsExist || thereIsNoDocuments;
  }

  accreditFile(selectedDocument, event) {
    const typeDocument = UPLOAD_MODAL_ACTIONS[event.action].documentType;
    const documentCode = DOCUMENT_PAYLOADS[typeDocument].documentType;
    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentCode, PHASE_CODES.execution, this.codeStep, AccessType.acreditted).subscribe({
        next: (response) => {
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
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  accredtModifiedContract(selectedDocument: IReviewAndDocument, modalPayload) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.contractModificationStep3.documentType,
      idProject: this.selectedExecution.idProject,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: 0,
      codeStep: DOCUMENT_PAYLOADS.contractModificationStep3.codeStep,
      type: 'accredit'
    };

    this.executionService.accreditDocument(this.selectedExecution.id, payload).subscribe(
      (data) => {
        console.log(data);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event): void {
    const documentDetails = DOCUMENT_PAYLOADS.contractModificationStep3;

    if (this.isAccreditStepThree) {
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
    const selectedFile = currentExecution.payment.modifiedContract.document[event.index];
    this.menuActions[event.action](selectedFile, event);
  }

  replaceFile(selectedDocument, event) {
    const files = this.documentService.getSelectedFiles(event.files);
    const typeDocument = UPLOAD_MODAL_ACTIONS[event.action].documentType;
    const documentCode = DOCUMENT_PAYLOADS[typeDocument].documentType;
    const actionType = UPLOAD_MODAL_ACTIONS[event.action].action;

    if (this.isAccreditStepThree) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentCode, PHASE_CODES.execution, this.codeStep, actionType).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (response.data.auth) {
              if (files) {
                this.validateUploaFinalDocument(event, documentCode, files);
              }
            } else {
              this.hasNotAccessNotification();
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
    if (!this.hasAccesEdit) {
      this.hasNotAccessNotification();

    }
    if (event.action !== 'UPPLOAD_FINAL_MODIFY_CONTRACT_STEP_3' && this.hasAccesEdit) {
      this.contractorOrSupervisorhasAcces(files, documentCode, event);
    }

    if (event.action === 'UPPLOAD_FINAL_MODIFY_CONTRACT_STEP_3') {
      if (isTechnicalCoordinator && this.hasAccesEdit) {
        this.contractorOrSupervisorhasAcces(files, documentCode, event);
      }
    }
  }

  contractorOrSupervisorhasAcces = (files, documentCode, event) => {
    if (documentCode === DOCUMENT_PAYLOADS.contractModificationStep3.documentType
      && UPLOAD_MODAL_ACTIONS[event.action].action === AccessType.upload) {
      return this.hasAccesEdit ? this.openModalUploadFiles(files, event.action) : this.hasNotAccessNotification();
    } else {
      this.openModalUploadFiles(files, event.action);
    }
  }

  hasNotAccessNotification = () => this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);

  get menuOptions() {
    const approvalsNumber = this.getApprovalsNumber();

    if (this.lastReviewIsObservation) { return [MODIFY_CONTRACT_MENU_STEP_3[1], MODIFY_CONTRACT_MENU_STEP_3[5]]; }
    if (this.modifiedContractLastDocument.approved) {
      return [MODIFY_CONTRACT_MENU_STEP_3[MODIFY_CONTRACT_MENU_STEP_3.length - 2]];
    }
    if (this.isLatestVersion) {
      return [...MODIFY_CONTRACT_MENU_STEP_3].slice(-1);
    }
    if (approvalsNumber < environment.approvalsRequired.modifiedContract) {
      const menu = [...MODIFY_CONTRACT_MENU_STEP_3].slice(0, 4);
      menu.splice(0, 1);
      return [...menu, MODIFY_CONTRACT_MENU_STEP_3[5]];
    }
    return [...MODIFY_CONTRACT_MENU_STEP_3.slice(0, 4), MODIFY_CONTRACT_MENU_STEP_3[5]];
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

  get lastReviewIsObservation(): boolean {
    const modifiedContractLastDocument = this.documents[this.documents.length - 1];
    if (modifiedContractLastDocument && Array.isArray(modifiedContractLastDocument.review)) {
      const lastReview = [...modifiedContractLastDocument.review][0];
      return lastReview.type === 'observation';
    }
    return false;
  }

  get modifiedContractLastDocument() {
    return !this.thereIsNoDocuments ? this.documents[this.documents.length - 1] : null;
  }

  get isLatestVersion() {
    return this.documents.length > 1 ? !!this.documents[this.documents.length - 2].approved : false;
  }

  get documents() {
    return this.selectedExecution.payment.modifiedContract.document;
  }

  get accreditedContract() {
    return this.selectedExecution.payment.modifiedContract.accredited;
  }

  get historyDocuments() {
    const modifiedContractDocuments = [...this.documents];
    modifiedContractDocuments.pop();
    return modifiedContractDocuments;
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
