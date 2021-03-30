import { Component, OnInit, Input } from '@angular/core';
import { IBreadcrumbTrailItem } from '../../models/common/interfaces';

@Component({
  selector: 'kt-breadcrumb-trail',
  templateUrl: './breadcrumb-trail.component.html',
  styleUrls: ['./breadcrumb-trail.component.scss']
})

export class BreadcrumbTrailComponent implements OnInit {

  @Input() breadcrumbTrailItems: IBreadcrumbTrailItem[];
  @Input() activeBreadcrumb: number;

  constructor() { }

  ngOnInit() {
  }

}
