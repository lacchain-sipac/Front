import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IMenuOption, IMenuEvent } from '@shared/models/common/interfaces';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { TooltipPosition } from '@angular/material';
import { FILE_PICKER_ACTIONS } from '@shared/helpers/constants';


@Component({
  selector: 'kt-menu-action',
  templateUrl: './menu-action.component.html',
  styleUrls: ['./menu-action.component.scss']
})
export class MenuActionComponent implements OnInit {

  @Input() menuOptions: IMenuOption;
  @Input() isActionsToPhases: false;
  @Input() itemIndex: number;
  @Input() showDefaultIcon = true;
  @Input() menuIcon: string;
  @Input() isDisabled: boolean;
  @Input() tooltipText: string;
  @Input() btnWidthEm: number;
  position: TooltipPosition = 'above';
  defaultBtnIcon = 'more_vert';

  svgIcons = [
    {
      name: 'icon_request',
      path: 'assets/images/icons/document.svg'
    },
    {
      name: 'icon_process',
      path: 'assets/images/icons/licitacion.svg'
    },
    {
      name: 'icon_execution',
      path: 'assets/images/icons/process-check.svg'
    }
  ];

  @Output() clickAction = new EventEmitter();

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.svgIcons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path));
    });
  }

  ngOnInit() {
  }

  get actionsThatFireFilePicker() {
    return FILE_PICKER_ACTIONS;
  }

  onClick(action, $files?: Event) {
    const event: IMenuEvent = { action };
    if (typeof this.itemIndex === 'number') {
      event.index = this.itemIndex;
    }
    if ($files) {
      event.files = $files;
    }
    this.clickAction.emit(event);
  }

}


