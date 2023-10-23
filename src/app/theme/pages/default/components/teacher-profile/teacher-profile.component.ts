import { Component, OnInit, ViewEncapsulation,ElementRef, Renderer2, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
declare let $: any
import 'fullcalendar';
// import { CalendarComponent } from 'ng-fullcalendar';
// import { Options } from 'fullcalendar';
import { HttpClient } from '@angular/common/http';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import {BaseService} from '../../../../../_services/base.service';
// import { count } from 'rxjs/operator/count';
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./teacher-profile.html",
  encapsulation: ViewEncapsulation.None,
})
export class TeacherProfileComponent implements OnInit, AfterViewInit {
  // calendarOptions: Options;
  // @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  private datatable:any;
  public test_date: any;
  private chart: any;
  public teacherData: any = {};
  public teacherSubjectChart: Array<any> = [];
  public teacherAttendChart: any;
  public teacherTestChart: any;
  public datavalue:any;
  public teacherInfo: any = {};
  public id: any;

  constructor( private elRef: ElementRef, 
    private renderer: Renderer2,private _script: ScriptLoaderService, private AmCharts: AmChartsService, private route: ActivatedRoute,private baseservice: BaseService) {

  }
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getTeacherData(this.id, this.AmCharts);

  }
  ngAfterViewInit() {

  }

  private getTeacherData(newid:any, newAmCharts:any) {
    this.baseservice.get('teacherprofile/' + newid).subscribe((data:any) => {
     
      this.teacherData = data;
       
      this.openSubjectList(data);
      this.teacherInfo = this.teacherData.info[0];
      if(this.teacherData.classtestresult.length>0)
     { this.teacherTestChart = _.meanBy(this.teacherData.classtestresult, 'result');
    }
    if(this.teacherData.monthlyattendance.length>0){
      this.teacherData.monthlyattendance = _.each(this.teacherData.monthlyattendance, item => item.result = parseFloat(item.result));
      this.teacherAttendChart = _.meanBy(this.teacherData.monthlyattendance, 'result');
  }
      newAmCharts.makeChart("m_amcharts_1", {
        "type": "serial",
        "theme": "light",
        "dataProvider": this.teacherData.monthlyattendance,
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
        "dataProvider": this.teacherData.classtestresult,
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

      var result = _.groupBy(this.teacherData.testmarks, "classSubName");
      var i = 2;
      var resultArray: Array<any> = [];
      _.forOwn(result, function(value, key) {

        resultArray.push(
          {
            "subjectTitle": key,
            "subjectAvg": _.meanBy(value, 'avgRecord')
          });
      });
      this.teacherSubjectChart = resultArray;
      _.forOwn(result, function(value, key) {


        var tmpdata = _.map(value, function(object) {
          return _.pick(object, ['testName', 'avgRecord']);
        });
        console.log(tmpdata);
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
              "valueField": "avgRecord"
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
   openOverview() {
    $('#m_user_profile_tab_3').hide();
  }
   openCalender() {
    $('#m_user_profile_tab_3').hide();   
    var result = this.teacherData.timetable;
    var resultArray: Array<any> = [];
    _.forOwn(result, function(value, key) {
      var dayValue;
if(value.dow=="Monday"){
  dayValue=1;
}else if(value.dow=="Tuesday"){
  dayValue=2;
}else if(value.dow=="Wednesday"){
  dayValue=3;
}else if(value.dow=="Thursday"){
  dayValue=4;
}else if(value.dow=="Friday"){
  dayValue=5;
}else if(value.dow=="Saturday"){
  dayValue=6;
}else if(value.dow=="Sunday"){
  dayValue=0;
}
      resultArray.push(
        {
          
          "title": value.title,
          "description":"Lecture "+value.title+" from "+value.start+" to "+value.end,
          "start":value.start,
          "end":value.end,
          "dow":[dayValue]
        });
    });
    $('#m_calendar').fullCalendar({
      header: {
        // left: 'prev,next today',
        center: 'Teacher Scheduke',
        right: 'agendaWeek,agendaDay,listWeek'
      },
      defaultView: 'listWeek',
      hiddenDays: [ 0 ] ,
      // defaultDate: '2018-01-12',
      navLinks: true, // can click day/week names to navigate views
      editable: true,
      height: 900,
      eventLimit: true, // allow "more" link when too many events
      events:resultArray
    });

  }



  openSubjectList(data:any) {
    var iValue=0;
    console.log(data); 
    this.datatable = $('.m_datatable').mDatatable({
    // this.datatable = $(this.elRef.nativeElement.querySelector('.m_datatable')).mDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: data.subjects,
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
        field: "id",
        title: "Sr.No.",
        textAlign: 'center',
        template: function (row:any) {
          console.log(row);
          return iValue++;
        }
      }, {
        field: "className",
        title: "Class Name",

      }, {
        field: "divName",
        title: "Div Name",
        
      }, {
        field: "subName",
        title: "Subject Name",
        
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

  public showSubjectList(){
    $('#m_user_profile_tab_3').show();
  }

}
