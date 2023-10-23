import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs"; // Update the import path
import { appVariables } from '../../app.constants';

@Injectable({
  providedIn: 'root' // Use providedIn for tree-shakable services
})
export class AuthGuard implements CanActivate {

  constructor(private _router: Router, private _userService: UserService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let storageData = localStorage.getItem(appVariables.userLocalStorage);
    let currentUser;
    
    if (storageData) {
        currentUser = JSON.parse(storageData);
    } else {
        // Handle the case where the data doesn't exist or set a default value
        currentUser = {}; // or some default value
    }
    if (currentUser != '' && currentUser != null && (currentUser.token != '' || currentUser.token != null)) {
      return true;
    } else {
      this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
