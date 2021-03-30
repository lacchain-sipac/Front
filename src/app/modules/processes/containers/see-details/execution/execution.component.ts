import { Component, OnInit } from '@angular/core';
import { Subscription, Observable, forkJoin } from 'rxjs';
import { IProject } from '@shared/models/common/interfaces';
import { ProjectsService } from '@modules/processes/projects.service';
import { ISelectsContractorAndSupervisor } from '@shared/models/response/interfaces';
import { ExecutionService } from '@modules/processes/services/execution.service';
import { map } from 'rxjs/operators';
import {
  RetainerViewer,
  PaymentsViewer,
  FinalPaymentsViewer,
} from '@shared/models/common/classes';

@Component({
  selector: 'kt-execution',
  templateUrl: './execution.component.html',
  styleUrls: ['./execution.component.scss'],
})
export class ExecutionComponent implements OnInit {
  projectSubscription: Subscription;
  selectedProject: IProject;
  selects$: Observable<ISelectsContractorAndSupervisor>;
  retainersArrayValues: RetainerViewer[];
  paymentsArrayValues: PaymentsViewer[];
  finalPaymentsViewer: FinalPaymentsViewer[];

  constructor(
    private projectsService: ProjectsService,
    private executionService: ExecutionService
  ) {}

  ngOnInit() {
    this.chargeSelects();
    this.projectSubscription = this.projectsService.project$.subscribe(
      (project) => {
        this.selectedProject = project;
        this.setRetainerValues(project);
        this.setPaymentDocuments(project);
        this.setFinalPayments(project);
      }
    );
  }

  get modificationContract() {
    const paymentContract =
      this.selectedProject.execution.payment &&
      this.selectedProject.execution.payment.modifiedContract &&
      this.selectedProject.execution.payment.modifiedContract.document;
    return !!paymentContract && paymentContract.length > 1
      ? paymentContract
      : null;
  }

  get mofificationContractHistory() {
    if (this.modificationContract.length > 1) {
      const modifiedContractDocuments = [...this.modificationContract];
      modifiedContractDocuments.pop();
      return modifiedContractDocuments;
    }
    return null;
  }

  get isModificationContractLatestVersion() {
    if (this.modificationContract) {
      const contracts = this.modificationContract;
      return contracts.length > 1
        ? !!contracts[contracts.length - 2].approved
        : false;
    }
    return false;
  }

  get contracts() {
    const contract = this.selectedProject.execution.modifiedContract;
    return !!contract && contract.document.length > 1
      ? contract.document
      : null;
  }

  get contractsHistory() {
    if (this.contracts.length > 1) {
      const modifiedContractDocuments = [...this.contracts];
      modifiedContractDocuments.pop();
      return modifiedContractDocuments;
    }
    return null;
  }

  get isContractLatestVersion() {
    if (this.contracts) {
      const contracts = this.contracts;
      return contracts.length > 1
        ? !!contracts[contracts.length - 2].approved
        : false;
    }
    return false;
  }

  setFinalPayments(project) {
    if (
      project.execution &&
      project.execution.payment &&
      project.execution.payment.finalPayment
    ) {
      this.finalPaymentsViewer = project.execution.payment.finalPayment.map(
        (estimate) => {
          return new FinalPaymentsViewer(estimate);
        }
      );
    }
  }

  setRetainerValues(project) {
    if (
      project.execution &&
      project.execution.payment &&
      project.execution.payment.advance
    ) {
      this.retainersArrayValues = project.execution.payment.advance.map(
        (advance) => {
          return new RetainerViewer(advance);
        }
      );
    }
  }

  get retainerCompanies() {
    const documentsCompanies = this.selectedProject.execution.payment.advance.map(
      (payment) => {
        return payment.request.document[0].document.company;
      }
    );
    const companies = Array.from(new Set(documentsCompanies));
    return companies;
  }

  get estimateCompanies() {
    const documentsCompanies = this.selectedProject.execution.payment.estimate.map(
      (payment) => {
        return payment.request.document[0].document.company;
      }
    );
    const companies = Array.from(new Set(documentsCompanies));
    return companies;
  }

  get finalPaymentCompanies() {
    const documentsCompanies = this.selectedProject.execution.payment.finalPayment.map(
      (payment) => {
        return payment.request.document[0].document.company;
      }
    );
    const companies = Array.from(new Set(documentsCompanies));
    return companies;
  }

  setPaymentDocuments(project) {
    if (
      project.execution &&
      project.execution.payment &&
      project.execution.payment.estimate
    ) {
      this.paymentsArrayValues = project.execution.payment.estimate.map(
        (estimate) => {
          return new PaymentsViewer(estimate);
        }
      );
    }
  }

  chargeSelects() {
    this.selects$ = forkJoin(
      this.executionService.getsUsersByRole('ROLE_CONT'),
      this.executionService.getsUsersByRole('ROLE_SUP')
    ).pipe(
      map(([idContractor, idSupervising]) => {
        return {
          idContractor: idContractor.data,
          idSupervising: idSupervising.data,
        };
      })
    );
  }

  getValidDocument(documents) {
    return documents && documents.length > 0 ? documents.pop() : null;
  }

  getDocumentHistory(documents) {
    return documents && documents.length > 1
      ? [...documents].reverse().splice(1, documents.length - 1)
      : null;
  }

  getListOfDocuments(documents) {
    if (!documents) {
      return [];
    }
    return [...documents];
  }

  get contractorList() {
    return this.selectedProject.execution.assignContractor.contractor;
  }

  get supervisorList() {
    return this.selectedProject.execution.assignContractor.supervising;
  }

  getContractors(selects) {
    return [...this.contractorList].map((contractorId) => {
      const contractor = [...selects.idContractor].filter(
        (option) => option.id === contractorId
      )[0];
      return { surnames: contractor.surnames, fullname: contractor.fullname };
    });
  }

  getSupervisors(selects) {
    return [...this.supervisorList].map((supervisorId) => {
      const supervisor = [...selects.idSupervising].filter(
        (option) => option.id === supervisorId
      )[0];
      return { surnames: supervisor.surnames, fullname: supervisor.fullname };
    });
  }
}
