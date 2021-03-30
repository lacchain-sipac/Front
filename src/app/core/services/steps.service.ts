import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class StepsService {

  getRequestSteps() {
    return of([
      'Datos del proceso',
      'Plan de adquisiciones',
      'Método de adquisición y tipo de contrato',
      'Documentación',
      'Disponibilidad y estructura presupuestaria'
    ]);
  }

  getProcessesSteps() {
    return of([
      'Inicio del proceso de contratación',
      'Documentación de oferta',
      'Comité de evaluación',
      'Informe de evaluación',
      'Carga de estructura presupuestaria',
      'Resolución de adjudicación',
      'Contrato firmado'
    ]);
  }

  getExecutionSteps() {
    return of([
      'Datos del contrato',
      'Contratista y Supervisor',
      'Pagos',
      'Modificación de Contrato',
      'Cierre Contrato'
    ]);
  }

}
