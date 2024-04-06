import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { OldStudentComponent } from './old-student.component';
import { LayoutModule } from '../../../../layouts/layout.module';
import { DefaultComponent } from '../../default.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: '',
        component: OldStudentComponent,
      },
    ],
  },
];
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
  ],
  exports: [RouterModule],
  declarations: [OldStudentComponent],
})
export class OldStudentModule {}
