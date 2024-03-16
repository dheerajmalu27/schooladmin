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
import { BaseService } from '../../../../../_services/base.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { CommonService } from '../../../../../_services/common-api.service';
declare let $: any;
declare var toastr: any;
@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './final-result-report.html',
  encapsulation: ViewEncapsulation.None,
})
export class finalResultReportComponent implements OnInit, AfterViewInit {
  datatable: any;
  showTemplate: any;
  classData: any;
  divisionData: any;
  testData: any;
  subjectData: any;
  schoolProfileData: any;
  finalResultData: any;
  pdfFileName: any;
  transformedReportList: any;
  transformedReportListKey: any;
  constructor(
    private elRef: ElementRef,
    private ComService: CommonService,
    private renderer: Renderer2,
    private _script: ScriptLoaderService,
    private baseservice: BaseService,
    private router: Router
  ) {
    this.getFinalResultList();
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

  parseResultData(resultData: string): any[] {
    const parsedResultData = JSON.parse(resultData);

    // Convert the parsed object into an array of subjects
    return Object.keys(parsedResultData).map((name) => ({
      name,
      marks: parsedResultData[name].split('/')[0], // Extract marks from the string
      total: parsedResultData[name].split('/')[1], // Extract total from the string
    }));
  }
  public printDiv(divId: string): void {
    const printContents = document.getElementById(divId)?.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents || '';

    window.print();

    document.body.innerHTML = originalContents;
  }
  public async generateFile() {
    const cards = document.querySelectorAll<HTMLElement>('.student-row');

    if (!cards || cards.length === 0) {
      console.error('No student ID cards found!');
      return;
    }

    const pdf = new jsPDF();

    // Array to store promises for each card
    const promises: Promise<void>[] = [];

    // Iterate over each card and add it to the PDF
    cards.forEach((card, index) => {
      // Convert the card to a canvas
      const promise = html2canvas(card, {
        useCORS: true,
      }).then(async (canvas) => {
        // Add the canvas to a new page in the PDF
        if (index > 0) {
          pdf.addPage();
        }
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        await pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // If this is the last card, save the PDF
        if (index === cards.length - 1) {
          pdf.save(this.pdfFileName);
        }
      });
      promises.push(promise);
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
  }
  // public generateFile() {
  //   const data = document.getElementById('contentData');
  //   console.log(data);

  //   if (!data) {
  //     console.error('Element #contentToConvert not found!');
  //     return; // exit the function if the element wasn't found
  //   }
  //   data.style.background = 'white';

  //   // Determine the dimensions of the content
  //   let contentWidth = data.offsetWidth - 150;
  //   const contentHeight = data.offsetHeight;

  //   // Create a PDF with the same dimensions as the content
  //   const pdf = new jsPDF('p', 'mm', [contentWidth, contentHeight]);
  //   // const pdf = new jsPDF('p', 'mm', 'a4');
  //   // Convert the content to a canvas
  //   html2canvas(data, { useCORS: true, scale: 2, logging: false }).then(
  //     (canvas) => {
  //       const contentDataURL = canvas.toDataURL('image/png');
  //       pdf.addImage(contentDataURL, 'PNG', 0, 0, contentWidth, contentHeight);
  //       pdf.save(this.pdfFileName); // Generated PDF
  //     }
  //   );
  // }
  public showModelPopup() {
    $('#myModel').addClass('modal fade show');
    $('#myModel').show();
    $('#myModel .modal-open').show();
  }
  public hideModelPopup() {
    $('#myModel').removeClass('modal fade show');
    $('#myModel').hide();
    $('#myModel .modal-open').hide();
  }
  public calculatePercentage(parsedResultData: any) {
    let ResultData = JSON.parse(parsedResultData);
    if (ResultData.Total) {
      const obtainedMarks = parseFloat(ResultData.Total.split('/')[0]);
      const totalMarks = parseFloat(ResultData.Total.split('/')[1]);
      const percentage = (obtainedMarks / totalMarks) * 100;
      return parseFloat(percentage.toFixed(2));
    }
    return 0; // Default to 0 if 'Total' is not present
  }

  tableToExcel(table: any) {
    this.ComService.tableToExcel(table, this.pdfFileName);
  }

  transformFinalReportList(reportlist: any[]): any[] {
    return reportlist.map((item) => {
      let subjectMarks: any = {}; // Initialize subjectMarks as an empty object

      return {
        studentId: item.studentId,
        studentName: item.studentName,
        rollNo: item.rollNo,
        class: item.className + '-' + item.divName,
        rank: item.rank,
        ...JSON.parse(item.resultData),
        GetMarks: item.getMarks,
        TotalMarks: item.totalMarks,
        percentage: item.percentage,
      };
    });
  }
  resultClassDivision(data: any, fileName: any) {
    if (data != '' && data != null) {
      this.baseservice
        .get(
          'finalresultbyclass?classId=' +
            data.split('-')[0] +
            '&divId=' +
            data.split('-')[1]
        )
        .subscribe(
          (data: any) => {
            this.finalResultData = data.finalResultData;
            this.finalResultData.forEach((student: any) => {
              student.percentage = this.calculatePercentage(student.resultData);
            });
            this.transformedReportList = this.transformFinalReportList(
              this.finalResultData
            );
            if (this.transformedReportList.length > 0) {
              this.transformedReportListKey = Object.keys(
                this.transformedReportList[0]
              );
              console.log(this.transformedReportListKey);
            }
            this.pdfFileName = fileName;
            this.showModelPopup();
            toastr.success('Final result downloaded successfully...!');
          },
          (err) => {
            console.log(err);
            toastr.error('Something went wrong...!');
            //  localStorage.clear();
          }
        );
    }
  }

  private getFinalResultList() {
    this.baseservice.get('schoolprofile').subscribe(
      (data: any) => {
        this.schoolProfileData = data.schoolprofile[0];
      },
      (err) => {
        //  localStorage.clear();
      }
    );
    this.baseservice.get('finalresultclassreportlist').subscribe(
      (data: any) => {
        this.classData = data.finalresultclasslist;
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
    // let dataJSONArray = JSON.parse(data.teacher);
    data.finalresultclasslist.forEach((item: any, index: any) => {
      item.srNo = index + 1;
    });
    this.datatable = $('.m_datatable').mDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: data.finalresultclasslist,
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
          field: 'className',
          title: 'Class',
        },
        {
          field: 'divName',
          title: 'Division Name',
        },
        {
          field: 'createdAt',
          width: 110,
          title: 'Final Result',
          sortable: false,
          overflow: 'visible',
          template: function (row: any) {
            return (
              '<span class="btn m-btn  m-btn--icon m-badge m-badge--danger m-badge--wide result-button" data-id="' +
              row.classId +
              '-' +
              row.divId +
              '"  data-filename="' +
              row.className +
              '-' +
              row.divName +
              '-Final-Result"> Generate </span>'
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

    $('#m_form_status, #m_form_type').selectpicker();

    this.renderer.listen(
      this.elRef.nativeElement.querySelector('.m_datatable'),
      'click',
      (e) => {
        if ((e.target as HTMLElement).classList.contains('result-button')) {
          e.preventDefault();
          const id = (e.target as HTMLElement).getAttribute('data-id');
          const datafilename = (e.target as HTMLElement).getAttribute(
            'data-filename'
          );

          this.resultClassDivision(id, datafilename);
        }
      }
    );
  }
}
