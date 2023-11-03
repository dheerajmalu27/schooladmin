import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef  } from '@angular/core';
import { CommonService } from '../../../../../_services/common-api.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { BaseService } from '../../../../../_services/base.service';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
declare var toastr: any;
// import { BOOL_TYPE } from '@angular/compiler/src/output/output_ast';
declare let $: any
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./pending-attendance-record.html",
  encapsulation: ViewEncapsulation.None,
})
export class PendingAttendanceRecordComponent implements OnInit, AfterViewInit {
  attendancePending: any = null;
  SrNo: any = 1;
  datatable: any ;
  divisionData: any = null;
  classData: any = null;
  studentData: any = null;
  showTemplate: any;
  dateOfAttendance: any = null;
  selectedFiles: any;
  addAttenaceFormList: any;
  constructor(private commonservice: CommonService,private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService, private baseservice: BaseService
    , private router: Router, public fb: FormBuilder) {

  }
  ngOnInit() {
   
    this.listTemplate();
    
  }
  listTemplate() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    'assets/demo/default/custom/components/datatables/base/html-table.js');
    $("#addTemplate").hide();
    $("#editTemplate").hide();
    $("#listTemplate").show();
    this.getAttendancePendingList();
  }
  addTemplate() {
    $("#addTemplate").show();
    $("#editTemplate").hide();
    $("#listTemplate").hide();
    
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js');
    $('#m_datepickerSet').datepicker({
      format: "yyyy-mm-dd",
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>'
      }
    });
    $('#m_datepickerSet').on('change', function () {
    });
  }
  
  private getAttendancePendingList() {
    this.baseservice.get('pendingattendance').subscribe((data:any) => {
      this.attendancePending = data;
     
      this.showtablerecord(data);
    },
    (err) => {
      
    //  localStorage.clear();
    });
  }
  private getAttendanceData(attendanceId:any){
 
  let excludeProjects = [Number(attendanceId)];
  let pendingattendanceData=_.filter(this.attendancePending, (v) => _.includes(excludeProjects, v.row_number));
  if(pendingattendanceData.length>0){
  this.addAttendanceSubmitForm(pendingattendanceData[0]);
  this.addTemplate();
  }
  }

  public addAttendanceSubmitForm(data:any){
   
    if (data.selectedDate != '' && data.classId!= '' && data.divId!= '') {
      this.baseservice.get('addattendancestudentlist?classId=' + data.classId + '&divId=' + data.divId+'&date='+data.selectedDate).subscribe((data:any) => {  
        this.studentData = data;    
      },
        (err) => {
          console.log(err);  
          toastr.error('Something went wrong...!');      
        });
    }
  }

  addStudentAttenaceSumitForm(data:any){
    
    var newArrData = _.map(data, function(o) {
      o.attendanceResult=JSON.parse(o.attendanceResult);
      return _.omit(o, ['studentName', 'className','divName','rollNo']); });
  
    let postdata=JSON.stringify(newArrData);
    this.baseservice.post('bulkattendance',postdata).subscribe((data:any) => { 
      this.datatable.destroy();
      this.listTemplate();
      toastr.success('Record has been added/updated successfully...!');
    },
    (err) => {
     console.log(err);
     toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }

  public showtablerecord(data: any): void {
    let i = 1;
    data.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    }); 
    this.datatable = $('.m_datatable').mDatatable({
      data: {
        type: 'local',
        source: data,
        pageSize: 10,
      },
      layout: {
        theme: 'default',
        class: '',
        scroll: false,
        height: 450,
        footer: false,
      },
      sortable: true,
      pagination: true,
      columns: [
        {
          field: "srNo",
          title: "Sr.No.",
        },
        {
          field: 'className',
          title: 'Class-Div',
          template: (row: any) => {
            return row.className + '-' + row.divName;
          },
        },
        {
          field: 'teacherName',
          title: 'Class Teacher',
          template: (row: any) => {
            return `<span  style="cursor: pointer;" class="teacherFn" data-id="${row.teacherId}">${row.teacherName}</span>`;
          }
  
        },
        {
          field: 'selectedDate',
          title: 'Date',
        },
        {
          field: 'active',
          title: 'Status',
          template: (row: any) => {
            return '<span class="m-badge m-badge-brand m-badge-wide"> Pending </span>';
          },
        },
        {
          field: 'id',
          title: 'Action',
          template: (row: any) => {
            return `<span class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" (click)="editAttendance(${row.row_number})"><i class="edit-button la la-edit" data-id="${row.row_number}"></i></span>`;
          },
        },
      ],
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
  
    this.renderer.listen(this.elRef.nativeElement.querySelector('.m_datatable'), 'click', (e) => {
      if ((e.target as HTMLElement).classList.contains('edit-button')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        this.getAttendanceData(id);
      }
      if ((e.target as HTMLElement).classList.contains('teacherFn')) {
                   e.preventDefault();
                   const id = (e.target as HTMLElement).getAttribute('data-id');
            this.router.navigate(['/teacher/profile/', id]);
      }
    });

    // Avoid using jQuery for event handling
    // Use Angular for event binding
  }

  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/datatables/base/html-table.js');


  }
  tableToExcel(table:any){
    this.commonservice.tableToExcel(table,'Pending Attendance List');
                 }
}
