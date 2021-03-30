import { IProject, IProcess } from '../interfaces';

export class EvaluationReportViewer {
  evaluationReport: any;
  evaluationReportAccredited: boolean;
  noObjection: any;
  lastReviewIsObservation: boolean;
  evaluationReportHistory: any;
  noObjectionHistory: any;
  noObjectionResponse: any;
  noObjectionResponseHistory: any;
  isLatestVersion: boolean;


  constructor(project: IProject) {
    this.evaluationReport = this.getEvaluationReport(project.process);
    this.evaluationReportAccredited = this.isEvaluationReportAccredited(project.process);
    this.noObjection = this.getNoObjection(project.process);
    this.lastReviewIsObservation = this.getlastReviewIsObservation(project.process);
    this.noObjectionResponse = this.getNoObjectionResponse(project.process);
    this.evaluationReportHistory = this.getEvReportHistory(project.process);
    this.noObjectionHistory = this.getObjectionHistory(project.process);
    this.noObjectionResponseHistory = this.getObjectionResponseHistory(project.process);
    this.isLatestVersion = this.isEvaluationReportLatestVersion(project.process);
  }

  getlastReviewIsObservation(process: IProcess): boolean {
    const biddingDocument = this.getEvaluationReport(process);
    if (biddingDocument && Array.isArray(biddingDocument.review)) {
      const lastReview = [...biddingDocument.review].pop();
      return lastReview.type === 'observation';
    }
    return false;
  }

  isEvaluationReportAccredited(process: IProcess): boolean {
    const evaluationReportExists = this.evaluationReportExists(process);
    return evaluationReportExists ? evaluationReportExists.evaluation.accredited : false;
  }

  isEvaluationReportLatestVersion(process) {
    const evaluationReportExists = this.evaluationReportExists(process);
    if (evaluationReportExists && evaluationReportExists.evaluation && evaluationReportExists.evaluation.document) {
      const evaluationReportDocuments = evaluationReportExists.evaluation.document;
      return evaluationReportDocuments.length > 1 ? !!evaluationReportDocuments[evaluationReportDocuments.length - 2].approved : false;
    }
    return false;
  }

  getEvReportHistory(process: IProcess) {
    const evaluationReportExists = this.evaluationReportExists(process);
    const isThereBiddingHistory = evaluationReportExists && evaluationReportExists.evaluation && evaluationReportExists.evaluation.document && evaluationReportExists.evaluation.document.length > 1;
    return isThereBiddingHistory ? [...evaluationReportExists.evaluation.document].reverse().splice(1, evaluationReportExists.evaluation.document.length - 1) : [];
  }

  getObjectionHistory(process: IProcess) {
    const evaluationReportExists = this.evaluationReportExists(process);
    const isThereBiddingHistory = evaluationReportExists && evaluationReportExists.noObjection && evaluationReportExists.noObjection.length > 1;
    return isThereBiddingHistory ? [...evaluationReportExists.noObjection].reverse().splice(1, evaluationReportExists.noObjection.length - 1) : [];
  }

  getObjectionResponseHistory(process: IProcess) {
    const evaluationReportExists = this.evaluationReportExists(process);
    const isThereBiddingHistory = evaluationReportExists && evaluationReportExists.responseNoObjection && evaluationReportExists.responseNoObjection.length > 1;
    return isThereBiddingHistory ? [...evaluationReportExists.responseNoObjection].reverse().splice(1, evaluationReportExists.responseNoObjection.length - 1) : [];
  }

  getNoObjection(process: IProcess) {
    const evaluationReportExists = this.evaluationReportExists(process);
    if (evaluationReportExists && evaluationReportExists.noObjection) {
      const noObjections = evaluationReportExists.noObjection;
      return noObjections.length === 1 ? noObjections[0] : [...noObjections].pop();
    }
    return null;
  }

  getNoObjectionResponse(process: IProcess) {
    const evaluationReportExists = this.evaluationReportExists(process);
    if (evaluationReportExists && evaluationReportExists.responseNoObjection) {
      const noObjections = evaluationReportExists.responseNoObjection;
      return noObjections.length === 1 ? noObjections[0] : [...noObjections].pop();
    }
    return null;
  }

  getEvaluationReport(process: IProcess) {
    const evaluationReportExists = this.evaluationReportExists(process);
    if (evaluationReportExists && evaluationReportExists.evaluation && evaluationReportExists.evaluation.document) {
      const reports = evaluationReportExists.evaluation.document;
      return reports.length === 1 ? reports[0] : [...reports].pop();
    }
    return null;
  }

  evaluationReportExists(process: IProcess) {
    return process && process.evaluationReport;
  }
}
