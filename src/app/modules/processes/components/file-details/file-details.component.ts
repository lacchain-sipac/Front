import { Component, OnInit, Input } from '@angular/core';
import { IFileDetails } from '@shared/models/common/interfaces';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'kt-file-details',
  templateUrl: './file-details.component.html',
  styleUrls: ['./file-details.component.scss'],
  providers: [DatePipe]
})

export class FileDetailsComponent implements OnInit {

  @Input() file: IFileDetails;
  @Input() uppercase: boolean;
  @Input() disabled: boolean;
  @Input() accredited: boolean;
  @Input() version: number;
  @Input() showTags: boolean;
  @Input() hasApprovalFlow = false;
  @Input() smallFontSize: boolean;
  @Input() isFinalDocument: boolean;

  constructor() { }

  ngOnInit() {
  }

  get titleClass() {
    return this.uppercase ? 'text-uppercase' : 'short-plus-text';
  }

  get fileIcon() {
    return this.disabled ? 'assets/vectors/grey-file.svg' : 'assets/vectors/file.svg';
  }

  get labelStyles() {
    return this.smallFontSize ? 'tiny-text' : 'short-plus-text';
  }

  get valueStyles() {
    return this.smallFontSize ? 'short-text' : 'short-plus-text';
  }

  get titleStyles() {
    return this.smallFontSize ? 'short-text' : '';
  }

  get disabledClass() {
    return this.disabled ? 'disabled-text' : '';
  }

  get disabledTag() {
    return this.disabled ? 'disabled-tag' : 'version-tag';
  }

  get tagIcon() {
    return this.disabled ? 'assets/vectors/disabled-tag.svg' : 'assets/vectors/latest-tag.svg';
  }

}
