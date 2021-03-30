export class ClarificationViewer {
  clarifyResponseAccredited: boolean;
  clarifyRequest: any;
  lastReviewIsObservation: boolean;
  clarifyResponse: any;
  clarifyRequestHistory: any;
  clarifyResponseHistory: any;
  isLatestVersion: boolean;

  constructor(clarify) {
    this.clarifyResponseAccredited = this.isClarifyAccredited(clarify);
    this.clarifyRequest = this.getClarifyRequest(clarify);
    this.lastReviewIsObservation = this.getlastReviewIsObservation(clarify);
    this.clarifyResponse = this.getClarifyResponse(clarify);
    this.clarifyRequestHistory = this.getClarifyRequestHistory(clarify);
    this.clarifyResponseHistory = this.getClarifyResponseHistory(clarify);
    this.isLatestVersion = this.isBiddingLatestVersion(clarify);
  }

  getlastReviewIsObservation(clarify): boolean {
    const biddingDocument = this.getClarifyResponse(clarify);
    if (biddingDocument && Array.isArray(biddingDocument.review)) {
      const lastReview = [...biddingDocument.review].pop();
      return lastReview.type === 'observation';
    }
    return false;
  }

  isBiddingLatestVersion(clarify) {
    if (clarify && clarify.response && clarify.response.document) {
      const biddingDocuments = clarify.response.document;
      return biddingDocuments.length > 1 ? !!biddingDocuments[biddingDocuments.length - 2].approved : false;
    }
    return false;
  }

  getClarifyResponseHistory(clarify) {
    const isThereObjectionHistory = clarify && clarify.response && clarify.response.document && clarify.response.document.length > 1;
    return isThereObjectionHistory ? [...clarify.response.document].reverse().splice(1, clarify.response.document.length - 1) : [];
  }

  getClarifyRequestHistory(clarify) {
    const isThereBiddingHistory = clarify && clarify.request && clarify.request.length > 1;
    return isThereBiddingHistory ? [...clarify.request].reverse().splice(1, clarify.request.length - 1) : [];
  }

  getClarifyResponse(clarify) {
    if (clarify && clarify.response && clarify.response.document) {
      const clarifies = clarify.response.document;
      return clarifies.length === 1 ? clarifies[0] : [...clarifies].pop();
    }
    return null;
  }

  getClarifyRequest(clariy) {
    if (clariy && clariy.request) {
      return clariy.request.length === 1 ? clariy.request[0] : [...clariy.request].pop();
    }
    return null;
  }

  isClarifyAccredited(clarify): boolean {
    return clarify && clarify.response ? clarify.response.accredited : false;
  }
}
