import { Component, OnInit, Input } from '@angular/core';
import { ProjectsService } from '@modules/processes/projects.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NotificationService } from '@shared/components/notification/notification.service';

@Component({
  selector: 'kt-document-lecture-card',
  templateUrl: './document-lecture-card.component.html',
  styleUrls: ['./document-lecture-card.component.scss']
})
export class DocumentLectureCardComponent implements OnInit {

  @Input() validDocument: any;
  @Input() documentHistory: any;
  @Input() accredited: boolean;
  @Input() approvals: any;
  @Input() title: string;
  @Input() documentNumber: string;
  @Input() isFinalDocument: boolean;
  @Input() approvationReview: any;
  @Input() showAllAccredited: boolean;

  constructor(
    private projectsService: ProjectsService,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
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

  get mainDocument() {
    return this.validDocument.document || this.validDocument;
  }

}
