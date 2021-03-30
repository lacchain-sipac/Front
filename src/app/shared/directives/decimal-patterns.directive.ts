import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[ktDecimalPattern]'
})

export class DecimalPatternDirective {

  numberOrDecimal = /^-?\d*\.?\d*$/;
  @Input() decimalNumbers: number;
  constructor() { }

  getValueReplaced(value, pattern): string {
    if (pattern.test(value)) {
      const { decimalNumbers } = this;
      return value % 1 === 0 ? value : parseFloat((Number(value)).toFixed(decimalNumbers));
    }
    return value.replace(/.$/, '');
  }

  @HostListener('keyup', ['$event'])
  onReplaceKeyUp(event) {
    const value = event.target.value;
    event.target.value = this.getValueReplaced(value, this.numberOrDecimal);
  }

}

