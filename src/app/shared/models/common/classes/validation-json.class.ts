import { IValidationJson } from '../interfaces';

export class ValidationJsonViewer {
  newRules: any;

  constructor(rules: IValidationJson) {
    this.newRules = rules;
  }
}
