import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef   } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import {BaseService} from '../../../../../_services/base.service';
import { Router } from '@angular/router';
declare let $: any

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./class-subject-test.html",
  encapsulation: ViewEncapsulation.None,
})
export class classSubjectTestComponent implements OnInit, AfterViewInit {
  datatable:any;
  showTemplate:any;
  classData:any;
  addClassForm : FormGroup;
  editClassForm : FormGroup;

  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService
    , private router: Router,fb: FormBuilder){
    this.getSubjectClassTestList();
    this.addClassForm = fb.group({
      'className' : [null, Validators.required],
      // 'lastName': [null,  Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      // 'gender' : [null, Validators.required],
      // 'hiking' : [false],
      // 'running' : [false],
      // 'swimming' : [false]
    });
    this.editClassForm = fb.group({
      'className' : [null, Validators.required],
      // 'lastName': [null,  Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
      // 'gender' : [null, Validators.required],
      // 'hiking' : [false],
      // 'running' : [false],
      // 'swimming' : [false]
    });
    // console.log(this.addClassForm);
    // this.addClassForm.valueChanges.subscribe( (form: any) => {
    //   console.log('form changed to:', form);
    // }
    // );
  }
  ngOnInit() {
    this.listTemplate();
  }
  ngAfterViewInit() {
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
  }
  editTemplate(studentData:any) {
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
    
    // this.studentDetail = studentData;
    
  }
  addClassSubmitForm(value: any){
    console.log(value);
  }
  editClassSubmitForm(value: any){
    console.log(value);
  }
  private getSubjectClassTestList() {
    this.baseservice.get('class').subscribe((data:any) => {
      this.classData = data.class;
      this.showtablerecord(data);
    },
    (err) => {
    //  localStorage.clear();
    });
  }
  public showtablerecord(data:any){
     // let dataJSONArray = JSON.parse(data.teacher);
     data.class.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    });         
     this.datatable = $('.m_datatable').mDatatable({
        // datasource definition
        data: {
          type: 'local',
          source: data.class,
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
          field: "testName",
          title: "Test Name",
         
        }, {
          field: "className",
          title: "Class-Div",
          template: function (row:any) {
            console.log(row);
            return row.className+'-'+row.divName;
          },
        },  {
          field: "subName",
          title: "Subject Name",
          
        }, {
          field: "teacherName",
          title: "Teacher Name",
          
        }, {
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
  
      $('#m_form_status, #m_form_type').selectpicker();
      // $('.m_datatable').on('click', '.teacherFn', (e) => {
      //   e.preventDefault();
      //   var id = $(e.target).attr('data-id');
       
      //   this.router.navigate(['/student/profile/', id]); 
      //   });
  }
}
