import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  pure: true
})
export class DateAgoPipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    if (value) {
      const seconds = Math.floor((+new Date() - +new Date(value)) / 1000);
      if (seconds < 29) {
        return 'Hace un momento';
      }
      const times = {
        año: { timestamp: 31536000, plural: 'años' },
        mes: { timestamp: 2592000, plural: 'meses' },
        semana: { timestamp: 604800, plural: 'semanas' },
        día: { timestamp: 86400, plural: 'días' },
        hora: { timestamp: 3600, plural: 'horas' },
        minuto: { timestamp: 60, plural: 'minutos' },
        segundo: { timestamp: 1, plural: 'segundos' }
      };

      let counter;
      for (const time of Object.keys(times)) {
        counter = Math.floor(seconds / times[time].timestamp);
        if (counter > 0) {
          if (counter === 1) {
            return counter + ' ' + time;
          } else {
            return counter + ' ' + times[time].plural;
          }
        }
      }
    }
    return value;
  }

}
