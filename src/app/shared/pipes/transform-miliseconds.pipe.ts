import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transformMiliseconds',
})
export class TransformMilisecondsPipe implements PipeTransform {
  transform(value: number, format?: 'toString'): string | number {
    if (format) {
      return this.tranformToString(value);
    } else {
      return this.tranformToNumber(value);
    }
  }

  tranformToString(value) {
    if (value <= 60) {
      return 'seconds';
    }
    if (value <= 3600) {
      return 'minutes';
    }
    return 'hours';
  }

  tranformToNumber(value: number) {
    if (value <= 60) {
      return value;
    }
    if (value <= 3600) {
      return Math.round(value / 60);
    }
    return Math.round(value / 3600);
  }
}
