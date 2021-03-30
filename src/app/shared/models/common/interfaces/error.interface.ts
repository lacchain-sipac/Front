export interface IError {
  error: IDataError;
}

interface IDataError {
  code: string;
  message: string;
}
