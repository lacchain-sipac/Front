export interface IControlValidation {
  minlength?: number;
  maxlength?: number;
  maxLimitNumber?: number;
  pattern?: string;
  error?: ITypeError;
}

interface ITypeError {
  maxLimitNumber?: string;
  required?: string;
  maxlength?: string;
  minlength?: string;
  pattern?: string;
}
