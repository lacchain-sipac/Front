import { ISignedContractCollection } from '../interfaces';

export class SignedContractViewer {
  signedContractAccredited: boolean;
  signedContract: any;
  lastReviewIsObservation: boolean;
  signedContractHistory: any;
  isLatestVersion: boolean;
  index: number;

  constructor(signedContract: ISignedContractCollection, index?: number) {
    this.signedContractAccredited = this.isRequestAccredited(signedContract);
    this.lastReviewIsObservation = this.getlastReviewIsObservation(signedContract);
    this.signedContract = this.getsignedContract(signedContract);
    this.signedContractHistory = this.getsignedContractHistory(signedContract);
    this.isLatestVersion = this.isBiddingLatestVersion(signedContract);
    this.index = index;
  }

  getlastReviewIsObservation(signedContract): boolean {
    const biddingDocument = this.getsignedContract(signedContract);
    if (biddingDocument && Array.isArray(biddingDocument.review)) {
      const lastReview = [...biddingDocument.review].pop();
      return lastReview.type === 'observation';
    }
    return false;
  }

  isBiddingLatestVersion(signedContract: ISignedContractCollection) {
    if (signedContract && signedContract.document) {
      const biddingDocuments = signedContract.document;
      return biddingDocuments.length > 1 ? !!biddingDocuments[biddingDocuments.length - 2].approved : false;
    }
    return false;
  }

  isRequestAccredited(signedContract: ISignedContractCollection): boolean {
    return !!signedContract ? signedContract.accredited : false;
  }

  getsignedContractHistory(signedContract: ISignedContractCollection) {
    const isTherePaymentHistory = signedContract && signedContract.document.length > 1;
    return isTherePaymentHistory ? [...signedContract.document].reverse().splice(1, signedContract.document.length - 1) : [];
  }

  getsignedContract(signedContract: ISignedContractCollection) {
    if (signedContract && signedContract.document) {
      return signedContract.document.length === 1 ? signedContract.document[0] : [...signedContract.document].pop();
    }
    return null;
  }
}
