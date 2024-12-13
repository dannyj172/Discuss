import { ValidatorFn } from "@angular/forms";

export function imageValidator():ValidatorFn {

    const regExp = new RegExp(`https:\/\/.*`)

    return (control)=> {
        const isImageInvalid = control.value=== '' || regExp.test(control.value)

      return isImageInvalid ? null : {imageValidator: true};
    }
  }