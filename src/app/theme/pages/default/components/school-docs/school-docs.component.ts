import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { BaseService } from '../../../../../_services/base.service';
import { environment } from 'src/environments/environment';
declare let $: any;
declare var toastr: any;
@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './school-docs.html',
  encapsulation: ViewEncapsulation.None,
})
export class SchoolDocsComponent implements OnInit, AfterViewInit {
  showTemplate: any;
  schoolDocData: any;
  datatable: any;
  addDocForm: FormGroup;
  selectedFiles: any;
  constructor(
    private _script: ScriptLoaderService,
    private baseservice: BaseService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient,
    private elRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.getSchoolOtherDocslist();
    this.addDocForm = this.fb.group({
      id: [null],
      docName: [null, Validators.required],
      filePath: [null, Validators.required],
    });
  }

  ngOnInit() {
    this.listTemplate();
  }

  ngAfterViewInit() {
    this.listTemplate();
  }

  listTemplate() {
    $('#addTemplate').hide();
    $('#listTemplate').show();
  }

  addTemplate() {
    $('#addTemplate').show();
    this.addDocForm.reset();
    $('#listTemplate').hide();
  }

  editTemplate() {
    $('#addTemplate').show();
    $('#listTemplate').hide();
  }

  private editDocData(data: any) {
    let excludeData = data.split('*');
    this.addDocForm.controls['id'].setValue(excludeData[0]);
    this.addDocForm.controls['docName'].setValue(excludeData[1]);
    this.editTemplate();
  }
  private deleteDocData(id: any) {
    const confirmation = window.confirm(
      'Are you sure you want to delete this record?'
    );
    if (!confirmation) {
      return; // Do nothing if the user cancels the confirmation
    }

    this.baseservice.delete(<string>('schoolotherdocs/' + id)).subscribe(
      (data: any) => {
        this.getSchoolOtherDocslist();
        this.listTemplate();
        toastr.success('Record deleted successfully...!');
      },
      (err) => {
        toastr.error('Something went wrong...!');
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
  }
  addDocSubmitForm(data: any) {
    const fileInput = document.getElementById(
      'fileInput'
    ) as HTMLInputElement | null;
    const formData: FormData = new FormData();
    for (const key of Object.keys(data)) {
      formData.append(key, data[key]);
    }
    if (fileInput && fileInput.files) {
      if (fileInput.files.length > 0) {
        formData.set('filePath', fileInput.files[0]);
      }
    }
    if (data.id == null || data.id == '') {
      formData.delete('id');
      this.baseservice.post('schoolotherdocs', formData).subscribe(
        (result: any) => {
          toastr.success('Record has been added successfully...!');
          this.getSchoolOtherDocslist();
          this.listTemplate();
        },
        (err) => {
          // localStorage.clear();
        }
      );
    } else {
      this.baseservice.put('schoolotherdocs/' + data.id, formData).subscribe(
        (result: any) => {
          toastr.success('Record has been updated successfully...!');
          this.getSchoolOtherDocslist();
          this.listTemplate();
        },
        (err) => {
          // localStorage.clear();
        }
      );
    }
  }

  private getSchoolOtherDocslist() {
    this.baseservice.get('schoolotherdocs').subscribe(
      (data: any) => {
        this.schoolDocData = data.schoolOtherDocs;
        this.refreshDataTable(data);
      },
      (err) => {
        // localStorage.clear();
      }
    );
  }
  selectFile(event: any) {
    this.selectedFiles = event.target.files[0];
  }
  public showtablerecord(data: any) {
    data.schoolOtherDocs.forEach((item: any, index: any) => {
      item.srNo = index + 1;
    });

    // Assume you still use jQuery-based datatable for now
    this.datatable = $('.m_datatable').mDatatable({
      data: {
        type: 'local',
        source: data.schoolOtherDocs,
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
      columns: [
        {
          field: 'srNo',
          title: 'Sr.No.',
        },
        {
          field: 'docName',
          title: 'Document Name',
        },
        {
          field: 'filePath',
          title: 'Download File',
          // callback function support for column rendering
          template: (row: any) => {
            return (
              '<a href="' +
              environment.apiImageUrl +
              row.filePath +
              '" target="_blank"><span class="btn m-btn  m-btn--icon m-badge m-badge--danger m-badge--wide allocate-button" data-id="' +
              row.id +
              '"> Download </span></a>'
            );
          },
        },
        {
          field: 'createdAt',
          width: 110,
          title: 'Actions',
          sortable: false,
          overflow: 'visible',
          template: function (row: any) {
            return (
              '<span class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill"><i class="edit-button la la-edit" data-id="' +
              row.id +
              '*' +
              row.docName +
              '"></i></span><span class="btn m-btn m-btn--hover-danger m-btn--icon m-btn--icon-only m-btn--pill"><i class="delete-button fa fa-trash-o" data-id="' +
              row.id +
              '"></i></span>'
            );
          },
        },
      ],
    });

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

    // For the .edit-button, continue using jQuery since it's tied to your jQuery-based plugin:
    $(this.elRef.nativeElement.querySelector('.m_datatable')).on(
      'click',
      '.edit-button',
      (e: any) => {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        this.editDocData(id);
      }
    );
    $(this.elRef.nativeElement.querySelector('.m_datatable')).on(
      'click',
      '.delete-button',
      (e: any) => {
        e.preventDefault();
        const id = e.target.getAttribute('data-id');
        this.deleteDocData(id);
      }
    );
  }
}
