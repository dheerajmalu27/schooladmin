import { Component, OnInit, ViewEncapsulation, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { ReactiveFormsModule, FormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BaseService } from '../../../../../_services/base.service';
import { Router } from '@angular/router';
declare let $: any;
declare var toastr: any;
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./holidays.html",
  encapsulation: ViewEncapsulation.None,
})
export class HolidaysComponent implements OnInit, AfterViewInit {
  showTemplate: any;
  holidayData: any;
  datatable: any;
  addHolidaysForm: FormGroup;
  editHolidaysForm: FormGroup;

  constructor(private elRef: ElementRef,
    private renderer: Renderer2, private _script: ScriptLoaderService, private baseservice: BaseService
    , private router: Router, fb: FormBuilder) {
    this.getHolidaysList();
    this.addHolidaysForm = fb.group({
      'holidayDate': [null, Validators.required],

    });

    this.editHolidaysForm = fb.group({
      'id': [null, Validators.required],
      'holidayDate': [null, Validators.required],

    });
    // console.log(this.addHolidaysForm);
    // this.addHolidaysForm.valueChanges.subscribe( (form: any) => {
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
      this.addHolidaysForm.controls['holidayDate'].setValue(value);
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
      this.editHolidaysForm.controls['holidayDate'].setValue(value);
    });
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
  }

  private editHolidaysData(data: any) {
    let excludeData = data.split('*');

    this.editHolidaysForm.controls['id'].setValue(excludeData[0]);
    this.editHolidaysForm.controls['holidayDate'].setValue(excludeData[1]);
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
  addHolidaysSubmitForm(data: any) {
    this.baseservice.post('holidays', data).subscribe((result: any) => {
    
      this.getHolidaysList();
      this.listTemplate();
      toastr.success('Record has been added successfully...!');
    },
      (err) => {
        toastr.error('Something went wrong...!');
        //  localStorage.clear();
      });
  }
  editHolidaysSubmitForm(data: any) {
    this.baseservice.put('holidays/' + data.id, data).subscribe((result: any) => {
    
      this.getHolidaysList();
      this.listTemplate();
      toastr.success('Record has been updated successfully...!');
    },
      (err) => {
        toastr.error('Something went wrong...!');
        //  localStorage.clear();
      });
  }
  private deleteHoliday(id:any){
    const confirmation = window.confirm('Are you sure you want to delete this record?');
  if (!confirmation) {
    return; // Do nothing if the user cancels the confirmation
  }

    this.baseservice.delete(<string>('holidays/' + id)).subscribe((data: any) => {
      this.getHolidaysList();
        this.listTemplate();
        toastr.success('Record deleted successfully...!');
    },
      (err) => {
        toastr.error('Something went wrong...!');
      });

  }
  
  private getHolidaysList() {
    this.baseservice.get('holidays').subscribe((data: any) => {
      this.holidayData = data.holidays;
      this.refreshDataTable(data);
    },
      (err) => {
        //  localStorage.clear();
      });


  }

  showtablerecord(data: any) {
    data.holidays.forEach((item: any, index: any) => {
      item.srNo = index + 1;
    });
    this.datatable = $('.m_datatable').mDatatable({

      data: {
        type: 'local',
        source: data.holidays,
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
        field: "holidayDate",
        title: "Date",

      }, {
        field: "active",
        title: "Status",
        // callback function support for column rendering
        template: function (row: { active: boolean }) {
          if (row.active) {
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
        template: function (row: any) {
          return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.id + '*' + row.holidayDate + '"></i></span><span class="btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"><i class="delete-button fa fa-trash-o" data-id="' + row.id + '"></i></span>';
        }
      }]
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
    $(this.elRef.nativeElement.querySelectorAll('#m_form_status, #m_form_type')).selectpicker();

    this.renderer.listen(this.elRef.nativeElement.querySelector('.m_datatable'), 'click', (e) => {
      if ((e.target as HTMLElement).classList.contains('edit-button')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        this.editHolidaysData(id);
      }
      if ((e.target as HTMLElement).classList.contains('delete-button')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        this.deleteHoliday(id);
      }
    });
  }

  // public showtablerecord(data:any){


  //     var iValue=0;           
  //      this.datatable = $('.m_datatable').mDatatable({

  //        data: {
  //          type: 'local',
  //          source: data.holidays,
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
  //       this.editHolidaysData(id);
  //       //  this.getStudentData(id);
  //       //this.router.navigate(['/student/profile/', id]); 
  //     });
  //  }


}
