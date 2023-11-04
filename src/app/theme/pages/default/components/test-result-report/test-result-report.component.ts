import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import {BaseService} from '../../../../../_services/base.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas'; 
declare let $: any
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./test-result-report.html",
  encapsulation: ViewEncapsulation.None,
})
export class testResultReportComponent implements OnInit, AfterViewInit {
   myArray= [];
  classData:any =null;
  testResultData:any;
  
  constructor(private _script: ScriptLoaderService,private baseservice: BaseService
    , private router: Router) {
    
    }
  ngOnInit() {
this.getTestClassList();
  }

 public buttonsetcolor(i:any){
    if((i+1)%5==0){
      return 'btn m-btn--pill m-btn--air btn-primary';
    }else if((i+1)%4==0){
      return 'btn m-btn--pill m-btn--air btn-danger';
    }else if((i+1)%3==0){
      return 'btn m-btn--pill m-btn--air btn-success';
    }else if((i+1)%2==0){
      return 'btn m-btn--pill m-btn--air btn-info';
    }else{
      return 'btn m-btn--pill m-btn--air btn-warning';
    }
  }
  public generatePDF(str:string) 
  { 
	// let str='1-1-1';
    let res = str.split("-");
    let postdata={"testId":res[0],"classId":res[1],"divId":res[2] };
    this.baseservice.get('gettestclassdivisionreportlist?testId='+res[0]+'&classId=' + res[1] + '&divId=' + res[2]).subscribe((data:any) => { 
      if(data.reportlist!=null && data.reportlist!=''){
        this.testResultData=data.reportlist;
        // this.genratefile();
        $("#contentToConvert").show();
            }
    },
    (err) => {
     console.log(err);
    //  localStorage.clear();
    });
    
    this.baseservice.get('testclassreportlist').subscribe((data:any) => {
     
     
   },
   (err) => {
   //  localStorage.clear();
   });   
 
  } 
  private getTestClassList() {
    this.baseservice.get('testclassreportlist').subscribe((data:any) => {
      if(data.testreportclasslist!=null && data.testreportclasslist!=''){
        this.classData=_.groupBy(data.testreportclasslist,ct => ct.testId);
        this.classData=_.toArray(this.classData);
      }
     
   },
   (err) => {
   //  localStorage.clear();
   });   
 }
 public generateFile() {
  const data = document.getElementById('contentData');

  if (!data) {
    console.error('Element #contentToConvert not found!');
    return; // exit the function if the element wasn't found
  }
  data.style.background = 'white';

  // Determine the dimensions of the content
  let contentWidth = data.offsetWidth-150;
  const contentHeight = data.offsetHeight;

  // Create a PDF with the same dimensions as the content
  const pdf = new jsPDF('p', 'mm', [contentWidth, contentHeight]);
  // const pdf = new jsPDF('p', 'mm', 'a4');
  // Convert the content to a canvas
  html2canvas(data, { scale: 2, logging: false, }).then((canvas) => {
    const contentDataURL = canvas.toDataURL('image/png');
    pdf.addImage(contentDataURL, 'PNG', 0, 0, contentWidth, contentHeight);
    pdf.save('MYPdf.pdf'); // Generated PDF
  });
}

public genratefile(){
  const data = document.getElementById('pdfgeneratehtml');
    
  if (!data) {
      console.error('Element #contentToConvert not found!');
      return; // exit the function if the element wasn't found
  }
  html2canvas(data, { scale: 2 }).then((canvas) => { 
  // Few necessary setting options 
  var imgWidth = 208; 
  var pageHeight = 295; 
  var imgHeight = canvas.height * imgWidth / canvas.width; 
  var heightLeft = imgHeight; 
  
  const contentDataURL = canvas.toDataURL('image/png') 
  let pdf =new jsPDF('p', 'mm', 'a4');//new jspdf('p', 'mm', 'a4'); // A4 size page of PDF 
  var position = 0; 
  pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight) 
  pdf.save('MYPdf.pdf'); // Generated PDF  
  }); 
}
  ngAfterViewInit() {  

  }  
}