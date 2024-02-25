import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Error } from '../interfaces/error.interface';
import { Router } from '@angular/router';
import { ServerResponse } from '../interfaces/server-response.interface';
import { appVariables } from './../app.constants';
import { CustomErrorHandlerService } from './custom-error-handler.service';
import { environment } from './../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class BaseService {
  constructor(
    private router: Router,
    private http: HttpClient,
    private errorHandler: CustomErrorHandlerService
  ) {}

  get(url: any): Observable<ServerResponse> {
    return this.http
      .get<ServerResponse>(environment.apiUrl + url)
      .pipe(
        map((res) => this.handleResponse(res)),
        catchError(this.catchAuthError.bind(this))
      );
  }

  post(
    url: any,
    postBody: any,
    options?: HttpHeaders
  ): Observable<ServerResponse> {
    return this.http
      .post<ServerResponse>(environment.apiUrl + url, postBody, {
        headers: options,
      })
      .pipe(
        map((res) => this.handleResponse(res)),
        catchError(this.catchAuthError.bind(this))
      );
  }

  delete(url: any): Observable<ServerResponse> {
    return this.http
      .delete<ServerResponse>(environment.apiUrl + url)
      .pipe(
        map((res) => this.handleResponse(res)),
        catchError(this.catchAuthError.bind(this))
      );
  }

  put(url: any, putData: any): Observable<ServerResponse> {
    return this.http
      .put<ServerResponse>(environment.apiUrl + url, putData)
      .pipe(map((res) => this.handleResponse(res)));
  }

  upload(url: string, file: File, data: any): Observable<ServerResponse> {
    const formData: FormData = new FormData(data);
    if (file) {
      formData.append('files', file, file.name);
    }
    appVariables.addContentTypeHeader = false;
    return this.post(url, data);
  }

  // ... (Keep the rest of the methods)

  handleResponse(res: ServerResponse): ServerResponse {
    if (res.error) {
      const error: Error = { error: res.error, message: res.message };
      throw new Error(this.errorHandler.parseCustomServerErrorToString(error));
    } else {
      return res;
    }
  }

  catchAuthError(res: HttpResponse<any>): Observable<never> {
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem(appVariables.userLocalStorage);
      localStorage.removeItem(appVariables.accessTokenLocalStorage);
      this.router.navigate([appVariables.loginPageUrl]);
      return throwError(res);
    }
    return throwError(res);
  }
}
