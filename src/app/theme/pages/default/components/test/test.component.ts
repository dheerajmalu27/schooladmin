import { Component, OnInit, ViewEncapsulation, ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { BaseService } from '../../../../../_services/base.service';

declare let $: any;

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./test.html",
  encapsulation: ViewEncapsulation.None,
})
export class TestComponent implements OnInit, AfterViewInit {
  showTemplate: any;
  testData: any;
  datatable: any;
  addTestForm: FormGroup;
  editTestForm: FormGroup;

  constructor(
    private _script: ScriptLoaderService,
    private baseservice: BaseService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.getTestList();
    this.addTestForm = this.fb.group({
      'testName': [null, Validators.required],
    });
    this.editTestForm = this.fb.group({
      'id': [null, Validators.required],
      'testName': [null, Validators.required],
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

  editTemplate(testData:any) {
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
  }

  private editTestData(data:any){
    let excludeData = data.split('*');
    this.editTestForm.controls['id'].setValue(excludeData[0]);
    this.editTestForm.controls['testName'].setValue(excludeData[1]);
    this.editTemplate(data);
  }

  addTestSubmitForm(data: any) {
    this.baseservice.post('test', data).subscribe((result:any) => {
      this.datatable.destroy();
      this.getTestList();
      this.listTemplate();
    }, (err) => {
      // localStorage.clear();
    });
  }

  editTestSubmitForm(data: any) {
    this.baseservice.put('test/' + data.id, data).subscribe((result:any) => {
      this.datatable.destroy();
      this.getTestList();
      this.listTemplate();
    }, (err) => {
      // localStorage.clear();
    });
  }

  private getTestList() {
    this.baseservice.get('test').subscribe((data: any) => {
      this.testData = data.test;
      this.showtablerecord(data);
    }, (err) => {
      // localStorage.clear();
    });
}
  
public showtablerecord(data: any) {
  console.log(data.test);    
  let iValue = 0;

  // Assume you still use jQuery-based datatable for now
  this.datatable = $(this.elRef.nativeElement.querySelector('.m_datatable')).mDatatable({
        
    data: {
      type: 'local',
      source: data.test,
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
    columns: [{
      field: "id",
      title: "Sr.No.",
      template: function () {
       return iValue=iValue+1;
     }
    }, {
      field: "testName",
      title: "Test Name",
      
    }, {
      field: "active",
      title: "Status",
      // callback function support for column rendering
      template: (row: any) => {
        const status: { [key: string]: { title: string, class: string } } = {
          'true': { title: 'Active', class: 'm-badge--success' },
          'false': { title: 'Inactive', class: 'm-badge--danger' }
        };
        
        // Check if the row.active value exists in the status object, if not, default to the inactive status.
        const currentStatus = status[row.active.toString()] || status['false'];
        
        return `<span class="m-badge ${currentStatus.class} m-badge--wide">${currentStatus.title}</span>`;
      }  
    }, {
      field: "createdAt",
      width: 110,
      title: "Actions",
      sortable: false,
      overflow: 'visible',
      template: function (row:any) {
       return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.id + '*'+row.testName+'"></i></span>';
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

  // For the .edit-button, continue using jQuery since it's tied to your jQuery-based plugin:
  $(this.elRef.nativeElement.querySelector('.m_datatable')).on('click', '.edit-button', (e:any) => {
    e.preventDefault();
    const id = e.target.getAttribute('data-id');
    this.editTestData(id);
  });
}

}
