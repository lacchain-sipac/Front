import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ModalUploadFilesComponent } from '../modals/modal-upload-files/modal-upload-files.component';
import { DocumentsService } from '@modules/processes/services/documents.service';
import { RulesService } from '@core/services/rules.service';
import { DOCUMENT_PAYLOADS } from '@shared/helpers';
import { AccessType } from '@shared/models/common/interfaces';
import { NotificationService } from '@shared/components/notification/notification.service';
import { Subscription } from 'rxjs';
import { ModalUploadViewer } from '@shared/models/common/classes';

@Component({
  selector: 'kt-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss'],
})
export class UploadFilesComponent implements OnInit {
  @Input() title: string;
  @Input() isDisable: boolean;
  @Input() multipleFiles: boolean;
  @Input() documentType: string;
  @Input() objectInEdition: string;
  @Input() idGroup: string;
  @Input() action: string;
  @Input() documentTitle: string;
  @Input() accredit: boolean;

  selectedFiles: FileList | null;

  constructor(
    public dialog: MatDialog,
    private notificationService: NotificationService,
    private rulesService: RulesService,
    private documentService: DocumentsService
  ) {}

  ngOnInit() {}

  detectFiles($event: Event) {
    const files = this.documentService.getSelectedFiles($event);
    const { documentType, phaseCode, codeStep } = DOCUMENT_PAYLOADS[
      this.documentType
    ];
    const hasAcessToExecuteThisAction: Subscription = this.rulesService
      .userHasAccessToActionInDocument(
        documentType,
        phaseCode,
        codeStep,
        AccessType.upload
      )
      .subscribe({
        next: (response) => {
          if (response.status === '00000') {
            if (files) {
              return response.data.auth && !this.isDisable
                ? this.openModalUploadFiles(files)
                : this.notificationService.info(
                    `El rol actual no cuenta con acceso para realizar esta acción`
                  );
            }
          } else {
            this.notificationService.warn(response.message);
          }
          hasAcessToExecuteThisAction.unsubscribe();
        },
      });
  }

  openModalUploadFiles(fileList: FileList): void {
    const data: ModalUploadViewer = {
      textButtonExecution: 'Guardar',
      textButtonReject: 'Cancelar',
      title: 'Cargar documento',
      accredited: this.accredit ? '1' : '0',
      fileList,
      documentType: this.documentType,
      objectInEdition: this.objectInEdition,
      documentTitle: this.documentTitle || this.title,
    };
    if (this.idGroup) {
      data.idGroup = this.idGroup;
    }
    const dialogRef = this.dialog.open(ModalUploadFilesComponent, { data });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
    });
  }
}
