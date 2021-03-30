import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatAutocompleteModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
} from '@angular/material';
import { RouterModule } from '@angular/router';
import { MatExpansionModule } from '@angular/material/expansion';
import { BreadcrumbComponent } from '@shared/components/breadcrumb/breadcrumb.component';
import { FooterComponent } from '@shared/components/footer/footer.component';
import { HeaderComponent } from '@shared/components/header/header.component';
import { LoaderComponent } from '@shared/components/loader/loader.component';
import {
  DragDropDirective,
  InputPatternDirective,
  DecimalPatternDirective,
  ThousandFormatDirective,
} from '@shared/directives';
import {
  DateAgoPipe,
  ThousandFormatPipe,
  HtmlPipe,
  KeysPipe,
  LogPipe,
  TransformMilisecondsPipe,
} from '@shared/pipes';
import { QRCodeModule } from 'angularx-qrcode';

import { BreadcrumbTrailComponent } from './components/breadcrumb-trail/breadcrumb-trail.component';
import { EmptyDataComponent } from './components/empty-data/empty-data.component';
import { ModalConfirmationComponent } from './components/modal-confirmation/modal-confirmation.component';
import { ModalRoleComponent } from './components/modal-role/modal-role.component';
import { NotificationComponent } from './components/notification/notification.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { ModalSessionComponent } from '@shared/components/modal-session/modal-session.component';

@NgModule({
  declarations: [
    LogPipe,
    KeysPipe,
    HtmlPipe,
    DateAgoPipe,
    ThousandFormatPipe,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    InputPatternDirective,
    DecimalPatternDirective,
    ThousandFormatDirective,
    DragDropDirective,
    BreadcrumbComponent,
    ToolbarComponent,
    NotificationComponent,
    EmptyDataComponent,
    StepperComponent,
    BreadcrumbTrailComponent,
    ModalConfirmationComponent,
    ModalRoleComponent,
    ModalSessionComponent,
    TransformMilisecondsPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatInputModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatMenuModule,
    MatCheckboxModule,
    MatListModule,
    MatDialogModule,
    QRCodeModule,
    ReactiveFormsModule,
    MatExpansionModule,
  ],
  exports: [
    InputPatternDirective,
    DecimalPatternDirective,
    ThousandFormatDirective,
    DragDropDirective,
    BreadcrumbComponent,
    HeaderComponent,
    FooterComponent,
    LoaderComponent,
    ToolbarComponent,
    NotificationComponent,
    EmptyDataComponent,
    StepperComponent,
    BreadcrumbTrailComponent,
    ModalConfirmationComponent,
    HtmlPipe,
    KeysPipe,
    LogPipe,
    DateAgoPipe,
    ThousandFormatPipe,
    ModalRoleComponent,
    TransformMilisecondsPipe,
  ],
  entryComponents: [
    ModalConfirmationComponent,
    ModalRoleComponent,
    ModalSessionComponent,
  ],
})
export class SharedModule {}
