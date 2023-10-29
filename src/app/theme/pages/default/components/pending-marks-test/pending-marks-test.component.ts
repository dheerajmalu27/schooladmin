import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {BaseService} from '../../../../../_services/base.service';
import { CommonService } from '../../../../../_services/common-api.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
declare let $: any
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./pending-marks-test.html",
  encapsulation: ViewEncapsulation.None,
})
export class PendingMarksTestComponent implements OnInit, AfterViewInit {
  studentData: any = null;
  isValid = false;
  datatable:any=null;
  addStudentData:any=null;
  divisionData:any=null;
  classData:any =null;
  showTemplate: any;
  studentDetail:any;
   addStudentForm : any;
   editStudentForm : any;
  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,
private commonservice: CommonService,private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router,public fb: FormBuilder) {
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
      // console.log(this.addStudentForm);
    });

   
        
   

  }
  public editTemplate() {
    this.isValid=true;
    console.log('dada')
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
    this.commonservice.tableToExcel(table,"Pending-Marks-Test-List");
  }
  ngAfterViewInit() {
    
    
  }

  private getTestMarksStudentData(data:any){
 
    let excludeData  = data.split('*');
  this.getStudentTestMarksList(excludeData);    
    }
    private getStudentTestMarksList(data:any){ 
    
      if (data[0] != '' && data[1]!= '' && data[2]!= '' && data[3]!='') {
        this.baseservice.get('getaddtestmarkstudentlist?classId=' + data[0] + '&divId=' + data[1]+'&testId='+data[2]+'&subId='+data[3]).subscribe((data:any) => {
          $("#addTestmarksForm1").hide();
          $("#addTestmarksForm2").show();
         
        this.addStudentData = data;
        this.addTemplate();   
        },
          (err) => {
            console.log(err);
            //  localStorage.clear();
          });
  
      }
    
  }
  setMarksVal(data:any,maxvalue:any){
    if(data.value>maxvalue){
      data.value=0;
    }
  }
  addStudentTestmarksSumitForm(data:any){
    console.log(data);
    var newArrData = _.map(data, function(o) {
      // o.TestmarksResult=JSON.parse(o.TestmarksResult);
      return _.omit(o, ['studentName', 'className','divName','rollNo','subName','teacherName']); });
    
     let postdata=(newArrData);
    this.baseservice.post('bulktestmarks',postdata).subscribe((data:any) => { 
      this.datatable.destroy();
      this.getAbsentStudentList();
      this.listTemplate();
    },
    (err) => {
     console.log(err);
    //  localStorage.clear();
    });
  }
  private getAbsentStudentList() {
    this.baseservice.get('gettestmarkspendinglist').subscribe((data:any) => {
      this.studentData = data;
        this.showtablerecord(data);
    },
    (err) => {
    //  localStorage.clear();
    });
  }
  setTotalVal(event: any): void {
    const value = event.target instanceof HTMLInputElement ? event.target.value : '';
      $('.totalmarksval').val(value); 
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
      }, {
        field: "testName",
        title: "Test Name",
      }, {
        field: "className",
        title: "Class-Div",
        template: function (row:any) {
          return row.className+'-'+row.divName;
        },
      }, {
        field: "subName",
        title: "Subject Name",
      }, {
        field: "teacherName",
        title: "Teacher Name",  
      },
       {
        field: "subId",
        title: "Actions",
        template: function (row:any) {
          return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="'+row.classId+ '*'+row.divisionId+'*'+row.testId+'*'+row.subjectId+'"></i></span>';
         
         
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
  
    // $('.m_datatable').on('click', '.teacherFn', (e) => {
    //   e.preventDefault();
    //   var id = $(e.target).attr('data-id');
     
    //   this.router.navigate(['/student/profile/', id]); 
    //   });
    //  $('.m_datatable').on('click', '.edit-button', (e) => {
    //   e.preventDefault();
    //   var id = $(e.target).attr('data-id');
    //   this.getTestMarksStudentData(id);
    //   //this.router.navigate(['/student/profile/', id]); 
    //   });

    this.renderer.listen(this.elRef.nativeElement.querySelector('.m_datatable'), 'click', (e) => {
      if ((e.target as HTMLElement).classList.contains('edit-button')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        this.getTestMarksStudentData(id);
      }
    });
  }
}