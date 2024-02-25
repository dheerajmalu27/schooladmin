// auth.guard.ts

import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree
} from "@angular/router";
import { UserService } from "../_services/user.service";
import { Observable } from "rxjs"; // Update the import path
import { environment } from "src/environments/environment";
import { CommonService } from "src/app/_services/common-api.service";
@Injectable({
  providedIn: 'root' // Use providedIn for tree-shakable services
})
export class TeacherAuthGuard implements CanActivate {

  constructor(private _router: Router, private _userService: UserService,private commonservice:CommonService) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
   
    let storageData = localStorage.getItem(environment.userLocalStorage);
    let currentUser;
    if (storageData !== null) {
      storageData = this.commonservice.b64_to_utf8(storageData);
      console.log("storageData");
      console.log(storageData);
    } else {
      // Handle the case where storageData is null, for example:
      console.error('storageData is null');
    }
   
    if (storageData) {
        currentUser = JSON.parse(storageData);
    } else {
        // Handle the case where the data doesn't exist or set a default value
        currentUser = ''; // or some default value
    }
    console.log('currentUser '+currentUser);
    if (currentUser != '' && currentUser != null && (currentUser.token != '' || currentUser.token != null)) {
      return true;
    } else {
      // Use UrlTree to navigate to the login page
      return this._router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    }
  }
}
