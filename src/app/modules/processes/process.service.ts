import { Injectable } from '@angular/core';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { environment } from '@environments/environment';
import { DataService } from '@core/services';
import { PATH_ENDPOINTS_PROCESSES, PATH_ENDPOINTS_PROCESS_STORAGE } from '@shared/helpers';
import { tap, map } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IProcess, IItemComittee } from '@shared/models/common/interfaces';
import { String } from 'typescript-string-operations';
import FileSaver from 'file-saver';
import { ProjectsService } from './projects.service';
import { Keys } from '@shared/helpers';
import { NotificationService } from '@shared/components/notification/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessService {

  token: string = localStorage.getItem(Keys.accessToken);

  constructor(
    private dataService: DataService,
    private http: HttpClient,
    private notificationService: NotificationService,
    private projectsService: ProjectsService) { }

  getProcess(id: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_PROCESSES.get, id)}`;
    this.dataService.set(pathService);

    return this.dataService.execGetJson().pipe(
      tap(response => {
        this.updateProject(response);
      })
    );
  }

  initProcess(idProject: string) {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_PROCESSES.updateProcess, idProject)}`;
    this.dataService.set(pathService);

    const parameters: string = JSON.stringify({ codeStep: 'paso_02_01' });

    return this.dataService.execPostJson(parameters).pipe(
      tap((response) => this.updateProject(response)),
    );
  }

  accreditDocument(processId, payload) {
    const roles = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).roles;
    payload.role = JSON.parse(localStorage.getItem(Keys.activeRole));
    const currenRole = roles.find((item) => item.code === payload.role);
    payload.roleName = currenRole.name;
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_PROCESSES.accredit, processId)}`;
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

  addUserCommittee(memberCommittee: IItemComittee, idProcess: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_PROCESSES.addUserCommittee, idProcess)}`;
    const parameters: string = JSON.stringify(memberCommittee);
    this.dataService.set(pathService);

    return this.dataService.execPostJson(parameters).pipe(
      tap((response) => this.updateProject(response)),
    );
  }

  updateUserCommitte(memberCommittee: IItemComittee, idProcess: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_PROCESSES.updateUserCommittee, idProcess)}`;
    const parameters: string = JSON.stringify(memberCommittee);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe(
      tap((response) => this.updateProject(response)),
    );
  }

  deleteUserCommiittee(idCommittee: string, idProcess: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${PATH_ENDPOINTS_PROCESSES.deleteUserCommittee}`;
    this.dataService.set(pathService);
    const body = { idCommittee, idProcess };

    return this.dataService.execDeleteJson(body).pipe(
      tap((response) => this.updateProject(response)),
    );
  }

  updateProcess(process: IProcess): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.processes}${String.Format(PATH_ENDPOINTS_PROCESSES.updateProcess, process.id)}`;
    const parameters: string = JSON.stringify(process);
    this.dataService.set(pathService);

    return this.dataService.execPutJson(parameters).pipe(
      tap((response) => this.updateProject(response)),
    );
  }

  saveProcessDocument(formData: FormData, id: string): Observable<IHttpResponse> {
    const pathService = `${environment.pathApis.storage}${PATH_ENDPOINTS_PROCESS_STORAGE.addDocument}`;
    const path: string = String.Format(pathService, id);
    let newObjectInEdition: any;
    this.dataService.set(path);
    return this.dataService.execPostFormData(formData).pipe(
      map((response) => {
        newObjectInEdition = { ...response.data };
        const newProject = {
          ...this.projectsService.currentProject,
          process: newObjectInEdition
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

  reviewDocument(idProcess, payload): Observable<IHttpResponse> {
    const roles = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).roles;
    payload.role = JSON.parse(localStorage.getItem(Keys.activeRole));
    const currenRole = roles.find((item) => item.code === payload.role);
    payload.roleName = currenRole.name;
    const pathService = `${environment.pathApis.storage}${PATH_ENDPOINTS_PROCESSES.reviewDocument}`;
    const path: string = String.Format(pathService, idProcess);
    const parameters: string = JSON.stringify(payload);
    this.dataService.set(path);
    return this.dataService.execPostJson(parameters).pipe(
      map((response) => {
        const newProcess = response.data;
        const newProject = {
          ...this.projectsService.currentProject,
          process: newProcess
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

  updateProject(response) {
    if (response.status === '00000') {
      const newProject = { ...this.projectsService.currentProject, process: response.data };
      this.projectsService.getCurrentProject(newProject);
    }
  }

}
