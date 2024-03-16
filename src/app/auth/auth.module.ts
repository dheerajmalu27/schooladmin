import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

// Import any required testing utilities from '@angular/common/http/testing' if needed

import { AuthRoutingModule } from './auth-routing.routing';
import { AuthComponent } from './auth.component';
import { AlertComponent } from './_directives/alert.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './_guards/auth.guard';
import { AlertService } from './_services/alert.service';
import { AuthenticationService } from './_services/authentication.service';
import { UserService } from './_services/user.service';
// Remember to update 'fakeBackendProvider' if it relied on @angular/http
// import { fakeBackendProvider } from "./_helpers/index";

@NgModule({
  declarations: [AuthComponent, AlertComponent, LogoutComponent],
  imports: [CommonModule, FormsModule, HttpClientModule, AuthRoutingModule],
  providers: [
    AuthGuard,
    AlertService,
    AuthenticationService,
    UserService,
    // Update or replace the following as per your needs:
    // fakeBackendProvider,
    // MockBackend utilities replacement from @angular/common/http/testing
    // BaseRequestOptions, (might not be required with HttpClient)
  ],
  bootstrap: [AlertComponent],

  // entryComponents: []
})
export class AuthModule {}
