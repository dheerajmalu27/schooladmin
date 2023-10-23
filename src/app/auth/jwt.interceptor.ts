import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { HttpRequest, HttpHandler, HttpEvent, HttpResponse, HttpErrorResponse, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'; // Import the tap operator

@Injectable({
  providedIn: 'root' // Use providedIn: 'root' for tree-shakable providers
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService, public router: Router) {}
  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {    
    return next.handle(request).pipe(
      tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // if the token is valid
        }
      }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
          if (err.status === 401) {
            // this is where you can do anything like navigating
            this.router.navigateByUrl('/login');
          }
        }
      })
    );
  }
}
