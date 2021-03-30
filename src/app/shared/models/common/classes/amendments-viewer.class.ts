export class AmendmentViewer {
  amendmentResponseAccredited: boolean;
  amendmentRequest: any;
  amendmentResponse: any;
  noObjection: any;
  lastReviewIsObservation: boolean;
  amendmentRequestHistory: any;
  amendmentResponseHistory: any;
  noObjectionHistory: any;
  responseAccredited: boolean;
  responseNoObjection: any;
  responseNoObjectionHistory: any;
  isLatestVersion: any;

  constructor(amendment: any) {
    this.amendmentResponseAccredited = this.isAmendmentAccredited(amendment);
    this.amendmentRequest = this.getAmendmentRequest(amendment);
    this.amendmentResponse = this.getAmendmentResponse(amendment);
    this.lastReviewIsObservation = this.getlastReviewIsObservation(amendment);
    this.noObjection = this.getNoObjection(amendment);
    this.amendmentRequestHistory = this.getAmendmentRequestHistory(amendment);
    this.amendmentResponseHistory = this.getAmendmentResponseHistory(amendment);
    this.noObjectionHistory = this.getNoObjectionHistory(amendment);
    this.responseAccredited = this.getAmendmentResponseAccredited(amendment);
    this.responseNoObjection = this.getNoObjectionResponse(amendment);
    this.responseNoObjectionHistory = this.getNoObjectionResponseHistory(amendment);
    this.isLatestVersion = this.isAmendmentLatestVersion(amendment);
  }

  getlastReviewIsObservation(amendment): boolean {
    const biddingDocument = this.getAmendmentResponse(amendment);
    if (biddingDocument && Array.isArray(biddingDocument.review)) {
      const lastReview = [...biddingDocument.review].pop();
      return lastReview.type === 'observation';
    }
    return false;
  }

  get enmiendaApprovals() {
    return this.amendmentResponse && this.amendmentResponse.review && this.amendmentResponse.review.length > 0;
  }

  isAmendmentLatestVersion(amendment) {
    if (amendment && amendment.response && amendment.response.document) {
      const biddingDocuments = amendment.response.document;
      return biddingDocuments.length > 1 ? !!biddingDocuments[biddingDocuments.length - 2].approved : false;
    }
    return false;
  }

  getAmendmentResponseHistory(amendment) {
    const isThereObjectionHistory = amendment && amendment.response && amendment.response.document && amendment.response.document.length > 1;
    return isThereObjectionHistory ? [...amendment.response.document].reverse().splice(1, amendment.response.document.length - 1) : [];
  }

  getAmendmentRequestHistory(amendment) {
    const isThereBiddingHistory = amendment && amendment.request && amendment.request.length > 1;
    return isThereBiddingHistory ? [...amendment.request].reverse().splice(1, amendment.request.length - 1) : [];
  }

  getNoObjectionHistory(amendment) {
    const isThereBiddingHistory = amendment && amendment.noObjection && amendment.noObjection.length > 1;
    return isThereBiddingHistory ? [...amendment.noObjection].reverse().splice(1, amendment.noObjection.length - 1) : [];
  }

  getNoObjectionResponseHistory(amendment) {
    const isThereBiddingHistory = amendment && amendment.responseNoObjection && amendment.responseNoObjection.length > 1;
    return isThereBiddingHistory ? [...amendment.responseNoObjection].reverse().splice(1, amendment.responseNoObjection.length - 1) : [];
  }

  getNoObjection(amendment) {
    if (amendment && amendment.noObjection) {
      return amendment.noObjection.length === 1 ? amendment.noObjection[0] : [...amendment.noObjection].pop();
    }
    return null;
  }

  getNoObjectionResponse(amendment) {
    if (amendment && amendment.responseNoObjection) {
      return amendment.responseNoObjection.length === 1 ? amendment.responseNoObjection[0] : [...amendment.responseNoObjection].pop();
    }
    return null;
  }

  getAmendmentResponse(amendment) {
    if (amendment && amendment.response && amendment.response.document) {
      return amendment.response.document.length === 1 ? amendment.response.document[0] : [...amendment.response.document].pop();
    }
    return null;
  }

  getAmendmentResponseAccredited(amendment) {
    return amendment && amendment.response && amendment.response.accredited;
  }

  getAmendmentRequest(amendment) {
    if (amendment && amendment.request) {
      return amendment.request.length === 1 ?
      amendment.request[0] : [...amendment.request].pop();
    }
    return null;
  }

  isAmendmentAccredited(amendment): boolean {
    return amendment && amendment.response ? amendment.response.accredited : false;
  }
}
