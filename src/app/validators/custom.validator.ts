import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from "@angular/forms"

export class CustomValidators extends Validators {
  static passwordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const regex = /^(?=.*\d).{8,}$/;
    return regex.test(control.value) ? null : { invalidPassword: true };
  }

  static conditionalRequired(name: string, company: boolean): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {

      if (
        (company && (name === 'bank_account' || name === 'phone')) ||
        (!company && (name === 'position' || name === 'age'))
      ) {
        if (control.value === null || control.value === '' || control.value === undefined) return { conditionalRequired: true}
      }

      return null;
    }
  }


  static timeRangeValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
      const openingTime = control.get('opening_time')?.value;
      const closingTime = control.get('closing_time')?.value;

      if (openingTime && closingTime) {
        const openingDate = new Date(`1970-01-01T${openingTime}`);
        const closingDate = new Date(`1970-01-01T${closingTime}`);

        const timeDifference = (closingDate.getTime() - openingDate.getTime()) / (1000 * 60 * 60);


        if (timeDifference < 1 || openingDate >= closingDate) {
          return { timeRange: true };
        }
      }

      return null;
    };
}
