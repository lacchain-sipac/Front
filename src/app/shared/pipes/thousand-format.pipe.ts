import { Pipe, PipeTransform } from '@angular/core';
import { thousandNumberFormat } from '@shared/helpers';

@Pipe({
  name: 'thousandFormat',
  pure: true
})
export class ThousandFormatPipe implements PipeTransform {
  private DECIMAL_SEPARATOR: string;
  private THOUSANDS_SEPARATOR: string;
  private padding = '00';
  numberOrDecimal = /^-?\d*\.?\d*$/;

  constructor() {
    this.DECIMAL_SEPARATOR = '.';
    this.THOUSANDS_SEPARATOR = ',';
  }

  transform(value): string {
    return thousandNumberFormat(value);
  }

}
