import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { IProject } from '@shared/models/common/interfaces';
import { Subscription } from 'rxjs';
import { AmendmentViewer, PreparationViewer, SignedContractViewer } from '@shared/models/common/classes';
import { ClarificationViewer } from '@shared/models/common/classes/clarifications-viewer.class';

@Component({
  selector: 'kt-process',
  templateUrl: './process.component.html',
  styleUrls: ['./process.component.scss']
})
export class ProcessComponent implements OnInit, OnDestroy {

  selectedProject: IProject;
  projectSubscription: Subscription;
  amendmentsArrayValues: AmendmentViewer[];
  clarificationsArrayValues: ClarificationViewer[];
  signedContractArrayValues: SignedContractViewer[];
  preparationViewer: PreparationViewer;

  constructor( private projectsService: ProjectsService ) { }

  ngOnInit() {
    this.projectSubscription = this.projectsService.project$.subscribe((project) => {
      this.preparationViewer = new PreparationViewer(project);
      this.selectedProject = project;
      this.setAmendmentValues(project);
      this.setClarifyValues(project);
      this.setSignedContractDocuments(project);
    });
  }

  ngOnDestroy() {
    this.projectSubscription.unsubscribe();
  }

  getValidDocument(documents) {
    return documents && documents.length > 0 ? documents.pop() : null;
  }

  setSignedContractDocuments(project: IProject) {
    if (project.process && project.process.signedContract && project.process.signedContract.contract) {
      this.signedContractArrayValues = project.process.signedContract.contract.map(signedContract => {
        return new SignedContractViewer(signedContract);
      });
    }
  }

  setAmendmentValues(project) {
    if (project.process && project.process.init && project.process.init.amendment) {
      this.amendmentsArrayValues = project.process.init.amendment.map(amendment => {
        return new AmendmentViewer(amendment);
      });
    }
  }

  setClarifyValues(project) {
    if (project.process && project.process.init && project.process.init.clarify) {
      this.clarificationsArrayValues = project.process.init.clarify.map(clarify => {
        return new ClarificationViewer(clarify);
      });
    }
  }

  getDocumentHistory(documents) {
    return documents && documents.length > 1 ? [...documents].reverse().splice(1, documents.length - 1) : null;
  }

  get process() {
    return this.selectedProject.process;
  }

  get linkRepository() {
    return { linkRepository: this.process.init.preparation.linkRepository };
  }

  get biddingDocument() {
    const biddingDocuments = [...this.process.init.preparation.bidding.document];
    return this.getValidDocument(biddingDocuments);
  }

  get openingAct() {
    const biddingDocuments = [...this.process.openingAct.document];
    return this.getValidDocument(biddingDocuments);
  }

  get openingActHistory() {
    const opening = [...this.process.openingAct.document];
    return this.getDocumentHistory(opening);
  }

  get biddingHasApprovals() {
    return this.biddingDocument && this.biddingDocument.review ? this.biddingDocument.review : null;
  }

  get biddingHistory() {
    const biddings = [...this.process.init.preparation.bidding.document];
    return this.getDocumentHistory(biddings);
  }

  get noObjectionBiddingHistory() {
    const clarify = [...this.process.init.preparation.noObjection];
    return this.getDocumentHistory(clarify);
  }

  get noObjectionResponseBiddingHistory() {
    const clarify = [...this.process.init.preparation.responseNoObjection];
    return this.getDocumentHistory(clarify);
  }

  get noObjectionBidding() {
    const noObj = [...this.process.init.preparation.noObjection ];
    return this.getValidDocument(noObj);
  }

  get noObjectionResponseBidding() {
    const noObj = [...this.process.init.preparation.responseNoObjection ];
    return this.getValidDocument(noObj);
  }

  get comitteeMembers() {
    return this.process.committee ? this.process.committee.committee : null;
  }

  get evaluationReport() {
    const biddingDocuments = [...this.process.evaluationReport.evaluation.document];
    return this.getValidDocument(biddingDocuments);
  }

  get noObjectionReport() {
    const biddingDocuments = [...this.process.evaluationReport.noObjection];
    return this.getValidDocument(biddingDocuments);
  }

  get noObjectionReportHistory() {
    const biddingDocuments = [...this.process.evaluationReport.noObjection];
    return this.getDocumentHistory(biddingDocuments);
  }

  get noObjectionResponseReport() {
    const biddingDocuments = [...this.process.evaluationReport.responseNoObjection];
    return this.getValidDocument(biddingDocuments);
  }

  get noObjectionResponseReportHistory() {
    const biddingDocuments = [...this.process.evaluationReport.responseNoObjection];
    return this.getDocumentHistory(biddingDocuments);
  }

  get evaluationReportHistory() {
    const reports = [...this.process.evaluationReport.evaluation.document];
    return this.getDocumentHistory(reports);
  }

  get awardResolution() {
    const award = [...this.process.awardResolution.document];
    return this.getValidDocument(award);
  }

  get signedContract() {
    const contract = [...this.process.signedContract.contract];
    return this.getValidDocument(contract);
  }

  get signedContractHistory() {
    const contract = [...this.process.signedContract.contract];
    return contract && contract.length > 1 ? [...contract].reverse().splice(1, contract.length - 1) : null;
  }

  get awardResolutionHistory() {
    const award = [...this.process.awardResolution.document];
    return this.getDocumentHistory(award);
  }

  parseComitteMember(member) {
    const comitteeMember = { ...member };
    comitteeMember.role = comitteeMember.role.name;
    delete comitteeMember.id;
    if (comitteeMember.detailRole === '') {
      delete comitteeMember.detailRole;
    }
    return comitteeMember;
  }

}
