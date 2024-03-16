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
import { CommonService } from '../../../../../_services/common-api.service';
import {
  ReactiveFormsModule,
  FormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../../../../../_services/base.service';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash';
import { el } from '@fullcalendar/core/internal-common';
declare let $: any;
declare var toastr: any;
@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './admission-records.html',
  encapsulation: ViewEncapsulation.None,
})
export class AdmissionRecordsComponent implements OnInit, AfterViewInit {
  datatable: any; // Change the type to your actual data type
  admissionData: any = null;
  admissionReportData: any = null;
  isDisabled: boolean = true;
  TitleSet: any = null;
  stateData: any = null;
  cityData: any = null;
  feesData: any = null;
  divisionData: any = null;
  classData: any = null;
  showTemplate: any;
  selectedFiles: any;
  addAdmissionForm: any;
  studentId = null;
  selectedAdmissionType: string | null = null;
  isStudentSelectionVisible: boolean = true;
  selectedStudent: any;
  finalResultStudentData: any;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private commonservice: CommonService,
    private _script: ScriptLoaderService,
    private router: Router,
    public fb: FormBuilder,
    private baseservice: BaseService
  ) {}
  ngOnInit() {
    this.getAdmissionList();

    this.listTemplate();
  }
  listTemplate() {
    $('#listTemplate').show();
  }

  tableToExcel(table: any) {
    this.commonservice.tableToExcel(table, 'Old Admission List');
  }
  ngAfterViewInit() {}
  private getAdmissionList() {
    this.baseservice.get('admission').subscribe(
      (data: any) => {
        this.admissionData = data.admission;
        this.admissionReportData = this.admissionData.map((admission: any) => {
          // Parse the feesPaymentDetails string into an object
          const feesPaymentDetails = JSON.parse(admission.feesPaymentDetails);

          // Merge the properties of feesPaymentDetails into the main object using the spread operator
          return { ...admission, ...feesPaymentDetails };
        });

        // console.log(this.admissionReportData);
        this.refreshDataTable(data);
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }

  public refreshDataTable(newData: any): void {
    // Destroy existing datatable

    if (this.datatable) {
      this.datatable.destroy(); // Destroy existing datatable instance
      this.showtablerecord(newData); // Reinitialize datatable with new data
    } else {
      this.showtablerecord(newData);
    }

    // Show new data in datatable
  }
  public showtablerecord(data: any) {
    try {
      let i = 1;

      // Assuming you're still using the jQuery based datatable.
      // Consider using Angular-based datatable libraries for more integration.
      this.datatable = $('.m_datatable').mDatatable({
        // datasource definition
        data: {
          type: 'local',
          source: data.admission,
          pageSize: 10,
        },

        layout: {
          theme: 'default', // datatable theme
          class: '', // custom wrapper class
          scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
          height: 450, // datatable's body's fixed height
          footer: false, // display/hide footer
        },
        sortable: true,

        pagination: true,
        columns: [
          {
            field: '',
            title: 'Sr.No.',
            textAlign: 'center',
            sortable: false,
            template: function (row: any) {
              return i++;
            },
          },
          {
            field: 'firstName',
            title: 'Student Name',
            template: function (row: any) {
              if (
                row.profileImage != null &&
                row.profileImage != '' &&
                row.profileImage != 'null'
              ) {
                return (
                  '<span (click)="detailProfile(' +
                  row.id +
                  ')" style="cursor: pointer;"  class="teacherFn" data-id="' +
                  row.id +
                  '">   ' +
                  row.firstName +
                  ' ' +
                  row.lastName +
                  '</span></span>'
                );
              } else {
                return (
                  '<span (click)="detailProfile(' +
                  row.id +
                  ')" style="cursor: pointer;"  class="teacherFn" data-id="' +
                  row.id +
                  '">' +
                  row.firstName +
                  ' ' +
                  row.lastName +
                  '</span>'
                );
              }
            },
          },
          {
            field: 'className',
            title: 'Class Name',
            template: function (row: any) {
              return row.className + '-' + row.divName;
            },
          },
          {
            field: 'fatherName',
            title: 'Father Name ',
          },
          {
            field: 'paymentAmount',
            title: 'Paid Amount',
          },
          {
            field: 'studentId',
            title: 'Is Student',
            template: function (row: any) {
              if (row.studentId != 'null') {
                return 'Student rollNo- ' + row.rollNo;
              } else {
                return 'Not Student';
              }
            },
          },
          {
            field: 'createdAt',
            title: 'Admission Date',
            template: function (row: any) {
              const dateString = '2024-02-27T03:52:52.000Z';
              const dateObject = new Date(row.createdAt);
              return dateObject
                .toISOString()
                .replace('T', ' ')
                .replace(/\.\d{3}Z/, '');
            },
          },
        ],
      });

      const query = this.datatable.getDataSourceQuery();

      const formSearch =
        this.elRef.nativeElement.querySelector('#m_form_search');
      const formStatus =
        this.elRef.nativeElement.querySelector('#m_form_status');
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
        this.elRef.nativeElement.querySelectorAll(
          '#m_form_status, #m_form_type'
        )
      ).selectpicker();

      this.renderer.listen(
        this.elRef.nativeElement.querySelector('.m_datatable'),
        'click',
        (e) => {}
      );
      // For elements inside datatable, you might still need jQuery.
      $(this.elRef.nativeElement.querySelector('.m_datatable')).on(
        'click',
        '.teacherFn',
        (e: any) => {
          e.preventDefault();
          const id = $(e.target).attr('data-id');
        }
      );

      // $(this.elRef.nativeElement.querySelector('.m_datatable')).on('click', '.edit-button', (e:any) => {
      //   e.preventDefault();
      //   const id = $(e.target).attr('data-id');
      //   this.getAdmissionData(id);
      // });
    } catch (error) {
      console.log(error);
    }
  }
}
