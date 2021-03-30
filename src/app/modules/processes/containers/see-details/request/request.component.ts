import { Component, OnInit } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { IProject } from '@shared/models/common/interfaces';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@shared/components/notification/notification.service';
import { ParametersService } from '@core/services';
import { forkJoin, Observable } from 'rxjs';
import { ISelectsResponse } from '@shared/models/response/interfaces';
import { map, tap } from 'rxjs/operators';
import { formatNumber } from '@angular/common';

@Component({
  selector: 'kt-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  selectedProject: IProject;
  selects$: Observable<ISelectsResponse>;
  operationsNumber: any;
  selectsOption: any;

  constructor(
    private projectsService: ProjectsService,
    private notificationService: NotificationService,
    private parametersService: ParametersService
  ) { }

  ngOnInit() {
    this.chargeSelectOptions();
    this.projectsService.project$.subscribe((project) => {
      this.selectedProject = project;
    });
  }

  private chargeSelectOptions() {
    this.selects$ = forkJoin([
      this.parametersService.getParameterByType('Transaction'),
      this.parametersService.getParameterByType('FundingAgency'),
      this.parametersService.getParameterByType('OperationNumber'),
      this.parametersService.getParameterByType('AssociatedComponent'),
      this.parametersService.getParameterByType('FundingSource'),
      this.parametersService.getParameterByType('Unit'),
      this.parametersService.getParameterByType('Method'),
      this.parametersService.getParameterByType('TypeContract')
    ]).pipe(
      map(([
        transactionTypeData,
        contributionData,
        operationNumberData,
        associatedComponentData,
        fundingSourceData,
        unitData,
        methodData,
        typeContractData
      ]) => {
        return {
          transactionTypeData: transactionTypeData.data,
          contributionData: contributionData.data,
          operationNumberData: operationNumberData.data,
          associatedComponentData: associatedComponentData.data,
          fundingSourceData: fundingSourceData.data,
          unitData: unitData.data,
          methodData: methodData.data,
          typeContractData: typeContractData.data
        };
      }),
      tap(selects => {
        this.operationsNumber = selects.operationNumberData;
        this.selectsOption = selects;
      })
    );
  }

  get dataProcessItems() {
    const dataProcess = { ...this.selectedProject.solicitude.dataProcess };
    delete dataProcess.processDetail;
    dataProcess.transactionType = this.getCodeValue(dataProcess.transactionType, 'transactionTypeData');
    return dataProcess;
  }

  getDetails(details) {
    const processDetail = { ...details };
    processDetail.fundingSource = this.getCodeValue(processDetail.fundingSource, 'fundingSourceData');
    processDetail.associatedComponent = this.getCodeValue(processDetail.associatedComponent, 'associatedComponentData');
    processDetail.contribution = this.getCodeValue(processDetail.contribution, 'contributionData');
    return processDetail;
  }

  get processDetail() {
    return this.selectedProject.solicitude.dataProcess.processDetail;
  }

  get financingLine() {
    const financingLine = { ...this.selectedProject.solicitude.financingLine };
    const estimatedAmount = `$ ${formatNumber(+financingLine.estimatedAmount.amount, 'en-US')} `;
    const quantity = formatNumber(+financingLine.quantity, 'en-US');
    financingLine.unit = this.getCodeValue(financingLine.unit, 'unitData');
    return { ...financingLine, estimatedAmount, quantity };
  }

  get budgetStructure() {
    return this.selectedProject.solicitude.budgetStructure;
  }

  get acquisitionMethod() {
    const acquisitionMethod = { ...this.selectedProject.solicitude.acquisitionMethod };
    acquisitionMethod.acquisitionMethod = this.getCodeValue(acquisitionMethod.acquisitionMethod, 'methodData');
    acquisitionMethod.contractType = this.getCodeValue(acquisitionMethod.contractType, 'typeContractData');
    return acquisitionMethod;
  }

  get document() {
    return this.selectedProject.solicitude.document;
  }

  getCodeValue(code, dataType) {
    const option = this.selectsOption[dataType].filter(item => item.code === code);
    return option[0].description;
  }

  saveFile(file) {
    this.projectsService.downloadFile(
      file.idStorage,
      file.fileName
    ).subscribe(
      (data) => {
      },
      (error: HttpErrorResponse) => {
        console.error(error);
        this.notificationService.error(error);
      }
    );
  }

}
