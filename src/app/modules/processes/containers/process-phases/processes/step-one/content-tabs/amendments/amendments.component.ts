import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@shared/components/notification/notification.service';
import { MatDialog } from '@angular/material';
import { IProject, ISolicitude, IMenuEvent, AccessType, IReviewAndDocument, IApprovalPayload } from '@shared/models/common/interfaces';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { DOCUMENT_PAYLOADS, CONFIRM_MODAL_PAYLOAD, AMENDMENT_RESPONSE_MENU, AMENDMENT_REQUEST_MENU, AMENDMENT_OBJECTION_MENU, AMENDMENT_OBJECTION_RES_MENU, PHASE_CODES, UPLOAD_MODAL_ACTIONS } from '@shared/helpers/constants';
import { ProcessService } from '@modules/processes/process.service';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { AmendmentViewer, ModalUploadViewer } from '@shared/models/common/classes';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { Subscription } from 'rxjs';
import { RulesService } from '@core/services/rules.service';
import { environment } from '@environments/environment';
import { IHttpResponse } from '@shared/models/response/interfaces';


@Component({
  selector: 'kt-amendments',
  templateUrl: './amendments.component.html',
  styleUrls: ['./amendments.component.scss']
})
export class AmendmentsComponent implements OnInit, OnDestroy {

  @Input() codeStep: string;
  @Input() isAccreditStepOne: boolean;
  selectedProject: IProject;
  panelBiddingOpenState = false;
  panelObjectionOpenState = false;
  selectedSolicitude: ISolicitude;
  projectSubscriber: Subscription;
  phaseCode: string;
  amendmentsArrayValues: AmendmentViewer[];

  @Output() enableNextBtn = new EventEmitter<boolean>();

  menuActions = {
    REPLACE_AMENDMENT_REQ: this.replaceFile.bind(this),
    REPLACE_AMENDMENT: this.replaceFile.bind(this),
    SAVE: this.saveFile.bind(this),
    APPROVE: this.openApproveAndObservationModal.bind(this),
    OBSERVE: this.openApproveAndObservationModal.bind(this),
    ACCREDIT_AMENDMENT: this.accreditFile.bind(this),
    REPLACE_AMENDMENT_OBJ: this.replaceFile.bind(this),
    REPLACE_AMENDMENT_RES_OBJ: this.replaceFile.bind(this),
    UPPLOAD_FINAL_AMENDMENT: this.replaceFile.bind(this),
  };

  constructor(
    private rulesService: RulesService,
    private projectsService: ProjectsService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private processService: ProcessService,
    private documentService: DocumentsService
  ) { }

  ngOnInit() {
    this.phaseCode = PHASE_CODES.processes;
    this.projectSubscriber = this.projectsService.project$.subscribe((project) => {
      this.setAmendmentValues(project);
      this.selectedProject = project;
      this.selectedSolicitude = this.selectedProject.solicitude;
      this.validateAmendments();
    });
    this.selectedSolicitude = this.projectsService.currentProject.solicitude;
  }

  validateAmendments() {
    if (this.amendmentsArrayValues) {
      const completePayments = this.amendmentsArrayValues.filter(paymentView => paymentView.responseNoObjection);
      const areAllDocumentsComplete = this.amendmentsArrayValues.length === completePayments.length;
      return this.enableNextBtn.emit(this.amendmentsArrayValues.length > 0 && areAllDocumentsComplete);
    }
    this.enableNextBtn.emit(true);
  }

  accreditFile(selectedDocument, event) {
    const typeDocument = UPLOAD_MODAL_ACTIONS[event.action].documentType;
    const documentCode = DOCUMENT_PAYLOADS[typeDocument].documentType;
    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentCode, PHASE_CODES.processes, this.codeStep, AccessType.acreditted).subscribe({
        next: (response) => {
          if (response.data.auth) {
            const dialogRef = this.dialog.open(
              ModalAccreditComponent, {
              data: CONFIRM_MODAL_PAYLOAD.ACCREDIT
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.accreditAmendmenteFile(selectedDocument, result);
              }
            });
          } else {
            this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  accreditAmendmenteFile(selectedDocument: IReviewAndDocument, modalPayload) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.amendment.documentType,
      idProject: this.selectedProject.id,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      nroApproved: 0,
      observation: modalPayload.observation,
      codeStep: DOCUMENT_PAYLOADS.amendment.codeStep,
      type: 'accredit'
    };
    this.processService.accreditDocument(this.selectedProject.process.id, payload).subscribe(
      (data) => {
        console.log(data);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  setAmendmentValues(project) {
    if (project.process && project.process.init && project.process.init.amendment) {
      this.amendmentsArrayValues = project.process.init.amendment.map(amendment => {
        return new AmendmentViewer(amendment);
      });
    }
  }

  get amendmentsRequestMenu() {
    return AMENDMENT_REQUEST_MENU;
  }

  get noObjectionMenu() {
    return AMENDMENT_OBJECTION_MENU;
  }

  get noObjectionResponseMenu() {
    return AMENDMENT_OBJECTION_RES_MENU;
  }

  ngOnDestroy() {
    this.projectSubscriber.unsubscribe();
  }

  saveFile(selectedDocument, event) {
    const idStorage = selectedDocument.document ? selectedDocument.document.idStorage : selectedDocument.idStorage;
    const fileName = selectedDocument.document ? selectedDocument.document.fileName : selectedDocument.fileName;
    this.projectsService.downloadFile(idStorage, fileName)
      .subscribe(
        (data) => { },
        (error: HttpErrorResponse) => {
          console.error(error);
          this.notificationService.error(error);
        }
      );
  }

  getAmendmentsResponseMenu(amendment) {
    const approvalsNumber = this.getApprovalsNumber(amendment);
    if (amendment.lastReviewIsObservation) { return [AMENDMENT_RESPONSE_MENU[1], AMENDMENT_RESPONSE_MENU[5]]; }
    if (amendment.amendmentResponse.approved) { return [AMENDMENT_RESPONSE_MENU[AMENDMENT_RESPONSE_MENU.length - 2]]; }
    if (amendment.isLatestVersion) { return [...AMENDMENT_RESPONSE_MENU].slice(-1); }
    if (approvalsNumber < environment.approvalsRequired.amendmentResponse) {
      const menu = [...AMENDMENT_RESPONSE_MENU].slice(0, 4);
      menu.splice(0, 1);
      return [...menu, AMENDMENT_RESPONSE_MENU[5]];
    }
    return [...AMENDMENT_RESPONSE_MENU.slice(0, 4), AMENDMENT_RESPONSE_MENU[5]];
  }

  getApprovalsNumber(amendment): number {
    let approvalsNumber = 0;
    if (amendment.amendmentResponse && Array.isArray(amendment.amendmentResponse.review)) {
      const approvalsList = amendment.amendmentResponse.review.filter(review => review.type === 'approval');
      approvalsNumber = approvalsList.length;
    }
    return approvalsNumber;
  }

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event, idGroup): void {
    const documentDetails = DOCUMENT_PAYLOADS.amendment;

    if (this.isAccreditStepOne) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    this.projectsService.openApproveAndObservationModal(
      event, selectedDocument, documentDetails, this.phaseCode, this.codeStep, this.selectedProject.id)
      .then((payload: IApprovalPayload) => {
        this.processService.reviewDocument(this.selectedProject.process.id, payload).subscribe(
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

    if (this.isAccreditStepOne) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentCode, this.phaseCode, this.codeStep, actionType).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (response.data.auth) {
              if (files) {
                return this.openModalUploadFiles(files, event.action, idGroup);
              }
            } else {
              this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
            }
          } else {
            this.notificationService.error(response.message);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  openModalUploadFiles(fileList: FileList, action, idGroup?: string): void {
    const dialogRef = this.dialog.open(ModalUploadFilesComponent, {
      data: new ModalUploadViewer(action, 'process', fileList, idGroup)
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


  amendmentEvent(event) {
    const noObjectionList = this.selectedProject.process.init.amendment[event.index].response.document;
    const idGroup = this.selectedProject.process.init.amendment[event.index].id;
    const selectedDocument = noObjectionList[noObjectionList.length - 1];
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

  amendmentRequestEvent(event: IMenuEvent) {
    const biddingList = this.selectedProject.process.init.amendment[event.index].request;
    const idGroup = this.selectedProject.process.init.amendment[event.index].id;
    const selectedDocument = biddingList[biddingList.length - 1];
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

}
