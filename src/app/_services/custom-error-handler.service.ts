import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Error } from '../interfaces/error.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandlerService {
  tryParseError(error: HttpErrorResponse): any {
    try {
      return error.error;
    } catch (ex) {
      return error.message || error.toString();
    }
  }

  parseCustomServerError(error: Error): any {
    const title = error.message;
    let body = '';
    for (const errorMsg of error.error) {
      body += `${errorMsg}. `;
    }
    return { title, body };
  }

  // Note: `Response` and `ResponseOptions` from the old Http module are no longer applicable.
  // Consider returning an observable with the error, or using a different approach.
  // The method below has been commented out for clarity.
  
  createCustomError(error: Error): HttpErrorResponse {
    try {
      const parsedError = this.parseCustomServerError(error);
      return new HttpErrorResponse({
        error: { title: parsedError.title, message: parsedError.body },
        status: 400
      });
    } catch (ex) {
      return new HttpErrorResponse({
        error: { title: 'Unknown Error!', message: 'Unknown Error Occurred.' },
        status: 400
      });
    }
  }

  // The showToast method has been commented out since it's not provided in the input code.

  parseCustomServerErrorToString(error: Error): string {
    // this.showToast(error);
    const parsedError = this.createCustomError(error);
    try {
      return JSON.stringify(this.tryParseError(parsedError));
    } catch (ex) {
      try {
        return error.error.toString();
      } catch (error:any) {
        return error.toString();
      }
    }
  }
}
