import { Injectable, Renderer2, RendererFactory2, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  private renderer: Renderer2;

  constructor(
    private sanitizer: DomSanitizer,
    private rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: any
  ) {
    this.renderer = this.rendererFactory.createRenderer(null, null);
  }

  tableToExcel(tableId: string, name?: string) {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>';
    
    const base64 = (s: string) => window.btoa(decodeURIComponent(encodeURIComponent(s)));
    const format = (s: string, c: any) => s.replace(/{(\w+)}/g, (m, p) => c[p]);

    const tableElement = this.document.getElementById(tableId);
    if (tableElement) {
      const ctx = {
        worksheet: name || 'Worksheet',
        table: tableElement.outerHTML
      };
      const blobUrl = uri + base64(format(template, ctx));
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(blobUrl);
      window.open(String(safeUrl), '_blank');
    }
  }
}
