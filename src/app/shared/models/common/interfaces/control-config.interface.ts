import { IControlValidation } from './control-validation.interface';

export interface ICCLogin {
  username: IControlValidation;
  password: IControlValidation;
}

export interface ICCCompletePassword {
  password: IControlValidation;
  confirmPassword: IControlValidation;
}

export interface ICCForgotPassword {
  email: IControlValidation;
}

export interface ICCUser {
  email: IControlValidation;
  fullname: IControlValidation;
  surnames: IControlValidation;
  status: IControlValidation;
}

export interface ICCRequestStepTwo {
  pacLine: IControlValidation;
  quantity: IControlValidation;
  unit: IControlValidation;
  description: IControlValidation;
  estimatedAmount: IControlValidation;
}

export interface ICCRequestStepOne {
  transactionType: IControlValidation;
  processName: IControlValidation;
  contribution: IControlValidation;
  operationNumber: IControlValidation;
  associatedComponent: IControlValidation;
  fundingSource: IControlValidation;
}

export interface ICCRequestStepThree {
  acquisitionMethod: IControlValidation;
  contractType: IControlValidation;
  newMethod: IControlValidation;
}

export interface ICCRequestStepFive {
  budgetStructure: IControlValidation;
  additionalComment: IControlValidation;
}

export interface ICCProcessStepThree {
  rolName: IControlValidation;
  detailRole: IControlValidation;
  userName: IControlValidation;
}

export interface ICCExecutionStepTwo {
  contractor: IControlValidation;
  supervisor: IControlValidation;
}

export interface ICCAccreditDialog {
  observation: IControlValidation;
}
