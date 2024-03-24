import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/index';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  verify(): Observable<any> {
    return this.http.get('/api/verify').pipe(map((response) => response));
  }

  forgotPassword(email: string): Observable<any> {
    return this.http
      .post(environment.apiUrl + 'users/forgot-password', { email })
      .pipe(map((response) => response));
  }

  getAll(): Observable<User[]> {
    return this.http
      .get<User[]>('/api/users')
      .pipe(map((response) => response));
  }

  getById(id: number): Observable<User> {
    return this.http
      .get<User>('/api/users/' + id)
      .pipe(map((response) => response));
  }

  create(user: User): Observable<User> {
    return this.http
      .post<User>('/api/users', user)
      .pipe(map((response) => response));
  }

  update(user: User): Observable<User> {
    return this.http
      .put<User>('/api/users/' + user.id, user)
      .pipe(map((response) => response));
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete('/api/users/' + id)
      .pipe(map((response) => response));
  }
}
