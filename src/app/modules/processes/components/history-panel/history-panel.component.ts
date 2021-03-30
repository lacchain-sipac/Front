import { Component, OnInit, Input } from '@angular/core';
import { IDocumentDetails, IReviewAndDocument } from '@shared/models/common/interfaces';

@Component({
  selector: 'kt-history-panel',
  templateUrl: './history-panel.component.html',
  styleUrls: ['./history-panel.component.scss']
})
export class HistoryPanelComponent implements OnInit {

  panelOpenState: boolean;
  @Input() history: IReviewAndDocument[];
  @Input() smallFontSize: boolean;
  @Input() showAllAccredited: boolean;

  constructor() { }

  ngOnInit() {
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState;
  }

  hasApprovals(document) {
    return document.review && document.review.length > 0;
  }

}
