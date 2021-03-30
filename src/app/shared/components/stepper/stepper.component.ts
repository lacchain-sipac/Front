import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'kt-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  @Input() steps: string[];
  @Input() currentStep: number;
  currentStepInPhase: number;
  maxStepSavedNumber: number;

  constructor(private router: Router) { }

  ngOnInit() {
    this.currentStepInPhase = this.currentStep - 1;
    this.maxStepSavedNumber = this.currentStepInPhase;
  }

  getClassStepCircle(index: number): string {
    let classList = 'd-flex justify-content-center align-items-center p-2 rounded-circle btn-circle-medium font-weight-bold ';
    index++;

    if (this.currentStep - 1 > this.currentStepInPhase && this.currentStep - 1 > this.maxStepSavedNumber) {
      this.maxStepSavedNumber = this.currentStep - 1;
    }

    if (index === this.currentStep) {
      classList = classList.concat('text-white contrast-bg');
      return classList;
    }

    if (index <= this.maxStepSavedNumber && index !== this.currentStep) {
      classList = classList.concat('success-bg');
      return classList;
    }

    classList = classList.concat('inactive-text bg-white');
    return classList;
  }

  getClassStepText(index: number): string {
    let classList = 'text-right d-flex align-items-center ';
    index++;

    if (index === this.currentStep) {
      classList = classList.concat('text-white');
      return classList;
    }

    classList = classList.concat('text-disable');
    return classList;

  }

  getListProcess() {
    this.router.navigate([`home/processes`]);
  }

  isStepCompleted = (index: number): boolean => index <= this.maxStepSavedNumber && index !== this.currentStep;

}
