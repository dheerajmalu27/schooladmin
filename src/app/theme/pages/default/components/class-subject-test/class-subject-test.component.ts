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
  templateUrl: "./class-subject-test.html",
  encapsulation: ViewEncapsulation.None,
})
export class classSubjectTestComponent implements OnInit, AfterViewInit {
  datatable:any;
  showTemplate:any;
  classData:any;
  divisionData:any;
  testData:any;
  subjectData:any;
  addClassForm : FormGroup;
  editClassForm : FormGroup;

  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService
    , private router: Router,private fb: FormBuilder){
    this.getSubjectClassTestList();
    this.addClassForm = fb.group({
      'className': new FormControl(),
      'divisions': new FormControl(),
      'tests': new FormControl(),
      'subjects': new FormControl(),
      'optionalSubjects': new FormControl(),
    });
    this.editClassForm = fb.group({
      'classId': new FormControl(),
      'className': new FormControl(),
      'divisions': new FormControl(),
      'tests': new FormControl(),
      'subjects': new FormControl(),
      'optionalSubjects': new FormControl(),
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
    this.getDivisionList('');
    this.getTestList('');
    this.getSubjectList('','');
  }
  editTemplate(editClassData:any) {
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
    $(".edit_class_id").val(editClassData.id);
    this.getDivisionList(editClassData.divIds);
    this.getTestList(editClassData.testIds.toString());
    this.getSubjectList(editClassData.subjectIds,editClassData.optionalSubjectIds);
    console.log(editClassData);
    this.editClassForm = this.fb.group({
      'className': editClassData.className,
   
    });
    console.log(this.editClassForm );
    // this.studentDetail = studentData;
    
  }
  getClassData(id:any){
    const result = this.classData.find((item: any) => item.id == id);

    if (result) {
      this.editTemplate(result);
    } else {
      console.log("Record not found.");
    }
  }
  addClassSubmitForm(data:any){

    data.divIds = $('.division_select2_drop_down').val().join(',');
    data.testIds = $('.test_select2_drop_down').val().join(',');
    data.subjectIds = ($('.subject_select2_drop_down').val()).join(',');
    data.optionalSubjectIds = ($('.optionalSubjects_select2_drop_down').val()).join(',');
    data.className = $('.class_name').val();
    // console.log($('.division_select2_drop_down').val());
    // console.log($('.test_select2_drop_down').val());
    // console.log($('.subject_select2_drop_down').val());
     if (data.subjectIds != '' && data.testIds!= '' && data.divIds!= '') {
      this.baseservice.post('class',data).subscribe((data:any) => {
        this.getSubjectClassTestList();
      // this.addStudentData = data;
        this.listTemplate();
        toastr.success('Record has been added successfully...!');
      },
        (err) => {
          console.log(err);
          toastr.error('Something went wrong...!');
          //  localStorage.clear();
        });

    }
  }
  editClassSubmitForm(data: any){
   
    data.divIds = $('.edit_division_select2_drop_down').val().join(',');
    data.testIds = $('.edit_test_select2_drop_down').val().join(',');
    data.subjectIds = ($('.edit_subject_select2_drop_down').val()).join(',');
    data.optionalSubjectIds = ($('.edit_optionalSubjects_select2_drop_down').val()).join(',');
    data.className = $('.edit_class_name').val();
    // console.log($('.division_select2_drop_down').val());
    // console.log($('.test_select2_drop_down').val());
    // console.log($('.subject_select2_drop_down').val());
     if (data.subjectIds != '' && data.testIds!= '' && data.divIds!= '' &&  $(".edit_class_id").val()!='') {
      this.baseservice.put('class/'+$(".edit_class_id").val(),data).subscribe((data:any) => {
        this.getSubjectClassTestList();
      // this.addStudentData = data;
        this.listTemplate();
        toastr.success('Record has been updated successfully...!');
      },
        (err) => {
          console.log(err);
          toastr.error('Something went wrong...!');
        });

    }
  }
  private getTestList(editTestData: any) {
    this.baseservice.get('testlist').subscribe((data: any) => {
        this.testData = data.test;

        // Initialize the dropdowns
        $('.test_select2_drop_down').select2({ data: this.testData });

        if (editTestData) {
            const valuesArray = editTestData.split(','); // Convert '1,2' to ['1', '2']

            $('.edit_test_select2_drop_down')
                .select2({ data: this.testData })  // Ensure you initialize it first
                .val(valuesArray)
                .trigger('change');
        }
    }, (err) => {
        // handle error here
    }); 
}

private getDivisionList(editValue: any) {
  this.baseservice.get('divisionlist').subscribe((data: any) => {
      this.divisionData = data.division;

      // Initialize the primary dropdown
      $('.division_select2_drop_down').select2({ data: this.divisionData });

      if (editValue) {
          const valuesArray = (typeof editValue === 'string') ? editValue.split(',') : editValue;

          $('.edit_division_select2_drop_down')
              .select2({ data: this.divisionData })  // Ensure you initialize it first
              .val(valuesArray)
              .trigger('change');
      }
  }, (err) => {
      // handle error here
  }); 
}

private getSubjectList(editSubjectData: any, editOptionalSubjectData: any) {
  this.baseservice.get('subjectlist').subscribe((data: any) => {
      this.subjectData = data.subject;

      // Initialize the primary dropdowns
      $('.subject_select2_drop_down').select2({ data: this.subjectData });
      $('.optionalSubjects_select2_drop_down').select2({ data: this.subjectData });

      if (editSubjectData) {
          // Convert string values to arrays if needed
          const valuesArraySubject = (typeof editSubjectData === 'string') ? editSubjectData.split(',') : editSubjectData;
          const valuesArrayOptional = (typeof editOptionalSubjectData === 'string') ? editOptionalSubjectData.split(',') : editOptionalSubjectData;

          $('.edit_subject_select2_drop_down')
              .select2({ data: this.subjectData })
              .val(valuesArraySubject)
              .trigger('change');

          $('.edit_optionalSubjects_select2_drop_down')
              .select2({ data: this.subjectData })
              .val(valuesArrayOptional)
              .trigger('change');
      }
  }, (err) => {
      // handle error here
  });
}

  private getSubjectClassTestList() {
    this.baseservice.get('classdetails').subscribe((data:any) => {
      this.classData = data.class;
      this.refreshDataTable(data);
    },
    (err) => {
    //  localStorage.clear();
    });
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
          field: "className",
          title: "Class",
        },  {
          field: "divisionNames",
          title: "Division Names",
          
        }, {
          field: "subjectNames",
          title: "Subject Name",
          
        }, {
          field: "testNames",
          title: "Test Name",
          
        }, {
          field: "optionalSubjectNames",
          title: "Optional Subjects",
        }, {
          field: "createdAt",
          width: 110,
          title: "Actions",
          sortable: false,
          overflow: 'visible',
          template: function (row:any) {
            return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.id+'"></i></span>';
  
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

      this.renderer.listen(this.elRef.nativeElement.querySelector('.m_datatable'), 'click', (e) => {
        if ((e.target as HTMLElement).classList.contains('edit-button')) {
          e.preventDefault();
          const id = (e.target as HTMLElement).getAttribute('data-id');
          this.getClassData(id);
        }
        // if ((e.target as HTMLElement).classList.contains('teacherFn')) {
        //   e.preventDefault();
        //   const id = (e.target as HTMLElement).getAttribute('data-id');
        //   this.router.navigate(['/teacher/profile/', id]);
        //   }
      });
      // $('.m_datatable').on('click', '.teacherFn', (e) => {
      //   e.preventDefault();
      //   var id = $(e.target).attr('data-id');
       
      //   this.router.navigate(['/student/profile/', id]); 
      //   });
  }
}
