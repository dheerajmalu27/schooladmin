import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef   } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { CommonService } from '../../../../../_services/common-api.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import {BaseService} from '../../../../../_services/base.service';
declare let $: any
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./absent-student.html",
  encapsulation: ViewEncapsulation.None,
})
export class AbsentStudentComponent implements OnInit, AfterViewInit {
  studentData: any = null;
  isValid = false;
  datatable:any;
  studentEditData:any;
  divisionData:any=null;
  classData:any =null;
  showTemplate: any;
  studentDetail:any;
   addStudentForm : any;
   editStudentForm : any;
  constructor(private commonservice: CommonService,private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router,public fb: FormBuilder) {
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
  
  tableToExcel(table:any){
    this.commonservice.tableToExcel(table,"Absent-Student-List");
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
  ngAfterViewInit() {
    
    
  }
  private getAbsentStudentList() {
    this.baseservice.get('absentstudent').subscribe((data:any) => {
      this.studentData = data;
      this.showtablerecord(data);
    },
    (err) => {
    //  localStorage.clear();
    });

  }
  
  

  showtablerecord(data:any) {
    data.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    });      
    this.datatable = $('.m_datatable').mDatatable({
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
      columns: [ {
        field: "srNo",
        title: "Sr.No.",
      },{
        
        field: "rollNo",
        title: "Roll No",
       
      }, {
        field: "studentName",
        title: "Student Name",
        template: function (row:any) {
        
          return '<span style="cursor: pointer;"  class="studentFn" data-id="'+row.id+'">'+row.studentName+'</span>';
        },
      }, {
        field: "className",
        title: "Class-Div",
        template: function (row:any) {
          
          return row.className+'-'+row.divName;
        },
      },
      //  {
      //   field: "fatherName",
      //   title: "Father Name ",
        
      // }, {
      //   field: "mobNumber",
      //   title: "Mob Number",
        
      // },
       {
        field: "teacherName",
        title: "Teacher Name",
        template: (row: any) => {
          return `<span  style="cursor: pointer;" class="teacherFn" data-id="${row.classTeacherId}">${row.teacherName}</span>`;
        }
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
  
    $('.m_datatable').on('click', '.studentFn', (e:any) => {
      e.preventDefault();
      var id = $(e.target).attr('data-id');
     
      this.router.navigate(['/student/profile/', id]); 
      });
      $('.m_datatable').on('click', '.teacherFn', (e:any) => {
        e.preventDefault();
        var id = $(e.target).attr('data-id');
       
        this.router.navigate(['/teacher/profile/', id]);
        });
     $('.m_datatable').on('click', '.edit-button', (e:any) => {
      e.preventDefault();
      var id = $(e.target).attr('data-id');
    
      //this.router.navigate(['/student/profile/', id]); 
      });
    // this.renderer.listen(this.elRef.nativeElement.querySelector('.m_datatable'), 'click', (e) => {
    //   if ((e.target as HTMLElement).classList.contains('edit-button')) {
    //     e.preventDefault();
    //     const id = (e.target as HTMLElement).getAttribute('data-id');
    //     // this.editDivisionData(id);
    //   }
    // });
  }


 
}