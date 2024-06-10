export class CustomValidationError extends Error {
    constructor(errors) {
      super(errors);
      this.errors = errors;
    }
  }