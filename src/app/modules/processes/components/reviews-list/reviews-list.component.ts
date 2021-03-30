import { Component, OnInit, Input } from '@angular/core';
import { IDocumentReview } from '@shared/models/common/interfaces';

@Component({
  selector: 'kt-reviews-list',
  templateUrl: './reviews-list.component.html',
  styleUrls: ['./reviews-list.component.scss']
})
export class ReviewsListComponent implements OnInit {

  @Input() reviewsList: IDocumentReview[];
  @Input() approvationReview: IDocumentReview;
  @Input() disabled: boolean;
  parsedReviewsList: IDocumentReview[];

  constructor() { }

  ngOnInit() {
    if (this.reviewsList) {
      this.reviewsList.reverse();
    }
  }

  get titleStyles() {
    return this.disabled ? 'title-user-form-secondary-grey' : 'title-user-form-secondary';
  }

}
