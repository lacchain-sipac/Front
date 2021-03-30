import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@shared/components/notification/notification.service';
import { MatDialog } from '@angular/material';
import { IProject, ISolicitude, IMenuEvent, AccessType, IReviewAndDocument, IApprovalPayload } from '@shared/models/common/interfaces';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { DOCUMENT_PAYLOADS, CONFIRM_MODAL_PAYLOAD, ESTIMATE_REQ_MENU, F01_ESTIMATE_MENU, CDP_ESTIMATE_MENU, UPLOAD_MODAL_ACTIONS, PHASE_CODES } from '@shared/helpers/constants';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { PaymentsViewer, ModalUploadViewer } from '@shared/models/common/classes';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { Subscription } from 'rxjs';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { RulesService } from '@core/services/rules.service';
import { environment } from '@environments/environment';
import { RoleService } from '@core/services/role.service';
import { Keys } from '@shared/helpers';


@Component({
  selector: 'kt-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit, OnDestroy {

  selectedProject: IProject;
  @Input() codeStep: string;
  @Input() hasAccesEdit: boolean;
  @Input() hasAccesToUpload: boolean;
  @Input() isAccreditStepThree: boolean;
  panelBiddingOpenState = false;
  panelObjectionOpenState = false;
  currentCompany: string;
  selectedSolicitude: ISolicitude;
  paymentsViewer: PaymentsViewer;
  projectSubscriber: Subscription;
  paymentsArrayValues: PaymentsViewer[];

  @Output() enableNextBtn = new EventEmitter<boolean>();

  menuActions = {
    REPLACE_ESTIMATE_REQ: this.replaceFile.bind(this),
    REPLACE_ESTIMATE_F01: this.replaceFile.bind(this),
    SAVE: this.saveFile.bind(this),
    APPROVE: this.openApproveAndObservationModal.bind(this),
    OBSERVE: this.openApproveAndObservationModal.bind(this),
    ACCREDIT_ESTIMATE_REQ: this.accreditFile.bind(this),
    REPLACE_ESTIMATE_CDP: this.replaceFile.bind(this),
    UPPLOAD_FINAL_ESTIMATE_REQ: this.replaceFile.bind(this),
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
    const documentsCompanies = this.selectedProject.execution.payment.estimate.map(estimate => {
      return estimate.request.document[0].document.company;
    });
    let companies = Array.from(new Set(documentsCompanies));
    if (this.roleService.currentActiveRole === 'ROLE_CONT' || this.roleService.currentActiveRole === 'ROLE_SUP') {
      companies = companies.filter(company => company === this.currentCompany);
    }
    return companies;
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

  validatePayments() {
    if (this.paymentsArrayValues) {
      const completePayments = this.paymentsArrayValues.filter(paymentView => paymentView.proffPayment);
      const areAllDocumentsComplete = this.paymentsArrayValues.length === completePayments.length;
      return this.enableNextBtn.emit(this.paymentsArrayValues.length > 0 && areAllDocumentsComplete);
    }
    this.enableNextBtn.emit(false);
  }

  accreditPaymentFile(selectedDocument: IReviewAndDocument, modalPayload) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.estimateRequest.documentType,
      idProject: this.selectedProject.id,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: 0,
      codeStep: DOCUMENT_PAYLOADS.estimateRequest.codeStep,
      type: 'accredit'
    };
    this.executionService.accreditDocument(this.selectedProject.execution.id, payload).subscribe(
      (data) => { },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  setPaymentDocuments(project) {
    if (project.execution && project.execution.payment && project.execution.payment.estimate) {
      this.paymentsArrayValues = project.execution.payment.estimate.map(estimate => {
        return new PaymentsViewer(estimate);
      });
    }
  }

  estimateRequestMenu(payments) {
    const approvalsNumber = this.getApprovalsNumber(payments);
    if (payments.lastReviewIsObservation) { return [ESTIMATE_REQ_MENU[1], ESTIMATE_REQ_MENU[5]]; }
    if (payments.estimateRequest.approved) { return [ESTIMATE_REQ_MENU[ESTIMATE_REQ_MENU.length - 2]]; }
    if (payments.isLatestVersion) { return [...ESTIMATE_REQ_MENU].slice(-1); }
    if (approvalsNumber < environment.approvalsRequired.paymentRequest) {
      const menu = [...ESTIMATE_REQ_MENU].slice(0, 4);
      menu.splice(0, 1);
      return [...menu, ESTIMATE_REQ_MENU[5]];
    }
    return [...ESTIMATE_REQ_MENU.slice(0, 4), ESTIMATE_REQ_MENU[5]];
  }

  getApprovalsNumber(payments): number {
    let approvalsNumber = 0;
    if (payments.estimateRequest && Array.isArray(payments.estimateRequest.review)) {
      const approvalsList = payments.estimateRequest.review.filter(review => review.type === 'approval');
      approvalsNumber = approvalsList.length;
    }
    return approvalsNumber;
  }

  get noObjectionMenu() {
    return CDP_ESTIMATE_MENU;
  }

  ngOnDestroy() {
    this.projectSubscriber.unsubscribe();
  }

  saveFile(selectedDocument, event) {
    const idStorage = selectedDocument.document ? selectedDocument.document.idStorage : selectedDocument.idStorage;
    const fileName = selectedDocument.document ? selectedDocument.document.fileName : selectedDocument.fileName;

    const downloadFileSubscription: Subscription = this.projectsService.downloadFile(idStorage, fileName)
      .subscribe(
        (data) => {
          downloadFileSubscription.unsubscribe();
        },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.notificationService.error(error);
          downloadFileSubscription.unsubscribe();
        }
      );
  }

  get f01EstimateMenu() {
    return F01_ESTIMATE_MENU;
  }

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event): void {
    const documentDetails = DOCUMENT_PAYLOADS.estimateRequest;

    if (this.isAccreditStepThree) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }
    if (!this.hasAccesEdit) {
      return this.hasNotAccessNotification();
    }

    this.projectsService.openApproveAndObservationModal(
      event, selectedDocument, documentDetails, PHASE_CODES.execution, this.codeStep, this.selectedProject.id)
      .then((payload: IApprovalPayload) => {
        this.executionService.reviewDocument(this.selectedProject.execution.id, payload).subscribe(
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
            if (response.data.auth) {
              if (files) {
                this.validateUploaFinalDocument(event, documentCode, files, idGroup);
              }
            } else {
              this.notificationService.info(`EL rol actual no cuenta con acceso para realizar esta acción`);
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
    if (event.action !== 'UPPLOAD_FINAL_ESTIMATE_REQ' && this.hasAccesEdit) {
      this.contractorOrSupervisorhasAcces(files, documentCode, event, idGroup);
    }

    if (event.action === 'UPPLOAD_FINAL_ESTIMATE_REQ') {
      if (isTechnicalCoordinator || this.hasAccesEdit) {
        this.contractorOrSupervisorhasAcces(files, documentCode, event, idGroup);
      }
    }
  }

  contractorOrSupervisorhasAcces = (files, documentCode, event, idGroup: string) => {
    if (documentCode === DOCUMENT_PAYLOADS.estimateRequest.documentType
      && UPLOAD_MODAL_ACTIONS[event.action].action === AccessType.upload) {
      return this.hasAccesEdit ? this.openModalUploadFiles(files, event.action, idGroup) : this.hasNotAccessNotification();
    } else {
      this.openModalUploadFiles(files, event.action, idGroup);
    }
  }

  hasNotAccessNotification = () => this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);

  openModalUploadFiles(fileList: FileList, action, idGroup: string): void {
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

  get amendmentRequest() {
    return this.paymentsViewer ? this.paymentsViewer.estimateRequest : null;
  }

  get amendmentResponse() {
    return this.paymentsViewer ? this.paymentsViewer.f01Estimate : null;
  }

  get noObjection() {
    return this.paymentsViewer ? this.paymentsViewer.proffPayment : null;
  }

  get amendmentRequestHistory() {
    return this.paymentsViewer ? this.paymentsViewer.estimateRequestHistory : null;
  }

  get amendmentResponseHistory() {
    return this.paymentsViewer ? this.paymentsViewer.f01EstimateHistory : null;
  }

  get noObjectionHistory() {
    return this.paymentsViewer ? this.paymentsViewer.proffPaymentHistory : null;
  }

  f01EstimateEvent(event) {
    const f01List = this.selectedProject.execution.payment.estimate[event.index].f01;
    const selectedDocument = f01List[f01List.length - 1];
    const idGroup = this.selectedProject.execution.payment.estimate[event.index].id;
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

  proofEstimateEvent(event) {
    const f01List = this.selectedProject.execution.payment.estimate[event.index].f01;
    const selectedDocument = f01List[f01List.length - 1];
    const idGroup = this.selectedProject.execution.payment.estimate[event.index].id;
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

  estimateRequestEvent(event: IMenuEvent) {
    const requestList = this.selectedProject.execution.payment.estimate[event.index].request.document;
    const selectedDocument = requestList[requestList.length - 1];
    const idGroup = this.selectedProject.execution.payment.estimate[event.index].id;
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

  get enmiendaApprovals() {
    return this.amendmentResponse && this.amendmentResponse.review && this.amendmentResponse.review.length > 0;
  }

}
