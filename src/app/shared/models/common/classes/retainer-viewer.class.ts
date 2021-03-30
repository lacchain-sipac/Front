export class RetainerViewer {
  downPaymentRequest: any;
  requestAccredited: boolean;
  f01Retainer: any;
  preliminaryEstimateRequest: any;
  downPaymentRequestHistory: any;
  lastReviewIsObservation: boolean;
  f01RetainerHistory: any;
  proffPayment: any;
  proffPaymentHistory: any;
  isLatestVersion: any;
  index: number;

  constructor(retainer, index?: number) {
    this.downPaymentRequest = this.getPaymentRequest(retainer);
    this.requestAccredited = this.isRequestAccredited(retainer);
    this.lastReviewIsObservation = this.getlastReviewIsObservation(retainer);
    this.preliminaryEstimateRequest = this.getPreliminaryDocEstimate(retainer);
    this.downPaymentRequestHistory = this.getDownPaymentRequestHistory(retainer);
    this.f01Retainer = this.getF01Retainer(retainer);
    this.f01RetainerHistory = this.getF01RetainerHistory(retainer);
    this.proffPayment = this.getProffPayment(retainer);
    this.proffPaymentHistory = this.getProffPaymentHistory(retainer);
    this.isLatestVersion = this.isRetainerLatestVersion(retainer);
    this.index = index;
  }

  getlastReviewIsObservation(retainer): boolean {
    const paymentRequest = this.getPaymentRequest(retainer);
    if (paymentRequest && Array.isArray(paymentRequest.review)) {
      const lastReview = [...paymentRequest.review].pop();
      return lastReview.type === 'observation';
    }
    return false;
  }

  isRequestAccredited(retainer): boolean {
    return retainer ? retainer.request.accredited : false;
  }

  getPreliminaryDocEstimate(retainer) {
    if (retainer && retainer.request && retainer.request.document) {
      return  retainer.request.document[0];
    }
    return null;
  }

  isRetainerLatestVersion(retainer) {
    if (retainer && retainer.request && retainer.request.document) {
      const biddingDocuments = retainer.request.document;
      return biddingDocuments.length > 1 ? !!biddingDocuments[biddingDocuments.length - 2].approved : false;
    }
    return false;
  }

  getF01RetainerHistory(retainer) {
    const isThereF01RetainerHistory = retainer && retainer.f01 && retainer.f01.length > 1;
    return isThereF01RetainerHistory ? [...retainer.f01].reverse().splice(1, retainer.f01.length - 1) : [];
  }

  getProffPayment(retainer) {
    if (retainer && retainer.proffPayment) {
      return retainer.proffPayment.length === 1 ? retainer.proffPayment[0] : [...retainer.proffPayment].pop();
    }
    return null;
  }

  getProffPaymentHistory(retainer) {
    const isThereProffPaymentHistory = retainer && retainer.proffPayment && retainer.proffPayment.length > 1;
    return isThereProffPaymentHistory ? [...retainer.proffPayment].reverse().splice(1, retainer.proffPayment.length - 1) : [];
  }

  getDownPaymentRequestHistory(retainer) {
    const isTherePaymentHistory = retainer && retainer.request && retainer.request.document.length > 1;
    return isTherePaymentHistory ? [...retainer.request.document].reverse().splice(1, retainer.request.document.length - 1) : [];
  }

  getF01Retainer(retainer) {
    if (retainer && retainer.f01) {
      return retainer.f01.length === 1 ? retainer.f01[0] : [...retainer.f01].pop();
    }
    return null;
  }

  getPaymentRequest(retainer) {
    if (retainer && retainer.request && retainer.request.document) {
      return retainer.request.document.length === 1 ? retainer.request.document[0] : [...retainer.request.document].pop();
    }
    return null;
  }
}
