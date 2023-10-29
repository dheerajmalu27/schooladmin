import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { HttpClient, HttpHeaders } from "@angular/common/http"; // Updated HTTP client
import { AmChartsService } from '@amcharts/amcharts3-angular'; // Note: Check for AmCharts 4 Angular support
import { ActivatedRoute } from '@angular/router';
import { BaseService } from '../../../../../_services/base.service';
import * as _ from 'lodash';

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./student-profile.html",
  encapsulation: ViewEncapsulation.None,
})
export class StudentProfileComponent implements OnInit, AfterViewInit {
  private chart: any;
  public studentData: any = {};
  public studentSubjectChart: Array<any> = [];
  public studentAttendChart: any;
  public studentTestChart: any;

  public studentInfo: any = {};
  public id: any;

  constructor(
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
      this.studentInfo = this.studentData.info[0];
      this.studentTestChart = _.meanBy(this.studentData.testresult, 'result').toFixed(2);
      this.studentData.monthlyattendance = _.each(this.studentData.monthlyattendance, item => item.result = parseFloat(item.result));
      this.studentAttendChart = _.meanBy(this.studentData.monthlyattendance, 'result').toFixed(2);
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
          "enabled": true
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
          "enabled": true
        }
      });
      var result = _.groupBy(this.studentData.testmarks, "subName");
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
          return _.pick(object, ['testName', 'totalAvg']);
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
            "categoryField": "testName",
            "categoryAxis": {
              "gridPosition": "start",
              "labelRotation": 90
            },
            "export": {
              "enabled": true
            }
          });
        }, 1000);
      });
    },
    (err) => {
    //  localStorage.clear();
    });
  }
}
