import { Component, OnInit, Input } from '@angular/core';
import { REQUEST_DETAILS } from '@shared/helpers/constants';

@Component({
  selector: 'kt-card-items-list',
  templateUrl: './card-items-list.component.html',
  styleUrls: ['./card-items-list.component.scss']
})
export class CardItemsListComponent implements OnInit {

  @Input() items: any;
  @Input() title: string;
  @Input() normalTitle: boolean;

  constructor() { }

  ngOnInit() {
  }

  get itemsKeys() {
    return Object.keys(this.items);
  }

  get texts() {
    return REQUEST_DETAILS;
  }

}
