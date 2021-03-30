import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService, ParametersService } from '@core/services';
import { MatDialog } from '@angular/material';
import { environment } from '@environments/environment';
import { ModalAccreditComponent } from '@modules/processes/components/modals/modal-accredit/modal-accredit.component';

import {
  Keys,
  PATH_ENDPOINTS_PROCESS_STORAGE,
  PATH_ENDPOINTS_PROJECT,
  PATH_ENDPOINTS_REQUESTS,
  PATH_ENDPOINTS_STORAGE,
  PROCESS_STATES,
  CONFIRM_MODAL_PAYLOAD,
} from '@shared/helpers';
import { IProject, IReviewAndDocument, AccessType, IApprovalPayload } from '@shared/models/common/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import FileSaver from 'file-saver';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { String } from 'typescript-string-operations';
import { NotificationService } from '@shared/components/notification/notification.service';
import { RulesService } from '@core/services/rules.service';
import { ProcessService } from './process.service';
import { IdocumentInformation } from '@shared/models/common/interfaces/document-type.interface';

@Injectable({
  providedIn: 'root'
})
export class ProjectsService {

  token: string = localStorage.getItem(Keys.accessToken);
  storagePaths = {
    process: PATH_ENDPOINTS_PROCESS_STORAGE.addDocument,
    solicitude: PATH_ENDPOINTS_STORAGE.addDocument
  };

  private project = new BehaviorSubject<IProject>(null);
  public currentProject: IProject;

  constructor(
    private parameterService: ParametersService,
    private dataService: DataService,
    private http: HttpClient,
    private rulesService: RulesService,
    private dialog: MatDialog,
    private notificationService: NotificationService,
  ) { }

  listProjects(): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${PATH_ENDPOINTS_PROJECT.all}`;
    this.dataService.set(pathService);

    return this.dataService.execGetJson().pipe();
  }

  getProject(id: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_PROJECT.get, id)}`;
    this.dataService.set(pathService);

    return this.dataService.execGetJson().pipe(
      tap(response => {
        this.getCurrentProject(response.data);
      })
    );
  }

  finishProject(id: string, codeStep): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_PROJECT.finish, id)}`;
    const parameters: string = JSON.stringify(codeStep);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe(
      tap(response => {
        this.getCurrentProject(response.data);
      })
    );
  }

  addSolicitude(): Observable<IHttpResponse> {
    // TODO: Usar la variable de enviroment con la ip correcta.
    const pathService = `${environment.pathApis.processes}${PATH_ENDPOINTS_REQUESTS.add}`;
    this.dataService.set(pathService);
    return this.dataService.execPostJson(null);
  }

  updateSolicitude(request): Observable<IHttpResponse> {
    // TODO: Pendiente averiguar el verdadero dominio del servicio y su enpoint
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_REQUESTS.update, request.id)}`;
    const parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe(
      tap((response) => {
        if (response.status === '00000') {
          const newProject = { ...this.currentProject, solicitude: response.data };
          this.getCurrentProject(newProject);
        }
      })
    );
  }

  saveRequestDocument(formData: FormData, id: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.storage}${this.storagePaths.solicitude}`;
    const path: string = String.Format(pathService, id);
    let newObjectInEdition: any;
    this.dataService.set(path);
    return this.dataService.execPostFormData(formData).pipe(
      map((response) => {
        newObjectInEdition = { ...this.currentProject.solicitude, document: response.data.document };
        const newProject = {
          ...this.currentProject,
          solicitude: newObjectInEdition
        };
        this.getCurrentProject(newProject);
        return response;
      })
    );
  }

  deleteDocument(idFile: string, idSolicitude: string, objectInEdition: string) {
    const pathService = `${environment.pathApis.storage}${PATH_ENDPOINTS_STORAGE.deleteDocument}`;
    this.dataService.set(pathService);
    const body = { idFile, idSolicitude };
    return this.dataService.execDeleteJson(body).pipe(
      map((response) => {
        const newObjectInEdition = { ...this.currentProject[objectInEdition], document: response.data.document };
        const newProject = { ...this.currentProject, [objectInEdition]: newObjectInEdition };
        this.getCurrentProject(newProject);
        return response;
      })
    );
  }

  downloadFile(idStorage: string, fileName: string) {
    const pathService = `${environment.pathApis.storage}${PATH_ENDPOINTS_STORAGE.downloadDocument}`;
    const path: string = String.Format(pathService, idStorage);
    // TODO: Mover header al interceptor
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
      }),
      responseType: 'blob' as 'json'
    };
    return this.http.get<Blob>(path, options).pipe(
      tap((response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        FileSaver.saveAs(blob, fileName);
        window.open(url, '_blank');
      })
    );
  }

  acreditRequest(request, requestId): Observable<IHttpResponse> {
    // TODO: Pendiente averiguar el verdadero dominio del servicio y su enpoint
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_REQUESTS.accredit, requestId)}`;
    const parameters: string = JSON.stringify(request);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe(
      // TODO: Pendiente borrar este catchError cuando el servicio ya se encuentre en la nube.
      tap((response) => {
        if (response.status === '00000') {
          this.getCurrentProject(response.data);
        }
      })
    );
  }

  openApproveAndObservationModal(
    event,
    selectedDocument: IReviewAndDocument,
    documentDetails: IdocumentInformation,
    phaseCode: string,
    codeStep: string,
    idProject: string,
  ) {
    const nroApproved: number = !!selectedDocument.review
      ? selectedDocument.review.filter(review => review.type === 'approval').length
      : 0;
    const rolesHasAccessToApproveDocument = this.rulesService.hasAccessToApproveDocument(
      phaseCode, codeStep, documentDetails.documentType, nroApproved);

    return new Promise((resolve, reject) => {
      const hasAcessToExecuteThisAction: Subscription = this.rulesService.userHasAccessToActionInDocument(
        documentDetails.documentType, phaseCode, codeStep, AccessType.approved).subscribe({
          next: (response: IHttpResponse) => {
            if (response.status === '00000') {
              if (response.data.auth) {
                if (event.action === 'APPROVE' && !rolesHasAccessToApproveDocument) {
                  this.notificationService.info(`No es el turno de aprobar del rol actual`);
                } else {
                  const dialogRef = this.dialog.open(
                    ModalAccreditComponent, {
                    data: CONFIRM_MODAL_PAYLOAD[event.action]
                  });

                  dialogRef.afterClosed().subscribe(result => {
                    if (result) {
                      const payload: IApprovalPayload = this.approveOrObserveDocument(
                        nroApproved, selectedDocument, result, event.action, idProject, documentDetails);
                      resolve(payload);
                    }
                  });
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
    });
  }

  approveOrObserveDocument(
    nroApproved: number,
    selectedDocument: IReviewAndDocument,
    modalPayload,
    action,
    idProject: string,
    documentDetails: IdocumentInformation
  ): IApprovalPayload {

    return {
      documentType: documentDetails.documentType,
      idProject,
      role: JSON.parse(localStorage.getItem(Keys.activeRole)),
      idStorage: selectedDocument.document.idStorage,
      nameFile: selectedDocument.document.fileName,
      observation: modalPayload.observation,
      nroApproved: action === 'APPROVE' ? nroApproved + 1 : nroApproved,
      codeStep: documentDetails.codeStep,
      type: action === 'APPROVE' ? 'approval' : 'observation'
    };
  }

  currentStep(activeStep: number) {
    const currentStep = this.currentProject[PROCESS_STATES[this.currentProject.currentStatus.code].objectInEdition].currentStep;
    return activeStep > currentStep ? activeStep : currentStep;
  }

  get project$(): Observable<IProject> {
    return this.project.asObservable();
  }

  public getCurrentProject(project: IProject): void {
    this.updateCurrentProject(project);
  }

  private updateCurrentProject(project: IProject): void {
    this.currentProject = project;
    this.project.next(project);
  }
}
