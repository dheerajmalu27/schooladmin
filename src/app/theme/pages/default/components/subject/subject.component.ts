import { Component, OnInit, ViewEncapsulation, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { HttpClient, HttpHeaders } from "@angular/common/http"; // New HttpClient
import { Router } from '@angular/router';
import { BaseService } from '../../../../../_services/base.service';

declare let $: any;
declare var toastr: any;
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./subject.html",
  encapsulation: ViewEncapsulation.None,
})
export class SubjectComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  subjectData:any;
  datatable:any;
  addSubjectForm : FormGroup;
  editSubjectForm : FormGroup;

  constructor(private elRef: ElementRef, private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router,fb: FormBuilder){
    this.getSubjectList();
    this.addSubjectForm = fb.group({
      'subName' : [null, Validators.required],
      
    });
    this.editSubjectForm = fb.group({
      'id' : [null, Validators.required], 
      'subName' : [null, Validators.required],
     
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
  private editSubjectData(data:any){
    let excludeData  = data.split('*');
   
    this.editSubjectForm.controls['id'].setValue(excludeData[0]);
    this.editSubjectForm.controls['subName'].setValue(excludeData[1]);
    this.editTemplate();
  }
  public refreshDataTable(newData: any): void {
    // Destroy existing datatable
    
      if (this.datatable) {
        this.datatable.destroy();  // Destroy existing datatable instance
        this.showtablerecord(newData); // Reinitialize datatable with new data
    }else{
      this.showtablerecord(newData);
    }
  
    // Show new data in datatable
   
  }
  addSubjectSubmitForm(data: any){
    this.baseservice.post('subject',data).subscribe((result:any) => { 
     
      this.getSubjectList();
      this.listTemplate();
      toastr.success('Record has been added successfully...!');
    },
    (err) => { 
      toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }
  editSubjectSubmitForm(data: any){
    this.baseservice.put('subject/'+data.id,data).subscribe((result:any) => { 
     
      this.getSubjectList();
      this.listTemplate();
      toastr.success('Record has been updated successfully...!');
    },
    (err) => {
      toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }
private getSubjectList() {
    this.baseservice.get('subject').subscribe((data: any) => {
      console.log(data);
        this.subjectData = data.subject;
        this.refreshDataTable(data);
    },
    (err) => {
        // Handle the error here. You might want to do something more than just clearing local storage.
        // localStorage.clear();
    });
}


showtablerecord(data:any) {
  console.log(data);
  data.subject.forEach((item:any, index:any) => {
    item.srNo = index + 1;
  }); 
  this.datatable = $('.m_datatable').mDatatable({
    data: {
      type: 'local',
      source: data.subject,
      pageSize: 10
    },
    layout: {
      theme: 'default',
      class: '',
      scroll: false,
      height: 450,
      footer: false
    },
    sortable: true,
    pagination: true,
    columns: [
      {
        field: "srNo",
        title: "Sr.No.",
      },
      {
        field: 'subName',
        title: 'Subject Name',
        template: function (row:any) {
         
          return row.subName;
        },
      },
      // {
      //   field: 'active',
      //   title: 'Status',
      //   template: (row: any) => {
      //     const status: { [key: string]: { title: string, class: string } } = {
      //       'true': { title: 'Active', class: 'm-badge--success' },
      //       'false': { title: 'Inactive', class: 'm-badge--danger' }
      //     };
          
      //     // Check if the row.active value exists in the status object, if not, default to the inactive status.
      //     const currentStatus = status[row.active.toString()] || status['false'];
          
      //     return `<span class="m-badge ${currentStatus.class} m-badge--wide">${currentStatus.title}</span>`;
      //   }        
      // },
      {
        field: 'createdAt',
        width: 110,
        title: 'Actions',
        sortable: false,
        overflow: 'visible',
        template: (row: any) => {
          return `<span class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill">
            <i class="edit-button la la-edit" data-id="${row.id}*${row.subName}"></i>
          </span>`;
        }
      }
    ]
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
      this.editSubjectData(id);
    }
  });
}

  // public showtablerecord(data:any) {
  //   this.datatable = {
  //     data: {
  //       type: 'local',
  //       source: this.subjects,
  //       pageSize: 10
  //     },
  //     layout: {
  //       theme: 'default',
  //       class: '',
  //       scroll: false,
  //       height: 450,
  //       footer: false
  //     },
  //     sortable: true,
  //     pagination: true,
  //     columns: [
  //       {
  //         field: 'id',
  //         title: 'Sr.No.'
  //       },
  //       {
  //         field: 'subName',
  //         title: 'Subject Name'
  //       },
  //       {
  //         field: 'active',
  //         title: 'Status',
  //         template: (row: any) => {
  //           const status = {
  //             true: { title: 'Active', class: 'm-badge--success' },
  //             false: { title: 'Inactive', class: 'm-badge--danger' }
  //           };
  //           return `<span class="m-badge ${status[row.active].class} m-badge--wide">${status[row.active].title}</span>`;
  //         }
  //       },
  //       {
  //         field: 'createdAt',
  //         width: 110,
  //         title: 'Actions',
  //         sortable: false,
  //         overflow: 'visible',
  //         template: (row: any) => {
  //           return `<span class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill">
  //             <i class="edit-button la la-edit" data-id="${row.id}*${row.subName}"></i>
  //           </span>`;
  //         }
  //       }
  //     ]
  //   };

  //   const query = this.datatable.data;

  //   // Attach event listeners using Angular's Renderer2
  //   const mFormSearch = document.getElementById('m_form_search') as HTMLInputElement;
  //   const mFormStatus = document.getElementById('m_form_status') as HTMLSelectElement;
  //   const mFormType = document.getElementById('m_form_type') as HTMLSelectElement;

  //   mFormSearch.addEventListener('keyup', (event) => {
  //     this.datatable.search((event.target as HTMLInputElement).value.toLowerCase());
  //   });
  //   mFormSearch.value = query.generalSearch || '';

  //   mFormStatus.addEventListener('change', () => {
  //     this.datatable.search(mFormStatus.value, 'Status');
  //   });
  //   mFormStatus.value = query.Status || '';

  //   mFormType.addEventListener('change', () => {
  //     this.datatable.search(mFormType.value, 'Type');
  //   });
  //   mFormType.value = query.Type || '';

  //   // Use Angular's Renderer2 for better event handling
  //   const editButtons = document.querySelectorAll('.edit-button');
  //   editButtons.forEach((button) => {
  //     button.addEventListener('click', (event) => {
  //       event.preventDefault();
  //       const id = event.target.getAttribute('data-id');
  //       this.editSubjectData(id);
  //     });
  //   });
  // }
}
