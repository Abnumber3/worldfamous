import {
  Component,
  ElementRef,
  Input,
  OnInit,
  Self,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NgControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  standalone: false,
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  @ViewChild('input', { static: true }) input: ElementRef | undefined;

  @Input() type = 'text';
  @Input() label = '';

  // extras used by your template
  @Input() toggleable = false;
  @Input() showErrors = false;
  @Input() showValid = false;
  @Input() isValid = false;

  // explicitly control browser autofill
  @Input() autocomplete: string = 'off';

  value: any = '';
  showPassword = false;

  // ControlValueAccessor hooks
  onChange: (value: any) => void = () => {};
  onTouched: () => void = () => {};

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control;
    const validators = control?.validator ? [control.validator] : [];
    const asyncValidators = control?.asyncValidator ? [control.asyncValidator] : [];
    control?.setValidators(validators);
    control?.setAsyncValidators(asyncValidators);
    control?.updateValueAndValidity({ emitEvent: false });
  }

  // CVA required methods
  writeValue(value: any): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.input?.nativeElement.setAttribute('disabled', 'true');
    } else {
      this.input?.nativeElement.removeAttribute('disabled');
    }
  }

  // template handlers
  handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    this.onChange(this.value);
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // dynamic error messages (used by your template)
  get errorMessages(): string[] {
    const control = this.controlDir.control;
    if (!control || !control.errors) return [];

    const errors: ValidationErrors = control.errors;
    const messages: string[] = [];

    if (errors['required']) messages.push('This field is required');
    if (errors['email']) messages.push('Must be a valid email.');
    // if (errors['minlength']) messages.push(`Minimum length is ${errors['minlength'].requiredLength}`);
    if (errors['maxlength']) messages.push(`Maximum length is ${errors['maxlength'].requiredLength}`);
 

    return messages;
  }
}
