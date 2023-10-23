import { Component,Renderer2,ElementRef, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';

import {BaseService} from '../../../../../_services/base.service';
import { Router } from '@angular/router';
declare let $: any

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./dashboard.html",
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  dashboardData:any=null;
  datatable: any ;
  datatable1: any ;

  constructor(private renderer: Renderer2, 
    private elRef: ElementRef, private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router) {
    this.getDashboardData();
  }
  ngOnInit() {

  }
  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/datatables/base/html-table.js');

    
  }

  private getDashboardData() {
    this.baseservice.get('dashboard').subscribe(
      (data: any) => {
        this.dashboardData = data.dashboarddata[0];
        this.showpendingattendancelist(data.todayattendancependinglist);
        this.showabsentstudentlist(data.todayabsentstudentlist);
      },
      (err) => {
        // Handle the error here, or clear localStorage as needed.
      }
    );
  }
  public showpendingattendancelist(data: any) {
    let i = 1;

    // Assuming you've set up the datatable correctly
    this.datatable = $(this.elRef.nativeElement.querySelector('.m_datatable')).mDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: data,
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
      columns: [{
        field: "",
        title: "Sr.No.",
        textAlign: 'center',
        sortable:false,
        template: function (row:any) {
          return i++;
        },
      }, {
        field: "className",
        title: "Class-Div",
        template: function (row:any) {
         
          return row.className+'-'+row.divName;
        },
      }, {
        field: "teacherName",
        title: "Class Teacher",
        
      }, {
        field: "selectedDate",
        title: "Date",
        
      }, {
        field: "active",
        title: "Status",
        template: function (row:any) {
          return '<span class="m-badge m-badge–brand m-badge–wide"> Pending </span>';
         
        },
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
    //... Other event bindings using the same approach as above ...

    $(this.elRef.nativeElement.querySelector('.m_datatable')).on('click', '.edit-button', (e:any) => {
      e.preventDefault();
      const id = $(e.target).attr('data-id');
    //  this.getAttendanceData(id);
    });
}
  
public showabsentstudentlist(data: any) {
  let i = 1;

  // Assuming you've set up the datatable correctly
  this.datatable = $(this.elRef.nativeElement.querySelector('.m_datatable')).mDatatable({
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
  //... Other event bindings using the same approach as above ...

  $(this.elRef.nativeElement.querySelector('.m_datatable')).on('click', '.edit-button', (e:any) => {
    e.preventDefault();
    const id = $(e.target).attr('data-id');
  //  this.getAttendanceData(id);
  });
  // $('.m_datatable').on('click', '.teacherFn', (e) => {
  //   e.preventDefault();
  //   var id = $(e.target).attr('data-id');
   
  //   this.router.navigate(['/student/profile/', id]); 
  //   });
  //  $('.m_datatable').on('click', '.edit-button', (e) => {
  //   e.preventDefault();
  //   var id = $(e.target).attr('data-id');
  
  //   //this.router.navigate(['/student/profile/', id]); 
  //   });
}


}
