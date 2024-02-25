import { Component, OnInit, ViewEncapsulation, AfterViewInit,Renderer2, ElementRef   } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import {BaseService} from '../../../../../_services/base.service';
import { Router } from '@angular/router';
declare let $: any;
declare var toastr: any;
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./homework.html",
  encapsulation: ViewEncapsulation.None,
})
export class NewsEventsComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  homeworkData:any;
  datatable:any;
  addNewseventsForm : FormGroup;
  activebookval:any;
  divisionData:any=null;
  classData:any =null;
  subjectData:any=null;
  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService
    , private router: Router,fb: FormBuilder){
    this.getNewseventsList();
    this.addNewseventsForm = fb.group({
      'id' : [null],
      'classId' : [null, Validators.required],
      'divId' : [null, Validators.required],
      'subId' : [null, Validators.required],
      'title' : [null, Validators.required],
      'description' : [null, Validators.required],
      'deadline' : [null, Validators.required],
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
    $("#listTemplate").show();
   
  }
  addTemplate() {
    $('.summernote').summernote('code', '');
    this.addNewseventsForm.reset();
    (<any>$('.subject_select2_drop_down')).val(null).trigger('change');
    (<any>$('.division_select2_drop_down')).val(null).trigger('change');
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/header/actions.js');
    this.getClassList();
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
  $('#m_datepickerSet').datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    templates: {
      leftArrow: '<i class="la la-angle-left"></i>',
      rightArrow: '<i class="la la-angle-right"></i>'
    }
    
  });
  var temp = this;
  $('#m_datepickerSet').on('change', () => {
    let value = $('#m_datepickerSet').val();
    console.log(value);
    this.addNewseventsForm.controls['deadline'].setValue(value);
    console.log(this.addNewseventsForm);
   
});
$('.summernote').on('summernote.change', (we: any, contents: any, $editable: any) => {
  console.log('Summernote content changed:', contents);
  this.addNewseventsForm.controls['description'].setValue(contents); 
  // You can perform further actions with the 'contents' variable
});


    $("#addTemplate").show();
    $("#listTemplate").hide();
  }
  editTemplate() {
    
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    'assets/demo/default/custom/header/actions.js');
  this.getClassList();
    
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
    'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
  $('#m_datepickerSet1').datepicker({
    format: "yyyy-mm-dd",
    todayHighlight: true,
    templates: {
      leftArrow: '<i class="la la-angle-left"></i>',
      rightArrow: '<i class="la la-angle-right"></i>'
    }
  });
  var temp = this;

  $('#m_datepickerSet1').on('change', () => {
    let value = $('#m_datepickerSet1').val();
    console.log(value);
    this.addNewseventsForm.controls['deadline'].setValue(value);
});
$('.summernote').on('summernote.change', (we: any, contents: any, $editable: any) => {
  console.log('Summernote content changed:', contents);
  this.addNewseventsForm.controls['description'].setValue(contents); 
  // You can perform further actions with the 'contents' variable
});
    $("#addTemplate").show();
    $("#listTemplate").hide();
    setTimeout(() => {
      this.onClassChange();
    }, 1000);
    
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
  private editNewseventsData(data:any){
    this.addNewseventsForm.reset();
    let excludeData: any = this.homeworkData.find((homework: any) => homework.id == data);
    this.addNewseventsForm.controls['id'].setValue(excludeData.id);
    this.addNewseventsForm.controls['classId'].setValue(excludeData.classId);
    this.addNewseventsForm.controls['divId'].setValue(excludeData.divId);
    this.addNewseventsForm.controls['subId'].setValue(excludeData.subId);
    this.addNewseventsForm.controls['title'].setValue(excludeData.title);
    this.addNewseventsForm.controls['description'].setValue(excludeData.description);
    this.addNewseventsForm.controls['deadline'].setValue(excludeData.deadline);
    $('.summernote').summernote('code', this.addNewseventsForm.controls['description'].value);
    this.editTemplate();
  }

  private deleteNewseventsData(id:any){
    const confirmation = window.confirm('Are you sure you want to delete this record?');
  if (!confirmation) {
    return; // Do nothing if the user cancels the confirmation
  }
    this.baseservice.delete(<string>('newsevents/' + id)).subscribe((data: any) => {
      this.getNewseventsList();
        this.listTemplate();
        toastr.success('Record deleted successfully...!');
    },
      (err) => {
        toastr.error('Something went wrong...!');
      });

  }
  addNewseventsSubmitForm(data: any){
    console.log(data);
  if(data.classId!='' && data.deadline!='' && data.description!='' && data.divId!=''&& data.subId!='' && data.title!=''){
    if(data.id!=null && data.id!=''){
      this.baseservice.put('newsevents/'+data.id,data).subscribe((result:any) => { 
      
        this.getNewseventsList();
        this.listTemplate();
        toastr.success('Record has been added successfully...!');
      },
      (err) => { 
        toastr.error('Something went wrong...!');
      //  localStorage.clear();
      });
    }else{
      this.baseservice.post('homework',data).subscribe((result:any) => { 
  
        this.getNewseventsList();
        this.listTemplate();
        toastr.success('Record has been added successfully...!');
      },
      (err) => { 
        toastr.error('Something went wrong...!');
      //  localStorage.clear();
      });
    }
   
  }

  }
  editNewseventsSubmitForm(data: any){
    this.baseservice.put('newsevents/'+data.homeworkId,data).subscribe((result:any) => { 

      this.getNewseventsList();
      this.listTemplate();
      toastr.success('Record has been updated successfully...!');
    },
    (err) => {
      toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }
  private getNewseventsList() {
    this.baseservice.get('homework').subscribe((data:any) => {
      this.homeworkData = data.homework;
      this.refreshDataTable(data);
    },
    (err) => {
    //  localStorage.clear();
    });


  }

  private getClassList() {

    this.baseservice.get('classlist').subscribe((data:any) => {
      this.classData = data.class;
      (<any>$('.class_select2_drop_down')).select2({ data: this.classData });
      $('.class_select2_drop_down').on('change', (event:any) => {
        console.log(event)
        this.onClassChange();
      });
    },
      (err) => {
        //  localStorage.clear();
      });
  }
  onClassChange() {
    const selectedClassId = $('.class_select2_drop_down').val();
    this.addNewseventsForm.controls['classId'].setValue(selectedClassId);
    console.log(selectedClassId);
    if (selectedClassId) {

      // Make an API call to get divisions based on the selected class
      this.baseservice.get('classsubject/' + selectedClassId).subscribe(
        (data: any) => {
          this.subjectData = data.subject;
      
          // Reset and initialize Select2 with new data
          (<any>$('.subject_select2_drop_down')).val(null).trigger('change');
          (<any>$('.subject_select2_drop_down')).select2({ data: this.subjectData });
      
          console.log(this.addNewseventsForm.controls['subId'].value);
      
          // Set value in Select2 if there is a pre-existing value in the form
          if (this.addNewseventsForm.controls['subId'].value !== null) {
            (<any>$('.subject_select2_drop_down')).val(this.addNewseventsForm.controls['subId'].value).trigger('change');
          }else{
            $('.subject_select2_drop_down').val()
          }
      
          // Handle change event after initializing Select2
          $('.subject_select2_drop_down').off('change').on('change', (event: any) => {
            this.addNewseventsForm.controls['subId'].setValue($('.subject_select2_drop_down').val());
          });
        },
        (error) => {
          console.error('Error fetching subject:', error);
        }
      );
      

      // Make an API call to get divisions based on the selected class
      this.baseservice.get('classdivision/'+selectedClassId).subscribe(
        (data: any) => {
          this.divisionData = data.division;
          (<any>$('.division_select2_drop_down')).val(null).trigger('change');
          (<any>$('.division_select2_drop_down')).select2({ data: this.divisionData });
          if(this.addNewseventsForm.controls['divId'].value!=null){
            (<any>$('.division_select2_drop_down')).val(this.addNewseventsForm.controls['divId'].value).trigger('change');
          }
          $('.division_select2_drop_down').on('change', (event:any) => {
            this.addNewseventsForm.controls['divId'].setValue($('.division_select2_drop_down').val()); 
          });
        },
        (error) => {
          console.error('Error fetching divisions:', error);
        }
      );
    } else {
      // Reset divisions if no class is selected
      this.divisionData = [];
    }
  }
  


  showtablerecord(data:any) {
    var iValue=0; 
    data.homework.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    }); 
    this.datatable = $('.m_datatable').mDatatable({
        
      data: {
        type: 'local',
        source: data.homework,
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
        field: "srNo",
        title: "Sr.No.",
      }, {
        field: "className",
        title: "Class-Div",
        template: function (row:any) {

          return row.className + '-' + row.divName;
        },
        
      }, {
        field: "subName",
        title: "Subject Name",
        
      }, {
        field: "title",
        title: "Title",
        
      }, {
        field: "description",
        title: "Description",
        
      }, {
        field: "deadline",
        title: "Deadline",
        
      }, {
        field: "createdAt",
        width: 110,
        title: "Actions",
        sortable: false,
        overflow: 'visible',
        template: function (row:any) {
         return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.id +'"></i></span><span class="btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"><i class="delete-button fa fa-trash-o" data-id="' + row.id + '"></i></span>';
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
        this.editNewseventsData(id);
      }
      if ((e.target as HTMLElement).classList.contains('delete-button')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        this.deleteNewseventsData(id);
      }
    });
  }
}
