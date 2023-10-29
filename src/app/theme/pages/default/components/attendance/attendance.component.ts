import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef   } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { BaseService } from '../../../../../_services/base.service';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import * as _ from 'lodash';
declare let $: any
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./attendance.html",
  encapsulation: ViewEncapsulation.None,
})
export class AttendanceComponent implements OnInit, AfterViewInit {
  attendancePending: any = null;
  datatable: any ;
  SrNo: any = 1;
  divisionData: any = null;
  classData: any = null;
  addStudentData: any = null;
  editStudentData: any = null;
  showTemplate: any;
  dateOfAttendance: any = null;
  selectedFiles: any;
  addAttenaceFormList: any;
  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService, private baseservice: BaseService
    , private router: Router, public fb: FormBuilder) {

  }
  ngOnInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/datatables/base/html-table.js');

    this.listTemplate();
    this.getAttendanceList();

    this.addAttenaceFormList = this.fb.group({
      'attendanceDate': new FormControl(),
      'classId': new FormControl(),
      'divId': new FormControl(),
    });

  }
  listTemplate() {
    $("#addTemplate").hide();
    $("#editTemplate").hide();
    $("#listTemplate").show();
   
  }
  editTemplate() {
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
   
  }
  addTemplate() {
    $("#addTemplate").show();
    $("#addAttendanceForm1").show();
    $("#addAttendanceForm2").hide();
    $("#editTemplate").hide();
    $("#listTemplate").hide();
    this.getClassList();
    this.getDivisionList();
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

  private getAttendanceData(data:any){
 
    let excludeData  = data.split('*');
  this.getStudentAttendanceList(excludeData);    
    }
    private getStudentAttendanceList(data:any){ 
        this.baseservice.get('getbyrecord?classId=' + data[0] + '&divId=' + data[1]+'&date='+data[2]).subscribe((data:any) => {  
          this.editStudentData = data.attendancestudentList; 
          this.editTemplate();   
        },
          (err) => {
            console.log(err);        
          });
      
    }
  private getAttendanceList() {
    this.baseservice.get('getattendancelist').subscribe((data:any) => {
      this.attendancePending = data;
     
      this.refreshDataTable(data);
    },
      (err) => {
        //  localStorage.clear();
      });

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
  private getClassList() {

    var select2: any;
    var resultArray: Array<any> = [];
    this.baseservice.get('classlist').subscribe((data:any) => {
      this.classData = data.class;
      (<any>$('.class_select2_drop_down')).select2({ data: this.classData });
    },
      (err) => {
        //  localStorage.clear();
      });
  }
  private getDivisionList() {
    var select2: any;
    var resultArray: Array<any> = [];
    this.baseservice.get('divisionlist').subscribe((data:any) => {
      this.divisionData = data.division;
      (<any>$('.division_select2_drop_down')).select2({ data: this.divisionData });
    },
      (err) => {
        //  localStorage.clear();
      });

  }
  addStudentAttenaceSumitForm(data:any){
    
    var newArrData = _.map(data, function(o) {
      o.attendanceResult=JSON.parse(o.attendanceResult);
      return _.omit(o, ['studentName', 'className','divName','rollNo']); });
  
    let postdata=(newArrData);
    console.log(postdata);
    this.baseservice.post('bulkattendance',postdata).subscribe((data:any) => { 
      this.datatable.destroy();
      this.getAttendanceList();
      this.listTemplate();
    },
    (err) => {
     console.log(err);
    //  localStorage.clear();
    });
  }
  editStudentAttenaceSumitForm(data:any){
    
    var newArrData = _.map(data, function(o) {
      o.attendanceResult=JSON.parse(o.attendanceResult);
      return _.omit(o, ['AttendanceStudent', 'AttendanceClass','AttendanceDivision','AttendanceClassTeacher','createdAt','updatedAt']); });
  
    let postdata=JSON.stringify(newArrData);
    this.baseservice.post('bulkattendance',postdata).subscribe((data:any) => { 
      
      this.datatable.destroy();
      this.getAttendanceList();
      this.listTemplate();
    },
    (err) => {
     console.log(err);
    //  localStorage.clear();
    });
  }
  public addAttendanceSubmitForm(data:any){

    data.divId = $('.division_select2_drop_down').val();
    data.classId = $('.class_select2_drop_down').val();
    data.dateOfAttendance = $("#m_datepickerSet").val();
    this.dateOfAttendance= $("#m_datepickerSet").val();
    if (data.dateOfAttendance != '' && data.classId!= '' && data.divId!= '') {
      this.baseservice.get('addattendancestudentlist?classId=' + data.classId + '&divId=' + data.divId+'&date='+data.dateOfAttendance).subscribe((data:any) => {
        $("#addAttendanceForm1").hide();
        $("#addAttendanceForm2").show();
      this.addStudentData = data;
        // this.listTemplate();
      },
        (err) => {
          console.log(err);
          //  localStorage.clear();
        });

    }

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
        cookie:false,
        webstorage:false
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
      columns: [ {
        field: "srNo",
        title: "Sr.No.",
      }, {
        field: "className",
        title: "Class-Div",
        template: function (row:any) {

          return row.className + '-' + row.divName;
        },
      },
       {
        field: "teacherName",
        title: "Class Teacher",
        template: (row: any) => {
          return `<span  style="cursor: pointer;" class="teacherFn" data-id="${row.teacherId}">${row.teacherName}</span>`;
        }

      }, {
        field: "selectedDate",
        title: "Date",

      }, {
        field: "totalPresent",
        title: "Status",
        template: function (row:any) {
          return row.totalPresent.toString() + "/" + row.total.toString();

        },
      }, {
        field: "id",
        title: "Action",

        template: function (row:any) {
          return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.classId + '*'+row.divId+'*'+row.selectedDate+'"></i></span>';

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
        this.getAttendanceData(id);
      }
      if ((e.target as HTMLElement).classList.contains('teacherFn')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        this.router.navigate(['/teacher/profile/', id]);
        }
    });
    
    // $(".reload").on('click', function(){

    //   this.datatable.reload();
    // });
  }
  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/datatables/base/html-table.js');


  }

}
