import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectsService } from '@modules/processes/projects.service';
import { IProcess, IExecution, AccessType, ISignedContractCollection } from '@shared/models/common/interfaces';
import { NotificationService } from '@shared/components/notification/notification.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { Subscription } from 'rxjs';
import { PHASE_CODES, Keys } from '@shared/helpers';
import { RulesService } from '@core/services/rules.service';

@Component({
  selector: 'kt-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit, OnDestroy {

  selectedProcess: IProcess;
  codeStep = 'paso_03_01';
  textButtonNext: string;
  hasAccesEdit: boolean;
  phaseCode: string;
  selectedExecution: IExecution;
  downloadFile: Subscription;
  updateExecutionService: Subscription;
  nextStepNumber = 2;
  isAccreditStepOne: boolean;
  contracts: ISignedContractCollection[];
  historyDocuments: ISignedContractCollection[];

  constructor(
    private router: Router,
    private rulesService: RulesService,
    private executionService: ExecutionService,
    private notificationService: NotificationService,
    private projectsService: ProjectsService,
  ) { }

  ngOnInit() {
    this.phaseCode = PHASE_CODES.processes;
    this.hasAccesEdit = this.rulesService.userHasAccessToAction(PHASE_CODES.execution, this.codeStep, AccessType.write);
    this.selectedProcess = this.projectsService.currentProject.process;
    this.selectedExecution = this.projectsService.currentProject.execution;
    this.isAccreditStepOne = this.selectedExecution.assignContractor && this.selectedExecution.assignContractor.accredited;
    this.textButtonNext = (this.hasAccesEdit && !this.isAccreditStepOne) ? 'Guardar y continuar' : 'Continuar';

    this.contracts = this.selectedProcess.signedContract.contract;
    const signedContractDocuments = [...this.contracts];
    signedContractDocuments.pop();
    this.historyDocuments = signedContractDocuments;
  }

  saveFile(signedContract) {
    this.downloadFile = this.projectsService.downloadFile(
      signedContract.document.idStorage,
      signedContract.document.fileName,
    ).subscribe(
      (data) => {
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.notificationService.error(error);
      }
    );
  }

  updateExecution() {
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: IExecution = {
      ...this.selectedExecution, currentStep, codeStep
    };

    this.updateExecutionService = this.executionService.updateExecution(payload).subscribe({
      next: (response) => {
        if (response.status === '00000') {
          this.handleSuccessfulUpdate();
        } else {
          this.notificationService.error(response.message);
        }
      }
    });
  }

  handleSuccessfulUpdate() {
    const userName = JSON.parse(localStorage.getItem(Keys.currentSessionUser)).fullname;
    this.notificationService.success(`Estimado(a) ${userName}, se han guardado los cambios realizados,
     se enviará un correo al siguiente ROL para continuar con el proceso.`);
    setTimeout(
      () => this.router.navigate([`home/processes/${this.selectedExecution.idProject}/execution/step-two`]),
      8000
    );
  }

  next() {
    if (!this.hasAccesEdit && !this.isAccreditStepOne) {
      return this.notificationService.info(`El rol actual no cuenta con acceso para realizar esta acción`);
    }
    if (this.isAccreditStepOne) { return this.router.navigate([`home/processes/${this.selectedExecution.idProject}/execution/step-two`]); }
    return this.updateExecution();
  }

  goBack(): void {
    this.router.navigate([`home/processes`]);
  }

  contractHistory(contract) {
    return [...contract.document].splice(0, contract.document.length - 1).reverse();
  }

  ngOnDestroy() {
    if (!!this.downloadFile) {
      this.downloadFile.unsubscribe();
    }

    if (!!this.updateExecutionService) {
      this.updateExecutionService.unsubscribe();
    }
  }

}
