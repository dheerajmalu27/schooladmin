import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NgBootstrapComponent } from './ng-bootstrap.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DefaultComponent } from '../../default.component';
import { LayoutModule } from '../../../../layouts/layout.module';
const routes: Routes = [
  {
    path: "",
    component: DefaultComponent,
    children: [
      {
        path: "",
        component: NgBootstrapComponent
      }
    ]
  },
];

@NgModule({
  imports: [
    NgbModule,
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    NgBootstrapComponent
  ],
  schemas: [NO_ERRORS_SCHEMA],
})
export class NgBootstrapModule {
}
