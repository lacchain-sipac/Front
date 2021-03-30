import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhaseService {
  private name: string;

  constructor() { }

  set phaseName(phaseName: string) {
    this.name = phaseName;
  }

  get phaseName() {
    return this.name;
  }
}
