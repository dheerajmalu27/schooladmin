import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/_services/common-api.service';
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(private http: HttpClient, private commonservice: CommonService) {}

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
    return this.http
      .post<any>(
        environment.apiUrl + 'users/login',
        { email, password },
        { headers: headers }
      )
      .pipe(
        tap((userData: any) => {
          // login successful if there's a jwt token in the response
          if (userData && userData.token) {
            userData.user['token'] = userData.token;
            userData.user['fullName'] = userData.user['first'];
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(
              environment.accessTokenLocalStorage,
              userData.token
            );
            localStorage.setItem(
              environment.userType,
              this.commonservice.utf8_to_b64(userData.user.role)
            );
            localStorage.setItem(
              environment.schoolProfileStoage,
              this.commonservice.utf8_to_b64(
                JSON.stringify(userData.schoolprofile)
              )
            );
            localStorage.setItem(
              environment.userLocalStorage,
              this.commonservice.utf8_to_b64(JSON.stringify(userData.user))
            );
          }
        })
      );
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem(environment.accessTokenLocalStorage);
    localStorage.removeItem(environment.schoolProfileStoage);
    localStorage.removeItem(environment.userLocalStorage);
    localStorage.removeItem('m-datatable__local_data-1-m-meta');
    localStorage.removeItem(environment.userType);
  }
}
