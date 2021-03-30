import { IPhaseStep } from './phase-step.interface';
import { IPhaseOption } from './phase-option.interface';

export interface IPhase {
  name: string;
  code: string;
  description: string;
  step: IPhaseStep[];
  phaseOption: IPhaseOption[];
}
