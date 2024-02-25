import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef   } from '@angular/core';
import { CommonService } from '../../../../../_services/common-api.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {BaseService} from '../../../../../_services/base.service';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';;
declare let $: any
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./student-class-list-report.html",
  encapsulation: ViewEncapsulation.None,
})
export class studentClassListReportComponent implements OnInit, AfterViewInit {
  studentData: any = null;
  isValid = false;
  studentEditData:any;
  StudentClassListData:any;
  divisionData:any=null;
  classData:any =null;
  datatable: any ;
  classStudentReportForm: any;
  dateHeaders:any;
  TableTitle:any
 
  constructor(private commonservice: CommonService,private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService
    , private router: Router,public fb: FormBuilder) {
    // this.getStudentList();
     
    }
  ngOnInit() {
    $("#listTemplate").hide();
    this.classStudentReportForm = this.fb.group({
     
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
    
    $("#listTemplate").hide();
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
  attendanceReportSubmitForm(data: any){
    data.divId = $('.division_select2_drop_down').val();
    data.classId = $('.class_select2_drop_down').val();
   
   if(data.divId!='' && data.classId!='' ){
    this.baseservice.get('getallclassdivisionstudentlist?classId='+data.classId+'&divId='+data.divId).subscribe((data:any) => {

      this.dateHeaders = Object.keys(data.students[0]).filter(key => !['rollNo', 'fullName'].includes(key));

      this.StudentClassListData = data.students;
     this.TableTitle=  'Class-'+$("#select2-m_select2_1-container").text()+' Div-'+  $("#select2-m_select2_2-container").text()+'-Report';
      this.refreshDataTable(data);
      $("#listTemplate").show();
     console.log(this.StudentClassListData)
    },
      (err) => {
        $("#listTemplate").hide();
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
  }
  tableToExcel(table:any){

    let FileName='Student-List-Class'+$('.class_select2_drop_down').val()+'Division-'+ $('.division_select2_drop_down').val();
    this.commonservice.tableToExcel(table,FileName);
  }
  showtablerecord(data:any) {

    const keysFromPosition = Object.keys(data.students[0]);

// Define the keys you want at the beginning
const startingKeys = ['rollNo', 'fullName'];

// Concatenate the starting keys with the remaining keys
const keys = startingKeys.concat(keysFromPosition.filter(key => !startingKeys.includes(key)));

// 'keys' will now contain the desired order of keys
console.log(keys);
const keyObjects = keys.map(key => ({
  field: key,
  title: key,
  template: function (row:any) {
    if (key !== 'rollNo' && key !== 'fullName') {
      if (row[key] === 'P') {
        return '<span class="m-badge m-badge--success m-badge--wide"> ' + row[key] + ' </span>';
      } else if (row[key] === 'A') {
        return '<span class="m-badge m-badge--danger m-badge--wide"> ' + row[key] + ' </span>';
      } else {
        return '<span class="m-badge m-badge--warning m-badge--wide"> ' + row[key] + ' </span>';
      }
    } else {
      // Handle rollNo and fullName differently (if needed)
      return row[key];
    }
  }
}));


let i = 1;
console.log(keyObjects);
    this.datatable = $(this.elRef.nativeElement.querySelector('.m_datatable')).mDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: data.students,
        pageSize: 10
      },

      // layout definition
      layout: {
        theme: 'default', // datatable theme
        class: '', // custom wrapper class
        scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
        height: 450, // datatable's body's fixed height
        footer: false // display/hide footer
      },

      // column sorting
      sortable: true,

      pagination: true,

      // inline and bactch editing(cooming soon)
      // editable: false,

      
      // columns definition
      // columns:keyObjects
      columns: [{
        field: "",
        title: "Sr.No.",
        textAlign: 'center',
        sortable:false,
        template: function (row:any) {
          return i++;
        },
      }, {
        field: "rollNo",
        title: "Roll No",
        },
        {
          field: "fullName",
          title: "Student Name",
          template: function (row:any) {
           if(row.profileImage!=null && row.profileImage!='' && row.profileImage!='null'){
            return '<span (click)="detailProfile('+row.id+')" style="cursor: pointer;"><span class="m-topbar__userpic"><img src="'+environment.apiImageUrl+row.profileImage+'" width="40" height="40" alt="" class="m--img-rounded m--marginless m--img-centered"></span><span (click)="detailProfile('+row.id+')" style="cursor: pointer;"  class="teacherFn" data-id="'+row.id+'">   '+row.fullName+'</span></span>';
           }else{
            return '<span (click)="detailProfile('+row.id+')" style="cursor: pointer;"  class="teacherFn" data-id="'+row.id+'">'+row.fullName+'</span>';
           }
           
          },
      }, {
        field: "id",
        title: "Student Id",
       
      }, {
        field: "className",
        title: "Class Name ",
        
      }, {
        field: "divName",
        title: "Division Name",
       
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
        // this.editDivisionData(id);
      }
    });
    $(this.elRef.nativeElement.querySelector('.m_datatable')).on('click', '.teacherFn', (e:any) => {
      e.preventDefault();
      const id = $(e.target).attr('data-id');
      this.router.navigate(['/student/profile/', id]);
    });
  }
  
}