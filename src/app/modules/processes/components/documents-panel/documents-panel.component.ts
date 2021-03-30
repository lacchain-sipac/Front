import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kt-documents-panel',
  templateUrl: './documents-panel.component.html',
  styleUrls: ['./documents-panel.component.scss']
})
export class DocumentsPanelComponent implements OnInit {

  @Input() title: string;
  panelOpenState: boolean;

  constructor() { }

  ngOnInit() {
  }

  togglePanel() {
    this.panelOpenState = !this.panelOpenState;
  }

}
