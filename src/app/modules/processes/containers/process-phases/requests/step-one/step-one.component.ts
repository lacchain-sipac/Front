import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectsService } from '@modules/processes/projects.service';
import { CC_REQUEST_STEP_ONE } from '@shared/helpers';
import { DataProcess, ICCRequestStepOne, ISolicitude, AccessType } from '@shared/models/common/interfaces';
import { Parameter } from '@shared/models/common/interfaces/parameter.interface';
import { ISelectsResponse, IHttpResponse } from '@shared/models/response/interfaces';
import { ParametersService } from '@core/services/parameters.service';
import { forkJoin, Observable, Subscription, BehaviorSubject, of, EMPTY } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { NotificationService } from '@shared/components/notification/notification.service';
import { RulesService } from '@core/services/rules.service';

@Component({
  selector: 'kt-step-one',
  templateUrl: './step-one.component.html',
  styleUrls: ['./step-one.component.scss']
})
export class StepOneComponent implements OnInit {

  ccRequestStep1: ICCRequestStepOne = CC_REQUEST_STEP_ONE;
  dataForm: FormGroup;
  nextStepNumber = 2;
  codeStep = 'paso_01_01';
  textButtonNext: string;
  selects$: Observable<ISelectsResponse>;
  selectedSolicitude: ISolicitude;
  hasAccesEdit: boolean;

  associatedComponent$ = new BehaviorSubject([]);
  operationsNumber: Parameter[];


  constructor(
    private fb: FormBuilder,
    private parametersService: ParametersService,
    private projectsService: ProjectsService,
    private rulesService: RulesService,
    private router: Router,
    private notificationService: NotificationService
  ) {
  }

  ngOnInit() {
    this.chargeSelectOptions();
    this.hasAccesEdit = this.rulesService.userHasAccessToAction('fase_01', 'paso_01_01', AccessType.write);
    this.textButtonNext = 'Guardar y continuar';
    this.selectedSolicitude = this.projectsService.currentProject.solicitude;
    this.dataForm = this.createForm();
    if (!this.hasAccesEdit) {
      this.dataForm.disable();
    }
    this.handlerUpdateForm(this.selectedSolicitude);
  }

  public createForm(): FormGroup {
    return this.fb.group({
      processName: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(this.ccRequestStep1.processName.maxlength),
        Validators.minLength(this.ccRequestStep1.processName.minlength)
      ])],
      transactionType: ['', [Validators.required]],
      processDetail: this.fb.array([this.createProcessDetailForms()])
    });
  }

  private createProcessDetailForms(): FormGroup {
    return this.fb.group({
      contribution: ['', [Validators.required]],
      operationNumber: ['', [Validators.required]],
      associatedComponent: ['', [Validators.required]],
      fundingSource: ['', [Validators.required]],
    });
  }

  private handlerUpdateForm(process: ISolicitude) {
    if (process) {
      const dataFormOne = process.dataProcess;
      if (dataFormOne) {
        const numberOfProcesses = process.dataProcess.processDetail.length - 1;
        for (let i = 0; i < numberOfProcesses; i++) {
          this.addProcessDetailForm();
        }
        this.updateForm(dataFormOne);
      }
    }
  }

  updateForm(process: DataProcess) {
    const { transactionType, processDetail, processName } = process;
    this.dataForm.patchValue({
      transactionType,
      processName,
      processDetail
    });

  }

  addProcessDetailForm(): void {
    this.processDetail.push(this.createProcessDetailForms());
  }

  get processDetail() {
    return this.dataForm.get('processDetail') as FormArray;
  }

  private chargeSelectOptions() {
    this.selects$ = forkJoin(
      this.parametersService.getParameterByType('Transaction'),
      this.parametersService.getParameterByType('FundingAgency'),
      this.parametersService.getParameterByType('OperationNumber'),
      this.parametersService.getParameterByType('AssociatedComponent'),
      this.parametersService.getParameterByType('FundingSource'),
    ).pipe(
      map(([
        transactionTypeData,
        contributionData,
        operationNumberData,
        associatedComponentData,
        fundingSourceData
      ]) => {
        return {
          transactionTypeData: transactionTypeData.data,
          contributionData: contributionData.data,
          operationNumberData: operationNumberData.data,
          associatedComponentData: associatedComponentData.data,
          fundingSourceData: fundingSourceData.data
        };
      }),
      tap(selects => this.operationsNumber = selects.operationNumberData)
    );
  }


  get processDetailForm() {
    return (this.dataForm.get('processDetail') as FormArray);
  }

  errorFormArray(field: string, formIndex: number, typeError: string) {
    return this.processDetailForm.controls[formIndex].get(field).hasError(typeError);
  }

  errorForm(field: string, type: string) {
    return this.dataForm.get(field).hasError(type);
  }

  removeForm(index: number): void {
    this.processDetailForm.removeAt(index);
  }

  goBack(): void {
    this.router.navigate([`home/processes`]);
  }

  handleSuccessfulUpdate() {
    this.notificationService.success('Los datos registrados se han guardado exitosamente.');
    setTimeout(
      () => this.navigateNextStep(),
      5000
    );
  }

  updateSolicitude() {
    const dataProcess = this.dataForm.value;
    const currentStep = this.projectsService.currentStep(this.nextStepNumber);
    const codeStep = this.codeStep;
    const payload: ISolicitude = {
      ...this.selectedSolicitude, dataProcess, currentStep, codeStep
    };
    this.projectsService.updateSolicitude(payload).subscribe({
      next: (response: IHttpResponse) => {
        if (response.status === '00000') {
          this.handleSuccessfulUpdate();
        } else {
          this.notificationService.warn(response.message);
        }
      }
    });
  }

  next(): void {
    if (!this.hasAccesEdit) { return this.navigateNextStep(); }
    if (this.dataForm.valid) { return this.updateSolicitude(); }
  }

  navigateNextStep(): void {
    this.router.navigate([`home/processes/${this.selectedSolicitude.idProject}/request/step-two`]);
  }

  get processDetailForms() {
    return this.processDetailForm.controls;
  }

  getAssociatedComponent(indexForm: number): Observable<Parameter[]> {
    const operationNumberSelected = this.getOperationNumberByIndex(indexForm);
    if (operationNumberSelected) {
      const associatedComponent = this.operationsNumber.find((item) => item.code === operationNumberSelected).group.parameter;
      return of(associatedComponent);
    }
    return EMPTY;
  }

  private getOperationNumberByIndex(index: number): string {
    return this.processDetailForm.controls[index].get('operationNumber').value;
  }

  onChangeOperationNumber(indexForm) {
    this.processDetailForm.controls[indexForm].get('associatedComponent').reset('');
  }

}
