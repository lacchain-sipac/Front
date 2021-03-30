import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@shared/components/notification/notification.service';
import { MatDialog } from '@angular/material';
import { IProject, IMenuEvent, IProcess, AccessType, IApprovalPayload } from '@shared/models/common/interfaces';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { DOCUMENT_PAYLOADS, EVALUATION_REPORT_MENU, NO_OBJ_EVALUATION_MENU, CONFIRM_MODAL_PAYLOAD, UPLOAD_MODAL_ACTIONS, PHASE_CODES, NO_OBJ_RES_EVALUATION_MENU } from '@shared/helpers/constants';
import { ProcessService } from '@modules/processes/process.service';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { ModalUploadViewer } from '@shared/models/common/classes';
import { EvaluationReportViewer } from '@shared/models/common/classes/evaluation-report-viewer.class';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RulesService } from '@core/services/rules.service';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { Keys } from '@shared/helpers';
import { environment } from '@environments/environment';
import { IReviewAndDocument } from '@shared/models/common/interfaces/process-evaluation-report.interface';

@Component({
  selector: 'kt-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})
export class StepFourComponent implements OnInit, OnDestroy {

  selectedProject: IProject;
  codeStep = 'paso_02_04';
  stepFourIsAccredited: boolean;
  textButtonNext: string;
  hasAccesEdit: boolean;
  phaseCode: string;
  projectSubscription: Subscription;
  evaluationReportViewer: EvaluationReportViewer;
  nextStepNumber = 5;

  menuActions = {
    REPLACE_EVALUATION: this.replaceFile.bind(this),
    REPLACE_EVALUATION_OBJ: this.replaceFile.bind(this),
    REPLACE_EVALUATION_OBJ_RES: this.replaceFile.bind(this),
    UPPLOAD_FINAL_EVALUATION: this.replaceFile.bind(this),
    ACCREDIT_EVALUATION: this.accreditFile.bind(this),
    APPROVE: this.openApproveAndObservationModal.bind(this),
    OBSERVE: this.openApproveAndObservationModal.bind(this),
    SAVE: this.saveFile.bind(this)
  };

  constructor(
    private projectsService: ProjectsService,
    private notificationService: NotificationService,
    private dialog: MatDialog,
    private rulesService: RulesService,
    private processService: ProcessService,
    private documentService: DocumentsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.projectSubscription = this.projectsService.project$.subscribe((project) => {
      this.phaseCode = PHASE_CODES.processes;
      this.evaluationReportViewer = new EvaluationReportViewer(project);
      this.stepFourIsAccredited = project.process.evaluationReport && project.process.evaluationReport.accredited;
      this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.processes, this.codeStep, AccessType.write);
      this.textButtonNext = !this.stepFourIsAccredited ? 'Guardar y continuar' : 'Continuar';
      this.selectedProject = project;
    });
  }

  get menuOptionsGroup() {
    const approvalsNumber = this.getApprovalsNumber();
    if (this.evaluationReport.lastReviewIsObservation) { return [EVALUATION_REPORT_MENU[1], EVALUATION_REPORT_MENU[5]]; }
    if (this.evaluationReport && this.evaluationReport.approved) { return [EVALUATION_REPORT_MENU[EVALUATION_REPORT_MENU.length - 2]]; }
    if (this.evaluationReportViewer && this.evaluationReportViewer.isLatestVersion) { return [...EVALUATION_REPORT_MENU].slice(-1); }

    if (approvalsNumber < environment.approvalsRequired.evaluationReport) {
      const menu = [...EVALUATION_REPORT_MENU].slice(0, 4);
      menu.splice(0, 1);
      return [...menu, EVALUATION_REPORT_MENU[5]];
    }
    return [...EVALUATION_REPORT_MENU.slice(0, 4), EVALUATION_REPORT_MENU[5]];
  }

  getApprovalsNumber(): number {
    let approvalsNumber = 0;
    if (this.evaluationReport && Array.isArray(this.evaluationReport.review)) {
      const approvalsList = this.evaluationReport.review.filter(review => review.type === 'approval');
      approvalsNumber = approvalsList.length;
    }
    return approvalsNumber;
  }

  get noObjectionMenu() {
    return NO_OBJ_EVALUATION_MENU;
  }

  get noObjectionResponseMenu() {
    return NO_OBJ_RES_EVALUATION_MENU;
  }

  ngOnDestroy() {
    if (this.projectSubscription) {
      this.projectSubscription.unsubscribe();
    }
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
                this.accreditEvaluation(selectedDocument, result);
              }
            });
          } else {
            this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  accreditEvaluation(selectedDocument: IReviewAndDocument, modalPayload) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.evaluationReport.documentType,
      idProject: this.selectedProject.id,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: 0,
      codeStep: DOCUMENT_PAYLOADS.evaluationReport.codeStep,
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
    return EVALUATION_REPORT_MENU;
  }

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event): void {
    const documentDetails = DOCUMENT_PAYLOADS.evaluationReport;

    if (this.stepFourIsAccredited) {
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

  replaceFile(selectedDocument, event) {
    const files = this.documentService.getSelectedFiles(event.files);
    const typeDocument = UPLOAD_MODAL_ACTIONS[event.action].documentType;
    const documentCode = DOCUMENT_PAYLOADS[typeDocument].documentType;
    const actionType = UPLOAD_MODAL_ACTIONS[event.action].action;

    if (this.stepFourIsAccredited) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentCode, this.phaseCode, this.codeStep, actionType).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (response.data.auth) {
              if (files) {
                this.openModalUploadFiles(files, event.action);
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

  openModalUploadFiles(fileList: FileList, action): void {
    const dialogRef = this.dialog.open(ModalUploadFilesComponent, {
      data: new ModalUploadViewer(action, 'process', fileList)
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  get evaluationReport() {
    return this.evaluationReportViewer ? this.evaluationReportViewer.evaluationReport : null;
  }

  get noObjection() {
    return this.evaluationReportViewer ? this.evaluationReportViewer.noObjection : null;
  }

  get noObjectionResponse() {
    return this.evaluationReportViewer ? this.evaluationReportViewer.noObjectionResponse : null;
  }

  get evaluationReportHistory() {
    return this.evaluationReportViewer ? this.evaluationReportViewer.evaluationReportHistory : null;
  }

  get noObjectionHistory() {
    return this.evaluationReportViewer ? this.evaluationReportViewer.noObjectionHistory : null;
  }

  get noObjectionResponseHistory() {
    return this.evaluationReportViewer ? this.evaluationReportViewer.noObjectionResponseHistory : null;
  }

  evaluationEvent(event: IMenuEvent) {
    const evaluations = this.selectedProject.process.evaluationReport.evaluation.document;
    const selectedDocument = evaluations[evaluations.length - 1];
    this.menuActions[event.action](selectedDocument, event);
  }

  noObjectionEvent(event: IMenuEvent) {
    const noObjections = this.selectedProject.process.evaluationReport.noObjection;
    const selectedDocument = noObjections[noObjections.length - 1];
    this.menuActions[event.action](selectedDocument, event);
  }

  noObjectionResponseEvent(event: IMenuEvent) {
    const noObjections = this.selectedProject.process.evaluationReport.responseNoObjection;
    const selectedDocument = noObjections[noObjections.length - 1];
    this.menuActions[event.action](selectedDocument, event);
  }

  get clarifyRequestHasApprovals() {
    return this.noObjection && this.noObjection.review && this.noObjection.review.length > 0;
  }

  goBack() {
    this.router.navigate([`home/processes/${this.selectedProject.id}/process/step-three`]);
  }

  navigateNextStep() {
    this.router.navigate([`home/processes/${this.selectedProject.id}/process/step-five`]);
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

  handleCompleteDocument() {
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: IProcess = {
      ...this.selectedProject.process, currentStep, codeStep
    };
    return this.processService.updateProcess(payload).subscribe({
      next: (response: IHttpResponse) => {
        if (response.status === '00000') {
          this.handleSuccessfulUpdate();
        } else {
          this.notificationService.error(response.message);
        }
      }
    });
  }

  next() {
    if (!this.hasAccesEdit && !this.stepFourIsAccredited) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (this.stepFourIsAccredited) { return this.navigateNextStep(); }
    if (this.noObjectionResponse) { return this.handleCompleteDocument(); }
    this.notificationService.warn('Por favor, adjunte el documento de informe de evaluación y su no objeción correspondiente.');
  }

}
