import { Directive, Input, HostListener } from '@angular/core';
import { thousandNumberFormat } from '@shared/helpers';

@Directive({
  selector: '[ktThousandFormat]'
})

export class ThousandFormatDirective {

  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;
  private padding = '00';
  numberOrDecimal = /^-?\d*\.?\d*$/;

  @Input() decimalNumbers: number;

  constructor() {
    this.DECIMAL_SEPARATOR = '.';
    this.THOUSANDS_SEPARATOR = ',';
  }

  getValueReplaced(value): string {
   return thousandNumberFormat(value);
  }

  @HostListener('keyup', ['$event'])
  onReplaceKeyUp(event) {
    const value = event.target.value;
    event.target.value = this.getValueReplaced(value);
  }

}

