import { Component, OnInit, Renderer2, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {BaseService} from '../../../../../_services/base.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from "../../../../../_services/common-api.service";
declare let $: any
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./today-absent-student.html",
  encapsulation: ViewEncapsulation.None,
})
export class TodayAbsentStudentComponent implements OnInit, AfterViewInit {
  studentData: any = null;
  isValid = false;
  studentEditData:any;
  divisionData:any=null;
  classData:any =null;
  showTemplate: any;
  studentDetail:any;
   addStudentForm : any;
   editStudentForm : any;
  constructor( private renderer: Renderer2, 
    private elRef: ElementRef,private ComService: CommonService, private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router,public fb: FormBuilder) {
    this.getAbsentStudentList();
    
    }
  ngOnInit() {
  
    this.listTemplate();
    }
  listTemplate() {
    $("#addTemplate").hide();
    $("#editTemplate").hide();
    $("#listTemplate").show();
  }
  addTemplate() {
    $("#addTemplate").show();
    $("#editTemplate").hide();
    $("#listTemplate").hide();
    
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
  public editTemplate(studentData:any) {
    this.isValid=true;
  
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
  
      
  }
  // tableToExcel(table){
  //   let uri = 'data:application/vnd.ms-excel;base64,'
  //       , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
  //       , base64 = function(s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
  //       , format = function(s,c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  //           if (!table.nodeType) table = document.getElementById(table)
  //           var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
  //           window.location.href = uri + base64(format(template, ctx))
  //               }
    tableToExcel(table:any){
      this.ComService.tableToExcel(table,'todays-absent-student-list');
      }
  ngAfterViewInit() {
    
    
  }
  private getAbsentStudentList() {
    this.baseservice.get('todayabsentstudent').subscribe((data:any) => {
      this.studentData = data;
      this.showtablerecord(data);
    },
    (err) => {
    //  localStorage.clear();
    });


  }
  
  
  public showtablerecord(data: any) {
    let i = 1;
    
    // Assuming you have datatable correctly set up
    const datatable = $(this.elRef.nativeElement.querySelector('.m_datatable')).mDatatable({
     // datasource definition
     data: {
      type: 'local',
      source: data,
      pageSize: 10,
      i:1
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
    columns: [{
      field: "",
      title: "Sr No",
      textAlign: 'center',
      template: function (row:any) {
        return i++;        
        },
    },{
      
      field: "rollNo",
      title: "Roll No",
     
    }, {
      field: "studentName",
      title: "Student Name",
      template: function (row:any) {
      
        return '<span (click)="detailProfile('+row.studentId+')"  class="teacherFn" data-id="'+row.id+'">'+row.studentName+'</span>';
      },
    }, {
      field: "className",
      title: "Class-Div",
      template: function (row:any) {
        
        return row.className+'-'+row.divName;
      },
    },
     {
      field: "fatherName",
      title: "Father Name ",
      
    }, {
      field: "mobNumber",
      title: "Mob Number",
      
    },
     {
      field: "teacherName",
      title: "Teacher Name",
      
    },
    {
     field: "attendanceDate",
     title: "Attendance Date",
     
   },
     {
      field: "id",
      title: "Actions",

      template: function (row:any) {
        return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="'+row.id+'"></i></span>';
       
       
      }
    }]
    });

    const query = <any>datatable.getDataSourceQuery();

    const searchElem = this.elRef.nativeElement.querySelector('#m_form_search');
    this.renderer.listen(searchElem, 'keyup', (e) => {
        datatable.search(e.target.value.toLowerCase());
    });
    searchElem.value = query.generalSearch;

    const statusElem = this.elRef.nativeElement.querySelector('#m_form_status');
    this.renderer.listen(statusElem, 'change', (e) => {
        datatable.search(e.target.value, 'Status');
    });
    statusElem.value = typeof query.Status !== 'undefined' ? query.Status : '';

    const typeElem = this.elRef.nativeElement.querySelector('#m_form_type');
    this.renderer.listen(typeElem, 'change', (e) => {
        datatable.search(e.target.value, 'Type');
    });
    typeElem.value = typeof query.Type !== 'undefined' ? query.Type : '';

    //... Other event bindings using the same approach ...

    const datatableElem = this.elRef.nativeElement.querySelector('.m_datatable');
    this.renderer.listen(datatableElem, 'click', (e) => {
      if (e.target && e.target.classList.contains('teacherFn')) {
          e.preventDefault();
          const id = e.target.getAttribute('data-id');
          this.router.navigate(['/student/profile/', id]);
      } else if (e.target && e.target.classList.contains('edit-button')) {
          e.preventDefault();
          const id = e.target.getAttribute('data-id');
          // Perform your action for the edit-button
      }
    });
  }
  
}