import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef   } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import {BaseService} from '../../../../../_services/base.service';
import { Router } from '@angular/router';
declare let $: any
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./division.html",
  encapsulation: ViewEncapsulation.None,
})
export class DivisionComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  divisionData:any;
  datatable: any ;
  addDivisionForm : FormGroup;
  editDivisionForm : FormGroup;

  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router,fb: FormBuilder){
    this.getDivisionList();
    this.addDivisionForm = fb.group({
      'divName' : [null, Validators.required],
    });
    this.editDivisionForm = fb.group({
      'id' : [null, Validators.required], 
      'divName' : [null, Validators.required],
     
    });
   
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
    
  
    
  }
  addDivisionSubmitForm(data: any){
    this.baseservice.post('division',data).subscribe((result:any) => { 
      this.datatable.destroy();
      this.getDivisionList();
      this.listTemplate();
    },
    (err) => { 
    //  localStorage.clear();
    });
  }
  editDivisionSubmitForm(data: any){
    this.baseservice.put('division/'+data.id,data).subscribe((result:any) => { 
      this.datatable.destroy();
      this.getDivisionList();
      this.listTemplate();
    },
    (err) => {
    
    //  localStorage.clear();
    });
  }
  private editDivisionData(data:any){
    let excludeData  = data.split('*');
   
    this.editDivisionForm.controls['id'].setValue(excludeData[0]);
    this.editDivisionForm.controls['divName'].setValue(excludeData[1]);
    this.editTemplate();
  }
  private getDivisionList() {
    this.baseservice.get('division').subscribe((data:any) => {
      this.divisionData = data.division;
      this.showtablerecord(data);
    },
    (err) => {
    //  localStorage.clear();
    });
  }
 

  showtablerecord(data:any) {
    this.datatable = $(this.elRef.nativeElement.querySelector('.m_datatable')).mDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: data.division,
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
        field: "id",
        title: "Sr.No.",
        
      }, {
        field: "divName",
        title: "Division Name",
        
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
          return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.id + '*'+row.divName+'"></i></span>';
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
        this.editDivisionData(id);
      }
    });
  }
}
