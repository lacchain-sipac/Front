import { Component, OnInit } from '@angular/core';
import { ProcessService } from '@modules/processes/process.service';
import { IProcess, IMenuEvent, AccessType } from '@shared/models/common/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/components/notification/notification.service';
import { Subscription } from 'rxjs';
import { ModalUploadFilesComponent } from '../modals/modal-upload-files/modal-upload-files.component';
import { ProjectsService } from '@modules/processes/projects.service';
import { MatDialog } from '@angular/material';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { PHASE_CODES, DOCUMENT_PAYLOADS, Keys } from '@shared/helpers';
import { RulesService } from '@core/services/rules.service';


@Component({
  selector: 'kt-award-resolution',
  templateUrl: './award-resolution.component.html',
  styleUrls: ['./award-resolution.component.scss']
})
export class AwardResolutionComponent implements OnInit {

  selectedProcess: IProcess;
  projectSubscription: Subscription;
  codeStep = 'paso_02_06';
  stepSixIsAccredited: boolean;
  textButtonNext: string;
  hasAccesEdit: boolean;
  phaseCode: string;
  nextStepNumber = 7;

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
    private router: Router,
    public dialog: MatDialog,
    private rulesService: RulesService,
    private documentService: DocumentsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.phaseCode = PHASE_CODES.processes;
    this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.processes, this.codeStep, AccessType.write);

    this.projectSubscription = this.projectsService.project$.subscribe((project) => {
      this.selectedProcess = project.process;
      this.stepSixIsAccredited = project.process.awardResolution && project.process.awardResolution.accredited;
      this.textButtonNext = !this.stepSixIsAccredited ? 'Guardar y continuar' : 'Continuar';
    });
  }

  get thereIsNoDocuments() {
    const awardResolution = this.selectedProcess.awardResolution;
    const documentsDoNotExist = !awardResolution;
    const thereIsNoDocuments = awardResolution && awardResolution.document.length === 0;
    return documentsDoNotExist || thereIsNoDocuments;
  }

  get documents() {
    return this.selectedProcess.awardResolution.document;
  }

  get historyDocuments() {
    const awardResolutionDocuments = [...this.documents];
    awardResolutionDocuments.pop();
    return awardResolutionDocuments;
  }

  menuEvent($event: IMenuEvent): void {
    const currentProcess = this.projectsService.currentProject.process;
    this.menuActions[$event.action](currentProcess, $event);
  }

  replaceFile(currentProcess, event) {
    const documentType = DOCUMENT_PAYLOADS.awardResolutionDocument.documentType;
    const files = this.documentService.getSelectedFiles(event.files);

    if (this.stepSixIsAccredited) {
      return this.notificationService.warn(`El paso ya ha sido acreditado y no puede ser modificado`);
    }

    const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
      documentType, this.phaseCode, this.codeStep, AccessType.upload).subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (files) {
              return response.data.auth
                ? this.openModalUploadFiles(files)
                : this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
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
      currentProcess.awardResolution.document[event.index].idStorage,
      currentProcess.awardResolution.document[event.index].fileName,
    ).subscribe(
      (data) => {
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.notificationService.error(error);
      }
    );
  }

  goBack(): void {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-five`]);
  }

  navigateNextStep() {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-seven`]);
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

  next() {
    if (!this.hasAccesEdit && !this.stepSixIsAccredited) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (this.stepSixIsAccredited) { return this.navigateNextStep(); }
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
        documentType: 'awardResolutionDocument',
        objectInEdition: 'process',
        accredited: '0',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

