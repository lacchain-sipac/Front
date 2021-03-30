import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { IProcess, AccessType } from '@shared/models/common/interfaces';
import { ProcessService } from '@modules/processes/process.service';
import { NotificationService } from '@shared/components/notification/notification.service';
import { Router } from '@angular/router';
import { RulesService } from '@core/services/rules.service';
import { PHASE_CODES, Keys } from '@shared/helpers';


@Component({
  selector: 'kt-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StepOneComponent implements OnInit {

  nextStepNumber = 2;
  codeStep = 'paso_02_01';
  isAccreditStepOne: boolean;
  textButtonNext: string;
  selectedProcess: IProcess;
  hasAccesEdit: boolean;
  isPreparationComplete: boolean;
  isClarifyComplete: boolean;
  isAmendmentComplete: boolean;

  constructor(
    private projectsService: ProjectsService,
    private rulesService: RulesService,
    private processService: ProcessService,
    private notificationService: NotificationService,
    private router: Router
  ) { }

  ngOnInit() {
    this.projectsService.project$.subscribe((project) => {
      this.selectedProcess = project.process;
      this.isAccreditStepOne = project.process.init && project.process.init.accredited;
      this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.processes, this.codeStep, AccessType.write);
      this.textButtonNext =  !this.isAccreditStepOne ? 'Guardar y continuar' : 'Continuar';
    });
  }

  get disableNextButton() {
    if (this.isAccreditStepOne) {
      return true;
    }
    return this.isPreparationComplete && this.isClarifyComplete && this.isAmendmentComplete;
  }

  goBack(): void {
    this.router.navigate([`home/processes`]);
  }

  preparationSection(event) {
    this.isPreparationComplete = event.enableBtn;
    this.selectedProcess = event.newProcess;
  }

  clarificationsSection(event) {
    this.isClarifyComplete = event;
  }

  amendmentsSection(event) {
    this.isAmendmentComplete = event;
  }

  handleSuccessfulUpdate() {
    const userName = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).fullname;

    this.notificationService.success(`Estimado(a) ${userName}, se han guardado los cambios realizados,
    se enviará un correo al siguiente ROL para continuar con el proceso.`);
    setTimeout(
      () => this.navigateNextStep(),
      8000
    );
  }

  navigateNextStep() {
    this.router.navigate([`home/processes/${this.selectedProcess.idProject}/process/step-two`]);
  }

  private updateProcess() {
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: IProcess = {
      ...this.selectedProcess, currentStep, codeStep
    };
    this.processService.updateProcess(payload).subscribe((response) => {
      if (response.status === '00000') {
        this.handleSuccessfulUpdate();
      } else {
        this.notificationService.error(response.message);
      }
    });
  }

  next(): void {
    if (!this.hasAccesEdit && !this.isAccreditStepOne) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (this.isAccreditStepOne) { return this.navigateNextStep(); }

    if (this.isPreparationComplete && this.isClarifyComplete && this.isAmendmentComplete) { return this.updateProcess(); }
  }
}
