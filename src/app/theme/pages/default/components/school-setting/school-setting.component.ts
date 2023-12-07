import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef   } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import {BaseService} from '../../../../../_services/base.service';
import { Router } from '@angular/router';
declare let $: any;
declare var toastr: any;
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./school-setting.html",
  encapsulation: ViewEncapsulation.None,
})
export class SchoolSettingComponent implements OnInit, AfterViewInit {
  isSchoolEndDateDisabled: boolean = true; // Set this value based on your logic

  showTemplate:any;
  schoolprofileData:any;
  datatable: any ;
  addSchoolSettingForm : FormGroup;
  editSchoolSettingForm : FormGroup;

  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router,fb: FormBuilder){
    this.getSchoolSettingList();
   
    this.editSchoolSettingForm = fb.group({
      'id' : [null, Validators.required], 
      'schoolName' : [null, Validators.required],
      'schoolAddress' : [null, Validators.required],
      'regNo' : [null, Validators.required],
      'schoolStartDate' : [null, Validators.required],
      'schoolEndDate' : [null, Validators.required],
     
    });
   
  }
  ngOnInit() {
    // this.listTemplate();
  }
  ngAfterViewInit() {
    // this.listTemplate();
  }
  listTemplate() {
    this.router.navigate(['/dashboard']);
   
  }

  editTemplate(data:any) {
    this.editSchoolSettingForm.controls['id'].setValue(data.id);
    this.editSchoolSettingForm.controls['schoolName'].setValue(data.schoolName);
    this.editSchoolSettingForm.controls['schoolAddress'].setValue(data.schoolAddress);
    this.editSchoolSettingForm.controls['regNo'].setValue(data.regNo);
    this.editSchoolSettingForm.controls['schoolStartDate'].setValue(data.schoolStartDate);
    this.editSchoolSettingForm.controls['schoolEndDate'].setValue(data.schoolEndDate);

   this.isSchoolEndDateDisabled=true;
    
  
  }
 
 
  editSchoolSettingSubmitForm(data: any){
    delete data.schoolEndDate;
    delete data.schoolStartDate;
    this.baseservice.put('schoolprofile/'+data.id,data).subscribe((result:any) => { 
   
      this.router.navigate(['/dashboard']);
      toastr.success('Record has been updated successfully...!');
    },
    (err) => {
      toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }
  private getSchoolSettingList() {
    this.baseservice.get('schoolprofile').subscribe((data:any) => {
      
      this.schoolprofileData = data.schoolprofile;
      this.editTemplate(data.schoolprofile[0]);

      
    },
    (err) => {
    //  localStorage.clear();
    });
  }
 


}
