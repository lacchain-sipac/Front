import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, debounceTime } from 'rxjs/operators';
import { ListColumn } from '@shared/models/common/classes';

@Component({
  selector: 'kt-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements AfterViewInit {

  @Input() name: string;
  @Input() placeholderSearch: string;
  @Input() columns: ListColumn[];

  @ViewChild('filter', { static: false }) filter: ElementRef;
  @Output() filterChange = new EventEmitter<string>();

  @Input() optSearch: boolean;
  @Input() optFilter: boolean;

  constructor() {
  }

  ngAfterViewInit() {
    if (this.optSearch) {
      fromEvent(this.filter.nativeElement, 'keyup').pipe(
        distinctUntilChanged(),
        debounceTime(150)
      ).subscribe(() => {
        this.filterChange.emit(this.filter.nativeElement.value);
      });
    }
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

}
