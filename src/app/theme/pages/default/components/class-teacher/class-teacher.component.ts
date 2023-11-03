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
  templateUrl: "./class-teacher.html",
  encapsulation: ViewEncapsulation.None,
})
export class ClassTeacherComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  classteacherData:any;
  datatable:any;
  divisionData:any;
  classData:any;
  teacherData:any;
  addClassTeacherForm : any;
  editClassteacherForm : any;

  constructor(private elRef: ElementRef, private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router,fb: FormBuilder){
    this.getClassTeacherList();
    this.addClassTeacherForm = fb.group({
      
      'divId' : [ Validators.required],
      'classId' : [ Validators.required],
      'teacherId' : [Validators.required],
      
    });
    this.editClassteacherForm = fb.group({
      'id' : [Validators.required], 
      'divId' : [ Validators.required],
      'classId' : [ Validators.required],
      'teacherId' : [Validators.required],
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
    this.getClassList();
    this.getDivisionList();
    this.getTeacherList();

    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    'assets/demo/default/custom/components/forms/widgets/select2.js');
  

  }
  editTemplate() {
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide(); 
    this.getClassList();
    this.getDivisionList();
    this.getTeacherList();
  
  }
  private getClassList() {
    this.baseservice.get('classlist').subscribe((data:any) => {
         this.classData = data.class;
         (<any>$('.class_select2_drop_down')).select2({ data: this.classData });
         (<any>$('.editclass_select2_drop_down')).select2({ data: this.classData });
       },
         (err) => {
           //  localStorage.clear();
         });
     }
     private getDivisionList() {
       this.baseservice.get('divisionlist').subscribe((data:any) => {
         this.divisionData = data.division;
         (<any>$('.division_select2_drop_down')).select2({ data: this.divisionData });
         (<any>$('.editdivision_select2_drop_down')).select2({ data: this.divisionData });
        
       },
         (err) => {
           //  localStorage.clear();
         });
   
     }
     private getTeacherList() {
      this.baseservice.get('teacherlist').subscribe((data:any) => {
        this.teacherData = data.teacher;
        (<any>$('.teacher_select2_drop_down')).select2({ data: this.teacherData });
        (<any>$('.editteacher_select2_drop_down')).select2({ data: this.teacherData });
      },
        (err) => {
          //  localStorage.clear();
        });
  
    }
  private editClassTeacherData(data:any){
    this.editTemplate();
    let excludeData  = data.split('*');
  
    setTimeout(() => 
    {
      $(".editclass_select2_drop_down").val(<string>excludeData[0]).trigger('change');
      $(".editclass_select2_drop_down").attr("disabled", "disabled");
    $(".editdivision_select2_drop_down").val(<string>excludeData[1]).trigger('change');
    $(".editdivision_select2_drop_down").attr("disabled", "disabled");
    $(".editteacher_select2_drop_down").val(<string>excludeData[2]).trigger('change');
    if(excludeData[3]!='null' && excludeData[3]){
      $('#classteacherId').val(excludeData[3]);
    }
    },
    1000);
   
   
  }
  addClassTeacherSubmitForm(data: any){
    console.log(data);

    data.divId = $('.division_select2_drop_down').val();
    data.classId = $('.class_select2_drop_down').val();
    data.classId = $('.class_select2_drop_down').val();
   
    data.teacherId = $('.teacher_select2_drop_down').val();
     if (data.classId!= '' && data.divId!= '' && data.teacherId!= '') {
      this.baseservice.post('updateclassteacher',data).subscribe((result:any) => { 
        this.datatable.destroy();
        this.getClassTeacherList();
        this.listTemplate();
        toastr.success('Record has been added successfully...!');
      },
      (err) => { 
      //  localStorage.clear();
      });
    }
   
  }
  editClassteacherSubmitForm(data: any){
    data.divId = $('.editdivision_select2_drop_down').val();
    data.classId = $('.editclass_select2_drop_down').val();

    data.teacherId = $('.editteacher_select2_drop_down').val();
    if($('#classteacherId').val()){
      data.id = $('#classteacherId').val();
    }
    if(data.id==null){
      delete data.id;
    }
    if (data.classId!= '' && data.divId!= '' &&  data.teacherId!= '') {
    this.baseservice.post('updateclassteacher',data).subscribe((result:any) => { 
     
      this.datatable.destroy();
      this.getClassTeacherList();
      this.listTemplate();
      toastr.info('Record has been updated successfully...!');
    },
    (err) => {
    
    //  localStorage.clear();
    });
  }
  }
private getClassTeacherList() {
    this.baseservice.get('classteacher').subscribe((data: any) => {
      console.log(data);
        this.classteacherData = data.classteacher;
        this.showtablerecord(data);
    },
    (err) => {
        // Handle the error here. You might want to do something more than just clearing local storage.
        // localStorage.clear();
    });
}


showtablerecord(data:any) {
  console.log(data);
  data.classteacher.forEach((item:any, index:any) => {
    item.srNo = index + 1;
  }); 
  this.datatable = $('.m_datatable').mDatatable({
    data: {
      type: 'local',
      source: data.classteacher,
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
        field: 'className',
        title: 'Class-Div',
        template: function (row:any) {
         
          return row.className+'-'+row.divName;
        },
      },
      {
        field: 'teacherName',
        title: 'Teacher Name',
        template: function (row:any) {
         if(row.teacherName==null){
          return '<span class="m-badge m-badge--danger m-badge--wide"> pending </span>';
         }else{
          return row.teacherName;
         }
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
            <i class="edit-button la la-edit" data-id="${row.classId}*${row.divId}*${row.teacherId}*${row.id}"></i>
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
      this.editClassTeacherData(id);
    }
  });
}

}
