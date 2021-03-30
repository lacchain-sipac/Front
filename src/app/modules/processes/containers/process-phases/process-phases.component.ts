import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StepsService } from '@core/services';
import { BREADCRUMBS_MAIN, ROUTES_PROCESSES } from '@shared/helpers';

@Component({
  selector: 'kt-process-phases',
  templateUrl: './process-phases.component.html',
  styleUrls: ['./process-phases.component.scss']
})
export class ProcessPhasesComponent implements OnInit {

  breadcrumbTrailItems = BREADCRUMBS_MAIN;
  testRoutes = ROUTES_PROCESSES;

  activeBreadcrumb: number;
  currentStep: number;
  steps: any;

  constructor(private _stepsService: StepsService, private route: ActivatedRoute ) {
    route.url.subscribe(() => {
      this.activeBreadcrumb = route.snapshot.firstChild.data.activeBreadcrumb;
      this.currentStep = route.snapshot.firstChild.data.currentStep;
      this.loadNamesSteps(this.activeBreadcrumb);
    });
  }

  ngOnInit() {
  }

  loadNamesSteps(activeBreadcrumb: number) {
    switch (activeBreadcrumb) {
      case 1:
        this._stepsService.getRequestSteps().subscribe(steps => {
          this.steps = steps;
        });
        break;
      case 2:
        this._stepsService.getProcessesSteps().subscribe(steps => {
          this.steps = steps;
        });
        break;
      case 3:
        this._stepsService.getExecutionSteps().subscribe(steps => {
          this.steps = steps;
        });
        break;

      default:
        break;
    }
  }

}
