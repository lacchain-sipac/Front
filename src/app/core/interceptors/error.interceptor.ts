import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '@core/services';
import { NotificationService } from '@shared/components/notification/notification.service';
import { JwtHelperService } from '@auth0/angular-jwt';

const errorMessages = {
  USER_NOT_ROLE_IN_BLOCKCHAIN: 'Usuario no tiene el rol  en la blockchain',
  MESSAGE_USER_NOT_HAVE_IDENTITY:
    'Usuario no tiene identidad digital en la blockchain',
  MESSAGE_ERROR_BLOCKCHAIN_REQUEST_ACCREDITED:
    'Solicitud ya fue acreditada en la blockchain',
  MESSAGE_USER_NOT_ROLE: 'usuario no tiene el rol en la blockchain',
  SOLICITUDE_ID_NOT_FOUND: 'Solicitud no encontrada',
  MESSAGE_ERROR_BLOCKCHAIN_STEP_FLOW_NO_EQUALS:
    'La dirección de contrato de este flujo no es igual al registrado en la blockchain',
  MESSAGE_ERROR_BLOCKCHAIN_PROJECT_NO_INIT: 'Proyecto no iniciado',
  MESSAGE_ERROR_BLOCKCHAIN_STEP_ACCREDITED: 'Paso ya esta acreditado',
  MESSAGE_ERROR_BLOCKCHAIN_DOCUMENT_FINISH_ALL: 'Proyecto ya ha finalizado',
  MESSAGE_ERROR_BLOCKCHAIN_STEP_PREVIUS: 'Se debe realizar un paso anterior',
  MESSAGE_ERROR_BLOCKCHAIN_USER_NO_FOUND_PROJECT:
    'Usuario no registrado en el proyecto (supervisor y contratista)',
  MESSAGE_ERROR_BLOCKCHAIN_STEP_FILE_NO_PRESENT:
    'Archivo no presente en el paso',
  MESSAGE_ERROR_BLOCKCHAIN_PROJECT_NOT_ACCREDITED: 'Proyecto no acreditado',
  MESSAGE_ERROR_BLOCKCHAIN_COMMENT_NOT_ACCREDITED: 'Comentario no acreditado',
  MESSAGE_ERROR_BLOCKCHAIN_DOCUMENT_NOT_ACCREDITED: 'Documento no acreditado',
  PROCESS_ID_NOT_FOUND: 'Proceso no encontrado',
  PROJECT_NOT_EXISTS: 'Proyecto no encontrado',
  EXECUTE_ID_NOT_FOUND: 'Ejecución no encontrada',
};

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private helper = new JwtHelperService();

  constructor(
    private _authenticationService: AuthenticationService,
    private _notificationService: NotificationService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        let error: string =
          errorMessages[err.error.error] || err.error.message || err.statusText;

        // TODO: Pendiente definir las acciones a realizar por cada tipo de error
        switch (err.status) {
          case 401:
            this._authenticationService.cleanSessionLocalStorage();
            break;
          case 400:
            break;
          case 500:
          case 504:
            error =
              'Hubo un problema, por favor intente nuevamente y en caso de persistir el error, comuníquese con el administrador de sistemas.';
            break;
          default:
            break;
        }

        this._notificationService.error(error);
        return throwError(error);
      })
    );
  }
}
