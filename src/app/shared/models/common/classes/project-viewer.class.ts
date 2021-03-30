import { IProject } from '../interfaces';
import { PROCESS_STATES } from '@shared/helpers/constants';

export class ProjectViewer {
  id: string;
  entryDate: string;
  processName?: string;
  operationNumber?: string;
  step?: number;
  status: string;
  createdBy?: string;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  currentStep?: number;
  currentStatus?: string;
  currentIdNavigation?: string;
  finishProcess?: boolean;
  finishSolicitude?: boolean;
  finishExecute?: boolean;
  initialized?: boolean;
  hasQualityGuarantee?: boolean;

  constructor(project: IProject) {
    this.id = project.id;
    this.entryDate = project.createdDate;
    this.processName = this.getProcessName(project);
    this.operationNumber = this.getProcessDetail(project, 'operationNumber');
    this.step = this.getFromPhaseInEdition(project, 'currentStep');
    this.status = project.currentStatus.name;
    this.createdBy = this.getProcessValue(project, 'createdBy');
    this.lastModifiedBy = this.getProcessValue(project, 'lastModifiedBy');
    this.lastModifiedDate = this.getProcessValue(project, 'lastModifiedDate');
    this.currentStep = this.getFromPhaseInEdition(project, 'currentStep');
    this.currentIdNavigation = this.getFromPhaseInEdition(project, 'id');
    this.currentStatus = project.currentStatus.code;
    this.finishProcess = this.isProjectFinished(project);
    this.finishSolicitude = project.solicitude.finishSolicitude;
    this.finishExecute = project.execution.finishExecute;
    this.hasQualityGuarantee = this.projecthasQualityGuarantee(project);
    this.initialized = project.process.initialized;
  }

  getFromPhaseInEdition(project: IProject, property: string) {
    return project[PROCESS_STATES[project.currentStatus.code].objectInEdition][property];
  }

  projecthasQualityGuarantee(project): boolean {
    const qualityGuarantee = project.execution.qualityGuarantee;
    if (qualityGuarantee) {
      return qualityGuarantee.hasQualityGuarantee;
    } else {
      return !!qualityGuarantee;
    }
  }

  isProjectFinished(project: IProject): boolean {
    return project && project.process && project.process.finishProcess;
  }

  getProcessName(project) {
    const dataProcess = project.solicitude.dataProcess;
    return (dataProcess && dataProcess.processName) ? dataProcess.processName : '';
  }

  getProcessDetail(project, property) {
    const dataProcess = project.solicitude.dataProcess;
    if (dataProcess && dataProcess.processDetail && dataProcess.processDetail.length > 0) {
      return dataProcess.processDetail.map(item => item[property]).join(', ');
    }
    return '';
  }

  getProcessValue = (project, property) => project[property] ? project[property] : '';
}
