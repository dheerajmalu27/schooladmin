import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CommonService } from '../../../../../_services/common-api.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import {BaseService} from '../../../../../_services/base.service';
import { appVariables } from '../../../../../app.constants';
import * as _ from 'lodash';
import { jsPDF } from 'jspdf';

import html2canvas from 'html2canvas';
declare let $: any;
declare var toastr: any;
declare var moment: any;
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
  leavingCertificateStudentData:any={};
  studentData:any=null;
  classData:any =null;
  showTemplate: any;
  selectedFiles:any;
  pdfFileName:any;
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
      'studentId' : new FormControl(),
      'firstName' : new FormControl({value:'',disabled:true}, Validators.required),
      'middleName' : new FormControl({value:'',disabled:true}, Validators.required),
      'lastName' : new FormControl({value:'',disabled:true}, Validators.required),
      'image': new FormControl({value:'',disabled:true}),
      'dateOfBirth' : new FormControl({value:'',disabled:true}),
      'className' : new FormControl({value:'',disabled:true}),
      'divName' : new FormControl({value:'',disabled:true}),
      'nationality': new FormControl({value:'',disabled:true}, Validators.required),
      'caste': new FormControl({value:'',disabled:true}, Validators.required),
      'religion': new FormControl({value:'',disabled:true}, Validators.required),
      'address': new FormControl({value:'',disabled:true}, Validators.required),
      'bloodGroup': new FormControl({value:'',disabled:true}),
      'gender' : new FormControl({value:'',disabled:true}, Validators.required),
      'motherName' : new FormControl({value:'',disabled:true}, Validators.required),
      'stateId' : new FormControl({value:'',disabled:true}),
      'cityId' : new FormControl({value:'',disabled:true}),
      'motherProf' : new FormControl({value:'',disabled:true}, Validators.required),
      'parentNumber' : new FormControl({value:'',disabled:true}, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(12),
      ]),
       'fatherName' : new FormControl({value:'',disabled:true}, Validators.required),
       'fatherProf' : new FormControl({value:'',disabled:true}, Validators.required),
       'parentNumberSecond' : new FormControl({value:'',disabled:true}, [
        Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(10),
        
      ]),
      'leavingReason': new FormControl(),
      'generalConduct': new FormControl(),
      'dateOfCertificate': new FormControl({value:'',disabled:true}),
      'remark': new FormControl(),
      'otherData': new FormControl(),
      // 'lastName': [null,  Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
    });
    
  
    this.listTemplate();
    }
  listTemplate() {
    $("#addTemplate").hide();
    $("#editTemplate").hide();
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
    $("#editTemplate").show();
    this.addLeavingCertificateForm.setValue({
      id: leavingcertificateData.id,
      studentId: leavingcertificateData.studentId,
      firstName: leavingcertificateData.firstName,
      middleName: leavingcertificateData.middleName,
      lastName: leavingcertificateData.lastName,
      // image: leavingcertificateData.profileImage,
      image: "",
      dateOfBirth: leavingcertificateData.dateOfBirth,
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
      leavingReason: '',
      generalConduct: '',
      dateOfCertificate:moment().format('YYYY-MM-DD HH:mm:ss'),
      remark: '',
      otherData: '',

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
    //  delete(data[0].id);
    data[0].studentId=data[0].id;
    data[0].id='';
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
  public showModelPopup(){
  
    $("#myModel").addClass("modal fade show");
    $("#myModel").show();
    $("#myModel .modal-open").show();
   
  }
  public hideModelPopup(){
    $("#myModel").removeClass("modal fade show");
    $("#myModel").hide();
    $("#myModel .modal-open").hide();
  } 
  public printDiv(divId: string): void {
    const printContents = document.getElementById(divId)?.innerHTML;
    const originalContents = document.body.innerHTML;
  
    document.body.innerHTML = printContents || '';
  
    window.print();
  
    document.body.innerHTML = originalContents;
  }
  public generateFile() {

    const data = document.getElementById('contentData');
    console.log(data);
    
    if (!data) {
      console.error('Element #contentToConvert not found!');
      return; // exit the function if the element wasn't found
    }
    data.style.background = 'white';
  
    // Determine the dimensions of the content
    let contentWidth = data.offsetWidth-650;
    const contentHeight = data.offsetHeight;
  
    // Create a PDF with the same dimensions as the content
    const pdf = new jsPDF('p', 'mm', [contentWidth, contentHeight]);
    // const pdf = new jsPDF('p', 'mm', 'a4');
    // Convert the content to a canvas
    html2canvas(data, { scale: 2, logging: false, }).then((canvas) => {
      const contentDataURL = canvas.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'PNG', 0, 0, contentWidth, contentHeight);
      pdf.save(this.pdfFileName); // Generated PDF
    });
  }
  private getLeavingCertificateData(Id:any) {
    this.showModelPopup();
    this.baseservice.get(<string>('leavingcertificates/'+Id)).subscribe((data:any) => { 
      this.leavingCertificateStudentData=data;
      this.showModelPopup();
      toastr.success('Leaving certificate downloaded successfully...!');
      // this.editTemplate(data.leavingcertificates);
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

  Object.keys(this.addLeavingCertificateForm.controls).forEach(key => {
    const control = this.addLeavingCertificateForm.controls[key];

    // Check if the control is disabled
    if (control.disabled) {
      // Add the key-value pair to the data object
      data[key] = control.value;
    }
  });
    for (const key of Object.keys(data)) {
      formData.append(key, data[key]);
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
this.baseservice.post('leavingcertificates',data).subscribe((data:any) => { 
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
        field: "firstName",
        title: "Student Name",
        template: function (row:any) {
         
          return row.firstName+' '+row.lastName;
        },
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
         
          return row.createdAt;
        }
      }, {
        field: "divName",
        title: "Actions",
        template: function (row:any) {
          return '<span class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill"> <i class="edit-button la la-edit" data-id="'+row.id+'"></i></span><span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill"> <i class="export-pdf fa fa-file-pdf-o" data-id="'+row.id+'"  data-filename="'+row.id+'"></i></span>'; //<span class="btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"><i class="delete-button fa fa-trash-o" data-id="'+row.id+'"></i></span>
          
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
      if ((e.target as HTMLElement).classList.contains('export-pdf')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        console.log('tests')
        this.getLeavingCertificateData(id);
      }
     
    });
    }catch(error){
      console.log(error)
    }
    
  }
  
}