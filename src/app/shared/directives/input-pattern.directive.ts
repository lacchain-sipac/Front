import { Directive, Input, HostListener } from '@angular/core';

@Directive({
  selector: '[ktInputPattern]'
})
export class InputPatternDirective {
  patterns = {
    alphanumericWithDashes: /[^a-zA-Z0-9-\._\s]*/g,
    alphanumeric: /[^a-zA-Z0-9\s]*/g,
    onlyLetters: /[^a-zA-Z\s]*/g,
    onlyNumbers: /[^0-9]*/g,
    // onlyDate: /^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}$/g
  };

  @Input() ktInputPattern: string;

  constructor() { }

  getValueReplaced(value, patternName): string {
    const pattern = this.patterns[patternName];
    const replacedValue = value.replace(pattern, '');
    return replacedValue;
  }

  /**
   * Reemplaza el value del input en el evento keyUp
   * basado en los patrones indicados en patterns y el @Input
   * ktInputPattern
   */
  @HostListener('keyup', ['$event'])
  onReplaceKeyUp(event) {
    // Propiedades
    const { patterns } = this;

    // Métodos
    const { getValueReplaced } = this;

    // Inputs
    const { ktInputPattern } = this;

    const value = event.target.value;

    event.target.value = this.getValueReplaced(value, ktInputPattern);

  }

}

