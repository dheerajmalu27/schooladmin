import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { HttpRequest } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  cachedRequests: Array<HttpRequest<any>> = [];
  private jwtHelper = new JwtHelperService();

  public collectFailedRequest(request:any): void {
    this.cachedRequests.push(request);
  }

  public retryFailedRequests(): void {
    // retry the requests. this method can
    // be called after the token is refreshed
  }
  public getToken(): string | null {
    return localStorage.getItem('accessToken');
}
  // public getToken(): string {
  //   return localStorage.getItem('token');
  // }

  public isAuthenticated(): boolean {
    const token = this.getToken();
    // Check if the token has expired
    return !this.jwtHelper.isTokenExpired(token);
  }
}
