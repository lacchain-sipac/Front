import { IProject, IProcess, IReviewAndDocument, ISolicitude } from '../interfaces';

export class PreparationViewer {
  biddingDocumentAccredited: boolean;
  transactionType: string;
  lastReviewIsObservation: boolean;
  biddingDocument: IReviewAndDocument;
  noObjectionDocument: any;
  biddingHistory: any;
  noObjectionHistory: any;
  linkRepository: string;
  noObjectionResponseHistory: any;
  noObjectionResponseDocument: any;
  isLatestVersion: boolean;

  constructor(project: IProject) {
    this.biddingDocumentAccredited = this.isBiddingAccredited(project.process);
    this.transactionType = this.getTransactionType(project.solicitude);
    this.lastReviewIsObservation = this.getlastReviewIsObservation(project.process);
    this.biddingDocument = this.getBiddingDocument(project.process);
    this.noObjectionDocument = this.getNoObjectionDocument(project.process);
    this.noObjectionResponseDocument = this.getNoObjectionResponseDocument(project.process);
    this.biddingHistory = this.getBiddingHistory(project.process);
    this.noObjectionHistory = this.getNoObjectionHistory(project.process);
    this.noObjectionResponseHistory = this.getNoObjectionResponseHistory(project.process);
    this.linkRepository = this.getLinkRepository(project.process);
    this.isLatestVersion = this.isBiddingLatestVersion(project.process);
  }

  getlastReviewIsObservation(process: IProcess): boolean {
    const biddingDocument = this.getBiddingDocument(process);
    if (biddingDocument && Array.isArray(biddingDocument.review)) {
      const lastReview = [...biddingDocument.review].pop();
      return lastReview.type === 'observation';
    }
    return false;
  }

  getLinkRepository(process: IProcess) {
    const preparationExists = this.preparationExists(process);
    return preparationExists ? preparationExists.linkRepository : null;
  }

  getTransactionType(solicitude: ISolicitude): string {
    if (solicitude && solicitude.dataProcess && solicitude.dataProcess.transactionType) {
      return solicitude.dataProcess.transactionType;
    }
    return null;
  }

  getNoObjectionHistory(process: IProcess) {
    const preparation = this.preparationExists(process);
    const isThereObjectionHistory = preparation && preparation.noObjection && preparation.noObjection.length > 1;
    return isThereObjectionHistory ? [...preparation.noObjection].reverse().splice(1, preparation.noObjection.length - 1) : [];
  }

  getNoObjectionResponseHistory(process: IProcess) {
    const preparation = this.preparationExists(process);
    const isThereObjectionHistory = preparation && preparation.responseNoObjection && preparation.responseNoObjection.length > 1;
    return isThereObjectionHistory ?
      [...preparation.responseNoObjection].reverse().splice(1, preparation.responseNoObjection.length - 1) : [];
  }

  getBiddingHistory(process: IProcess) {
    const preparation = this.preparationExists(process);
    const biddingHistory = preparation && preparation.bidding && preparation.bidding.document;
    if (biddingHistory && biddingHistory.length > 1) {
      return [...biddingHistory].reverse().splice(1, biddingHistory.length - 1);
    }
    return [];
  }

  getNoObjectionDocument(process: IProcess) {
    const preparation = this.preparationExists(process);
    if (preparation && preparation.noObjection) {
      const noObjection = preparation.noObjection;
      return noObjection.length === 1 ? noObjection[0] : [...noObjection].pop();
    }
    return null;
  }

  getNoObjectionResponseDocument(process: IProcess) {
    const preparation = this.preparationExists(process);
    if (preparation && preparation.responseNoObjection) {
      const noObjection = preparation.responseNoObjection;
      return noObjection.length === 1 ? noObjection[0] : [...noObjection].pop();
    }
    return null;
  }

  getBiddingDocument(process: IProcess) {
    const preparationExists = this.preparationExists(process);
    if (preparationExists && preparationExists.bidding && preparationExists.bidding.document) {
      const biddingDocuments = preparationExists.bidding.document;
      return biddingDocuments.length === 1 ? biddingDocuments[0] : [...biddingDocuments].pop();
    }
    return null;
  }

  isBiddingLatestVersion(process) {
    const preparationExists = this.preparationExists(process);
    if (preparationExists && preparationExists.bidding && preparationExists.bidding.document) {
      const biddingDocuments = preparationExists.bidding.document;
      return biddingDocuments.length > 1 ? !!biddingDocuments[biddingDocuments.length - 2].approved : false;
    }
    return false;
  }

  isBiddingAccredited(process: IProcess): boolean {
    const preparationExists = this.preparationExists(process);
    return preparationExists ? preparationExists.bidding.accredited : false;
  }

  preparationExists(process: IProcess) {
    if (process && process.init) {
      return process.init.preparation;
    }
    return null;
  }
}
