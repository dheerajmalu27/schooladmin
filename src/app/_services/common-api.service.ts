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

  tableToExcel(tableId: string, name?: string) {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html...></html>';  // truncated for brevity
    
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
