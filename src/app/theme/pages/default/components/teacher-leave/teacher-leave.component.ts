import { Component, OnInit, ViewEncapsulation,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
declare let $: any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./teacher-leave.html",
  encapsulation: ViewEncapsulation.None,
})
export class TeacherLeaveComponent implements OnInit, AfterViewInit {
  showTemplate: any;
  subjectData: any;
  datatable: any;
  addTeacherLeaveForm: FormGroup;
  editTeacherLeaveForm: FormGroup;
  // _script: ScriptLoaderService
  constructor(
    private elRef: ElementRef, 
    private renderer: Renderer2,
    private _script: ScriptLoaderService,
    private http: HttpClient,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.getSubjectList();
    this.addTeacherLeaveForm = this.fb.group({
      'subjectName': [null, Validators.required]
    });
    this.editTeacherLeaveForm = this.fb.group({
      'subjectName': [null, Validators.required]
    });
  }

  ngOnInit() {
    this.listTemplate();
  }

  ngAfterViewInit() {
    this.listTemplate();
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    'assets/demo/default/custom/components/forms/widgets/select2.js');
  this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
    
    // this._script.loadScript('.m-grid__item.m-grid__item--fluid.m-wrapper',
    //   ['assets/demo/default/custom/components/forms/widgets/select2.js',
    //   'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js'], true);
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
  }

  editTemplate(subjectData:any) {
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
  }

  addSubjectSubmitForm(value: any) {
    console.log(value);
  }

  editSubjectSubmitForm(value: any) {
    console.log(value);
  }

  private getSubjectList() {
    const authToken = localStorage.getItem('sauAuth');

    if (!authToken) {
      // Handle the case where the token is not available
      // You can throw an error, redirect the user, etc.
      throw new Error("Authorization token not found");
    }
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'authorization': authToken
    });
    
    this.http.get<{ subject: any }>('http://localhost:3000/api/subject', { headers })
      .subscribe(data => {
        this.subjectData = data.subject;
        this.showtablerecord(data);
      }, error => {
        localStorage.clear();
      });
  }

  public showtablerecord(data: any) {
    data.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    }); 
    this.datatable =  $('.m_datatable').mDatatable({
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
      columns: [ {
        field: "srNo",
        title: "Sr.No.",
      }, {
        field: "subName",
        title: "Teacher Name",
        
      },{
       field: "id",
       title: "Total Leave",
       
     },{
       field: "id",
       title: "Remaining Leave",
       
     },{
       field: "id",
       title: "Leave Dates",
       
     },
      {
        field: "active",
        title: "Status",
        // callback function support for column rendering
        template: function (row: { active: boolean }) {
          if(row.active) {
              return '<span class="m-badge m-badge--success m-badge--wide">Active</span>';
          } else {
              return '<span class="m-badge m-badge--danger m-badge--wide">Inactive</span>';
          }
        }      
      }, {
        field: "createdAt",
        width: 110,
        title: "Actions",
        sortable: false,
        overflow: 'visible',
        template: function (row:any) {
          var dropup = (row.getDatatable().getPageSize() - row.getIndex()) <= 4 ? 'dropup' : '';

          return '\
            <div class="dropdown ' + dropup + '">\
              <a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
                                <i class="la la-ellipsis-h"></i>\
                            </a>\
                <div class="dropdown-menu dropdown-menu-right">\
                  <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
                  <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
                  <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
                </div>\
            </div>\
            <a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="View ">\
                            <i class="la la-edit"></i>\
                        </a>\
          ';
        }
      }]
    });

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

    // The selectpicker seems to be a Bootstrap thing; you might need a separate approach or use a native Angular solution
    $(this.elRef.nativeElement.querySelectorAll('#m_form_status, #m_form_type')).selectpicker();
  }
  // public showtablerecord(data:any){
   
     
                 
  //      var datatable = $('.m_datatable').mDatatable({
        
  //        data: {
  //          type: 'local',
  //          source: data.subject,
  //          pageSize: 10
  //        },
   
  //        // layout definition
  //        layout: {
  //          theme: 'default', // datatable theme
  //          class: '', // custom wrapper class
  //          scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
  //          height: 450, // datatable's body's fixed height
  //          footer: false // display/hide footer
  //        },
   
  //        // column sorting
  //        sortable: true,
   
  //        pagination: true,
   
  //        // inline and bactch editing(cooming soon)
  //        // editable: false,
   
  //        // columns definition
  //        columns: [{
  //          field: "id",
  //          title: "Sr.No.",
           
  //        }, {
  //          field: "subName",
  //          title: "Teacher Name",
           
  //        },{
  //         field: "id",
  //         title: "Total Leave",
          
  //       },{
  //         field: "id",
  //         title: "Remaining Leave",
          
  //       },{
  //         field: "id",
  //         title: "Leave Dates",
          
  //       },
  //        {
  //          field: "active",
  //          title: "Status",
  //          // callback function support for column rendering
  //          template: function (row:any) {
  //            var status = {
  //              true: {'title': 'Active', 'class': ' m-badge--success'},
  //              false: {'title': 'Inactive', 'class': ' m-badge--danger'}
               
  //            };
  //            return '<span class="m-badge ' + status[row.active].class + ' m-badge--wide">' + status[row.active].title + '</span>';
  //          }
  //        }, {
  //          field: "createdAt",
  //          width: 110,
  //          title: "Actions",
  //          sortable: false,
  //          overflow: 'visible',
  //          template: function (row:any) {
  //            var dropup = (row.getDatatable().getPageSize() - row.getIndex()) <= 4 ? 'dropup' : '';
   
  //            return '\
  //              <div class="dropdown ' + dropup + '">\
  //                <a href="#" class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" data-toggle="dropdown">\
  //                                  <i class="la la-ellipsis-h"></i>\
  //                              </a>\
  //                  <div class="dropdown-menu dropdown-menu-right">\
  //                    <a class="dropdown-item" href="#"><i class="la la-edit"></i> Edit Details</a>\
  //                    <a class="dropdown-item" href="#"><i class="la la-leaf"></i> Update Status</a>\
  //                    <a class="dropdown-item" href="#"><i class="la la-print"></i> Generate Report</a>\
  //                  </div>\
  //              </div>\
  //              <a href="#" class="m-portlet__nav-link btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" title="View ">\
  //                              <i class="la la-edit"></i>\
  //                          </a>\
  //            ';
  //          }
  //        }]
  //      });
   
  //      var query = datatable.getDataSourceQuery();
   
  //      $('#m_form_search').on('keyup', function (e) {
  //        datatable.search($(this).val().toLowerCase());
  //      }).val(query.generalSearch);
   
  //      $('#m_form_status').on('change', function () {
  //        datatable.search($(this).val(), 'Status');
  //      }).val(typeof query.Status !== 'undefined' ? query.Status : '');
   
  //      $('#m_form_type').on('change', function () {
  //        datatable.search($(this).val(), 'Type');
  //      }).val(typeof query.Type !== 'undefined' ? query.Type : '');
   
  //      $('#m_form_status, #m_form_type').selectpicker();
      
  //  }
}
