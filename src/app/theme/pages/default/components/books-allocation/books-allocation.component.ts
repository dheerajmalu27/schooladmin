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
  templateUrl: "./books-allocation.html",
  encapsulation: ViewEncapsulation.None,
})
export class BooksAllocationComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  borrowedBooksData:any;
  booksData:any;
  studentsData:any;
  datatable:any;
  addBooksAllocationForm : FormGroup;
  editBooksAllocationForm : FormGroup;
  activebookval:any;

  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService
    , private router: Router,fb: FormBuilder){
    this.getBooksAllocationList();
    this.addBooksAllocationForm = fb.group({
      'studentId' : [null],
      'bookId' : [null],
      'borrowDate' : [null],
    });
    
    this.editBooksAllocationForm = fb.group({
      'borrowId' : [null],
      'studentId' : [null],
      'bookId' : [null], 
      'borrowDate' : [null],
      'returnDate' : [null],
    });
    // console.log(this.addBooksAllocationForm);
    // this.addBooksAllocationForm.valueChanges.subscribe( (form: any) => {
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
 

    this.getBooksList();
    this.getStudentList();
    $("#addTemplate").show();
    $("#editTemplate").hide();
    $("#listTemplate").hide();
  }
  editTemplate() {
    this.getBooksList();
    this.getStudentList();
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
  $('#m_datepickerSet2').datepicker({
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

});
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
  }
 
  private getBooksList() {
    var select2: any;
    var resultArray: Array<any> = [];
    this.baseservice.get('bookslist').subscribe((data:any) => {
      this.booksData = data.books;
    (<any>$('.books_select2_drop_down')).select2({data:this.booksData});
    (<any>$('.edit_books_select2_drop_down')).select2({data:this.booksData});
   },
   (err) => {
   //  localStorage.clear();
   });   
   
   }

   private getStudentList() {
    var select2: any;
    var resultArray: Array<any> = [];
    this.baseservice.get('activestudentlist').subscribe((data:any) => {
      this.studentsData = data.student;
    (<any>$('.student_select2_drop_down')).select2({data:this.studentsData});
    (<any>$('.edit_student_select2_drop_down')).select2({data:this.studentsData});
   },
   (err) => {
   //  localStorage.clear();
   });   
   
   }
  private editBooksAllocationData(data:any){
    this.editTemplate();
    let excludeData: any = this.borrowedBooksData.find((borrowedBooks: any) => borrowedBooks.borrowId == data);
    this.editBooksAllocationForm.controls['borrowId'].setValue(excludeData.borrowId);
    this.editBooksAllocationForm.controls['bookId'].setValue(excludeData.bookId);
    this.editBooksAllocationForm.controls['studentId'].setValue(excludeData.studentId);
    this.editBooksAllocationForm.controls['borrowDate'].setValue(excludeData.borrowDate);
    this.editBooksAllocationForm.controls['returnDate'].setValue(excludeData.returnDate);
   


    setTimeout(() => 
    {
      $(".edit_student_select2_drop_down").val(<string>excludeData.studentId).trigger('change');
      // $(".edit_student_select2_drop_down").attr("disabled", "disabled");
    $(".edit_books_select2_drop_down").val(<string>excludeData.bookId).trigger('change');
    // $(".edit_books_select2_drop_down").attr("disabled", "disabled");
    },
    1000);
  }
  addBooksAllocationSubmitForm(data: any){
    console.log(data);
    data.bookId = $('.books_select2_drop_down').val();
    data.studentId = $('.student_select2_drop_down').val();
    data.borrowDate = $("#m_datepickerSet").val();
    if(data.bookId!=null && data.bookId && data.borrowDate){
      this.baseservice.post('borrowedbooks',data).subscribe((result:any) => { 
        this.datatable.destroy();
        this.getBooksAllocationList();
        this.listTemplate();
        toastr.success('Record has been added successfully...!');
      },
      (err) => { 
        toastr.error('Something went wrong...!');
      //  localStorage.clear();
      });
    }

  }
  editBooksAllocationSubmitForm(data: any){
  
    data.bookId = $('.edit_books_select2_drop_down').val();
    data.studentId = $('.edit_student_select2_drop_down').val();
    data.borrowDate = $("#m_datepickerSet1").val();
    data.returnDate = $("#m_datepickerSet2").val();
    console.log(data);
    if(data.borrowId!=null && data.bookId!=null && data.bookId!=null && data.borrowDate!=null && data.returnDate!=null){
      this.baseservice.put('borrowedbooks/'+data.borrowId,data).subscribe((result:any) => { 
        this.datatable.destroy();
        this.getBooksAllocationList();
        this.listTemplate();
        toastr.success('Record has been updated successfully...!');
      },
      (err) => {
        toastr.error('Something went wrong...!');
      //  localStorage.clear();
      });
    }
  
  }
  private getBooksAllocationList() {
    this.baseservice.get('borrowedbooks').subscribe((data:any) => {
      this.borrowedBooksData = data.borrowedbooks;
      this.showtablerecord(data);
    },
    (err) => {
    //  localStorage.clear();
    });


  }

  showtablerecord(data:any) {
    var iValue=0; 
    data.borrowedbooks.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    }); 
    this.datatable = $('.m_datatable').mDatatable({
        
      data: {
        type: 'local',
        source: data.borrowedbooks,
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
        field: "bookName",
        title: "Book Name",
        
      }, {
        field: "studentName",
        title: "Student Name",
        
      }, {
        field: "borrowDate",
        title: "Borrow Date",
        
      }, {
        field: "returnDate",
        title: "Return Date",
        
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
         return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.bookId +'"></i></span>';
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
        this.editBooksAllocationData(id);
      }
    });
  }

  // public showtablerecord(data:any){
 
     
  //     var iValue=0;           
  //      this.datatable = $('.m_datatable').mDatatable({
        
  //        data: {
  //          type: 'local',
  //          source: data.books,
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
  //          template: function () {
  //           return iValue=iValue+1;
  //         }
  //        }, {
  //          field: "holidayDate",
  //          title: "Date",
           
  //        }, {
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
  //           return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.id + '*'+row.holidayDate+'"></i></span>';
  //          }
  //        }]
  //      });
   
  //      var query = this.datatable.getDataSourceQuery();
   
  //      $('#m_form_search').on('keyup', function (e) {
  //        this.datatable.search($(this).val().toLowerCase());
  //      }).val(query.generalSearch);
   
  //      $('#m_form_status').on('change', function () {
  //        this.datatable.search($(this).val(), 'Status');
  //      }).val(typeof query.Status !== 'undefined' ? query.Status : '');
   
  //      $('#m_form_type').on('change', function () {
  //        this.datatable.search($(this).val(), 'Type');
  //      }).val(typeof query.Type !== 'undefined' ? query.Type : '');
   
  //      $('#m_form_status, #m_form_type').selectpicker();
  //      $('.m_datatable').on('click', '.edit-button', (e) => {
  //       e.preventDefault();
  //       var id = $(e.target).attr('data-id');
  //       this.editBooksAllocationData(id);
  //       //  this.getStudentData(id);
  //       //this.router.navigate(['/student/profile/', id]); 
  //     });
  //  }

   
}
