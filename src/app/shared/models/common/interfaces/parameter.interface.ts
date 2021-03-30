export interface Parameter {
  code: string;
  description: string;
  group?: {
    type: string;
    parameter: Parameter[]
  };
}
