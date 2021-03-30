import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessesRoutingModule } from './processes-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import {
  MatTableModule,
  MatPaginatorModule,
  MatSortModule,
  MatIconModule,
  MatMenuModule,
  MatCheckboxModule,
  MatButtonModule,
  MatProgressSpinnerModule,
  MatInputModule,
  MatSelectModule,
  MatDialogModule,
  MatProgressBarModule,
  MatTabsModule,
  MatTooltipModule,
  MatListModule,
} from '@angular/material';

import { ProcessPhasesComponent } from './containers/process-phases/process-phases.component';
import { ListProcessComponent } from './containers/list-process/list-process.component';
import { SeeDetailsComponent } from './containers/see-details/see-details.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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

import { StepOneComponent as ExecutionStepOneComponent } from './containers/process-phases/execution/step-one/step-one.component';
import { StepTwoComponent as ExecutionStepTwoComponent } from './containers/process-phases/execution/step-two/step-two.component';
import { ModalUploadFilesComponent } from './components/modals/modal-upload-files/modal-upload-files.component';
import { MenuActionComponent } from './components/menu-action/menu-action.component';
import { FileDetailsComponent } from './components/file-details/file-details.component';
import { UploadFilesComponent } from './components/upload-files/upload-files.component';
import { AmendmentsComponent } from './containers/process-phases/processes/step-one/content-tabs/amendments/amendments.component';
import { ClarificationsComponent } from './containers/process-phases/processes/step-one/content-tabs/clarifications/clarifications.component';
import { PreparationComponent } from './containers/process-phases/processes/step-one/content-tabs/preparation/preparation.component';
import { ApprovalBubbleComponent } from './components/approval-bubble/approval-bubble.component';
import { ModalCreateCommitteeComponent } from './components/modals/modal-create-committee/modal-create-committee.component';
import { ModalAccreditComponent } from './components/modals/modal-accredit/modal-accredit.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { HistoryPanelComponent } from './components/history-panel/history-panel.component';
import { StepSixComponent } from './containers/process-phases/processes/step-six/step-six.component';
import { StepSevenComponent } from './containers/process-phases/processes/step-seven/step-seven.component';
import { AwardResolutionComponent } from './components/award-resolution/award-resolution.component';
import { RetainerComponent } from './containers/process-phases/execution/step-three/retainer/retainer.component';
import { PaymentsComponent } from './containers/process-phases/execution/step-three/payments/payments.component';
import { FinalPaymentComponent } from './containers/process-phases/execution/step-three/final-payment/final-payment.component';
import { StepThreeComponent } from './containers/process-phases/execution/step-three/step-three.component';
import { StepFourComponent } from './containers/process-phases/execution/step-four/step-four.component';
import { StepFiveComponent } from './containers/process-phases/execution/step-five/step-five.component';
import { RequestComponent as RequestDetailsComponent } from './containers/see-details/request/request.component';
import { ProcessComponent as ProcessDetailsComponent } from './containers/see-details/process/process.component';
import { ExecutionComponent as ExecutionDetailsComponent } from './containers/see-details/execution/execution.component';
import { CardItemsListComponent } from './components/card-items-list/card-items-list.component';
import { DocumentLectureCardComponent } from './components/document-lecture-card/document-lecture-card.component';
import { ReviewsListComponent } from './components/reviews-list/reviews-list.component';
import { ModifiedContractComponent } from './containers/process-phases/execution/step-three/modified-contract/modified-contract.component';
import { DocumentsPanelComponent } from './components/documents-panel/documents-panel.component';
import { ModalRequestDetailsComponent } from './components/modals/modal-request-details/modal-request-details.component';


@NgModule({
  declarations: [
    ProcessPhasesComponent,
    ListProcessComponent,

    RequestStepOneComponent,
    RequestStepTwoComponent,
    RequestStepThreeComponent,
    RequestStepFourComponent,
    RequestStepFiveComponent,

    ProcessStepOneComponent,
    ProcessStepTwoComponent,
    ProcessStepThreeComponent,
    ProcessStepFourComponent,
    ProcessStepFiveComponent,

    ExecutionStepOneComponent,
    ExecutionStepTwoComponent,

    ModalUploadFilesComponent,
    MenuActionComponent,

    UploadFilesComponent,

    AmendmentsComponent,

    ClarificationsComponent,
    FileDetailsComponent,

    PreparationComponent,

    ApprovalBubbleComponent,

    ModalCreateCommitteeComponent,

    ModalAccreditComponent,
    AwardResolutionComponent,


    StepSixComponent,

    StepSevenComponent,

    StepThreeComponent,

    StepFourComponent,

    StepFiveComponent,
    HistoryPanelComponent,
    SeeDetailsComponent,
    RetainerComponent,
    PaymentsComponent,
    FinalPaymentComponent,
    StepThreeComponent,
    RequestDetailsComponent,
    ProcessDetailsComponent,
    ExecutionDetailsComponent,
    CardItemsListComponent,
    DocumentLectureCardComponent,
    ReviewsListComponent,
    ModifiedContractComponent,
    DocumentsPanelComponent,
    ModalRequestDetailsComponent

  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProcessesRoutingModule,
    SharedModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSelectModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatTabsModule,
    MatProgressBarModule,
    MatMenuModule,
    MatCheckboxModule,
    MatListModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatMenuModule,
    HttpClientModule,
    MatExpansionModule
  ],
  entryComponents: [
    ModalAccreditComponent,
    ModalCreateCommitteeComponent,
    ModalUploadFilesComponent,
    ModalRequestDetailsComponent
  ]
})
export class ProcessesModule { }
