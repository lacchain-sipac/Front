import { IStatusProject } from './status-project';
import { IProcess } from './process-interface';
import { ISolicitude } from './solicitude.interface';
import { IExecution } from './execution.interface';

export interface IProject {
  createdBy: string;
  createdDate: string;
  currentStatus: IStatusProject;
  execution: IExecution;
  id: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  process: IProcess;
  solicitude: ISolicitude;
}


export interface DataProcess {
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
