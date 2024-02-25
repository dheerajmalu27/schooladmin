import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../_services/user.service';
import { environment } from 'src/environments/environment';
import { CommonService } from 'src/app/_services/common-api.service';

@Injectable({
  providedIn: 'root', // Use providedIn for tree-shakable services
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private userService: UserService,
    private commonService: CommonService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    console.log('AuthGuard canActivate() is called');

    // Retrieve user data from local storage
    const storageData = localStorage.getItem(environment.userLocalStorage);

    if (storageData) {
      // Decode user data
      const decodedData = this.commonService.b64_to_utf8(storageData);

      // Parse user data to JSON
      const currentUser = JSON.parse(decodedData);

      // Check if the user has a token and is logged in
      if (currentUser && currentUser.token) {
        // Check if roles are defined for the main route
        const requiredRoles = route.data && (route.data['roles'] as string[]);

        // Check if roles are defined for the first child route
        const firstChildRoles =
          route.children.length > 0 &&
          route.children[0].data &&
          (route.children[0].data['roles'] as string[]);

        // If roles are not defined for the main route or the user has one of the required roles, allow access
        if (
          (!requiredRoles || requiredRoles.includes(currentUser.role)) &&
          (!firstChildRoles || firstChildRoles.includes(currentUser.role))
        ) {
          return true;
        }

        // If the user doesn't have the required role, navigate to the forbidden page
        return this.router.createUrlTree(['/404']);
      }
    }

    // If the user is not logged in, redirect to the login page
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url },
    });
  }
}
