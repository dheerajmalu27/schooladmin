import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef   } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import {BaseService} from '../../../../../_services/base.service';
import { Router } from '@angular/router';
declare let $: any
declare var toastr: any;
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./class.html",
  encapsulation: ViewEncapsulation.None,
})
export class ClassComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  classData:any;
  datatable: any ;
  addClassForm : FormGroup;
  editClassForm : FormGroup;

  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService
    , private router: Router,fb: FormBuilder){
    this.getClassList();
    this.addClassForm = fb.group({
      'className' : [null, Validators.required],
      
    });
    this.editClassForm = fb.group({
      'id' : [null, Validators.required], 
      'className' : [null, Validators.required],
     
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
  editTemplate() {
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
    
    // this.studentDetail = studentData;
    
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
  addClassSubmitForm(data: any){
    this.baseservice.post('class',data).subscribe((result:any) => { 
     
      this.getClassList();
      this.listTemplate();
      toastr.success('Record has been added/updated successfully...!');
    },
    (err) => {
      toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }
  editClassSubmitForm(data: any){
    
    this.baseservice.put('class/'+data.id,data).subscribe((result:any) => { 
      
      this.getClassList();
      this.listTemplate();
    },
    (err) => {
    
    //  localStorage.clear();
    });
  }
  private getClassList() {
    this.baseservice.get('class').subscribe((data:any) => {
      this.classData = data.class;
      this.refreshDataTable(data);
    },
    (err) => {
    //  localStorage.clear();
    });
  }
  private editClassData(data:any){
    let excludeData  = data.split('*');
   
    this.editClassForm.controls['id'].setValue(excludeData[0]);
    this.editClassForm.controls['className'].setValue(excludeData[1]);
    this.editTemplate();
  }
  showtablerecord(data:any) {
    data.class.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    });
    this.datatable = $(this.elRef.nativeElement.querySelector('.m_datatable')).mDatatable({
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
        field: "className",
        title: "Class Name",
        template: function (row:any) {
        
          return row.className;
        },
      }, {
        field: "active",
        title: "Status",
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
          return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.id + '*'+row.className+'"></i></span>';
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
        this.editClassData(id);
      }
    });
  }
}
