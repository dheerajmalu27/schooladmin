import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { BaseService } from '../_services/base.service';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import * as _ from 'lodash'; // Ensure lodash is correctly installed
declare var toastr: any;
@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private renderer: Renderer2;

  constructor(
    private baseservice: BaseService,
    private sanitizer: DomSanitizer,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: any
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }
  tableToExcel(table: any, worksheetName: string) {
    let schoolProfileStorageData: any = localStorage.getItem(
      environment.schoolProfileStoage
    );
    if (schoolProfileStorageData !== null) {
      schoolProfileStorageData = JSON.parse(
        this.b64_to_utf8(schoolProfileStorageData)
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

    const uri = 'data:application/vnd.ms-excel;base64,';

    const template =
      '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table style="border-collapse: collapse; border: 1px solid black;">{table}</table></body></html>';
    const base64 = (s: any) =>
      window.btoa(decodeURIComponent(encodeURIComponent(s)));
    const format = (s: any, c: any) =>
      s.replace(/{(\w+)}/g, (m: any, p: any) => c[p]);

    if (!table.nodeType) table = document.getElementById(table);

    const thCount = table.querySelectorAll('thead th').length;
    console.log('Total th elements:', thCount);
    // const schoolNameRow = `<tr><td colspan="${thCount}" style="font-size: 20px; text-align: center; border: 1px solid black;">${schoolProfileStorageData.schoolName}<br>${schoolProfileStorageData.schoolAddress}</td></tr>`;

    const schoolNameRow = `
  <tr>
    <td style="border-collapse: collapse; border: 1px solid black; height: 80px; width: 80px; text-align: center;">
      <img src="${environment.apiImageUrl}${
      schoolProfileStorageData.schoolLogo
    }" alt="School Logo" style="max-width: 100%; max-height: 100%;">
    </td>
    <td colspan="${
      thCount - 1
    }" style="font-size: 20px; text-align: center; border: 1px solid black;">
      ${schoolProfileStorageData.schoolName}<br>${
      schoolProfileStorageData.schoolAddress
    }
    </td>
  </tr>
`;

    // const schoolNameRow = `<tr><td colspan="${thCount}" style="font-size: 20px; text-align: center; border: 1px solid black;">${schoolProfileStorageData.schoolName}</td></tr><tr><td colspan="${thCount}" style="font-size: 20px; text-align: center; border: 1px solid black;">${schoolProfileStorageData.schoolAddress}</td></tr>`;
    const cells = table.querySelectorAll('th, td');
    cells.forEach((cell: any) => {
      cell.setAttribute(
        'style',
        'border-collapse: collapse; border: 1px solid black;'
      );
    });
    const ctx = {
      worksheet: worksheetName || 'Worksheet',
      table: schoolNameRow + table.innerHTML,
    };

    // Set the filename in the 'download' attribute
    const blob = new Blob([format(template, ctx)], {
      type: 'application/vnd.ms-excel',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = worksheetName || 'Workbook.xls';
    a.click();
    window.URL.revokeObjectURL(url);
    toastr.success('Excel file is generated successfully...!');
  }

  // tableToExcel(table: any, worksheetName: string) {
  //   let schoolProfileStorageData: any = localStorage.getItem(environment.schoolProfileStoage);
  //   if (schoolProfileStorageData !== null) {
  //     schoolProfileStorageData = JSON.parse(this.b64_to_utf8(schoolProfileStorageData));
  //   } else {
  //     console.error('schoolProfileStorageData is null');
  //     return;
  //   }

  //   const uri = 'data:application/vnd.ms-excel;base64,';
  //   const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>';
  //   const base64 = (s: any) => window.btoa(decodeURIComponent(encodeURIComponent(s)));
  //   const format = (s: any, c: any) => s.replace(/{(\w+)}/g, (m: any, p: any) => c[p]);

  //   if (!table.nodeType) table = document.getElementById(table);
  //   const ctx = {
  //     worksheet: worksheetName || 'Worksheet',
  //     table: table.innerHTML
  //   };

  //   // Set the filename in the 'download' attribute
  //   const blob = new Blob([format(template, ctx)], { type: 'application/vnd.ms-excel' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = worksheetName || 'Workbook.xls';
  //   a.click();
  //   window.URL.revokeObjectURL(url);
  //   toastr.success('Excel file is generated successfully...!');
  // }
  getDropDownClassList() {
    return this.baseservice.get('class').pipe(
      map((data: any) => {
        const resultArray: Array<any> = [];
        const classData = data.class;
        classData.map((item: any) => {
          resultArray.push(
            _.mapKeys(item, (value: any, key: string) => {
              return key === 'className' ? 'text' : key;
            })
          );
        });

        return resultArray.map((o) => _.pick(o, ['id', 'text']));
      })
    );
  }

  getDropDownDivisionList() {
    return this.baseservice.get('division').pipe(
      map((data: any) => {
        const resultArray: Array<any> = [];
        const divisionData = data.division;
        divisionData.map((item: any) => {
          resultArray.push(
            _.mapKeys(item, (value: any, key: string) => {
              return key === 'className' ? 'text' : key;
            })
          );
        });
        return resultArray;
      })
    );
  }
  utf8_to_b64(str: string): string {
    return btoa(
      encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt('0x' + p1));
      })
    );
  }

  b64_to_utf8(str: string): string {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(str), (c) => {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
  }
}
