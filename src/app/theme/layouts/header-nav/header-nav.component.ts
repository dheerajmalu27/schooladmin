import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../helpers';
import { Router } from "@angular/router";
import { AuthenticationService } from "../../../auth/_services/authentication.service";

declare let mLayout: any;
@Component({
  selector: "app-header-nav",
  templateUrl: "./header-nav.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class HeaderNavComponent implements OnInit, AfterViewInit {


  constructor(private _router: Router,
    private _authService: AuthenticationService) {

  }
  ngOnInit() {

  }
  ngAfterViewInit() {

    mLayout.initHeader();
   
  

  }
 logout(){
  Helpers.setLoading(true);
  // reset login status
  this._authService.logout();
  const currentUrl = this._router.url;

  // Encode the current URL to include it as the returnUrl parameter
  const returnUrl = (currentUrl);
  // Navigate to the login route with the returnUrl parameter
  this._router.navigate(['/login'], { queryParams: { returnUrl: returnUrl } });
 }
 openMenu(){
 
mLayout.initAside();

}

}
