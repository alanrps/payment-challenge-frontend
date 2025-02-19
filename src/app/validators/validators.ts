import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function dateGreaterThanToday(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const currentDate = new Date();
    const selectedDate = new Date(control.value);

    return selectedDate < currentDate ? { dateInvalid: 'A data deve ser maior ou igual a hoje.' } : null;
  };
}