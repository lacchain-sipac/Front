import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'kt-empty-data',
  templateUrl: './empty-data.component.html',
  styleUrls: ['./empty-data.component.scss']
})


export class EmptyDataComponent implements OnInit {

  @Input() type: string;
  information: IEmptyData;

  constructor() { }

  ngOnInit() {
    switch (this.type) {
      case 'users':
        this.information = {
          icon: 'assignment',
          title: 'Aún no hay usuarios agregados',
          message: 'Haz click en Agregar usuario y comienza a registrar usuarios de aplicación'
        };
        break;

      case 'requests':
        this.information = {
          icon: 'assignment',
          title: 'Aún no hay procesos solicitados',
          message: 'Haz click en Crear solicitud y comienza a registrar solicitudes de procesos'
        };
        break;
      case 'membersCommittee':
        this.information = {
          icon: 'assignment',
          title: 'Aún no hay miembros agregados',
          message: 'Haz click en Agregar para registrar miembros del comite de evaluación.'
        };
        break;
      default:
        break;
    }
  }

}

export interface IEmptyData {
  icon: string;
  title: string;
  message: string;
}
