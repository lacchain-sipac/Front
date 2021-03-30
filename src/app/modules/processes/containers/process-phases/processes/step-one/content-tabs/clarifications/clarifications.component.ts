import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@shared/components/notification/notification.service';
import { MatDialog } from '@angular/material';
import { IProject, IMenuEvent, AccessType, IReviewAndDocument, IApprovalPayload } from '@shared/models/common/interfaces';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { DOCUMENT_PAYLOADS, MENU_CLARIFY_REQUEST, CLARIFY_MENU, CONFIRM_MODAL_PAYLOAD, PHASE_CODES, UPLOAD_MODAL_ACTIONS } from '@shared/helpers/constants';
import { ProcessService } from '@modules/processes/process.service';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { ClarificationViewer } from '@shared/models/common/classes/clarifications-viewer.class';
import { ModalUploadViewer } from '@shared/models/common/classes';
import { RulesService } from '@core/services/rules.service';
import { Subscription } from 'rxjs';
import { environment } from '@environments/environment';

@Component({
  selector: 'kt-clarifications',
  templateUrl: './clarifications.component.html',
  styleUrls: ['./clarifications.component.scss']
})
export class ClarificationsComponent implements OnInit {

  @Input() codeStep: string;
  @Input() isAccreditStepOne: boolean;
  selectedProject: IProject;
  phaseCode: string;
  clarificationViewer: ClarificationViewer;
  clarificationsArrayValues: ClarificationViewer[];

  @Output() enableNextBtn = new EventEmitter<boolean>();


  menuActions = {
    REPLACE_REQ_CLARIFY: this.replaceFile.bind(this),
    REPLACE_RES_CLARIFY: this.replaceFile.bind(this),
    SAVE: this.saveFile.bind(this),
    APPROVE: this.openApproveAndObservationModal.bind(this),
    OBSERVE: this.openApproveAndObservationModal.bind(this),
    ACCREDIT_RES_CLARIFY: this.accreditFile.bind(this),
    UPPLOAD_FINAL_RES_CLARIFY: this.replaceFile.bind(this)
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
    this.projectsService.project$.subscribe((project) => {
      this.setClarifyValues(project);
      this.selectedProject = project;
      this.validatePayments();
    });
  }

  validatePayments() {
    if (this.clarificationsArrayValues) {
      const completePayments = this.clarificationsArrayValues.filter(paymentView => paymentView.isLatestVersion);
      const areAllDocumentsComplete = this.clarificationsArrayValues.length === completePayments.length;
      return this.enableNextBtn.emit(this.clarificationsArrayValues.length > 0 && areAllDocumentsComplete);
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
                this.accreditClarifyResponseFile(selectedDocument, result);
              }
            });
          } else {
            this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  accreditClarifyResponseFile(selectedDocument: IReviewAndDocument, modalPayload) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.clarifyingResponse.documentType,
      idProject: this.selectedProject.id,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: 0,
      codeStep: DOCUMENT_PAYLOADS.clarifyingResponse.codeStep,
      type: 'accredit'
    };
    this.processService.accreditDocument(this.selectedProject.process.id, payload).subscribe(
      (data) => {
        this.notificationService.success('El documento fue acreditado exitosamente.');
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  setClarifyValues(project) {
    if (project.process && project.process.init && project.process.init.clarify) {
      this.clarificationsArrayValues = project.process.init.clarify.map(clarify => {
        return new ClarificationViewer(clarify);
      });
    }
  }

  clarifyMenuOptions(clarify) {
    const approvalsNumber = this.getApprovalsNumber(clarify);
    if (clarify.lastReviewIsObservation) { return [CLARIFY_MENU[1], CLARIFY_MENU[5]]; }
    if (clarify.clarifyResponse.approved) { return [CLARIFY_MENU[CLARIFY_MENU.length - 2]]; }
    if (clarify.isLatestVersion) { return [...CLARIFY_MENU].slice(-1); }
    if (approvalsNumber < environment.approvalsRequired.clarifyResponse) {
      const menu = [...CLARIFY_MENU].slice(0, 4);
      menu.splice(0, 1);
      return [...menu, CLARIFY_MENU[5]];
    }
    return [...CLARIFY_MENU.slice(0, 4), CLARIFY_MENU[5]];
  }

  getApprovalsNumber(clarify): number {
    let approvalsNumber = 0;
    if (clarify.clarifyResponse && Array.isArray(clarify.clarifyResponse.review)) {
      const approvalsList = clarify.clarifyResponse.review.filter(review => review.type === 'approval');
      approvalsNumber = approvalsList.length;
    }
    return approvalsNumber;
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

  get clarifyRequestMenu() {
    return MENU_CLARIFY_REQUEST;
  }

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event, idGroup): void {
    const documentDetails = DOCUMENT_PAYLOADS.clarifyingResponse;

    if (this.isAccreditStepOne) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    this.projectsService.openApproveAndObservationModal(
      event, selectedDocument, documentDetails, this.phaseCode, this.codeStep, this.selectedProject.id)
      .then((payload: IApprovalPayload) => {
        this.processService.reviewDocument(this.selectedProject.process.id, payload).subscribe(
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

    if (this.isAccreditStepOne) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentCode, this.phaseCode, this.codeStep, actionType).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (response.data.auth) {
              if (files) {
                this.openModalUploadFiles(files, event.action, idGroup);
              }
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

  openModalUploadFiles(fileList: FileList, action, idGroup: string): void {
    const dialogRef = this.dialog.open(ModalUploadFilesComponent, {
      data: new ModalUploadViewer(action, 'process', fileList, idGroup)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  clarifyEvent(event) {
    const noObjectionList = this.selectedProject.process.init.clarify[event.index].response.document;
    const idGroup = this.selectedProject.process.init.clarify[event.index].id;
    const selectedDocument = noObjectionList[noObjectionList.length - 1];
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

  clarifyRequestEvent(event: IMenuEvent) {
    const biddingList = this.selectedProject.process.init.clarify[event.index].request;
    const idGroup = this.selectedProject.process.init.clarify[event.index].id;
    const selectedDocument = biddingList[biddingList.length - 1];
    this.menuActions[event.action](selectedDocument, event, idGroup);
  }

}
