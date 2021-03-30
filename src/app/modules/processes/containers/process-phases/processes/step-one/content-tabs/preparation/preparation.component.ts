import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { ParametersService } from '@core/services';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@shared/components/notification/notification.service';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { IProject, ISolicitude, IMenuEvent, IProcess, AccessType, IReviewAndDocument, IApprovalPayload } from '@shared/models/common/interfaces';
import { PreparationViewer, ModalUploadViewer } from '@shared/models/common/classes';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { DOCUMENT_PAYLOADS, BIDDING_MENU, OBJECTION_BIDDING_MENU, CONFIRM_MODAL_PAYLOAD, PHASE_CODES, UPLOAD_MODAL_ACTIONS, OBJECTION_RES_BIDDING_MENU } from '@shared/helpers/constants';
import { ProcessService } from '@modules/processes/process.service';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { ModalRequestDetailsComponent } from '@modules/processes/components/modals/modal-request-details/modal-request-details.component';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { RulesService } from '@core/services/rules.service';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';

@Component({
  selector: 'kt-preparation',
  templateUrl: './preparation.component.html',
  styleUrls: ['./preparation.component.scss']
})
export class PreparationComponent implements OnInit, OnDestroy {

  @Output() enableNextBtn = new EventEmitter<{ enableBtn: boolean, newProcess: IProcess }>();
  @Input() codeStep: string;
  @Input() hasAccesEdit: boolean;
  @Input() isAccreditStepOne: boolean;
  reviewSubscription: Subscription;
  selectedProject: IProject;
  panelBiddingOpenState = false;
  panelObjectionOpenState = false;
  selectedSolicitude: ISolicitude;
  repositoryLink = '';
  projectSubscriber: Subscription;
  public contractType$: Observable<any>;
  preparationViewer: any;
  phaseCode: string;

  menuActions = {
    REPLACE_BIDDING: this.replaceFile.bind(this),
    REPLACE_B_NO_OBJ: this.replaceFile.bind(this),
    FINISH_BIDDING: this.replaceFile.bind(this),
    REPLACE_B_RESPONSE_NO_OBJ: this.replaceFile.bind(this),
    SAVE: this.saveFile.bind(this),
    APPROVE: this.openApproveAndObservationModal.bind(this),
    OBSERVE: this.openApproveAndObservationModal.bind(this),
    UPPLOAD_FINAL_BIDDING: this.replaceFile.bind(this),
    ACCREDIT_DOC: this.accreditFile.bind(this)
  };

  constructor(
    private router: Router,
    private rulesService: RulesService,
    private projectsService: ProjectsService,
    private parametersService: ParametersService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private processService: ProcessService,
    private documentService: DocumentsService
  ) { }

  ngOnInit() {
    this.phaseCode = PHASE_CODES.processes;
    this.projectSubscriber = this.projectsService.project$.subscribe((project) => {
      this.selectedProject = project;
      this.selectedSolicitude = this.selectedProject.solicitude;
      this.preparationViewer = new PreparationViewer(project);
      this.repositoryLink = this.repositoryLink || this.preparationViewer.linkRepository;
      this.validateForm();
    });
    this.contractType$ = this.parametersService.getParameterByType('Transaction').pipe(map((response) => response.data));
  }

  ngOnDestroy() {
    this.projectSubscriber.unsubscribe();
    if (this.reviewSubscription) {
      this.reviewSubscription.unsubscribe();
    }
  }

  get menuOptionsGroup() {
    const approvalsNumber = this.getApprovalsNumber();
    if (this.preparationViewer.lastReviewIsObservation) { return [BIDDING_MENU[1], BIDDING_MENU[5]]; }
    if (this.biddingDocument && this.biddingDocument.approved) { return [BIDDING_MENU[BIDDING_MENU.length - 2]]; }
    if (this.preparationViewer && this.preparationViewer.isLatestVersion) { return [...BIDDING_MENU].slice(-1); }
    if (approvalsNumber < environment.approvalsRequired.biddingRequest) {
      const menu = [...BIDDING_MENU].slice(0, 4);
      menu.splice(0, 1);
      return [...menu, BIDDING_MENU[5]];
    }

    return [...BIDDING_MENU.slice(0, 4), BIDDING_MENU[5]];
  }

  getApprovalsNumber(): number {
    let approvalsNumber = 0;
    if (this.biddingDocument && Array.isArray(this.biddingDocument.review)) {
      const approvalsList = this.biddingDocument.review.filter(review => review.type === 'approval');
      approvalsNumber = approvalsList.length;
    }
    return approvalsNumber;
  }

  validateRepositoryLink(event) {
    if (event.target.value !== '' && event.target.value !== null) {
      this.validateForm();
    }
  }

  validateForm() {
    if (this.noObjectionResponseDocument) {
      const newProcess = { ...this.selectedProject.process };
      newProcess.init.preparation.linkRepository = this.repositoryLink;
      this.enableNextBtn.emit({
        enableBtn: true,
        newProcess: this.selectedProject.process
      });
    }
  }

  getTransactionTypeDescription(transactionTypes) {
    const contract = transactionTypes.filter(item => item.code === this.preparationViewer.transactionType);
    return contract[0].description;
  }

  openModalRequestDetails(): void {
    const dialogRef = this.dialog.open(ModalRequestDetailsComponent);

    dialogRef.afterClosed().subscribe({
      next: (result) => { }
    });
  }

  saveFile(selectedDocument) {
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

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event): void {
    const documentDetails = DOCUMENT_PAYLOADS.biddingDocument;

    if (this.isAccreditStepOne) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    this.projectsService.openApproveAndObservationModal(
      event, selectedDocument, documentDetails, this.phaseCode, this.codeStep, this.selectedProject.id)
      .then((payload: IApprovalPayload) => {
        this.reviewSubscription = this.processService.reviewDocument(this.selectedProject.process.id, payload).subscribe(
          (data) => { },
          (error: HttpErrorResponse) => {
            console.error(error);
          }
        );
      });
  }

  replaceFile(selectedDocument, event) {
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
                return this.openModalUploadFiles(files, event.action);
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

  accreditBiddingFile(selectedDocument: IReviewAndDocument, modalPayload, action) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.biddingDocument.documentType,
      idProject: this.selectedProject.id,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: 0,
      codeStep: DOCUMENT_PAYLOADS.biddingDocument.codeStep,
      type: 'accredit'
    };

    this.processService.accreditDocument(this.selectedProject.process.id, payload).subscribe(
      (data) => { },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  accreditFile(selectedDocument, event) {
    const typeDocument = UPLOAD_MODAL_ACTIONS[event.action].documentType;
    const documentCode = DOCUMENT_PAYLOADS[typeDocument].documentType;
    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentCode, this.phaseCode, this.codeStep, AccessType.acreditted).subscribe({
        next: (response) => {
          if (response.data.auth) {
            const dialogRef = this.dialog.open(
              ModalAccreditComponent, {
              data: CONFIRM_MODAL_PAYLOAD.ACCREDIT
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.accreditBiddingFile(selectedDocument, result, event.action);
              }
            });
          } else {
            this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  openModalUploadFiles(fileList: FileList, action): void {
    const dialogRef = this.dialog.open(ModalUploadFilesComponent, {
      data: new ModalUploadViewer(action, 'process', fileList)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  get biddingDocument() {
    return this.preparationViewer ? this.preparationViewer.biddingDocument : null;
  }

  get noObjectionDocument() {
    return this.preparationViewer ? this.preparationViewer.noObjectionDocument : null;
  }

  get noObjectionResponseDocument() {
    return this.preparationViewer ? this.preparationViewer.noObjectionResponseDocument : null;
  }

  get biddingHistory() {
    return this.preparationViewer ? this.preparationViewer.biddingHistory : null;
  }

  get noObjectionHistory() {
    return this.preparationViewer ? this.preparationViewer.noObjectionHistory : null;
  }

  get noObjectionResponseHistory() {
    return this.preparationViewer ? this.preparationViewer.noObjectionResponseHistory : null;
  }

  navigateToRequestDetails(): void {
    this.router.navigate([`home/processes/${this.selectedProject.id}/see-details/request`]);
  }

  objectionEvent(event) {
    const noObjectionList = this.selectedProject.process.init.preparation.noObjection;
    const selectedDocument = noObjectionList[noObjectionList.length - 1];
    this.menuActions[event.action](selectedDocument, event);
  }

  biddingEvent(event: IMenuEvent) {
    const biddingList = this.selectedProject.process.init.preparation.bidding.document;
    const selectedDocument = biddingList[biddingList.length - 1];
    this.menuActions[event.action](selectedDocument, event);
  }

  get biddingHasApprovals() {
    return this.biddingDocument && this.biddingDocument.review && this.biddingDocument.review.length > 0;
  }

  get noObjectionMenu() {
    return OBJECTION_BIDDING_MENU;
  }

  get noObjectionResponseMenu() {
    return OBJECTION_RES_BIDDING_MENU;
  }

}
