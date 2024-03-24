import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { BaseService } from '../../../../../_services/base.service';
import { Router } from '@angular/router';
declare let $: any;
declare var toastr: any;
@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './expenses.html',
  encapsulation: ViewEncapsulation.None,
})
export class ExpensesComponent implements OnInit, AfterViewInit {
  showTemplate: any;
  expensesData: any;
  datatable: any;
  addExpensesForm: FormGroup;
  editExpensesForm: FormGroup;
  activeexpensesval: any;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private _script: ScriptLoaderService,
    private baseservice: BaseService,
    private router: Router,
    fb: FormBuilder
  ) {
    this.getExpensesList();
    this.addExpensesForm = fb.group({
      name: [null, Validators.required],
      billno: [null, Validators.required],
      expense_type: [null, Validators.required],
      amount: [null, Validators.required],
      phone: [null, Validators.required], // Marking the phone field as required
      email: [null],
      status: [null],
      date: [null, Validators.required], // Marking the date field as required
    });

    this.editExpensesForm = fb.group({
      id: [null, Validators.required],
      name: [null, Validators.required],
      billno: [null, Validators.required],
      expense_type: [null, Validators.required],
      amount: [null, Validators.required],
      phone: [null, Validators.required], // Marking the phone field as required
      email: [null],
      status: [null],
      date: [null, Validators.required], // Marking the date field as required
    });
    // console.log(this.addExpensesForm);
    // this.addExpensesForm.valueChanges.subscribe( (form: any) => {
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
    $('#addTemplate').hide();
    $('#editTemplate').hide();
    $('#listTemplate').show();
  }
  addTemplate() {
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js'
    );
    $('#m_datepickerSet').datepicker({
      format: 'yyyy-mm-dd',
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
    });
    var temp = this;
    $('#m_datepickerSet').on('change', () => {
      let value = $('#m_datepickerSet').val();
      console.log(value);
      this.addExpensesForm.controls['holidayDate'].setValue(value);
    });

    $('#addTemplate').show();
    $('#editTemplate').hide();
    $('#listTemplate').hide();
  }
  editTemplate() {
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js'
    );
    $('#m_datepickerSet1').datepicker({
      format: 'yyyy-mm-dd',
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
    });
    var temp = this;

    $('#m_datepickerSet1').on('change', () => {
      let value = $('#m_datepickerSet1').val();
      console.log(value);
      this.editExpensesForm.controls['holidayDate'].setValue(value);
    });
    $('#addTemplate').hide();
    $('#editTemplate').show();
    $('#listTemplate').hide();
  }

  private editExpensesData(data: any) {
    let excludeData: any = this.expensesData.find(
      (expenses: any) => expenses.id == data
    );
    this.editExpensesForm.controls['id'].setValue(excludeData.id); // Assuming 'id' is the primary key field
    this.editExpensesForm.controls['name'].setValue(excludeData.name);
    this.editExpensesForm.controls['billno'].setValue(excludeData.billno);
    this.editExpensesForm.controls['expense_type'].setValue(
      excludeData.expense_type
    );
    this.editExpensesForm.controls['amount'].setValue(excludeData.amount);
    this.editExpensesForm.controls['phone'].setValue(excludeData.phone);
    this.editExpensesForm.controls['email'].setValue(excludeData.email);
    this.editExpensesForm.controls['status'].setValue(excludeData.status);
    this.editExpensesForm.controls['date'].setValue(excludeData.date);
    this.editTemplate();
  }
  public refreshDataTable(newData: any): void {
    // Destroy existing datatable

    if (this.datatable) {
      this.datatable.destroy(); // Destroy existing datatable instance
      this.showtablerecord(newData); // Reinitialize datatable with new data
    } else {
      this.showtablerecord(newData);
    }
  }
  addExpensesSubmitForm(data: any) {
    this.baseservice.post('expenses', data).subscribe(
      (result: any) => {
        this.getExpensesList();
        this.listTemplate();
        toastr.success('Record has been added successfully...!');
      },
      (err) => {
        toastr.error('Something went wrong...!');
        //  localStorage.clear();
      }
    );
  }
  editExpensesSubmitForm(data: any) {
    this.baseservice.put('expenses/' + data.id, data).subscribe(
      (result: any) => {
        this.getExpensesList();
        this.listTemplate();
        toastr.success('Record has been updated successfully...!');
      },
      (err) => {
        toastr.error('Something went wrong...!');
        //  localStorage.clear();
      }
    );
  }
  private getExpensesList() {
    this.baseservice.get('expenses').subscribe(
      (data: any) => {
        this.expensesData = data.expenses;
        this.refreshDataTable(data);
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }

  showtablerecord(data: any) {
    var iValue = 0;
    data.expenses.forEach((item: any, index: any) => {
      item.srNo = index + 1;
    });
    this.datatable = $('.m_datatable').mDatatable({
      data: {
        type: 'local',
        source: data.expenses,
        pageSize: 10,
      },

      // layout definition
      layout: {
        theme: 'default', // datatable theme
        class: '', // custom wrapper class
        scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
        height: 450, // datatable's body's fixed height
        footer: false, // display/hide footer
      },

      // column sorting
      sortable: true,

      pagination: true,

      // inline and bactch editing(cooming soon)
      // editable: false,

      // columns definition
      columns: [
        {
          field: 'srNo',
          title: 'Sr.No.',
        },
        {
          field: 'name',
          title: 'Name',
        },
        {
          field: 'billno',
          title: 'Bill No',
        },
        {
          field: 'expense_type',
          title: 'Expense Type',
        },
        {
          field: 'amount',
          title: 'Amount',
        },
        {
          field: 'phone',
          title: 'Phone',
        },

        {
          field: 'status',
          title: 'Status',
        },
        {
          field: 'date',
          title: 'Date',
        },
        {
          field: 'createdAt',
          width: 110,
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          template: function (row: any) {
            return (
              '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' +
              row.id +
              '"></i></span>'
            );
          },
        },
      ],
    });

    const query = this.datatable.getDataSourceQuery();

    const formSearch = this.elRef.nativeElement.querySelector('#m_form_search');
    const formStatus = this.elRef.nativeElement.querySelector('#m_form_status');
    const formType = this.elRef.nativeElement.querySelector('#m_form_type');

    if (formSearch) {
      this.renderer.listen(formSearch, 'keyup', (e) => {
        this.datatable.search(e.target.value.toLowerCase());
      });
    }

    if (formStatus) {
      this.renderer.listen(formStatus, 'change', (e) => {
        this.datatable.search(e.target.value, 'Status');
      });
    }

    if (formType) {
      this.renderer.listen(formType, 'change', (e) => {
        this.datatable.search(e.target.value, 'Type');
      });
    }

    // Assuming selectpicker() is necessary for styling, if it's based on jQuery, you can retain this.
    $(
      this.elRef.nativeElement.querySelectorAll('#m_form_status, #m_form_type')
    ).selectpicker();

    this.renderer.listen(
      this.elRef.nativeElement.querySelector('.m_datatable'),
      'click',
      (e) => {
        if ((e.target as HTMLElement).classList.contains('edit-button')) {
          e.preventDefault();
          const id = (e.target as HTMLElement).getAttribute('data-id');
          this.editExpensesData(id);
        }
      }
    );
  }

  // public showtablerecord(data:any){

  //     var iValue=0;
  //      this.datatable = $('.m_datatable').mDatatable({

  //        data: {
  //          type: 'local',
  //          source: data.expenses,
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
  //       this.editExpensesData(id);
  //       //  this.getStudentData(id);
  //       //this.router.navigate(['/student/profile/', id]);
  //     });
  //  }
}
