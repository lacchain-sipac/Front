import { Component, OnInit, Input } from '@angular/core';
import { IDocumentReview } from '@shared/models/common/interfaces';

@Component({
  selector: 'kt-approval-bubble',
  templateUrl: './approval-bubble.component.html',
  styleUrls: ['./approval-bubble.component.scss']
})
export class ApprovalBubbleComponent implements OnInit {

  @Input() disabled: boolean;
  @Input() revision: IDocumentReview;

  constructor() { }

  ngOnInit() {
  }

  get observeIcon() {
    return this.disabled ? 'assets/vectors/observe-grey.svg' : 'assets/vectors/observe.svg';
  }

  get approveIcon() {
    return this.disabled ? 'assets/vectors/approve-grey.svg' : 'assets/vectors/approve.svg';
  }

  get accreditIcon() {
    return this.disabled ? 'assets/vectors/accredit-enable.svg' : 'assets/vectors/accredit-disable.svg';
  }

  get reviewDescription() {
    if (this.revision.type === 'approval') { return 'Aprobó'; }
    if (this.revision.type === 'accredit') { return 'Acreditó'; }
    if (this.revision.type === 'observation') { return 'Observó'; }
  }

  get revisionIcon() {
    if (this.revision.type === 'approval') { return this.approveIcon; }
    if (this.revision.type === 'accredit') { return this.accreditIcon; }
    if (this.revision.type === 'observation') { return this.observeIcon; }
  }

  get disabledClass() {
    return this.disabled ? 'disabled-text font-weight-boldr' : '';
  }

}
