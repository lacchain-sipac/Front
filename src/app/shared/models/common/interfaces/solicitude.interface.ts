export interface IAcquisitionMethod {
  acquisitionMethod: string;
  contractType: string;
  newMethod: string;
}

export interface IBudgetStructure {
  additionalComment?: string;
  availabilityStructure: true;
  budgetStructure: string;
  viable: true;
}

export interface ISolicitudeStatus {
  code: string;
  name: string;
}

export interface IDataProcess {
  processName: string;
  transactionType: string;
  processDetail: [
    {
      associatedComponent: string;
      contribution: string;
      fundingSource: string;
      operationNumber: string;
    }
  ];
}

export interface ISolicitudeDocument {
  dateCreation: string;
  fileName: string;
  idStorage: string;
  observation: string;
  user: string;
}

export interface ISolicitudeAccreditation {
  role: string;
  user: string;
  hash: string;
  observation: string;
  date: Date;
}

export interface IFinancingLine {
  description: string;
  estimatedAmount: IEstimateAmount;
  pacLine: string;
  quantity: string;
  unit: string;
}

export interface IEstimateAmount {
  amount: string;
  code: string;
}

export interface ISolicitude {
  idProject: string;
  acquisitionMethod: IAcquisitionMethod;
  budgetStructure: IBudgetStructure;
  createdBy: string;
  currentStatus: ISolicitudeStatus;
  currentStep: number;
  codeStep: string;
  dataProcess: IDataProcess;
  dateAdmission: string;
  document: ISolicitudeDocument[];
  financingLine: IFinancingLine;
  accredited: ISolicitudeAccreditation;
  finishSolicitude: true;
  id: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
}
