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
  templateUrl: "./books.html",
  encapsulation: ViewEncapsulation.None,
})
export class BooksComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  bookData:any;
  datatable:any;
  addBooksForm : FormGroup;
  editBooksForm : FormGroup;
  activebookval:any;

  constructor(private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService
    , private router: Router,fb: FormBuilder){
    this.getBooksList();
    this.addBooksForm = fb.group({
      'title' : [null, Validators.required],
      'author' : [null, Validators.required],
      'isbn' : [null, Validators.required],
      'genre' : [null, Validators.required],
      'quantity' : [null, Validators.required],
     
    });
    
    this.editBooksForm = fb.group({
      'bookId' : [null, Validators.required],
      'title' : [null, Validators.required],
      'author' : [null, Validators.required],
      'isbn' : [null, Validators.required],
      'genre' : [null, Validators.required],
      'quantity' : [null, Validators.required],
     'active': [null, Validators.required],
    });
    // console.log(this.addBooksForm);
    // this.addBooksForm.valueChanges.subscribe( (form: any) => {
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
  $('#m_datepickerSet').on('change', () => {
    let value = $('#m_datepickerSet').val();
    console.log(value);
    this.addBooksForm.controls['holidayDate'].setValue(value);
});


    $("#addTemplate").show();
    $("#editTemplate").hide();
    $("#listTemplate").hide();
  }
  editTemplate() {
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
    this.editBooksForm.controls['holidayDate'].setValue(value);
});
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
  }
 
  private editBooksData(data:any){
   
    let excludeData: any = this.bookData.find((book: any) => book.bookId == data);
    this.editBooksForm.controls['bookId'].setValue(excludeData.bookId);
    this.editBooksForm.controls['title'].setValue(excludeData.title);
    this.editBooksForm.controls['author'].setValue(excludeData.author);
    this.editBooksForm.controls['isbn'].setValue(excludeData.isbn);
    this.editBooksForm.controls['genre'].setValue(excludeData.genre);
    this.editBooksForm.controls['quantity'].setValue(excludeData.quantity);
    this.editBooksForm.controls['active'].setValue(excludeData.active);
    this.activebookval=excludeData.active;
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
  }
  addBooksSubmitForm(data: any){
    this.baseservice.post('books',data).subscribe((result:any) => { 
      this.getBooksList();
      this.listTemplate();
      toastr.success('Record has been added successfully...!');
    },
    (err) => { 
      toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }
  editBooksSubmitForm(data: any){
    this.baseservice.put('books/'+data.bookId,data).subscribe((result:any) => { 
      this.getBooksList();
      this.listTemplate();
      toastr.success('Record has been updated successfully...!');
    },
    (err) => {
      toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }
  private getBooksList() {
    this.baseservice.get('books').subscribe((data:any) => {
      this.bookData = data.books;
      this.refreshDataTable(data);
    },
    (err) => {
    //  localStorage.clear();
    });


  }

  showtablerecord(data:any) {
    var iValue=0; 
    data.books.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    }); 
    this.datatable = $('.m_datatable').mDatatable({
        
      data: {
        type: 'local',
        source: data.books,
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
        field: "title",
        title: "Book Name",
        
      }, {
        field: "author",
        title: "Author Name",
        
      }, {
        field: "quantity",
        title: "Actual QTY",
        
      }, {
        field: "availableQuantity",
        title: "Available QTY",
        
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
        this.editBooksData(id);
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
  //       this.editBooksData(id);
  //       //  this.getStudentData(id);
  //       //this.router.navigate(['/student/profile/', id]); 
  //     });
  //  }

   
}
