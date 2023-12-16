import { Component, OnInit, ViewEncapsulation,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { HttpClient, HttpHeaders } from "@angular/common/http"; // Updated HTTP client
import { AmChartsService } from '@amcharts/amcharts3-angular'; // Note: Check for AmCharts 4 Angular support
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../../../../../_services/base.service';
declare let $: any;
import * as _ from 'lodash';
import { appVariables } from '../../../../../app.constants';
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./student-profile.html",
  encapsulation: ViewEncapsulation.None,
})
export class StudentProfileComponent implements OnInit, AfterViewInit {
  imageUrlPath=appVariables.apiImageUrl;
  private chart: any;
  public studentData: any = {};
  public studentSubjectChart: Array<any> = [];
  public studentAttendChart: any;
  public studentTestChart: any;
  public studentFinalResult:any;
  public studentInfo: any = {};
  public id: any;
  private datatable:any;
  constructor(
    private elRef: ElementRef, 
    private renderer: Renderer2,
    private AmCharts: AmChartsService, 
    private route: ActivatedRoute, 
    private http: HttpClient, // Updated HTTP client
    private baseservice: BaseService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getStudentData(this.id, this.AmCharts);
  }

  ngAfterViewInit() {}

  // private getStudentData(newid:any, newAmCharts:any) {
  //   const auth = localStorage.getItem('sauAuth');
  //   const headers = new HttpHeaders({
  //       'Content-Type': 'application/json',
  //       'authorization': auth ? auth : ''
  //   });
    
  //   this.baseservice.get('studentprofile/'+ newid).subscribe((data: any) => {
  //     // ... (same logic)
  //   },
  //   (err) => {
  //     // ... (same logic)
  //   });
  // }
  private getStudentData(newid:any, newAmCharts:any) {
        const auth = localStorage.getItem('sauAuth');
    const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': auth ? auth : ''
    });
   this.baseservice.get('studentprofile/'+ newid).subscribe((data) => {   
      this.studentData = data;
      console.log(this.studentData);
      this.openHomeworkList(data);
      this.studentInfo = this.studentData.info;
      this.studentTestChart = _.meanBy(this.studentData.testresult, 'result').toFixed(2);
      this.studentData.monthlyattendance = _.each(this.studentData.monthlyattendance, item => item.result = parseFloat(item.result));
      this.studentAttendChart = _.meanBy(this.studentData.monthlyattendance, 'result').toFixed(2);
      this.studentFinalResult=this.studentData.finalresult;
      newAmCharts.makeChart("m_amcharts_1", {
        "type": "serial",
        "theme": "light",
        "dataProvider": this.studentData.monthlyattendance,
        "valueAxes": [{
          "gridColor": "#FFFFFF",
          "gridAlpha": 0.2,
          "dashLength": 0,
          "maximum": 100
        }],
        "gridAboveGraphs": true,
        "startDuration": 1,
        "graphs": [{
          "balloonText": "[[category]]: <b>[[value]]</b>",
          "fillAlphas": 0.8,
          "lineAlpha": 0.2,
          "type": "column",
          "valueField": "result"
        }],
        "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
        },
        "categoryField": "month",
        "categoryAxis": {
          "gridPosition": "start",
          "gridAlpha": 0,
          "tickPosition": "start",
          "tickLength": 100
        },
        "export": {
          "enabled": false
        }
      });


      newAmCharts.makeChart("m_amcharts_2", {
        "type": "serial",
        "theme": "light",
        "dataProvider": this.studentData.testresult,
        "valueAxes": [{
          "gridColor": "#FFFFFF",
          "gridAlpha": 0.2,
          "dashLength": 0,
          "maximum": 100
        }],
        "gridAboveGraphs": true,
        "startDuration": 1,
        "graphs": [{
          "balloonText": "[[category]]: <b>[[value]]</b>",
          "fillAlphas": 0.8,
          "lineAlpha": 0.2,
          "type": "column",
          "valueField": "result"
        }],
        "chartCursor": {
          "categoryBalloonEnabled": false,
          "cursorAlpha": 0,
          "zoomable": false
        },
        "categoryField": "testName",
        "categoryAxis": {
          "gridPosition": "start",
          "gridAlpha": 0,
          "tickPosition": "start",
          "tickLength": 20
        },
        "export": {
          "enabled": false
        }
      });





      var result = _.groupBy(this.studentData.testmarks, "testName");
      var i = 2;
      var resultArray: Array<any> = [];
      _.forOwn(result, function(value, key) {
        resultArray.push(
          {
            "subjectTitle": key,
            "subjectAvg": _.meanBy(value, 'totalAvg').toFixed(2)
          });
      });
      this.studentSubjectChart = resultArray;
      _.forOwn(result, function(value, key) {
        var tmpdata = _.map(value, function(object) {
          return {
            subName: object.subName,
            totalAvg: object.totalAvg.toFixed(2) // Format 'totalAvg' to 2 decimal places
          };
        });
        setTimeout(() => {
          i++;
          newAmCharts.makeChart("m_amcharts_" + i, {
            "theme": "light",
            "type": "serial",
            "startDuration": 2,
            "dataProvider": tmpdata,
            "valueAxes": [{
              "position": "left",
              "maximum": 100
            }],
            "graphs": [{
              "balloonText": "[[category]]: <b>[[value]]</b>",
              "fillColorsField": "color",
              "fillAlphas": 1,
              "lineAlpha": 0.1,
              "type": "column",
              "valueField": "totalAvg"
            }],
            "depth3D": 20,
            "angle": 30,
            "chartCursor": {
              "categoryBalloonEnabled": false,
              "cursorAlpha": 0,
              "zoomable": false
            },
            "categoryField": "subName",
            "categoryAxis": {
              "gridPosition": "start",
              "labelRotation": 90
            },
            "export": {
              "enabled": false
            }
          });
          $('a[title="JavaScript charts"]').hide();
        }, 1000);
      });
      // var titleToHide = 'JavaScript charts';
      
      let j = 0;
      this.studentData.finalresult.forEach((resultItem: any) => {
        let resultDataObject = JSON.parse(resultItem.resultData);
        resultDataObject = _.omit(resultDataObject, 'Total');
        const data = _.map(resultDataObject, (marks: string, subName: string) => ({
          subName,
          totalAvg: parseFloat(marks.split('/')[0])
        }));
      
        setTimeout(() => {
          j++; // Use 'j' instead of 'i'
          newAmCharts.makeChart("m_amcharts_final_"+j, {
            "theme": "light",
            "type": "serial",
            "startDuration": 2,
            "dataProvider": data,
            "valueAxes": [{
              "position": "left",
              "maximum": 100
            }],
            "graphs": [{
              "balloonText": "[[category]]: <b>[[value]]</b>",
              "fillColorsField": "color",
              "fillAlphas": 1,
              "lineAlpha": 0.1,
              "type": "column",
              "valueField": "totalAvg"
            }],
            "depth3D": 20,
            "angle": 30,
            "chartCursor": {
              "categoryBalloonEnabled": false,
              "cursorAlpha": 0,
              "zoomable": false
            },
            "categoryField": "subName",
            "categoryAxis": {
              "gridPosition": "start",
              "labelRotation": 90
            },
            "export": {
              "enabled": false
            }
          });
          $('a[title="JavaScript charts"]').hide();
        }, 1000);
      });
      // Find all <a> elements with the specified title attribute
      $('a[title="JavaScript charts"]').hide();
    },
    (err) => {
    //  localStorage.clear();
    });
  }

  // Function to create a chart


  openHomeworkList(data:any) {
    var iValue=1;
    data.homework.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    }); 
    this.datatable = $('.m_datatable').mDatatable({
    // this.datatable = $('.m_datatable').mDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: data.homework,
        pageSize: 10
      },

      // layout definition
      layout: {
        theme: 'default', // datatable theme
        class: '', // custom wrapper class
        scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
        height: 450, // datatable's body's fixed height
        footer: false // display/hide footer
      },

      // column sorting
      sortable: true,

      pagination: true,

      // inline and bactch editing(cooming soon)
      // editable: false,

      // columns definition
      columns: [{
        field: "srNo",
        title: "Sr.No.",
      }, {
        field: "subName",
        title: "Subject Name",
        
      }, {
        field: "title",
        title: "Title",
        
      }, {
        field: "description",
        title: "Description",
        
      }, {
        field: "deadline",
        title: "Deadline",
        
      }]
    });
  
    const query = this.datatable.getDataSourceQuery();
  
    const formSearch = this.elRef.nativeElement.querySelector('#m_form_search');
    const formStatus = this.elRef.nativeElement.querySelector('#m_form_status');
    const formType = this.elRef.nativeElement.querySelector('#m_form_type');
  
    if(formSearch){
      this.renderer.listen(formSearch, 'keyup', (e) => {
        this.datatable.search(e.target.value.toLowerCase());
      });
    }
 
    if(formStatus){
      this.renderer.listen(formStatus, 'change', (e) => {
        this.datatable.search(e.target.value, 'Status');
      });
    }

    if(formType){
      this.renderer.listen(formType, 'change', (e) => {
        this.datatable.search(e.target.value, 'Type');
      });
    }
  
    // Assuming selectpicker() is necessary for styling, if it's based on jQuery, you can retain this.
    $(this.elRef.nativeElement.querySelectorAll('#m_form_status, #m_form_type')).selectpicker();
  
  
  }
  public showHomeworkList(){
    $('#m_user_profile_tab_3').show();
   
  }
  openOverview() {
    $('#m_user_profile_tab_3').hide();
  }
}
