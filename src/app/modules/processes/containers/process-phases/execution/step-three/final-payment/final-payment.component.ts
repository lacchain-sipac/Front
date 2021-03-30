import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@shared/components/notification/notification.service';
import { MatDialog } from '@angular/material';
import { IProject, ISolicitude, IMenuEvent, AccessType, IReviewAndDocument, IApprovalPayload } from '@shared/models/common/interfaces';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { DOCUMENT_PAYLOADS, CONFIRM_MODAL_PAYLOAD, FINAL_ESTIMATE_REQ_MENU, F01_FINAL_ESTIMATE_MENU, CDP_FINAL_ESTIMATE_MENU, PHASE_CODES, UPLOAD_MODAL_ACTIONS } from '@shared/helpers/constants';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { FinalPaymentsViewer, ModalUploadViewer } from '@shared/models/common/classes';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { Subscription } from 'rxjs';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { RulesService } from '@core/services/rules.service';
import { environment } from '@environments/environment';
import { RoleService } from '@core/services/role.service';
import { Keys } from '@shared/helpers';

@Component({
  selector: 'kt-final-payment',
  templateUrl: './final-payment.component.html',
  styleUrls: ['./final-payment.component.scss']
})
export class FinalPaymentComponent implements OnInit, OnDestroy {

  @Input() codeStep: string;
  @Input() hasAccesEdit: boolean;
  @Input() hasAccesToUpload: boolean;
  @Input() isAccreditStepThree: boolean;
  selectedProject: IProject;
  downloadFileSubscription: Subscription;
  reviewSubscription: Subscription;
  panelBiddingOpenState = false;
  panelObjectionOpenState = false;
  selectedSolicitude: ISolicitude;
  projectSubscriber: Subscription;
  currentCompany: string;
  paymentsArrayValues: FinalPaymentsViewer[];

  @Output() enableNextBtn = new EventEmitter<boolean>();

  menuActions = {
    REPLACE_FINAL_ESTIMATE_REQ: this.replaceFile.bind(this),
    REPLACE_FINAL_ESTIMATE_F01: this.replaceFile.bind(this),
    SAVE: this.saveFile.bind(this),
    APPROVE: this.openApproveAndObservationModal.bind(this),
    OBSERVE: this.openApproveAndObservationModal.bind(this),
    ACCREDIT_FINAL_ESTIMATE_REQ: this.accreditFile.bind(this),
    REPLACE_FINAL_ESTIMATE_CDP: this.replaceFile.bind(this),
    UPPLOAD_FINISH_ESTIMATE_REQ: this.replaceFile.bind(this),
  };

  constructor(
    private roleService: RoleService,
    private rulesService: RulesService,
    private projectsService: ProjectsService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private executionService: ExecutionService,
    private documentService: DocumentsService
  ) { }

  ngOnInit() {
    this.projectSubscriber = this.projectsService.project$.subscribe((project) => {
      this.setPaymentDocuments(project);
      this.selectedProject = project;
      this.selectedSolicitude = this.selectedProject.solicitude;
      this.validatePayments();
    });
    this.selectedSolicitude = this.projectsService.currentProject.solicitude;
    this.currentCompany = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).company;
  }

  get companies() {
    const documentsCompanies = this.selectedProject.execution.payment.finalPayment.map(payment => {
      return payment.request.document[0].document.company;
    });
    let companies = Array.from(new Set(documentsCompanies));
    if (this.roleService.currentActiveRole === 'ROLE_CONT' || this.roleService.currentActiveRole === 'ROLE_SUP') {
      companies = companies.filter(company => company === this.currentCompany);
    }
    return companies;
  }

  setPaymentDocuments(project) {
    if (project.execution && project.execution.payment && project.execution.payment.finalPayment) {
      this.paymentsArrayValues = project.execution.payment.finalPayment.map(finalPayment => {
        return new FinalPaymentsViewer(finalPayment);
      });
    }
  }

  validatePayments() {
    if (this.paymentsArrayValues) {
      const completePayments = this.paymentsArrayValues.filter(paymentView => paymentView.proffPayment);
      const areAllDocumentsComplete = this.paymentsArrayValues.length === completePayments.length;
      return this.enableNextBtn.emit(this.paymentsArrayValues.length > 0 && areAllDocumentsComplete);
    }
    this.enableNextBtn.emit(false);
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
                this.accreditPaymentFile(selectedDocument, result);
              }
            });
          } else {
            this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  accreditPaymentFile(selectedDocument: IReviewAndDocument, modalPayload) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.finalEstimateRequest.documentType,
      idProject: this.selectedProject.id,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: 0,
      codeStep: DOCUMENT_PAYLOADS.finalEstimateRequest.codeStep,
      type: 'accredit'
    };
    this.executionService.accreditDocument(this.selectedProject.execution.id, payload).subscribe(
      (data) => { },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  estimateRequestMenu(finalPayment) {
    const approvalsNumber = this.getApprovalsNumber(finalPayment);
    const isAccredited = finalPayment.estimateRequest && finalPayment.estimateRequest.approved;
    if (finalPayment.lastReviewIsObservation) {
      return [FINAL_ESTIMATE_REQ_MENU[1], FINAL_ESTIMATE_REQ_MENU[5]];
    }
    if (isAccredited) { return [FINAL_ESTIMATE_REQ_MENU[FINAL_ESTIMATE_REQ_MENU.length - 2]]; }
    if (finalPayment.isLatestVersion) { return [...FINAL_ESTIMATE_REQ_MENU].slice(-1); }
    if (approvalsNumber < environment.approvalsRequired.finalPaymentRequest) {
      const menu = [...FINAL_ESTIMATE_REQ_MENU].slice(0, 4);
      menu.splice(0, 1);
      return [...menu, FINAL_ESTIMATE_REQ_MENU[5]];
    }
    return [...FINAL_ESTIMATE_REQ_MENU.slice(0, 4), FINAL_ESTIMATE_REQ_MENU[5]];
  }

  getApprovalsNumber(finalPayment): number {
    let approvalsNumber = 0;
    if (finalPayment.estimateRequest && Array.isArray(finalPayment.estimateRequest.review)) {
      const approvalsList = finalPayment.estimateRequest.review.filter(review => review.type === 'approval');
      approvalsNumber = approvalsList.length;
    }
    return approvalsNumber;
  }

  get noObjectionMenu() {
    return CDP_FINAL_ESTIMATE_MENU;
  }

  ngOnDestroy() {
    this.projectSubscriber.unsubscribe();
    if (this.downloadFileSubscription) {
      this.downloadFileSubscription.unsubscribe();
    }
    if (this.reviewSubscription) {
      this.reviewSubscription.unsubscribe();
    }
  }

  saveFile(selectedDocument, event) {
    const idStorage = selectedDocument.document ? selectedDocument.document.idStorage : selectedDocument.idStorage;
    const fileName = selectedDocument.document ? selectedDocument.document.fileName : selectedDocument.fileName;

    this.downloadFileSubscription = this.projectsService.downloadFile(idStorage, fileName)
      .subscribe(
        (data) => {
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.notificationService.error(error);
        }
      );
  }

  get f01EstimateMenu() {
    return F01_FINAL_ESTIMATE_MENU;
  }

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event): void {
    const documentDetails = DOCUMENT_PAYLOADS.finalEstimateRequest;

    if (this.isAccreditStepThree) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }
    if (!this.hasAccesEdit) {
      return this.hasNotAccessNotification();
    }

    this.projectsService.openApproveAndObservationModal(
      event, selectedDocument, documentDetails, PHASE_CODES.execution, this.codeStep, this.selectedProject.id)
      .then((payload: IApprovalPayload) => {
        this.reviewSubscription = this.executionService.reviewDocument(this.selectedProject.execution.id, payload).subscribe(
          (data) => { },
          (error: HttpErrorResponse) => {
            console.error(error);
          }
        );
      });
  }

  replaceFile(selectedDocument, event, idGroup) {
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
            if (response.data.auth && files) {
              this.validateUploaFinalDocument(event, documentCode, files, idGroup);
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

  validateUploaFinalDocument = (event, documentCode, files, idGroup) => {
    const isTechnicalCoordinator = this.roleService.currentActiveRole === 'ROLE_COO_TEC';
    if (event.action !== 'UPPLOAD_FINISH_ESTIMATE_REQ' && this.hasAccesEdit) {
      this.contractorOrSupervisorhasAcces(files, documentCode, event, idGroup);
    }

    if (event.action === 'UPPLOAD_FINISH_ESTIMATE_REQ') {
      if (isTechnicalCoordinator || this.hasAccesEdit) {
        this.contractorOrSupervisorhasAcces(files, documentCode, event, idGroup);
      }
    }
  }

  contractorOrSupervisorhasAcces = (files, documentCode, event, idGroup: string) => {
    if (documentCode === DOCUMENT_PAYLOADS.finalEstimateRequest.documentType
      && UPLOAD_MODAL_ACTIONS[event.action].action === AccessType.upload) {
      return this.hasAccesEdit ? this.openModalUploadFiles(files, event.action, idGroup) : this.hasNotAccessNotification();
    } else {
      this.openModalUploadFiles(files, event.action, idGroup);
    }
  }

  hasNotAccessNotification = () => this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);

  openModalUploadFiles(fileList: FileList, action, idGroup): void {
    const dialogRef = this.dialog.open(ModalUploadFilesComponent, {
      data: new ModalUploadViewer(action, 'execution', fileList, idGroup)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  get amendmentsTab() {
    if (this.selectedProject.process && this.selectedProject.process.init) {
      return this.selectedProject.process.init.amendment;
    }
    return null;
  }

  f01EstimateEvent(event) {
    const f01List = this.selectedProject.execution.payment.finalPayment[event.index].f01;
    const selectedDocument = f01List[f01List.length - 1];
    const idGroup = this.selectedProject.execution.payment.finalPayment[event.index].id;
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

  proofEstimateEvent(event) {
    const f01List = this.selectedProject.execution.payment.finalPayment[event.index].proffPayment;
    const selectedDocument = f01List[f01List.length - 1];
    const idGroup = this.selectedProject.execution.payment.finalPayment[event.index].id;
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

  estimateRequestEvent(event: IMenuEvent) {
    const requestList = this.selectedProject.execution.payment.finalPayment[event.index].request.document;
    const selectedDocument = requestList[requestList.length - 1];
    const idGroup = this.selectedProject.execution.payment.finalPayment[event.index].id;
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

}
