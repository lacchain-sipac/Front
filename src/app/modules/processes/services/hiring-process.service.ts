import { Injectable } from '@angular/core';
import { ILoginRequest } from '@shared/models/request/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { environment } from '@environments/environment';
import { PATH_ENDPOINTS_PARAMETERS } from '@shared/helpers';
import { DataService } from '@core/services';
import { catchError } from 'rxjs/operators';

// TODO: Pendiente definir la estructura de un proceso
import * as dataProcessDocument from '../../../../assets/jsons/responses/res-process-document.json';
import { of, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HiringProcessService {

  constructor(private dataService: DataService) { }

  processDocument(): Observable<IHttpResponse> {
    // TODO: Pendiente averiguar el verdadero dominio del servicio y su enpoint
    const pathService = `${environment.pathApis.security}${PATH_ENDPOINTS_PARAMETERS.roles}`;
    this.dataService.set(pathService);

    return this.dataService.execGetJson().pipe(
      // TODO: Pendiente borrar este catchError cuando el servicio ya se encuentre en la nube.
      catchError(() => {
        console.log('processDocument', 'Error de servicio al obtener el documento del proceso, el response será reemplazada por información mock.');
        return of((dataProcessDocument as any).default as IHttpResponse);
      })
    );
  }
}
