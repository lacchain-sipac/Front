import { Component, OnInit } from '@angular/core';
import { IProcess, IMenuEvent, AccessType } from '@shared/models/common/interfaces';
import { ProcessService } from '@modules/processes/process.service';
import { ProjectsService } from '@modules/processes/projects.service';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/components/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { MatDialog } from '@angular/material';
import { ModalUploadFilesComponent } from '@modules/processes/components/modals/modal-upload-files/modal-upload-files.component';
import { RulesService } from '@core/services/rules.service';
import { PHASE_CODES, DOCUMENT_PAYLOADS, Keys } from '@shared/helpers';

@Component({
  selector: 'kt-step-two',
  templateUrl: './step-two.component.html',
  styleUrls: ['./step-two.component.scss']
})

export class StepTwoComponent implements OnInit {

  selectedProcess: IProcess;
  codeStep = 'paso_02_02';
  textButtonNext: string;
  hasAccesEdit: boolean;
  stepTwoIsAccredited: boolean;
  phaseCode: string;
  projectSubscription: Subscription;
  isThereOpeningAct: boolean;
  nextStepNumber = 3;

  menuOptions = [
    {
      shortName: 'Descargar',
      icon: 'file_download',
      action: 'SAVE'
    },
    {
      shortName: 'Reemplazar',
      icon: 'loop',
      action: 'REPLACE'
    }
  ];

  menuActions = {
    REPLACE: this.replaceFile.bind(this),
    SAVE: this.saveFile.bind(this)
  };

  constructor(
    private processService: ProcessService,
    private projectsService: ProjectsService,
    private rulesService: RulesService,
    private router: Router,
    public dialog: MatDialog,
    private documentService: DocumentsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.phaseCode = PHASE_CODES.processes;
    this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.processes, this.codeStep, AccessType.write);

    this.projectSubscription = this.projectsService.project$.subscribe((project) => {
      this.selectedProcess = project.process;
      this.stepTwoIsAccredited = project.process.openingAct && project.process.openingAct.accredited;
      this.textButtonNext = !this.stepTwoIsAccredited ? 'Guardar y continuar' : 'Continuar';
    });
  }

  get thereIsNoDocuments() {
    const documentsDoNotExist = this.selectedProcess && !this.selectedProcess.openingAct;
    const thereIsNoDocuments = this.selectedProcess.openingAct &&
      this.selectedProcess.openingAct.document && this.selectedProcess.openingAct.document.length === 0;
    return documentsDoNotExist || thereIsNoDocuments;
  }

  menuEvent(event: IMenuEvent): void {
    const currentProcess = this.projectsService.currentProject.process;
    this.menuActions[event.action](currentProcess, event);
  }

  replaceFile(currentProcess, event) {
    const documentType = DOCUMENT_PAYLOADS.openingActDocument.documentType;
    const files = this.documentService.getSelectedFiles(event.files);

    if (this.stepTwoIsAccredited) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentType, this.phaseCode, this.codeStep, AccessType.upload).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (response.data.auth) {
              if (files) {
                return this.openModalUploadFiles(files);
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

  saveFile(currentProcess, event) {
    this.projectsService.downloadFile(
      currentProcess.openingAct.document[event.index].idStorage,
      currentProcess.openingAct.document[event.index].fileName,
    ).subscribe(
      (data) => {
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.notificationService.error(error);
      }
    );
  }

  get documents() {
    return this.selectedProcess.openingAct.document;
  }

  get historyDocuments() {
    const openingActDocuments = [...this.documents];
    openingActDocuments.pop();
    return openingActDocuments;
  }

  goBack(): void {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-one`]);
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

  navigateNextStep() {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-three`]);
  }

  next() {
    if (!this.hasAccesEdit && !this.stepTwoIsAccredited) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (this.stepTwoIsAccredited) { return this.navigateNextStep(); }
    if (this.thereIsNoDocuments) { return this.notificationService.warn('Por favor, adjunte al menos un documento.'); }
    this.updateProcess();
  }

  private updateProcess() {
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: IProcess = {
      ...this.selectedProcess, currentStep, codeStep
    };
    this.processService.updateProcess(payload).subscribe((response) => {
      if (response.status === '00000') {
        this.handleSuccessfulUpdate();
      } else {
        this.notificationService.error(response.message);
      }
    });
  }

  openModalUploadFiles(fileList: FileList): void {
    const dialogRef = this.dialog.open(ModalUploadFilesComponent, {
      data: {
        textButtonExecution: 'Guardar',
        textButtonReject: 'Cancelar',
        title: 'Reemplazar documento',
        fileList,
        documentType: 'openingActDocument',
        objectInEdition: 'process',
        accredited: '0',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}




