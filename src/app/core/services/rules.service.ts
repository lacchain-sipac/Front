import { Injectable } from '@angular/core';
import { Keys } from '@shared/helpers';
import { ParametersService } from './parameters.service';
import { PATH_ENDPOINTS_RULES } from '@shared/helpers';
import { DataService } from '@core/services';
import { environment } from '@environments/environment';
import { AccessType } from '@shared/models/common/interfaces';
import { IHttpResponse } from '@shared/models/response/interfaces';
import { RoleService } from '@core/services/role.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RulesService {
  isAuthenticate: boolean;

  constructor(
    private roleService: RoleService,
    private dataService: DataService,
    private parameterService: ParametersService
  ) {
    this.isAuthenticate = JSON.parse(localStorage.getItem(Keys.isAuthenticate));
  }

  get activeRole() {
    return this.roleService.currentActiveRole;
  }

  userHasAccessToPhaseAction(codePhase: string, codePhaseOption: string): Observable<IHttpResponse> {
    const parameters: string = JSON.stringify({
      code_phase: codePhase,
      code_phase_option: codePhaseOption,
      code_proyect: 'PRY_HONDURAS',
      role: this.roleService.currentActiveRole
    });

    const pathService = `${environment.pathApis.parameters}${PATH_ENDPOINTS_RULES.permitionByOption}`;
    this.dataService.set(pathService);

    return this.dataService.execPostJson(parameters);
  }

  /**
   * Determina si un asuario tiene acceso de lectura o escritura a una area o seccion dada, de acuerdo a las reglas de la aplicacion
   * @param codePhase fase del proceso
   * @param codeStep paso del proceso
   * @param documentType codigo del documento
   * @param codeTypeAction accion a ejecutar
   */
  userHasAccessToActionInDocument(documentType: string, codePhase: string, codeStep: string, codeTypeAction: string):
    Observable<IHttpResponse> {
    const parameters: string = JSON.stringify({
      code_document_type: documentType,
      code_phase: codePhase,
      code_proyect: 'PRY_HONDURAS',
      code_step: codeStep,
      code_type_action: codeTypeAction,
      role: this.roleService.currentActiveRole
    });

    const pathService = `${environment.pathApis.parameters}${PATH_ENDPOINTS_RULES.permitionByTypeDocument}`;
    this.dataService.set(pathService);

    return this.dataService.execPostJson(parameters);
  }

  /**
   * Determina si un asuario tiene acceso de lectura o escritura a una area o seccion dada, de acuerdo a las reglas de la aplicacion
   * @param phase fase del proceso
   * @param step paso del proceso
   * @param action accion a ejecutar
   */
  userHasAccessToAction(phase: string, step: string, action: AccessType) {
    return this.parameterService.rules
      .getStepsFromPhase(phase)
      .getAccessTypeFromStep(step)
      .rolesWithAccessTo(action)
      .roleHasAccess(this.roleService.currentActiveRole);
  }

  hasAccessToApproveDocument(phase: string, step: string, documentType, nroApproved) {
    return this.parameterService.rules
      .getStepsFromPhase(phase)
      .getDocumentTypeFromStep(step)
      .getActionsFromDocument(documentType)
      .rolesWithAccessTo(AccessType.approved)
      .roleHasAccesToApproveDocuments(nroApproved, this.roleService.currentActiveRole);
  }

}
