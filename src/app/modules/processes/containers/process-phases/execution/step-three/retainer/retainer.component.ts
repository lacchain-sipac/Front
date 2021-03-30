import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@shared/components/notification/notification.service';
import { MatDialog } from '@angular/material';
import { IProject, ISolicitude, IMenuEvent, AccessType, IReviewAndDocument, IApprovalPayload } from '@shared/models/common/interfaces';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { DOCUMENT_PAYLOADS, CONFIRM_MODAL_PAYLOAD, F01_RETAINER_MENU, PAYMENT_REQUEST_MENU, PROFF_PAYMENT_MENU, PHASE_CODES, UPLOAD_MODAL_ACTIONS } from '@shared/helpers/constants';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { ModalUploadViewer, RetainerViewer } from '@shared/models/common/classes';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { Subscription } from 'rxjs';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { RulesService } from '@core/services/rules.service';
import { environment } from '@environments/environment';
import { RoleService } from '@core/services/role.service';
import { Keys } from '@shared/helpers';

@Component({
  selector: 'kt-retainer',
  templateUrl: './retainer.component.html',
  styleUrls: ['./retainer.component.scss']
})
export class RetainerComponent implements OnInit, OnDestroy {

  selectedProject: IProject;
  @Input() codeStep: string;
  @Input() hasAccesToUpload: boolean;
  @Input() hasAccesEdit: boolean;
  @Input() isAccreditStepThree: boolean;
  panelBiddingOpenState = false;
  panelObjectionOpenState = false;
  selectedSolicitude: ISolicitude;
  projectSubscriber: Subscription;
  downloadFileSubscription: Subscription;
  reviewSubscription: Subscription;
  currentCompany: string;
  retainersArrayValues: RetainerViewer[];

  @Output() enableNextBtn = new EventEmitter<boolean>();

  menuActions = {
    REPLACE_PAYMENT_REQ: this.replaceFile.bind(this),
    REPLACE_F01_RETAINER: this.replaceFile.bind(this),
    SAVE: this.saveFile.bind(this),
    APPROVE: this.openApproveAndObservationModal.bind(this),
    OBSERVE: this.openApproveAndObservationModal.bind(this),
    ACCREDIT_PAYMENT_REQ: this.accreditFile.bind(this),
    REPLACE_PROOF_PAYMENT: this.replaceFile.bind(this),
    UPPLOAD_FINAL_RETAINER: this.replaceFile.bind(this),
  };

  constructor(
    private roleService: RoleService,
    private rulesService: RulesService,
    private projectsService: ProjectsService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private documentService: DocumentsService,
    private executionService: ExecutionService,
  ) { }

  ngOnInit() {
    this.projectSubscriber = this.projectsService.project$.subscribe((project) => {
      if (project.execution && project.execution.payment && project.execution.payment.advance) {
        this.retainersArrayValues = project.execution.payment.advance.map((advance, index) => {
          return new RetainerViewer(advance, index);
        });
      }
      this.selectedProject = project;
      this.selectedSolicitude = this.selectedProject.solicitude;
      this.validatePayments();
    });
    this.selectedSolicitude = this.projectsService.currentProject.solicitude;
    this.currentCompany = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).company;
  }

  get companies() {
    const documentsCompanies = this.selectedProject.execution.payment.advance.map((advance, index) => {
      return advance.request.document[0].document.company;
    });
    let companies = Array.from(new Set(documentsCompanies));
    if (this.roleService.currentActiveRole === 'ROLE_CONT' || this.roleService.currentActiveRole === 'ROLE_SUP') {
      companies = companies.filter(company => company === this.currentCompany);
    }
    return companies;
  }

  validatePayments() {
    if (this.retainersArrayValues) {
      const completePayments = this.retainersArrayValues.filter(paymentView => paymentView.proffPayment);
      const areAllDocumentsComplete = this.retainersArrayValues.length === completePayments.length;
      return this.enableNextBtn.emit(areAllDocumentsComplete);
    }
    this.enableNextBtn.emit(true);
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
                this.accreditRetainerFile(selectedDocument, result);
              }
            });
          } else {
            this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  accreditRetainerFile(selectedDocument: IReviewAndDocument, modalPayload) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.paymentRequest.documentType,
      idProject: this.selectedProject.id,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: 0,
      codeStep: DOCUMENT_PAYLOADS.paymentRequest.codeStep,
      type: 'accredit'
    };
    this.executionService.accreditDocument(this.selectedProject.execution.id, payload).subscribe(
      (data) => { },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  downPaymentRequestMenu(retainer) {
    const approvalsNumber = this.getApprovalsNumber(retainer);
    if (retainer.lastReviewIsObservation) { return [PAYMENT_REQUEST_MENU[1], PAYMENT_REQUEST_MENU[5]]; }
    if (retainer.downPaymentRequest.approved) { return [PAYMENT_REQUEST_MENU[PAYMENT_REQUEST_MENU.length - 2]]; }
    if (retainer.isLatestVersion) { return [...PAYMENT_REQUEST_MENU].slice(-1); }
    if (approvalsNumber < environment.approvalsRequired.retainerRequest) {
      const menu = [...PAYMENT_REQUEST_MENU].slice(0, 4);
      menu.splice(0, 1);
      return [...menu, PAYMENT_REQUEST_MENU[5]];
    }
    return [...PAYMENT_REQUEST_MENU.slice(0, 4), PAYMENT_REQUEST_MENU[5]];
  }

  getApprovalsNumber(retainer): number {
    let approvalsNumber = 0;
    if (retainer.downPaymentRequest && Array.isArray(retainer.downPaymentRequest.review)) {
      const approvalsList = retainer.downPaymentRequest.review.filter(review => review.type === 'approval');
      approvalsNumber = approvalsList.length;
    }
    return approvalsNumber;
  }

  get proffPaymentMenu() {
    return PROFF_PAYMENT_MENU;
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
        (data) => { },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.notificationService.error(error);
        }
      );
  }

  get f01RetainerMenu() {
    return F01_RETAINER_MENU;
  }

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event): void {
    const documentDetails = DOCUMENT_PAYLOADS.paymentRequest;

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
          (data) => {},
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
    if (event.action !== 'UPPLOAD_FINAL_RETAINER' && this.hasAccesEdit) {
      this.contractorOrSupervisorhasAcces(files, documentCode, event, idGroup);
    }

    if (event.action === 'UPPLOAD_FINAL_RETAINER') {
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

  downPaymentRequestEvent(event) {
    const paymentRequestList = this.selectedProject.execution.payment.advance[event.index].request.document;
    const selectedDocument = paymentRequestList[paymentRequestList.length - 1];
    const idGroup = this.selectedProject.execution.payment.advance[event.index].id;
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

  f01RetainerEvent(event: IMenuEvent) {
    const f01RetainerList = this.selectedProject.execution.payment.advance[event.index].f01;
    const selectedDocument = f01RetainerList[f01RetainerList.length - 1];
    const idGroup = this.selectedProject.execution.payment.advance[event.index].id;
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

  proffPaymentEvent(event: IMenuEvent) {
    const proffPaymentList = this.selectedProject.execution.payment.advance[event.index].proffPayment;
    const selectedDocument = proffPaymentList[proffPaymentList.length - 1];
    const idGroup = this.selectedProject.execution.payment.advance[event.index].id;
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

}
