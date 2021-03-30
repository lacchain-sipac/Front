import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalConfirmationComponent } from '@shared/components/modal-confirmation/modal-confirmation.component';
import { ProjectsService } from '@modules/processes/projects.service';
import { ISolicitude, AccessType } from '@shared/models/common/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { NotificationService } from '@shared/components/notification/notification.service';
import { RulesService } from '@core/services/rules.service';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { Keys } from '@shared/helpers';


@Component({
  selector: 'kt-step-four',
  templateUrl: './step-four.component.html',
  styleUrls: ['./step-four.component.scss']
})
export class StepFourComponent implements OnInit {

  public selectedSolicitude: ISolicitude;
  hasAccesEdit: boolean;
  nextStepNumber = 5;
  codeStep = 'paso_01_04';

  menuOptions = [
    {
      shortName: 'Descargar',
      icon: 'file_download',
      action: 'SAVE'
    },
    {
      shortName: 'Eliminar',
      icon: 'delete',
      action: 'DELETE'
    }
  ];

  menuActions = {
    DELETE: this.openModaDelete.bind(this),
    SAVE: this.saveFile.bind(this)
  };

  constructor(
    private dialog: MatDialog,
    private rulesService: RulesService,
    private projectsService: ProjectsService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    this.hasAccesEdit = this.rulesService.userHasAccessToAction('fase_01', 'paso_01_04', AccessType.write);

    this.projectsService.project$.subscribe((project) => {
      this.selectedSolicitude = project.solicitude;
    });
  }

  menuEvent(event): void {
    const currentProject = this.projectsService.currentProject.solicitude;
    this.menuActions[event.action](currentProject, event);
  }

  navigateNextStep(): void {
    this.router.navigate([`home/processes/${this.selectedSolicitude.idProject}/request/step-five`]);
  }

  get thereIsNoDocuments() {
    const documentsDoNotExist = this.selectedSolicitude && !this.selectedSolicitude.document;
    const thereIsNoDocuments = this.selectedSolicitude.document && this.selectedSolicitude.document.length === 0;
    return documentsDoNotExist || thereIsNoDocuments;
  }

  deleteFile(currentRequest, event) {
    this.projectsService.deleteDocument(
      currentRequest.document[event.index].idStorage,
      currentRequest.id,
      'solicitude'
    ).subscribe(
      (data) => {
      },
      (error: HttpErrorResponse) => {
        console.error(error);
      }
    );
  }

  openModaDelete(currentRequest, event): void {
    const dialogRef = this.dialog.open(ModalConfirmationComponent, {
      data: {
        textButtonExecution: 'Eliminar',
        textButtonReject: 'Cancelar',
        title: 'CONFIRMAR',
        description: `¿Está seguro que desea eliminar el documento ${currentRequest.document[event.index].fileName}?`
      }
    });

    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result === 'execution') {
          this.deleteFile(currentRequest, event);
        }
      }
    });
  }

  saveFile(currentRequest, event) {
    this.projectsService.downloadFile(
      currentRequest.document[event.index].idStorage,
      currentRequest.document[event.index].fileName
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
    this.router.navigate([`home/processes/${this.selectedSolicitude.idProject}/request/step-three`]);
  }

  handleSuccessfulUpdate() {
    const userName = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).fullname;
    this.notificationService.success(`Estimado(a) ${userName}, se han guardado los cambios realizados,
       se ha enviado un correo al siguiente ROL para continuar con la Solicitud.`);
    setTimeout(
      () => this.navigateNextStep(),
      8000
    );
  }

  updateSolicitude() {
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: ISolicitude = {
      ...this.selectedSolicitude, currentStep, codeStep
    };
    this.projectsService.updateSolicitude(payload).subscribe({
      next: (response: IHttpResponse) => {
        if (response.status === '00000') {
          this.handleSuccessfulUpdate();
        } else {
          this.notificationService.warn(response.message);
        }
      }
    });
  }

  next() {
    if (!this.hasAccesEdit) {
      return this.navigateNextStep();
    } else {
      if (this.thereIsNoDocuments) {
        this.notificationService.warn('Por favor, adjunte al menos un documento.');
      } else {
        this.updateSolicitude();
      }
    }
  }

}
