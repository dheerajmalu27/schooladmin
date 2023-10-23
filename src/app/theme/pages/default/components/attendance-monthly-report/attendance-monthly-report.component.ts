import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {BaseService} from '../../../../../_services/base.service';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
declare let $: any
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./attendance-monthly-report.html",
  encapsulation: ViewEncapsulation.None,
})
export class AttendanceMonthlyReportComponent implements OnInit, AfterViewInit {
  studentData: any = null;
  isValid = false;
  studentEditData:any;
  divisionData:any=null;
  classData:any =null;
  attendanceReportForm: FormGroup;
 
  constructor(private _script: ScriptLoaderService,private baseservice: BaseService
    , private router: Router,public fb: FormBuilder) {
    // this.getStudentList();
     
    }
  ngOnInit() {
    
    this.attendanceReportForm = this.fb.group({
      'attendanceDate': new FormControl(),
      'classId': new FormControl(),
      'divId': new FormControl(),
    });
    this.getClassList();
    this.getDivisionList();
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    'assets/demo/default/custom/components/forms/widgets/bootstrap-daterangepicker.js');
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    'assets/demo/default/custom/components/forms/widgets/select2.js');

    }
  
  
 
  ngAfterViewInit() {
    
    
  }
  private getClassList() {

    this.baseservice.get('classlist').subscribe((data:any) => {
      this.classData = data.class;
      (<any>$('.class_select2_drop_down')).select2({ data: this.classData });
    },
      (err) => {
        //  localStorage.clear();
      });
  }
  private getDivisionList() {
  this.baseservice.get('divisionlist').subscribe((data:any) => {
      this.divisionData = data.division;
      (<any>$('.division_select2_drop_down')).select2({ data: this.divisionData });
    },
      (err) => {
        //  localStorage.clear();
      });

  }
  attendanceReportSubmitForm(value: any){
    console.log(value);
  }
  
}