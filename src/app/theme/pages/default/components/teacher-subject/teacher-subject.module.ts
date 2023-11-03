import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { TeacherSubjectComponent } from './teacher-subject.component';
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
        "component": TeacherSubjectComponent
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
    TeacherSubjectComponent
  ]
})
export class TeacherSubjectModule {



}
