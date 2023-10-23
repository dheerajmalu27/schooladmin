import { HttpClient, HttpRequest, HttpResponse, HttpErrorResponse, HttpBackend, HttpHeaders, HttpEventType } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, throwError } from 'rxjs';

@Injectable()
export class MockHttpBackendInterceptor implements HttpBackend {
  // Array in local storage for registered users
  private users: any[] = JSON.parse(localStorage.getItem('users')) || [];
  private token: string = 'fake-jwt-token';

  constructor(private realBackend: HttpBackend) { }

  handle(request: HttpRequest<any>): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        // Your mock backend logic here, e.g.:
        if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
          // Handle login logic
        }

        // ... More handlers ...

        // Pass through any requests not handled above
        this.realBackend.handle(request).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        });
      }, 500);
    });
  }
}

// Update your providers to use the MockHttpBackendInterceptor as a provider for HttpBackend
