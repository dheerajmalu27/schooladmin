import { Injectable, Injector } from '@angular/core';
import { HttpHeaders, HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  router: Router;

  constructor(
    private http: HttpClient,
    private injector: Injector
  ) {}

  request(url: string | HttpRequest<any>): Observable<any> {
    let tokenizedReq;

    if (typeof url === 'string') {
      const token = localStorage.getItem(environment.accessTokenLocalStorage);
      // const headersConfig = {
      //   'Content-Type': environment.defaultContentTypeHeader,
      //   'Authorization': token
      // };
      let headersConfig = {
        'Content-Type': 'application/json',
        'Authorization': token || 'default_token_value'
      };
      
      tokenizedReq = new HttpRequest('GET', url, { headers: new HttpHeaders(headersConfig) });
    } else {
      tokenizedReq = this.createRequestOptions(url);
    }

    return this.http.request(tokenizedReq).pipe(
      catchError(this.catchAuthError(this))
    );
  }

  private createRequestOptions(request: HttpRequest<any>): HttpRequest<any> {
    const token: any = localStorage.getItem(environment.accessTokenLocalStorage);
    
    // const headersConfig = {
    //   'Authorization': token
    // };
    let headersConfig: { [key: string]: string } = { 'Authorization': token };  // or however you initialize it

    if (environment.addContentTypeHeader && typeof environment.addContentTypeHeader === 'string') {
      headersConfig['Content-Type'] = environment.addContentTypeHeader;
    } else {
      headersConfig['Content-Type'] = request.headers.get('Content-Type') || environment.defaultContentTypeHeader;
    }

    return request.clone({
      setHeaders: headersConfig
    });
  }

  private catchAuthError(self: HttpService) {
    return (error: HttpErrorResponse) => {
      if (this.router == null) {
        this.router = this.injector.get(Router);
      }
      if (error.status === 401 || error.status === 403) {
        console.log(error);
        localStorage.removeItem(environment.userLocalStorage);
        localStorage.removeItem(environment.accessTokenLocalStorage);
        this.router.navigate([environment.loginPageUrl]);
      }

      return throwError(error);
    };
  }
}
