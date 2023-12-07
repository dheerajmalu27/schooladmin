import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { SchoolSettingComponent } from './school-setting.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    "path": "",
    "component": DefaultComponent,
    "children": [
      {
        "path": "",
        "component": SchoolSettingComponent
      }
    ]
  }
];
@NgModule({
  imports: [
    FormsModule,ReactiveFormsModule,CommonModule, RouterModule.forChild(routes), LayoutModule
  ], exports: [
    RouterModule
  ], declarations: [
    SchoolSettingComponent
  ]
})
export class SchoolSettingModule {



}
