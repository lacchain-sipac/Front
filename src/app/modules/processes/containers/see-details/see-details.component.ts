import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PhaseService } from '@modules/processes/services/phase.service';

@Component({
  selector: 'kt-see-details',
  templateUrl: './see-details.component.html',
  styleUrls: ['./see-details.component.scss']
})

export class SeeDetailsComponent implements OnInit {
  phaseTitle = {
    execution: 'Resumen de la fase de ejecución',
    process: 'Resumen de la fase de proceso',
    request: 'Solicitud de Proceso'
  };

  constructor(private router: Router, private phaseService: PhaseService ) {
  }

  ngOnInit() {
  }

  goBack() {
    this.router.navigate(['home/processes']);
  }

  get title(){
    const phaseName = this.phaseService.phaseName;
    return this.phaseTitle[phaseName] || '';
  }

}
