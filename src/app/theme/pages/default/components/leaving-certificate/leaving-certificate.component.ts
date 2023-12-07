import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CommonService } from '../../../../../_services/common-api.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import {BaseService} from '../../../../../_services/base.service';
import { appVariables } from '../../../../../app.constants';
import * as _ from 'lodash';
declare let $: any;
declare var toastr: any;
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./leaving-certificate.html",
  encapsulation: ViewEncapsulation.None,
})
export class LeavingCertificateComponent implements OnInit, AfterViewInit {
  datatable: any; // Change the type to your actual data type
  leavingcertificateData: any = null;
  TitleSet: any = null;
  stateData:any=null;
  cityData:any=null;

  studentData:any=null;
  classData:any =null;
  showTemplate: any;
  selectedFiles:any;
  leavingCertificateStudentForm: any;
   addLeavingCertificateForm : any;
  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,
private commonservice: CommonService,private _script: ScriptLoaderService, private router: Router,public fb: FormBuilder,private baseservice: BaseService) {
    }
  ngOnInit() {
    this.leavingCertificateStudentForm = this.fb.group({
      'studentId': new FormControl(),
    });
    this.getLeavingCertificateList();
    this.addLeavingCertificateForm = this.fb.group({
      'id' : new FormControl(),
      'firstName' : new FormControl('', Validators.required),
      'middleName' : new FormControl('', Validators.required),
      'lastName' : new FormControl('', Validators.required),
      'image': new FormControl(),
      'dob' : new FormControl(),
      'className' : new FormControl(),
      'divName' : new FormControl(),
      'nationality': new FormControl('', Validators.required),
      'caste': new FormControl('', Validators.required),
      'religion': new FormControl('', Validators.required),
      'address': new FormControl('', Validators.required),
      'bloodGroup': new FormControl(),
      'gender' : new FormControl('', Validators.required),
      'motherName' : new FormControl('', Validators.required),
      'stateId' : new FormControl(),
      'cityId' : new FormControl(),
      'motherProf' : new FormControl('', Validators.required),
      'parentNumber' : new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(12),
      ]),
       'fatherName' : new FormControl('', Validators.required),
       'fatherProf' : new FormControl('', Validators.required),
       'parentNumberSecond' : new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
      ]),
      // 'lastName': [null,  Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
    });
    
  
    this.listTemplate();
    }
  listTemplate() {
    $("#addTemplate").hide();
    $("#listTemplate").show();
  }
  addTemplate() {
    this.TitleSet='Add LeavingCertificate';
    this.addLeavingCertificateForm.reset();
    $("#addTemplate").show();
    $("#listTemplate").hide();
    this.getStudentList();
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js');
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
      
      $('#m_datepickerSet').datepicker({
        todayHighlight: true,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    $('#m_datepickerSet').on('change', function(){
    });


  }
 
  public editTemplate(leavingcertificateData:any) {
    this.TitleSet='Edit LeavingCertificate';
  
    this.addLeavingCertificateForm.reset();
   
    // this.getStudentList();
    $("#listTemplate").hide();
    $("#addTemplate").hide();
    $("#addTemplate1").show();
    this.addLeavingCertificateForm.setValue({
      id: leavingcertificateData.id,
      firstName: leavingcertificateData.firstName,
      middleName: leavingcertificateData.middleName,
      lastName: leavingcertificateData.lastName,
      // image: leavingcertificateData.profileImage,
      image: "",
      dob: leavingcertificateData.dateOfBirth,
      className: leavingcertificateData.className,
      divName: leavingcertificateData.divName,
      nationality: leavingcertificateData.nationality,
      caste: leavingcertificateData.caste,
      religion: leavingcertificateData.religion,
      address: leavingcertificateData.address,
      bloodGroup: leavingcertificateData.bloodGroup,
      gender: leavingcertificateData.gender,
      motherName: leavingcertificateData.motherName,
      stateId: leavingcertificateData.stateId,
      cityId: leavingcertificateData.cityId,
      motherProf: leavingcertificateData.motherProf,
      parentNumber: leavingcertificateData.parentNumber,
      fatherName: leavingcertificateData.fatherName,
      fatherProf: leavingcertificateData.fatherProf,
      parentNumberSecond: leavingcertificateData.parentNumberSecond,
    });
  
   

    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js');
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
      $('#m_datepickerSet').datepicker({
        todayHighlight: true,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    setTimeout(() => 
    {
        $(".student_select2_drop_down").val(<string>leavingcertificateData.divName).trigger('change');
      $(".state_select2_drop_down").val(<string>leavingcertificateData.stateId).trigger('change');
    },
    2000);
    
  }

  tableToExcel(table:any){
    this.commonservice.tableToExcel(table,'LeavingCertificate List');
                 }
  ngAfterViewInit() {
   
  }
  leavingCertificateSubmitForm(data: any){
    data.studentId = $('.student_select2_drop_down').val();
   console.log(data);
   if(data.studentId!=''){
    this.baseservice.get('studentinfo/'+data.studentId).subscribe((data:any) => {
      // console.log(data.studentinfo);
     this.editTemplate(data[0]);
    //   $("#listTemplate").show();
    },
      (err) => {
        $("#listTemplate").hide();
        //  localStorage.clear();
      });
   }
  
  }
  private getLeavingCertificateList() {
    this.baseservice.get('leavingcertificates').subscribe((data:any) => {
      this.leavingcertificateData = data.leavingcertificates;
      this.refreshDataTable(data);
    },
    (err) => {
    //  localStorage.clear();
    });
   
  }
  private getLeavingCertificateData(Id:any) {
    this.baseservice.get(<string>('leavingcertificates/'+Id)).subscribe((data:any) => { 
      this.editTemplate(data.leavingcertificates);
    },
    (err) => {
      //localStorage.clear();
    });
   

  }

  


 private getStudentList() {
 var select2: any;
 var resultArray: Array<any> = [];
 this.baseservice.get('activestudentlist').subscribe((data:any) => {
   this.studentData = data.student;
 (<any>$('.student_select2_drop_down')).select2({data:this.studentData});
},
(err) => {
//  localStorage.clear();
});   

}
selectFile(event: any) {
  this.selectedFiles = event.target.files[0];
}
public addLeavingCertificateSubmitForm(data:any){
  const formData: FormData = new FormData();

   
    
    data.stateId=$('.state_select2_drop_down').val();
    data.cityId=$('.city_select2_drop_down').val();
    data.divName=$('.student_select2_drop_down').val();
    data.dob=$("#m_datepickerSet").val();

    const fileInput = document.getElementById('imageInput') as HTMLInputElement | null;
  
  
    for (const key of Object.keys(data)) {
      formData.append(key, data[key]);
    }

    // if (this.selectedFiles && this.selectedFiles.length > 0) {
    //     formData.append('image', this.selectedFiles[0]);
    // }
    formData.set('stateId', $('.state_select2_drop_down').val() as string);
    formData.set('cityId', $('.city_select2_drop_down').val() as string);
    formData.set('divName', $('.student_select2_drop_down').val() as string);
    formData.set('className', $('.class_select2_drop_down').val() as string);
    formData.set('dateOfBirth', $("#m_datepickerSet").val() as string);
    if (fileInput && fileInput.files) {
      if (fileInput.files.length > 0) {
        formData.set('image', fileInput.files[0]);
      }
    }
if(data.id!=''&& data.id!=undefined && data.id!=null)  {
// data.image=this.selectedFiles;
this.baseservice.put('leavingcertificates/'+data.id,formData).subscribe((data:any) => {
  this.getLeavingCertificateList();
  this.listTemplate();
  toastr.success('Record has been updated successfully...!');
},
(err) => {
 console.log(err);
 toastr.error('Something went wrong...!');
//  localStorage.clear();
});
}else{
 data.image=this.selectedFiles;
delete data.id;
console.log(formData);
console.log(data);
this.baseservice.post('leavingcertificates',formData).subscribe((data:any) => { 
  this.getLeavingCertificateList();
  this.listTemplate();
  toastr.success('Record has been added successfully...!');
},
(err) => {
 console.log(err);
 toastr.error('Something went wrong...!');
 //  localStorage.clear();
});
}
     
}
public refreshDataTable(newData: any): void {
  // Destroy existing datatable
  
    if (this.datatable) {
      this.datatable.destroy();  // Destroy existing datatable instance
      this.showtablerecord(newData); // Reinitialize datatable with new data
  }else{
    this.showtablerecord(newData);
  }

  // Show new data in datatable
 
}
  public showtablerecord(data: any) {
    try{
      let i = 1;

    // Assuming you're still using the jQuery based datatable.
    // Consider using Angular-based datatable libraries for more integration.
    this.datatable = $('.m_datatable').mDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: data.leavingcertificates,
        pageSize: 10
      },

      layout: {
        theme: 'default', // datatable theme
        class: '', // custom wrapper class
        scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
        height: 450, // datatable's body's fixed height
        footer: false // display/hide footer
      },
      sortable: true,

      pagination: true,
      columns: [{
        field: "",
        title: "Sr.No.",
        textAlign: 'center',
        sortable:false,
        template: function (row:any) {
          return i++;
        },
      }, {
        field: "studentName",
        title: "Student Name",
        // template: function (row:any) {
        //  if(row.profileImage!=null && row.profileImage!='' && row.profileImage!='null'){
        //   return '<span (click)="detailProfile('+row.id+')" style="cursor: pointer;"><span class="m-topbar__userpic"><img src="'+appVariables.apiImageUrl+row.profileImage+'" width="40" height="40" alt="" class="m--img-rounded m--marginless m--img-centered"></span><span (click)="detailProfile('+row.id+')" style="cursor: pointer;"  class="teacherFn" data-id="'+row.id+'">   '+row.firstName+' '+row.lastName+'</span></span>';
        //  }else{
        //   return '<span (click)="detailProfile('+row.id+')" style="cursor: pointer;"  class="teacherFn" data-id="'+row.id+'">'+row.firstName+' '+row.lastName+'</span>';
        //  }
         
        // },
      }, {
        field: "className",
        title: "Class-Div",
        template: function (row:any) {
         
          return row.className+'-'+row.divName;
        },
      }, {
        field: "dateOfCertificate",
        title: "Certificate Date",
        template: function (row:any) {
         
          return row.fatherName;
        }
      }, {
        field: "className",
        title: "Actions",
       
        template: function (row:any) {
          return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="'+row.id+'"></i></span>';
          
        }
      }]
    });

    const query = this.datatable.getDataSourceQuery();
  
      
     
    const formSearch = this.elRef.nativeElement.querySelector('#m_form_search');
    const formStatus = this.elRef.nativeElement.querySelector('#m_form_status');
    const formType = this.elRef.nativeElement.querySelector('#m_form_type');
      if(formSearch){
        this.renderer.listen(formSearch, 'keyup', (e) => {
          this.datatable.search(e.target.value.toLowerCase());
        });
      }
   
      if(formStatus){
        this.renderer.listen(formStatus, 'change', (e) => {
          this.datatable.search(e.target.value, 'Status');
        });
      }
  
      if(formType){
        this.renderer.listen(formType, 'change', (e) => {
          this.datatable.search(e.target.value, 'Type');
        });
      }
    
  
    // Assuming selectpicker() is necessary for styling, if it's based on jQuery, you can retain this.
    $(this.elRef.nativeElement.querySelectorAll('#m_form_status, #m_form_type')).selectpicker();
  
    this.renderer.listen(this.elRef.nativeElement.querySelector('.m_datatable'), 'click', (e) => {
      if ((e.target as HTMLElement).classList.contains('edit-button')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        this.getLeavingCertificateData(id);
      }
    });
    }catch(error){
      console.log(error)
    }
    
  }
  
}