import { Component, OnInit, ViewEncapsulation, AfterViewInit, Renderer2, ElementRef } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { ValidatorFn, AbstractControl, ValidationErrors , FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { BaseService } from '../../../../../_services/base.service';



import { Router } from '@angular/router';
declare let $: any;
declare var toastr: any;
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./fees-structure.html",
  encapsulation: ViewEncapsulation.None,
})
export class FeesStructureComponent implements OnInit, AfterViewInit {
  showTemplate: any;
  FeesStructureData: any;
  datatable: any;
  addFeesStructureForm: FormGroup;
  activebookval: any;
  divisionData: any = null;
  classData: any = null;
  subjectData: any = null;
  constructor(private elRef: ElementRef,
    private renderer: Renderer2, private _script: ScriptLoaderService, private baseservice: BaseService
    , private router: Router, fb: FormBuilder) {
    this.getFeesStructureList();
    this.addFeesStructureForm = fb.group({
      feeId: [null],
      classId: [null],
      tuitionFee: [null, [Validators.required, this.nonNegativeValidator()]],
      developmentFee: [null, [Validators.required, this.nonNegativeValidator()]],
      examinationFee: [null, [Validators.required, this.nonNegativeValidator()]],
      sportsFee: [null, [Validators.required, this.nonNegativeValidator()]],
      transportationFee: [null, [Validators.required, this.nonNegativeValidator()]],
      libraryFee: [null, [Validators.required, this.nonNegativeValidator()]],
      labFee: [null, [Validators.required, this.nonNegativeValidator()]],
      securityFee: [null, [Validators.required, this.nonNegativeValidator()]],
      otherFee: [null, [Validators.required, this.nonNegativeValidator()]],
      paymentFrequency: ['1'],
      dueDate: [null],
      lateFee: [null,[this.nonNegativeValidator()]],
      discount: [null,[this.nonNegativeValidator()]]
    });
  }
  ngOnInit() {
    this.listTemplate();
  }
  ngAfterViewInit() {
    this.listTemplate();
  }
  private nonNegativeValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (value !== null && value < 0) {
        return { nonNegative: true };
      }

      return null;
    };
  }
  listTemplate() {
    $("#addTemplate").hide();
    $("#listTemplate").show();

  }
  addTemplate() {

    this.addFeesStructureForm.reset();
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
      this.addFeesStructureForm.controls['deadline'].setValue(value);
      console.log(this.addFeesStructureForm);

    });



    $("#addTemplate").show();
    $("#listTemplate").hide();
  }
  editTemplate() {

    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/header/actions.js');
    // this.getClassList();

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
      this.addFeesStructureForm.controls['deadline'].setValue(value);
    });

    $("#addTemplate").show();
    $("#listTemplate").hide();

  }

  private editFeesStructureData(data: any) {
    this.addFeesStructureForm.reset();
    let excludeData: any = this.FeesStructureData.find((FeesStructure: any) => FeesStructure.feeId == data);
    this.addFeesStructureForm.controls['feeId'].setValue(excludeData.feeId);
    this.addFeesStructureForm.controls['classId'].setValue(excludeData.classId);
    this.addFeesStructureForm.controls['tuitionFee'].setValue(excludeData.tuitionFee);
    this.addFeesStructureForm.controls['developmentFee'].setValue(excludeData.developmentFee);
    this.addFeesStructureForm.controls['examinationFee'].setValue(excludeData.examinationFee);
    this.addFeesStructureForm.controls['sportsFee'].setValue(excludeData.sportsFee);
    this.addFeesStructureForm.controls['transportationFee'].setValue(excludeData.transportationFee);
    this.addFeesStructureForm.controls['libraryFee'].setValue(excludeData.libraryFee);
    this.addFeesStructureForm.controls['labFee'].setValue(excludeData.labFee);
    this.addFeesStructureForm.controls['securityFee'].setValue(excludeData.securityFee);
    this.addFeesStructureForm.controls['otherFee'].setValue(excludeData.otherFee);
    this.addFeesStructureForm.controls['paymentFrequency'].setValue(excludeData.paymentFrequency);
    this.addFeesStructureForm.controls['dueDate'].setValue(excludeData.dueDate);
    this.addFeesStructureForm.controls['lateFee'].setValue(excludeData.lateFee);
    this.addFeesStructureForm.controls['discount'].setValue(excludeData.discount);
    const classlistData = [{ "id": excludeData.classId, "text": excludeData.className }];
    $('.class_select2_drop_down').empty().trigger('change');
    (<any>$('.class_select2_drop_down')).select2({ data: classlistData });
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
  addFeesStructureSubmitForm(data: any) {
    data.classId = $('.class_select2_drop_down').val();
    if (data.classId != '') {
      if (data.feeId != null && data.feeId != '') {
        this.baseservice.put('fees/' + data.feeId, data).subscribe((result: any) => {
         
          this.getFeesStructureList();
          this.listTemplate();
          toastr.success('Record has been added successfully...!');
        },
          (err) => {
            toastr.error('Something went wrong...!');
            //  localStorage.clear();
          });
      } else {
        this.baseservice.post('fees', data).subscribe((result: any) => {
        
          this.getFeesStructureList();
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
  editFeesStructureSubmitForm(data: any) {
    this.baseservice.put('FeesStructure/' + data.FeesStructureId, data).subscribe((result: any) => {
     
      this.getFeesStructureList();
      this.listTemplate();
      toastr.success('Record has been updated successfully...!');
    },
      (err) => {
        toastr.error('Something went wrong...!');
        //  localStorage.clear();
      });
  }
  private getFeesStructureList() {
    this.baseservice.get('fees').subscribe((data: any) => {
      this.FeesStructureData = data.fees;
      this.refreshDataTable(data);
    },
      (err) => {
        //  localStorage.clear();
      });


  }

  private getClassList() {

    this.baseservice.get('classlistforfees').subscribe((data: any) => {
      this.classData = data.class;
      $('.class_select2_drop_down').empty().trigger('change');
      (<any>$('.class_select2_drop_down')).select2({ data: this.classData });
      $('.class_select2_drop_down').on('change', (event: any) => {
        console.log(event)

      });
    },
      (err) => {
        //  localStorage.clear();
      });
  }




  showtablerecord(data: any) {
    var iValue = 0;
    data.fees.forEach((item: any, index: any) => {
      item.srNo = index + 1;
    });
    this.datatable = $('.m_datatable').mDatatable({

      data: {
        type: 'local',
        source: data.fees,
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
        title: "Class Name",
      }, {
        field: "totalFee",
        title: "Total Fees",

      }, {
        field: "createdAt",
        width: 110,
        title: "Actions",
        sortable: false,
        overflow: 'visible',
        template: function (row: any) {
          return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="' + row.feeId + '"></i></span>';
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
        this.editFeesStructureData(id);
      }
    });
  }
}
