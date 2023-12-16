import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
import { tap } from "rxjs/operators";
import { appVariables } from '../../app.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  login(email: string, password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Accept': 'application/json' });
    return this.http.post<any>('http://192.168.1.5:3000/api/users/login', { email, password }, { headers: headers })
      .pipe(
        tap((userData: any) => {
          // login successful if there's a jwt token in the response
          if (userData && userData.token) {
            userData.user["token"] = userData.token;
            userData.user["fullName"] = userData.user["first"];
            // store user details and jwt token in local storage to keep user logged in between page refreshes
            localStorage.setItem(appVariables.accessTokenLocalStorage, userData.token);
            localStorage.setItem(appVariables.userLocalStorage, JSON.stringify(userData.user));
          }
        })
      );
  }

  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem(appVariables.accessTokenLocalStorage);
    localStorage.removeItem(appVariables.userLocalStorage);
  }
}
