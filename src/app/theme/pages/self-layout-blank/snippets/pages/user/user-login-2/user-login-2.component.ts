import { Component, ComponentFactoryResolver, OnInit,AfterViewInit, ViewChild, ViewContainerRef, ViewEncapsulation } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Helpers } from '../../../../../../../helpers';
import { ScriptLoaderService } from '../../../../../../../_services/script-loader.service';
import { AuthenticationService } from "../../../../../../../../app/auth/_services/authentication.service";
import { AlertService } from "../../../../../../../../app/auth/_services/alert.service";
import { UserService } from "../../../../../../../../app/auth/_services/user.service";
import { AlertComponent } from "../../../../../../../../app/auth/_directives/alert.component";
import { LoginCustom } from "../../../../../../../../app/auth/_helpers/login-custom";

@Component({
  selector: ".m-grid.m-grid--hor.m-grid--root.m-page",
  templateUrl: "./user-login-2.component.html",
  encapsulation: ViewEncapsulation.None,
})
export class UserLogin2Component implements OnInit {
  model: any = {};
  loading = false;
  returnUrl: any;
  @ViewChild('alertSignin', { read: ViewContainerRef }) alertSignin: ViewContainerRef;
  @ViewChild('alertSignup', { read: ViewContainerRef }) alertSignup: ViewContainerRef;
  @ViewChild('alertForgotPass', { read: ViewContainerRef }) alertForgotPass: ViewContainerRef;

  constructor(private _router: Router,
    private _script: ScriptLoaderService,
    private _userService: UserService,
    private _route: ActivatedRoute,
    private _authService: AuthenticationService,
    private _alertService: AlertService,
    private cfr: ComponentFactoryResolver) {
  }

  ngOnInit() {
    this.model.remember = true;
    // get return url from route parameters or default to '/'
    // this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    // this._router.navigate([this.returnUrl]);
console.log("test");
    // this._script.load('body', 'assets/vendors/base/vendors.bundle.js', 'assets/demo/default/base/scripts.bundle.js')
    //   .then(() => {
    //     Helpers.setLoading(false);
    //     LoginCustom.init();
    //   });
  }

  signin() {
    this.loading = true;
    this._authService.login(this.model.email, this.model.password)
      .subscribe(
      data => {
        this._router.navigate(['/dashboard']);
      },
      error => {
        this.showAlert('alertSignin');
        this._alertService.error(error);
        this.loading = false;
      });
  }

  signup() {
    this.loading = true;
    this._userService.create(this.model)
      .subscribe(
      data => {
        this.showAlert('alertSignin');
        this._alertService.success('Thank you. To complete your registration please check your email.', true);
        this.loading = false;
        LoginCustom.displaySignInForm();
        this.model = {};
      },
      error => {
        this.showAlert('alertSignup');
        this._alertService.error(error);
        this.loading = false;
      });
  }

  forgotPass() {
    this.loading = true;
    this._userService.forgotPassword(this.model.email)
      .subscribe(
      data => {
        this.showAlert('alertSignin');
        this._alertService.success('Cool! Password recovery instruction has been sent to your email.', true);
        this.loading = false;
        LoginCustom.displaySignInForm();
        this.model = {};
      },
      error => {
        this.showAlert('alertForgotPass');
        this._alertService.error(error);
        this.loading = false;
      });
  }

  showAlert(target: keyof this) {
    (this[target] as ViewContainerRef).clear();
    let factory = this.cfr.resolveComponentFactory(AlertComponent);
    let ref = (this[target] as ViewContainerRef).createComponent(factory);
    ref.changeDetectorRef.detectChanges();
  }

}
