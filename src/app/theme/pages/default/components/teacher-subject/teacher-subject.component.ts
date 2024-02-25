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
  templateUrl: "./teacher-subject.html",
  encapsulation: ViewEncapsulation.None,
})
export class TeacherSubjectComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  subjectData:any;
  datatable:any;
  divisionData:any;
  classData:any;
  teacherData:any;
  addTeacherSubjectForm : any;
  editSubjectForm : any;

  constructor(private elRef: ElementRef, private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router,fb: FormBuilder){
    this.getTeacherSubjectList();
    this.addTeacherSubjectForm = fb.group({
      'subId' : [ Validators.required],
      'divId' : [ Validators.required],
      'classId' : [ Validators.required],
      'teacherId' : [Validators.required],
      
    });
    this.editSubjectForm = fb.group({
      'id' : [Validators.required], 
      'subId' : [ Validators.required],
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
    this.getSubjectList();
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
    this.getSubjectList(); 
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
    
    private deleteTeacherSubjectData(id:any){
      const confirmation = window.confirm('Are you sure you want to delete this record?');
    if (!confirmation) {
      return; // Do nothing if the user cancels the confirmation
    }
  
      this.baseservice.delete(<string>('teachersubject/' + id)).subscribe((data: any) => {
        this.getTeacherSubjectList();
          this.listTemplate();
          toastr.success('Record deleted successfully...!');
      },
        (err) => {
          toastr.error('Something went wrong...!');
        });
  
    }
    
  private editTeacherSubjectData(data:any){
    this.editTemplate();
    let excludeData  = data.split('*');
    // this.editSubjectForm.controls['classId'].setValue(excludeData[0]);
    // this.editSubjectForm.controls['divId'].setValue(excludeData[1]);
    // this.editSubjectForm.controls['subId'].setValue(excludeData[2]);
    // this.editSubjectForm.controls['teacherId'].setValue(excludeData[3]);
    setTimeout(() => 
    {
      $(".editclass_select2_drop_down").val(<string>excludeData[0]).trigger('change');
      $(".editclass_select2_drop_down").attr("disabled", "disabled");
    $(".editdivision_select2_drop_down").val(<string>excludeData[1]).trigger('change');
    $(".editdivision_select2_drop_down").attr("disabled", "disabled");
    $(".editsubject_select2_drop_down").val(<string>excludeData[2]).trigger('change');
    $(".editsubject_select2_drop_down").attr("disabled", "disabled");
    $(".editteacher_select2_drop_down").val(<string>excludeData[3]).trigger('change');
    },
    1000);
   
   
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
  addTeacherSubjectSubmitForm(data: any){
    console.log(data);

    data.divId = $('.division_select2_drop_down').val();
    data.classId = $('.class_select2_drop_down').val();
    data.classId = $('.class_select2_drop_down').val();
    data.subId = $('.subject_select2_drop_down').val();
    data.teacherId = $('.teacher_select2_drop_down').val();
     if (data.classId!= '' && data.divId!= '' && data.subId!= '' && data.teacherId!= '') {
      this.baseservice.post('teachersubject',data).subscribe((result:any) => { 
       
        this.getTeacherSubjectList();
        this.listTemplate();
        toastr.success('Record has been added successfully...!');
      },
      (err) => {
        toastr.error('Something went wrong...!');
      //  localStorage.clear();
      });
    }
   
  }
  editSubjectSubmitForm(data: any){
    data.divId = $('.editdivision_select2_drop_down').val();
    data.classId = $('.editclass_select2_drop_down').val();
    data.subId = $('.editsubject_select2_drop_down').val();
    data.teacherId = $('.editteacher_select2_drop_down').val();
    if (data.classId!= '' && data.divId!= '' && data.subId!= '' && data.teacherId!= '') {
    this.baseservice.post('updateteachersubject',data).subscribe((result:any) => { 
     
      this.getTeacherSubjectList();
      this.listTemplate();
      toastr.success('Record has been updated successfully...!');
    },
    (err) => {
      toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }
  }
private getTeacherSubjectList() {
    this.baseservice.get('teachersubjectlist').subscribe((data: any) => {
      console.log(data);
        this.subjectData = data.subjectteacherlist;
        this.refreshDataTable(data);
    },
    (err) => {
        // Handle the error here. You might want to do something more than just clearing local storage.
        // localStorage.clear();
    });
}
private getSubjectList() {
  this.baseservice.get('subjectlist').subscribe((data: any) => {
    console.log(data);
      this.subjectData = data.subject;
        (<any>$('.subject_select2_drop_down')).select2({ data: this.subjectData });
        (<any>$('.editsubject_select2_drop_down')).select2({ data: this.subjectData });
  },
  (err) => {
      // Handle the error here. You might want to do something more than just clearing local storage.
      // localStorage.clear();
  });
}

showtablerecord(data:any) {
  console.log(data);
  data.subjectteacherlist.forEach((item:any, index:any) => {
    item.srNo = index + 1;
  }); 
  this.datatable = $('.m_datatable').mDatatable({
    data: {
      type: 'local',
      source: data.subjectteacherlist,
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
        field: 'subName',
        title: 'Subject Name',
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
      {
        field: 'createdAt',
        width: 110,
        title: 'Actions',
        sortable: false,
        overflow: 'visible',
        template: (row: any) => {
          if(row.id==null){
            return `<span class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill"><i class="edit-button la la-edit" data-id="${row.classId}*${row.divId}*${row.subId}*${row.teacherId}"></i></span>`;
          }else{
            return `<span class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill"><i class="edit-button la la-edit" data-id="${row.classId}*${row.divId}*${row.subId}*${row.teacherId}"></i>
            </span><span class="btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"><i class="delete-button fa fa-trash-o" data-id="${row.id}"></i></span>`;
          }
         
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
      this.editTeacherSubjectData(id);
    }
    if ((e.target as HTMLElement).classList.contains('delete-button')) {
      e.preventDefault();
      const id = (e.target as HTMLElement).getAttribute('data-id');
      this.deleteTeacherSubjectData(id);
    }
  });
}

}
