
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme/theme.component';
import { LayoutModule } from './theme/layouts/layout.module';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { AmChartsModule } from "@amcharts/amcharts3-angular";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonService } from "./_services/common-api.service";
import { ScriptLoaderService } from "./_services/script-loader.service";
import { CustomErrorHandlerService } from "./_services/custom-error-handler.service";
import { ThemeRoutingModule } from "./theme/theme-routing.module";
import { AuthModule } from "./auth/auth.module";
import { FullCalendarModule } from '@fullcalendar/angular';
import {BaseService} from "./_services/base.service";
import {HttpService} from "./_services/http.service"
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TokenInterceptor } from './auth/token.interceptor';
import { HttpClientModule } from '@angular/common/http'; 

@NgModule({
  declarations: [
    ThemeComponent,
    AppComponent,
  ],
  imports: [
    // HttpModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    LayoutModule,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ThemeRoutingModule,
    AuthModule,
    AmChartsModule,
    HttpClientModule,
  ],
  providers: [ScriptLoaderService,CommonService,BaseService, HttpService,CustomErrorHandlerService,
      {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
