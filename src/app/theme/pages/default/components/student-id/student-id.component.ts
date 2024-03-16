import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { CommonService } from '../../../../../_services/common-api.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { BaseService } from '../../../../../_services/base.service';
import { FormControl, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
declare let $: any;
@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './student-id.html',
  encapsulation: ViewEncapsulation.None,
})
export class StudentIdComponent implements OnInit, AfterViewInit {
  imageUrlPath = environment.apiImageUrl;
  studentData: any = null;
  isValid = false;
  pdfFileName = 'Student Id Cards';
  studentEditData: any;
  StudentClassListData: any;
  divisionData: any = null;
  classData: any = null;
  datatable: any;
  classStudentReportForm: any;
  dateHeaders: any;
  TableTitle: any;

  constructor(
    private commonservice: CommonService,
    private elRef: ElementRef,
    private renderer: Renderer2,
    private _script: ScriptLoaderService,
    private baseservice: BaseService,
    private router: Router,
    public fb: FormBuilder
  ) {
    // this.getStudentList();
  }
  ngOnInit() {
    $('#listTemplate').hide();
    this.classStudentReportForm = this.fb.group({
      classId: new FormControl(),
      divId: new FormControl(),
    });
    this.getClassList();
    this.getDivisionList();
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-daterangepicker.js'
    );
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js'
    );
  }

  ngAfterViewInit() {
    $('#listTemplate').hide();
  }
  private getClassList() {
    this.baseservice.get('classlist').subscribe(
      (data: any) => {
        this.classData = data.class;
        (<any>$('.class_select2_drop_down')).select2({ data: this.classData });
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }
  private getDivisionList() {
    this.baseservice.get('divisionlist').subscribe(
      (data: any) => {
        this.divisionData = data.division;
        (<any>$('.division_select2_drop_down')).select2({
          data: this.divisionData,
        });
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }
  attendanceReportSubmitForm(data: any) {
    data.divId = $('.division_select2_drop_down').val();
    data.classId = $('.class_select2_drop_down').val();

    if (data.divId != '' && data.classId != '') {
      this.baseservice
        .get(
          'getallclassdivisionstudentlist?classId=' +
            data.classId +
            '&divId=' +
            data.divId
        )
        .subscribe(
          (data: any) => {
            this.dateHeaders = Object.keys(data.students[0]).filter(
              (key) => !['rollNo', 'fullName'].includes(key)
            );

            this.StudentClassListData = data.students;
            this.TableTitle =
              'Class-' +
              $('#select2-m_select2_1-container').text() +
              ' Div-' +
              $('#select2-m_select2_2-container').text() +
              '-Report';

            $('#listTemplate').show();
            console.log(this.StudentClassListData);
            this.showModelPopup();
            let schoolProfileStorageData: any = localStorage.getItem(
              environment.schoolProfileStoage
            );
            if (schoolProfileStorageData !== null) {
              schoolProfileStorageData = JSON.parse(
                this.commonservice.b64_to_utf8(schoolProfileStorageData)
              );
            } else {
              console.error('schoolProfileStorageData is null');
              return;
            }

            // Check if schoolProfileStorageData is an object and has the schoolName property
            if (
              typeof schoolProfileStorageData !== 'object' ||
              !schoolProfileStorageData.schoolName
            ) {
              console.error(
                'schoolProfileStorageData is not in the correct format or missing schoolName property'
              );
              return;
            }
            this.StudentClassListData.forEach((studentData: any) => {
              // Add school profile data to each student object
              studentData.schoolName = schoolProfileStorageData.schoolName;
              studentData.schoolAddress =
                schoolProfileStorageData.schoolAddress;
              studentData.schoolLogo = schoolProfileStorageData.schoolLogo;
            });
            console.log(schoolProfileStorageData);
          },
          (err) => {
            $('#listTemplate').hide();
            //  localStorage.clear();
          }
        );
    }
  }
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
  public printDiv(divId: string): void {
    const printContents = document.getElementById(divId)?.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents || '';

    window.print();

    document.body.innerHTML = originalContents;
  }

  public async generateFile() {
    const cards = document.querySelectorAll<HTMLElement>('.col-mb-4');

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
        if (index > -1) {
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

  //   if (!data) {
  //     console.error('Element #contentData not found!');
  //     return;
  //   }

  //   const pdf = new jsPDF('p', 'mm', 'a4');

  //   html2canvas(data).then((canvas) => {
  //     const contentDataURL = canvas.toDataURL(); // By default, the format will be detected automatically

  //     // Determine the image format (PNG or JPEG) based on the data URL
  //     const imageFormat = contentDataURL.includes('data:image/jpeg')
  //       ? 'JPEG'
  //       : 'PNG';

  //     // Add the image of the content to the PDF
  //     const imgWidth = pdf.internal.pageSize.getWidth();
  //     const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     pdf.addImage(contentDataURL, imageFormat, 0, 0, imgWidth, imgHeight);

  //     // Save the PDF
  //     pdf.save(this.pdfFileName);
  //   });
  // }
  // public generateFile() {
  //   const modalContent = document.querySelector('#myModel .modal-content');

  //   if (!modalContent) {
  //     console.error('Modal content not found!');
  //     return;
  //   }

  //   const pdf = new jsPDF('p', 'mm', 'a4');

  //   // Get all images within the modal content
  //   const images = Array.from(modalContent.querySelectorAll('img'));

  //   // Promises for each image conversion
  //   const imagePromises = images.map((image) => {
  //     return new Promise<void>((resolve) => {
  //       // Convert each image to a canvas
  //       html2canvas(image).then((canvas) => {
  //         const imageDataURL = canvas.toDataURL(); // Auto-detect image format

  //         // Add the canvas image to the PDF
  //         const imgWidth = pdf.internal.pageSize.getWidth();
  //         const imgHeight = (canvas.height * imgWidth) / canvas.width;

  //         const imageFormat = imageDataURL.includes('data:image/jpeg')
  //           ? 'JPEG'
  //           : 'PNG';

  //         pdf.addImage(imageDataURL, imageFormat, 0, 0, imgWidth, imgHeight);

  //         // Add a new page if there are more images
  //         if (images.indexOf(image) < images.length - 1) {
  //           pdf.addPage();
  //         }

  //         resolve();
  //       });
  //     });
  //   });

  //   // Wait for all image conversions to complete before saving the PDF
  //   Promise.all(imagePromises).then(() => {
  //     pdf.save(this.pdfFileName);
  //   });
  // }
  // public generateFile(): void {
  //   const pdf = new jsPDF();

  //   const contentWidth = 3.375; // Width of the student ID card in inches
  //   const contentHeight = 2.125; // Height of the student ID card in inches
  //   const scaleFactor = 2; // Scale factor for conversion from inches to points

  //   const promises = this.StudentClassListData.map((studentData: any, index: any) => {
  //     const cardX = (index % 2) * contentWidth * scaleFactor; // Position of card horizontally
  //     const cardY = Math.floor(index / 2) * contentHeight * scaleFactor; // Position of card vertically

  //     const contentDataURL = `${this.imageUrlPath}${studentData.profileImage}`;

  //     return fetch(contentDataURL)
  //       .then(response => response.blob())
  //       .then(blob => {
  //         const reader = new FileReader();
  //         reader.onload = () => {
  //           const imageDataUrl = reader.result as string;
  //           pdf.addImage(
  //             imageDataUrl,
  //             'JPEG',
  //             cardX,
  //             cardY,
  //             contentWidth * scaleFactor,
  //             contentHeight * scaleFactor
  //           );

  //           // Add a new page after every two cards (assuming a layout of 2 cards per row)
  //           if ((index + 1) % 2 === 0) {
  //             pdf.addPage();
  //           }
  //         };
  //         reader.readAsDataURL(blob);
  //       })
  //       .catch(error => {
  //         console.error('Error loading image:', error);
  //       });
  //   });

  //   Promise.all(promises).then(() => {
  //     pdf.save('student_id_cards.pdf');
  //   });
  // }

  tableToExcel(table: any) {
    let FileName =
      'Student-List-Class' +
      $('.class_select2_drop_down').val() +
      'Division-' +
      $('.division_select2_drop_down').val();
    this.commonservice.tableToExcel(table, FileName);
  }
}
