import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { BaseService } from '../_services/base.service';
import { map } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import * as _ from 'lodash';  // Ensure lodash is correctly installed

@Injectable({
  providedIn: 'root'
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

  // tableToExcel(table: string, name?: string) {
  //   const uri = 'data:application/vnd.ms-excel;base64,';
  //   const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>';
  //   const base64 = function (s:any) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) };
  //   const format = function (s:any, c:any) { return s.replace(/{(\w+)}/g, function (m:any, p:any) { return c[p]; }) };
    
  //   // Using Angular's ViewChild to get the table content
  //   const ctx = { worksheet: table || 'Worksheet',  table };
  //   const link = document.createElement('a');
  //   link.href = uri + base64(format(template, ctx));
  //   link.download = 'data.xls';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }
  tableToExcel(table: any, worksheetName: string) {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>';
    const base64 = (s: any) => window.btoa(decodeURIComponent(encodeURIComponent(s)));
    const format = (s: any, c: any) => s.replace(/{(\w+)}/g, (m: any, p: any) => c[p]);

    if (!table.nodeType) table = document.getElementById(table);
    const ctx = {
        worksheet: worksheetName || 'Worksheet',
        table: table.innerHTML
    };
    window.location.href = uri + base64(format(template, ctx));
}

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
        
        return resultArray.map(o => _.pick(o, ['id', 'text']));
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
        })
        return resultArray;
      })
    );
  }
}
