import { Injectable } from '@angular/core';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { environment } from '@environments/environment';
import { DataService } from '@core/services';
import { PATH_ENDPOINTS_PROCESS_STORAGE, PATH_ENDPOINTS_EXECUTION, PATH_ENDPOINTS_EXECUTION_STORAGE, Keys } from '@shared/helpers';
import { tap, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { String } from 'typescript-string-operations';
import FileSaver from 'file-saver';
import { ProjectsService } from '../projects.service';
import { IExecution } from '@shared/models/common/interfaces/index.js';
import { NotificationService } from '@shared/components/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ExecutionService {

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private projectsService: ProjectsService) { }

  updateExecution(execution: IExecution): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_EXECUTION.update, execution.id)}`;
    const parameters: string = JSON.stringify(execution);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe(
      tap((response) => this.updateProject(response))
    );
  }

  createExecution(idProject: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_EXECUTION.createExecution, idProject)}`;
    this.dataService.set(pathService);
    const parameters: string = JSON.stringify({ codeStep: 'paso_03_01' });
    return this.dataService.execPostJson(parameters).pipe(
      tap((response) => this.updateProject(response)),
    );
  }

  accreditDocument(processId, payload) {
    const roles = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).roles;
    payload.role = JSON.parse(localStorage.getItem(Keys.activeRole));
    const currenRole = roles.find((item) => item.code === payload.role);
    payload.roleName = currenRole.name;
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_EXECUTION.accredit, processId)}`;
    this.dataService.set(pathService);
    const parameters: string = JSON.stringify(payload);
    return this.dataService.execPostJson(parameters).pipe(
      tap((response) => {
        if (response.status === '00000') {
          this.updateProject(response);
          this.notificationService.success(
            'Se acreditó correctamente, se enviará una notificación al siguiente ROL para que adjunte el documento final');
        } else {
          this.notificationService.error(response.message);
        }
      }),
    );
  }

  saveExecutionDocument(formData: FormData, id: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.storage}${PATH_ENDPOINTS_EXECUTION_STORAGE.addDocument}`;
    const path: string = String.Format(pathService, id);
    let newObjectInEdition: any;
    this.dataService.set(path);
    return this.dataService.execPostFormData(formData).pipe(
      map((response) => {
        newObjectInEdition = { ...response.data };
        const newProject = {
          ...this.projectsService.currentProject,
          execution: newObjectInEdition
        };
        this.projectsService.getCurrentProject(newProject);
        return response;
      })
    );
  }

  downloadFile(idStorage: string, fileName: string) {
    const pathService = `${environment.pathApis.storage}${PATH_ENDPOINTS_PROCESS_STORAGE.downloadDocument}`;
    const path: string = String.Format(pathService, idStorage);
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/pdf',
      }),
      responseType: 'blob' as 'json'
    };
    return this.http.get<Blob>(path, options).pipe(
      tap((response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        FileSaver.saveAs(blob, fileName);
      })
    );
  }

  reviewDocument(idExecution, payload): Observable<IHttpResponse> {
    const roles = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).roles;
    payload.role = JSON.parse(localStorage.getItem(Keys.activeRole));
    const currenRole = roles.find((item) => item.code === payload.role);
    payload.roleName = currenRole.name;
    const pathService = `${environment.pathApis.storage}${PATH_ENDPOINTS_EXECUTION.reviewDocument}`;
    const path: string = String.Format(pathService, idExecution);
    const parameters: string = JSON.stringify(payload);
    this.dataService.set(path);
    return this.dataService.execPostJson(parameters).pipe(
      map((response) => {
        const newProcess = response.data;
        const newProject = {
          ...this.projectsService.currentProject,
          execution: newProcess
        };
        this.projectsService.getCurrentProject(newProject);
        return response;
      }),
      tap((response) => {
        if (response.status === '00000') {
          this.generateNotificationToReview(payload.type);
          this.updateProject(response);
        }
      }),
    );
  }

  generateNotificationToReview(payloadType) {
    const review = (payloadType === 'observation') ? 'observó' : 'aprobó';
    const messsage = (payloadType === 'observation')
      ? 'ROL correspondiente para que adjunte un nuevo documento'
      : 'siguiente ROL para que continue aprobando/acreditando';
    this.notificationService.success(
      `Se ${review} correctamente, se enviará una notificación al ${messsage}`);
  }

  getsUsersByRole(role: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_EXECUTION.getUsersByRole, role)}`;
    this.dataService.set(pathService);
    return this.dataService.execGetJson().pipe();
  }

  updateProject(response) {
    if (response.status === '00000') {
      const newProject = { ...this.projectsService.currentProject, execution: response.data };
      this.projectsService.getCurrentProject(newProject);
    }
  }

}
