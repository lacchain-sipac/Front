import { Component, OnInit, OnDestroy } from '@angular/core';
import { IProcess, IMenuEvent, AccessType, IProject, IReviewAndDocument, IApprovalPayload } from '@shared/models/common/interfaces';
import { ProcessService } from '@modules/processes/process.service';
import { ProjectsService } from '@modules/processes/projects.service';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/components/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { MatDialog } from '@angular/material';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { PHASE_CODES, DOCUMENT_PAYLOADS, CONFIRM_MODAL_PAYLOAD, UPLOAD_MODAL_ACTIONS, SIGNED_CONTRACT_MENU, Keys } from '@shared/helpers';
import { RulesService } from '@core/services/rules.service';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';
import { ModalUploadViewer, SignedContractViewer } from '@shared/models/common/classes';
import { environment } from '@environments/environment';


@Component({
  selector: 'kt-step-seven',
  templateUrl: './step-seven.component.html',
  styleUrls: ['./step-seven.component.scss']
})
export class StepSevenComponent implements OnInit, OnDestroy {

  selectedProcess: IProcess;
  codeStep = 'paso_02_07';
  stepSevenIsAccredited: boolean;
  textButtonNext: string;
  hasAccesEdit: boolean;
  phaseCode: string;
  projectSubscription: Subscription;
  updateSubscription: Subscription;
  reviewSubscription: Subscription;
  isThereOpeningAct: boolean;
  signedContractArrayValues: SignedContractViewer[];
  numberPrism = '';

  menuActions = {
    REPLACE_SIGNED_CONTRACT: this.replaceFile.bind(this),
    ACCREDIT_SIGNED_CONTRACT: this.accreditFile.bind(this),
    UPPLOAD_FINAL_SIGNED_CONTRACT: this.replaceFile.bind(this),
    APPROVE: this.openApproveAndObservationModal.bind(this),
    OBSERVE: this.openApproveAndObservationModal.bind(this),
    SAVE: this.saveFile.bind(this)
  };

  constructor(
    private rulesService: RulesService,
    private processService: ProcessService,
    private projectsService: ProjectsService,
    private router: Router,
    public dialog: MatDialog,
    private documentService: DocumentsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.phaseCode = PHASE_CODES.processes;
    this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.processes, this.codeStep, AccessType.write);

    this.projectSubscription = this.projectsService.project$.subscribe((project: IProject) => {
      this.setSignedContractDocuments(project);
      this.selectedProcess = project.process;
      this.stepSevenIsAccredited = project.process.signedContract && project.process.signedContract.accredited;
      this.textButtonNext = (this.hasAccesEdit && !this.stepSevenIsAccredited) ? 'Guardar y terminar' : 'Terminar';

      if (project.process.signedContract && project.process.signedContract.numberPrism) {
        this.numberPrism = project.process.signedContract.numberPrism;
      }
    });
  }

  setSignedContractDocuments(project: IProject) {
    if (project.process && project.process.signedContract && project.process.signedContract.contract) {
      this.signedContractArrayValues = project.process.signedContract.contract.map(signedContract => {
        return new SignedContractViewer(signedContract);
      });
    }
  }

  menuOptions(signedContractViewer: SignedContractViewer) {
    const approvalsNumber = this.getApprovalsNumber(signedContractViewer);
    if (signedContractViewer.lastReviewIsObservation) {
      return [SIGNED_CONTRACT_MENU[1], SIGNED_CONTRACT_MENU[5]];
    }
    if (signedContractViewer.signedContract.approved) {
      return [SIGNED_CONTRACT_MENU[SIGNED_CONTRACT_MENU.length - 2]];
    }
    if (signedContractViewer.isLatestVersion) {
      return [...SIGNED_CONTRACT_MENU].slice(-1);
    }
    if (approvalsNumber < environment.approvalsRequired.signedContract) {
      const menu = [...SIGNED_CONTRACT_MENU].slice(0, 4);
      menu.splice(0, 1);
      return [...menu, SIGNED_CONTRACT_MENU[5]];
    }
    return [...SIGNED_CONTRACT_MENU.slice(0, 4), SIGNED_CONTRACT_MENU[5]];
  }

  getApprovalsNumber(signedContractViewer: SignedContractViewer): number {
    let approvalsNumber = 0;
    if (signedContractViewer.signedContract && Array.isArray(signedContractViewer.signedContract.review)) {
      const approvalsList = signedContractViewer.signedContract.review.filter(review => review.type === 'approval');
      approvalsNumber = approvalsList.length;
    }
    return approvalsNumber;
  }

  ngOnDestroy() {
    if (this.updateSubscription) { this.updateSubscription.unsubscribe(); }
    if (this.reviewSubscription) { this.reviewSubscription.unsubscribe(); }
    this.projectSubscription.unsubscribe();
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
                this.accreditSignedContract(selectedDocument, result);
              }
            });
          } else {
            this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  accreditSignedContract(selectedDocument: IReviewAndDocument, modalPayload) {
    const payload = {
      documentType: DOCUMENT_PAYLOADS.signedContractDocument.documentType,
      idProject: this.selectedProcess.idProject,
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: 0,
      codeStep: DOCUMENT_PAYLOADS.signedContractDocument.codeStep,
      type: 'accredit'
    };

    this.processService.accreditDocument(this.selectedProcess.id, payload).subscribe(
      (data) => {
        console.log(data);
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  openApproveAndObservationModal(selectedDocument: IReviewAndDocument, event): void {
    const documentDetails = DOCUMENT_PAYLOADS.signedContractDocument;

    if (this.stepSevenIsAccredited) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    this.projectsService.openApproveAndObservationModal(
      event, selectedDocument, documentDetails, this.phaseCode, this.codeStep, this.selectedProcess.idProject)
      .then((payload: IApprovalPayload) => {
        this.processService.reviewDocument(this.selectedProcess.id, payload).subscribe(
          (data) => { },
          (error: HttpErrorResponse) => {
            console.error(error);
          }
        );
      });
  }

  hasNotAccessNotification = () => this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);

  get thereIsNoDocuments() {
    const documentsExist = this.selectedProcess && this.selectedProcess.signedContract;
    const thereIsNoDocuments = this.selectedProcess && this.selectedProcess.signedContract
      && this.selectedProcess.signedContract.contract.length === 0;
    return !documentsExist || thereIsNoDocuments;
  }


  contractHistory(contract) {
    return [...contract.document].splice(0, contract.document.length - 1).reverse();
  }

  menuEvent(event: IMenuEvent): void {
    const selectedContract = this.signedContractArrayValues[event.index].signedContract;
    const idGroup = this.selectedProcess.signedContract.contract[event.index].id;
    this.menuActions[event.action](selectedContract, event, idGroup);
  }

  replaceFile(selectedContract, event, idGroup) {
    const documentType = DOCUMENT_PAYLOADS.signedContractDocument.documentType;
    const files = this.documentService.getSelectedFiles(event.files);

    if (this.stepSevenIsAccredited) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentType, this.phaseCode, this.codeStep, AccessType.upload).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (files) {
              return response.data.auth
                ? this.openModalUploadFiles(files, event.action, idGroup)
                : this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
            }
          } else {
            this.notificationService.error(response.message);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        }
      });
  }

  saveFile(selectedDocument, event) {
    const idStorage = selectedDocument.document ? selectedDocument.document.idStorage : selectedDocument.idStorage;
    const fileName = selectedDocument.document ? selectedDocument.document.fileName : selectedDocument.fileName;

    const downloadFileSubscription: Subscription = this.projectsService.downloadFile(
      idStorage, fileName
    ).subscribe(
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

  goBack(): void {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-six`]);
  }

  handleSuccessfulUpdate() {
    const userName = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).fullname;

    this.notificationService.success(`Estimado(a) ${userName}, se han guardado los cambios realizados,
    se enviará un correo al siguiente ROL para continuar con el proceso.`);
    setTimeout(
      () => this.router.navigate([`home/processes`]),
      8000
    );
  }

  next() {
    if (!this.hasAccesEdit && !this.stepSevenIsAccredited) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (this.stepSevenIsAccredited) { return this.router.navigate([`home/processes`]); }
    if (!this.signedContractArrayValues) {
      return this.notificationService.warn('Por favor, adjunte al menos un documento.');
    } else {
      const completeSignedContracts = this.signedContractArrayValues.filter(contractView => contractView.signedContract);
      const areAllDocumentsComplete = this.signedContractArrayValues.length === completeSignedContracts.length;
      if (this.signedContractArrayValues.length > 0 && areAllDocumentsComplete) {
        this.openModaConfirmation();
      } else {
        return this.notificationService.warn('Por favor, asegurese que los documentos que subio esten con sus adjuntos completos.');
      }
    }
  }

  get buttonNextDisabled(): boolean {
    if (this.signedContractArrayValues) {
      const completeSignedContracts = this.signedContractArrayValues.filter(contractView => contractView.isLatestVersion);
      const areAllDocumentsComplete = this.signedContractArrayValues.length === completeSignedContracts.length;
      return !(this.signedContractArrayValues.length > 0 && areAllDocumentsComplete && this.numberPrism);
    }
    return true;
  }

  private updateProcess() {
    const finishProcess = true;
    this.selectedProcess.signedContract.numberPrism = this.numberPrism;
    const codeStep = this.codeStep;
    const payload: IProcess = {
      ...this.selectedProcess, finishProcess, codeStep
    };

    this.processService.updateProcess(payload).subscribe((response) => {
      if (response.status === '00000') {
        this.handleSuccessfulUpdate();
      } else {
        this.notificationService.error(response.message);
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

  openModaConfirmation(): void {
    const dialogRef = this.dialog.open(ModalConfirmationComponent, {
      data: {
        textButtonExecution: 'Si, guardar',
        textButtonReject: 'Volver',
        title: 'CONFIRMAR',
        description: '¿Está seguro que desea guardar y confirmar la información que acabas de completar?'
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'execution') {
          this.updateProcess();
        }
      }
    });
  }

}
