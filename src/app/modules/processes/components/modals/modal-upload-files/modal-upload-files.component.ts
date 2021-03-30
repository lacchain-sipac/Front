import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import { NotificationService } from '@shared/components/notification/notification.service';
import { IDialogData } from '@shared/models/common/interfaces';
import { ProjectsService } from '@modules/processes/projects.service';
import { DOCUMENT_PAYLOADS, MEMORY_UNITS } from '@shared/helpers/constants';
import { ProcessService } from '@modules/processes/process.service';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';


@Component({
  selector: 'kt-modal-upload-files',
  templateUrl: './modal-upload-files.component.html',
  styleUrls: ['./modal-upload-files.component.scss']
})
export class ModalUploadFilesComponent implements OnInit {

  selectedFiles: FileList | null;
  basePath = '/uploads';
  kilobytes = 1024;
  nameFile: string;
  loading: boolean;
  success: boolean;
  countRestrictedFiles: number;
  countCorrectFiles: number;
  description = '';
  contract = '';
  fileSize: string;
  documentTitle: string;
  isPaymentDocument = false;
  contracts = [];

  methodsToSaveDocs = {
    solicitude: () => this.saveSolicitudeDocument(),
    process: () => this.saveProcessDocument(),
    execution: () => this.saveExecutionDocument()
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: IDialogData,
    private notificationService: NotificationService,
    private _notificationService: NotificationService,
    public dialogRef: MatDialogRef<ModalUploadFilesComponent>,
    private projectsService: ProjectsService,
    public dialog: MatDialog,
    private processService: ProcessService,
    private executionService: ExecutionService
  ) {
    this.getFiles(this.data.fileList);
    const fileSize = this.formatBytes(this.data.fileList[0].size);
    this.fileSize = fileSize;
    this.documentTitle = this.data.documentTitle;
    this.nameFile = this.data.fileList[0].name;
  }

  ngOnInit() {
    const signedContract = this.projectsService.currentProject.process.signedContract;
    if (!!signedContract && signedContract.contract.length > 0) {
      this.contracts = signedContract.contract.map(contract =>
        [...contract.document].pop().document.fileName);
    }
    this.isPaymentDocument = this.data.documentType === 'estimateRequest'
      || this.data.documentType === 'paymentRequest'
      || this.data.documentType === 'finalEstimateRequest';
  }

  getFiles(files: FileList) {
    this.countRestrictedFiles = 0;
    this.countCorrectFiles = 0;
    const countFiles: number = files.length;

    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf') {
        this.countCorrectFiles++;
      } else {
        this.countRestrictedFiles++;
      }
    });

    if (this.countRestrictedFiles > 0) {
      this._notificationService.warn((this.countRestrictedFiles).toString() + ' archivos de ' + (countFiles).toString() + ' no son documentos PDF. Solo se subieron correctamente ' + (this.countCorrectFiles).toString() + ' archivos.');
      this.countRestrictedFiles = 0;
      this.countCorrectFiles = 0;
    }
    this.selectedFiles = null;
  }

  uploadFiles(files: FileList) {
    this.loading = true;
    Array.from(files).forEach((file) => {
      if (file.type === 'application/pdf') {
        // TODO: Pendiente definir manejo de notificaciones
        this.methodsToSaveDocs[this.data.objectInEdition]();
      }
    });

  }

  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) { return '0 Bytes'; }
    const decimalsNumber = decimals < 0 ? 0 : decimals;
    const memoryUnit = Math.floor(Math.log(bytes) / Math.log(this.kilobytes));
    return parseFloat((bytes / Math.pow(this.kilobytes, memoryUnit)).toFixed(decimalsNumber)) + ' ' + MEMORY_UNITS[memoryUnit];
  }

  closeModal() {
    if (!this.loading || this.success) {
      this.dialogRef.close();
    }
  }

  createFormDataPayload(idProject = null): FormData {
    const formData: FormData = new FormData();
    formData.append('file', this.data.fileList.item(0));
    formData.append('observation', this.description);

    if (this.data.documentType) {
      Object.keys(DOCUMENT_PAYLOADS[this.data.documentType]).forEach(property => {
        formData.append(property, DOCUMENT_PAYLOADS[this.data.documentType][property]);
      });
    }

    if (this.isPaymentDocument) {
      formData.append('signedContract', this.contract);
    }

    if (this.data.idGroup) {
      formData.append('idGroup', this.data.idGroup);
    }

    if (idProject) {
      formData.append('accredited', this.data.accredited);
      formData.append('idProject', idProject);
    }

    return formData;
  }

  openConfirmationLastVersionDocument(isProcessDocument: boolean, formData: FormData, currentPhaseId: string) {
    const dialogRef = this.dialog.open(ModalConfirmationComponent, {
      data: {
        textButtonExecution: 'Sí, guardar',
        textButtonReject: 'Cancelar',
        title: 'CONFIRMAR',
        description: `¿Esta seguro de adjuntar la versión final del documento, luego no será posible reemplazarla?`
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'execution') {
          if (isProcessDocument) {
            this.saveDocumentOfPhaseProcess(formData, currentPhaseId);
          } else {
            this.saveDocumentOfPhaseExecution(formData, currentPhaseId);
          }
        } else {
          this.dialogRef.close();
        }
      }
    });
  }

  saveProcessDocument() {
    const isProcessDocument = true;
    const modalTitle = this.data.title;
    const currentProject = this.projectsService.currentProject;
    const currentPhaseId = currentProject.process.id;
    const formData = this.createFormDataPayload(currentProject.id);
    if (modalTitle === 'Documento final' || modalTitle === 'Subir documento final') {
      this.openConfirmationLastVersionDocument(isProcessDocument, formData, currentPhaseId);
    } else {
      this.saveDocumentOfPhaseProcess(formData, currentPhaseId);
    }
  }

  saveSolicitudeDocument() {
    const currentProject = this.projectsService.currentProject;
    const currentPhaseId = currentProject[this.data.objectInEdition].id;
    const formData = this.createFormDataPayload();
    this.projectsService.saveRequestDocument(formData, currentPhaseId).subscribe({
      next: (response) => { this.manageResponse(response); }
    });
  }

  saveExecutionDocument() {
    const isProcessDocument = false;
    const modalTitle = this.data.title;
    const currentProject = this.projectsService.currentProject;
    const currentPhaseId = currentProject.execution.id;
    const formData = this.createFormDataPayload(currentProject.id);

    if (modalTitle === 'Documento final' || modalTitle === 'Subir documento final') {
      this.openConfirmationLastVersionDocument(isProcessDocument, formData, currentPhaseId);
    } else {
      this.saveDocumentOfPhaseExecution(formData, currentPhaseId);
    }
  }

  saveDocumentOfPhaseProcess(formData: FormData, currentPhaseId: string) {
    this.processService.saveProcessDocument(formData, currentPhaseId).subscribe({
      next: (response) => { this.manageResponse(response); }
    });
  }

  saveDocumentOfPhaseExecution(formData: FormData, currentPhaseId: string) {
    this.executionService.saveExecutionDocument(formData, currentPhaseId).subscribe({
      next: (response) => { this.manageResponse(response); }
    });
  }

  manageResponse(response) {
    if (response.status === '00000') {
      this.loading = false;
      this.success = true;
      this._notificationService.success('Su documento PDF se subió correctamente al repositorio.');
      setTimeout(() => this.dialogRef.close(), 2000);
    } else {
      this.notificationService.error(response.message);
      setTimeout(() => this.dialogRef.close(), 2000);
    }
  }

  get enableUploadButton() {
    const generalEnableBUtton = this.description !== '' && this.description !== null && this.countCorrectFiles > 0
      && !this.loading && !this.success;
    if (this.isPaymentDocument) {
      return generalEnableBUtton && this.contract;
    }
    return generalEnableBUtton;
  }

}
