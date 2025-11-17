import { Component, Input } from '@angular/core';
import { CdkStepper } from '@angular/cdk/stepper';

@Component({
  selector: 'app-stepper',
  standalone: false,
  templateUrl: './stepper.component.html',
  styleUrl: './stepper.component.scss',
  providers: [
    {
      provide: CdkStepper,
      useExisting: StepperComponent
    }
  ]
})
export class StepperComponent extends CdkStepper  {

  // 👇 This is what your template is binding to
  @Input() linearModeSelected: boolean = false;

  // Optional: if you want to click on step headers and move
  onStepHeaderClick(index: number): void {
    this.selectedIndex = index;
  }
}
