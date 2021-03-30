export class FinalPaymentsViewer {
  estimateRequestAccredited: boolean;
  estimateRequest: any;
  f01Estimate: any;
  lastReviewIsObservation: boolean;
  preliminaryEstimateRequest: any;
  estimateRequestHistory: any;
  f01EstimateHistory: any;
  proffPayment: any;
  proffPaymentHistory: any;
  isLatestVersion: boolean;
  index: number;

  constructor(finalPayment, index?: number) {
    this.estimateRequestAccredited = this.isRequestAccredited(finalPayment);
    this.estimateRequest = this.getEstimateRequest(finalPayment);
    this.lastReviewIsObservation = this.getlastReviewIsObservation(finalPayment);
    this.preliminaryEstimateRequest = this.getPreliminaryDocEstimate(finalPayment);
    this.estimateRequestHistory = this.getEstimateRequestHistory(finalPayment);
    this.f01Estimate = this.getF01Estimate(finalPayment);
    this.f01EstimateHistory = this.getF01EstimateHistory(finalPayment);
    this.proffPayment = this.getProffPayment(finalPayment);
    this.proffPaymentHistory = this.getProffPaymentHistory(finalPayment);
    this.isLatestVersion = this.isBiddingLatestVersion(finalPayment);
    this.index = index;
  }

  getlastReviewIsObservation(finalPayment): boolean {
    const estimateRequest = this.getEstimateRequest(finalPayment);
    if (estimateRequest && Array.isArray(estimateRequest.review)) {
      const lastReview = [...estimateRequest.review].pop();
      return lastReview.type === 'observation';
    }
    return false;
  }


  isBiddingLatestVersion(finalPayment) {
    if (finalPayment && finalPayment.request && finalPayment.request.document) {
      const biddingDocuments = finalPayment.request.document;
      return biddingDocuments.length > 1 ? !!biddingDocuments[biddingDocuments.length - 2].approved : false;
    }
    return false;
  }

  isRequestAccredited(finalPayment): boolean {
    return finalPayment && finalPayment.request ? finalPayment.request.accredited : false;
  }

  getF01EstimateHistory(finalPayment) {
    const isThereF01EstimateHistory = finalPayment && finalPayment.f01 && finalPayment.f01.length > 1;
    return isThereF01EstimateHistory ? [...finalPayment.f01].reverse().splice(1, finalPayment.f01.length - 1) : [];
  }

  getProffPayment(finalPayment) {
    if (finalPayment && finalPayment.proffPayment) {
      return finalPayment.proffPayment.length === 1 ? finalPayment.proffPayment[0] : [...finalPayment.proffPayment].pop();
    }
    return null;
  }

  getProffPaymentHistory(finalPayment) {
    const isThereProffPaymentHistory = finalPayment && finalPayment.proffPayment && finalPayment.proffPayment.length > 1;
    return isThereProffPaymentHistory ? [...finalPayment.proffPayment].reverse().splice(1, finalPayment.proffPayment.length - 1) : [];
  }

  getEstimateRequestHistory(finalPayment) {
    const isTherePaymentHistory = finalPayment && finalPayment.request && finalPayment.request.document.length > 1;
    return isTherePaymentHistory ? [...finalPayment.request.document].reverse().splice(1, finalPayment.request.document.length - 1) : [];
  }

  getPreliminaryDocEstimate(finalPayment) {
    if (finalPayment && finalPayment.request && finalPayment.request.document) {
      return  finalPayment.request.document[0];
    }
    return null;
  }

  getF01Estimate(finalPayment) {
    if (finalPayment && finalPayment.f01) {
      return finalPayment.f01.length === 1 ? finalPayment.f01[0] : [...finalPayment.f01].pop();
    }
    return null;
  }

  getEstimateRequest(finalPayment) {
    if (finalPayment && finalPayment.request && finalPayment.request.document) {
      return finalPayment.request.document.length === 1 ? finalPayment.request.document[0] : [...finalPayment.request.document].pop();
    }
    return null;
  }
}
