import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProcessPhasesComponent } from './containers/process-phases/process-phases.component';
import { ListProcessComponent } from './containers/list-process/list-process.component';
import { SeeDetailsComponent } from './containers/see-details/see-details.component';

import { StepOneComponent as RequestStepOneComponent } from './containers/process-phases/requests/step-one/step-one.component';
import { StepTwoComponent as RequestStepTwoComponent } from './containers/process-phases/requests/step-two/step-two.component';
import { StepThreeComponent as RequestStepThreeComponent } from './containers/process-phases/requests/step-three/step-three.component';
import { StepFourComponent as RequestStepFourComponent } from './containers/process-phases/requests/step-four/step-four.component';
import { StepFiveComponent as RequestStepFiveComponent } from './containers/process-phases/requests/step-five/step-five.component';

import { StepOneComponent as ProcessStepOneComponent } from './containers/process-phases/processes/step-one/step-one.component';
import { StepTwoComponent as ProcessStepTwoComponent } from './containers/process-phases/processes/step-two/step-two.component';
import { StepThreeComponent as ProcessStepThreeComponent } from './containers/process-phases/processes/step-three/step-three.component';
import { StepFourComponent as ProcessStepFourComponent } from './containers/process-phases/processes/step-four/step-four.component';
import { StepFiveComponent as ProcessStepFiveComponent } from './containers/process-phases/processes/step-five/step-five.component';
import { StepSixComponent as ProcessStepSixComponent } from './containers/process-phases/processes/step-six/step-six.component';
import { StepSevenComponent as ProcessStepSevenComponent } from './containers/process-phases/processes/step-seven/step-seven.component';

import { StepOneComponent as ExecutionStepOneComponent } from './containers/process-phases/execution/step-one/step-one.component';
import { StepTwoComponent as ExecutionStepTwoComponent } from './containers/process-phases/execution/step-two/step-two.component';
import { StepThreeComponent as ExecutionStepThreeComponent } from './containers/process-phases/execution/step-three/step-three.component';
import { StepFourComponent as ExecutionStepFourComponent } from './containers/process-phases/execution/step-four/step-four.component';
import { StepFiveComponent as ExecutionStepFiveComponent } from './containers/process-phases/execution/step-five/step-five.component';
import { ProjectResolver } from './services/project.resolver.service';
import { ParameterRulesResolverService } from './services/parameter-rules.resolver.service';

import { RequestComponent as RequestDetailsComponent } from './containers/see-details/request/request.component';
import { ProcessComponent as ProcessDetailsComponent } from './containers/see-details/process/process.component';
import { ExecutionComponent as ExecutionDetailsComponent } from './containers/see-details/execution/execution.component';
import { PhaseGuard } from '@core/guards/phase.guard';

const routes: Routes = [
  {
    path: '',
    component: ListProcessComponent,
    resolve: {
      process: ParameterRulesResolverService
    }
  },
  {
    path: ':id/see-details',
    component: SeeDetailsComponent,
    children: [
      { path: 'request', component: RequestDetailsComponent, canActivate: [PhaseGuard]  },
      { path: 'process', component: ProcessDetailsComponent, canActivate: [PhaseGuard] },
      { path: 'execution', component: ExecutionDetailsComponent, canActivate: [PhaseGuard] }
    ],
    resolve: {
      process: ProjectResolver
    }
  },
  {
    path: ':id/request',
    component: ProcessPhasesComponent,
    children: [
      { path: 'step-one', component: RequestStepOneComponent, data: { activeBreadcrumb: 1, currentStep: 1 }, canActivate: [PhaseGuard] },
      { path: 'step-two', component: RequestStepTwoComponent, data: { activeBreadcrumb: 1, currentStep: 2 }, canActivate: [PhaseGuard] },
      { path: 'step-three', component: RequestStepThreeComponent, data: { activeBreadcrumb: 1, currentStep: 3 }, canActivate: [PhaseGuard] },
      { path: 'step-four', component: RequestStepFourComponent, data: { activeBreadcrumb: 1, currentStep: 4 }, canActivate: [PhaseGuard] },
      { path: 'step-five', component: RequestStepFiveComponent, data: { activeBreadcrumb: 1, currentStep: 5 }, canActivate: [PhaseGuard] }
    ],
    resolve: {
      process: ProjectResolver, ParameterRulesResolverService
    }
  },
  {
    path: ':id/process',
    component: ProcessPhasesComponent,
    children: [
      { path: 'step-one', component: ProcessStepOneComponent, data: { activeBreadcrumb: 2, currentStep: 1 }, canActivate: [PhaseGuard] },
      { path: 'step-two', component: ProcessStepTwoComponent, data: { activeBreadcrumb: 2, currentStep: 2 }, canActivate: [PhaseGuard] },
      { path: 'step-three', component: ProcessStepThreeComponent, data: { activeBreadcrumb: 2, currentStep: 3 }, canActivate: [PhaseGuard] },
      { path: 'step-four', component: ProcessStepFourComponent, data: { activeBreadcrumb: 2, currentStep: 4 }, canActivate: [PhaseGuard] },
      { path: 'step-five', component: ProcessStepFiveComponent, data: { activeBreadcrumb: 2, currentStep: 5 }, canActivate: [PhaseGuard] },
      { path: 'step-six', component: ProcessStepSixComponent, data: { activeBreadcrumb: 2, currentStep: 6 }, canActivate: [PhaseGuard] },
      { path: 'step-seven', component: ProcessStepSevenComponent, data: { activeBreadcrumb: 2, currentStep: 7 }, canActivate: [PhaseGuard] }
    ],
    resolve: {
      process: ProjectResolver, ParameterRulesResolverService
    }
  },
  {
    path: ':id/execution',
    component: ProcessPhasesComponent,
    children: [
      { path: 'step-one', component: ExecutionStepOneComponent, data: { activeBreadcrumb: 3, currentStep: 1 }, canActivate: [PhaseGuard] },
      { path: 'step-two', component: ExecutionStepTwoComponent, data: { activeBreadcrumb: 3, currentStep: 2 }, canActivate: [PhaseGuard] },
      { path: 'step-three', component: ExecutionStepThreeComponent, data: { activeBreadcrumb: 3, currentStep: 3 }, canActivate: [PhaseGuard] },
      { path: 'step-four', component: ExecutionStepFourComponent, data: { activeBreadcrumb: 3, currentStep: 4 }, canActivate: [PhaseGuard] },
      { path: 'step-five', component: ExecutionStepFiveComponent, data: { activeBreadcrumb: 3, currentStep: 5 }, canActivate: [PhaseGuard] },
    ],
    resolve: {
      process: ProjectResolver, ParameterRulesResolverService
    }
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class ProcessesRoutingModule { }
