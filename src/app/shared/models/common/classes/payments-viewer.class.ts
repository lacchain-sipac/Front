export class PaymentsViewer {
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

  constructor(estimate, index?: number) {
    this.estimateRequestAccredited = this.isRequestAccredited(estimate);
    this.estimateRequest = this.getEstimateRequest(estimate);
    this.preliminaryEstimateRequest = this.getPreliminaryDocEstimate(estimate);
    this.estimateRequestHistory = this.getEstimateRequestHistory(estimate);
    this.f01Estimate = this.getF01Estimate(estimate);
    this.f01EstimateHistory = this.getF01EstimateHistory(estimate);
    this.proffPayment = this.getProffPayment(estimate);
    this.proffPaymentHistory = this.getProffPaymentHistory(estimate);
    this.isLatestVersion = this.isPaymentLatestVersion(estimate);
    this.lastReviewIsObservation = this.getlastReviewIsObservation(estimate);
    this.index = index;
  }

  getlastReviewIsObservation(estimate): boolean {
    const estimateRequest =  this.getEstimateRequest(estimate);
    if (estimateRequest && Array.isArray(estimateRequest.review)) {
      const lastReview = [...estimateRequest.review].pop();
      return lastReview.type === 'observation';
    }
    return false;
  }

  isPaymentLatestVersion(estimate) {
    if (estimate && estimate.request && estimate.request.document) {
      const biddingDocuments = estimate.request.document;
      return biddingDocuments.length > 1 ? !!biddingDocuments[biddingDocuments.length - 2].approved : false;
    }
    return false;
  }

  getPreliminaryDocEstimate(estimate) {
    if (estimate && estimate.request && estimate.request.document) {
      return  estimate.request.document[0];
    }
    return null;
  }

  isRequestAccredited(estimate): boolean {
    return estimate ? estimate.request.accredited : false;
  }

  getF01EstimateHistory(estimate) {
    const isThereF01EstimateHistory = estimate && estimate.f01 && estimate.f01.length > 1;
    return isThereF01EstimateHistory ? [...estimate.f01].reverse().splice(1, estimate.f01.length - 1) : [];
  }

  getProffPayment(estimate) {
    if (estimate && estimate.proffPayment) {
      return estimate.proffPayment.length === 1 ? estimate.proffPayment[0] : [...estimate.proffPayment].pop();
    }
    return null;
  }

  getProffPaymentHistory(estimate) {
    const isThereProffPaymentHistory = estimate && estimate.proffPayment && estimate.proffPayment.length > 1;
    return isThereProffPaymentHistory ? [...estimate.proffPayment].reverse().splice(1, estimate.proffPayment.length - 1) : [];
  }

  getEstimateRequestHistory(estimate) {
    const isTherePaymentHistory = estimate && estimate.request && estimate.request.document.length > 1;
    return isTherePaymentHistory ? [...estimate.request.document].reverse().splice(1, estimate.request.document.length - 1) : [];
  }

  getF01Estimate(estimate) {
    if (estimate && estimate.f01) {
      return estimate.f01.length === 1 ? estimate.f01[0] : [...estimate.f01].pop();
    }
    return null;
  }

  getEstimateRequest(estimate) {
    if (estimate && estimate.request && estimate.request.document) {
      return estimate.request.document.length === 1 ? estimate.request.document[0] : [...estimate.request.document].pop();
    }
    return null;
  }
}
