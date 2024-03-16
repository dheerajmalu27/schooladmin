import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
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
@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './test-result-report.html',
  encapsulation: ViewEncapsulation.None,
})
export class testResultReportComponent implements OnInit, AfterViewInit {
  myArray = [];
  classData: any = null;
  testResultData: any;
  schoolProfileData: any;
  pdfFileName: any;
  transformedReportList: any;
  transformedReportListKey: any;
  constructor(
    private _script: ScriptLoaderService,
    private baseservice: BaseService,
    private ComService: CommonService,
    private router: Router
  ) {}
  ngOnInit() {
    this.getTestClassList();
  }

  public buttonsetcolor(i: any) {
    if ((i + 1) % 5 == 0) {
      return 'btn m-btn--pill m-btn--air btn-primary';
    } else if ((i + 1) % 4 == 0) {
      return 'btn m-btn--pill m-btn--air btn-danger';
    } else if ((i + 1) % 3 == 0) {
      return 'btn m-btn--pill m-btn--air btn-success';
    } else if ((i + 1) % 2 == 0) {
      return 'btn m-btn--pill m-btn--air btn-info';
    } else {
      return 'btn m-btn--pill m-btn--air btn-warning';
    }
  }
  public generatePDF(str: string, str1: string) {
    this.pdfFileName = str1 + '-Result';
    let res = str.split('-');
    let postdata = { testId: res[0], classId: res[1], divId: res[2] };
    this.baseservice
      .get(
        'gettestclassdivisionreportlist?testId=' +
          res[0] +
          '&classId=' +
          res[1] +
          '&divId=' +
          res[2]
      )
      .subscribe(
        (data: any) => {
          if (data.reportlist != null && data.reportlist != '') {
            this.testResultData = data.reportlist;

            this.transformedReportList = this.transformReportList(
              data.reportlist
            );
            if (this.transformedReportList.length > 0) {
              this.transformedReportListKey = Object.keys(
                this.transformedReportList[0]
              );
              console.log(this.transformedReportListKey);
            }

            this.showModelPopup();
            // $("#contentToConvert").show();
          }
        },
        (err) => {
          console.log(err);
          //  localStorage.clear();
        }
      );

    this.baseservice.get('testclassreportlist').subscribe(
      (data: any) => {},
      (err) => {
        //  localStorage.clear();
      }
    );
  }
  private getTestClassList() {
    this.baseservice.get('schoolprofile').subscribe(
      (data: any) => {
        this.schoolProfileData = data.schoolprofile[0];
      },
      (err) => {
        //  localStorage.clear();
      }
    );
    this.baseservice.get('testclassreportlist').subscribe(
      (data: any) => {
        if (
          data.testreportclasslist != null &&
          data.testreportclasslist != ''
        ) {
          this.classData = _.groupBy(
            data.testreportclasslist,
            (ct) => ct.testId
          );
          this.classData = _.toArray(this.classData);
        }
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }
  public printDiv(divId: string): void {
    const printContents = document.getElementById(divId)?.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents || '';

    window.print();

    document.body.innerHTML = originalContents;
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
  tableToExcel(table: any) {
    this.ComService.tableToExcel(table, this.pdfFileName);
  }

  transformReportList(reportlist: any[]): any[] {
    return reportlist.map((item) => {
      let subjectMarks: any = {}; // Initialize subjectMarks as an empty object
      item.subjectData.forEach((sub: any) => {
        subjectMarks[sub.subName] = `${sub.getMarks}/${sub.totalMarks}`;
      });

      return {
        studentId: item.studentId,
        studentName: item.studentName,
        rollNo: item.rollNo,
        class: item.className + '-' + item.divName,
        rank: item.rank,
        ...subjectMarks,
        GetMarks: item.sumGetMarks,
        TotalMarks: item.sumTotalMarks,
        percentage: item.percentage,
      };
    });
  }
  public genratefile() {
    const data = document.getElementById('pdfgeneratehtml');

    if (!data) {
      console.error('Element #contentToConvert not found!');
      return; // exit the function if the element wasn't found
    }
    html2canvas(data, { useCORS: true, scale: 2 }).then((canvas) => {
      // Few necessary setting options
      var imgWidth = 208;
      var pageHeight = 295;
      var imgHeight = (canvas.height * imgWidth) / canvas.width;
      var heightLeft = imgHeight;

      const contentDataURL = canvas.toDataURL('image/png');
      let pdf = new jsPDF('p', 'mm', 'a4'); //new jspdf('p', 'mm', 'a4'); // A4 size page of PDF
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      pdf.save(this.pdfFileName); // Generated PDF
    });
  }
  ngAfterViewInit() {}
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
}
