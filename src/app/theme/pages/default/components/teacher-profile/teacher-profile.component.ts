import {
  Component,
  OnInit,
  ViewEncapsulation,
  ElementRef,
  Renderer2,
  AfterViewInit,
} from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
declare let $: any;
import 'fullcalendar';
// import { CalendarComponent } from 'ng-fullcalendar';
// import { Options } from 'fullcalendar';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { ActivatedRoute } from '@angular/router';
import * as _ from 'lodash';
import { BaseService } from '../../../../../_services/base.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { environment } from 'src/environments/environment';
@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './teacher-profile.html',
  encapsulation: ViewEncapsulation.None,
})
export class TeacherProfileComponent implements OnInit, AfterViewInit {
  imageUrlPath = environment.apiImageUrl;
  // calendarOptions: Options;
  // @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  showButton = false;
  private datatable: any;
  public test_date: any;
  private chart: any;
  public teacherData: any = {};
  public teacherSubjectChart: Array<any> = [];
  public teacherAttendChart: any;
  public teacherTestChart: any;
  public datavalue: any;
  public teacherInfo: any = {};
  public id: any;

  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private _script: ScriptLoaderService,
    private AmCharts: AmChartsService,
    private route: ActivatedRoute,
    private baseservice: BaseService
  ) {}
  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.getTeacherData(this.id, this.AmCharts);
  }
  ngAfterViewInit() {}

  genratefile() {
    const data = document.getElementById('m_calendar');

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
      pdf.save('MYPdf.pdf'); // Generated PDF
    });
  }

  private getTeacherData(newid: any, newAmCharts: any) {
    this.baseservice.get('teacherprofile/' + newid).subscribe(
      (data: any) => {
        this.teacherData = data;

        for (let i = 0; i < this.teacherData.classtestresult.length; i++) {
          if (this.teacherData.classtestresult[i].result > 80) {
            this.teacherData.classtestresult[i].color = '#875692';
          } else if (
            this.teacherData.classtestresult[i].result <= 80 &&
            this.teacherData.classtestresult[i].result > 60
          ) {
            this.teacherData.classtestresult[i].color = '#67b7dc'; // blue
          } else if (
            this.teacherData.classtestresult[i].result <= 60 &&
            this.teacherData.classtestresult[i].result > 35
          ) {
            this.teacherData.classtestresult[i].color = '#f38400'; // orange
          } else {
            this.teacherData.classtestresult[i].color = '#dc6967'; // red
          }
        }

        this.openSubjectList(data);
        this.teacherInfo = this.teacherData.info[0];
        if (this.teacherData.classtestresult.length > 0) {
          this.teacherTestChart = _.meanBy(
            this.teacherData.classtestresult,
            'result'
          ).toFixed(2);
        }
        if (this.teacherData.monthlyattendance.length > 0) {
          for (let i = 0; i < this.teacherData.monthlyattendance.length; i++) {
            if (this.teacherData.monthlyattendance[i].result > 80) {
              this.teacherData.monthlyattendance[i].color = '#875692';
            } else if (
              this.teacherData.monthlyattendance[i].result <= 80 &&
              this.teacherData.monthlyattendance[i].result > 60
            ) {
              this.teacherData.monthlyattendance[i].color = '#67b7dc'; // blue
            } else if (
              this.teacherData.monthlyattendance[i].result <= 60 &&
              this.teacherData.monthlyattendance[i].result > 35
            ) {
              this.teacherData.monthlyattendance[i].color = '#f38400'; // orange
            } else {
              this.teacherData.monthlyattendance[i].color = '#dc6967'; // red
            }
          }
          this.teacherData.monthlyattendance = _.each(
            this.teacherData.monthlyattendance,
            (item) => (item.result = parseFloat(item.result))
          );
          this.teacherAttendChart = _.meanBy(
            this.teacherData.monthlyattendance,
            'result'
          ).toFixed(2);
        }

        newAmCharts.makeChart('m_amcharts_1', {
          type: 'serial',
          theme: 'light',
          dataProvider: this.teacherData.monthlyattendance,
          valueAxes: [
            {
              gridColor: '#FFFFFF',
              gridAlpha: 0.2,
              dashLength: 0,
              maximum: 100,
            },
          ],
          gridAboveGraphs: true,
          startDuration: 1,
          graphs: [
            {
              balloonText: '[[category]]: <b>[[value]]</b>',
              fillAlphas: 0.8,
              lineAlpha: 0.2,
              type: 'column',
              valueField: 'result',
              colorField: 'color',
            },
          ],
          chartCursor: {
            categoryBalloonEnabled: false,
            cursorAlpha: 0,
            zoomable: false,
          },
          categoryField: 'month',
          categoryAxis: {
            gridPosition: 'start',
            gridAlpha: 0,
            tickPosition: 'start',
            tickLength: 100,
          },
          export: {
            enabled: false,
          },
        });

        $('a[title="JavaScript charts"]').hide();
        newAmCharts.makeChart('m_amcharts_2', {
          type: 'serial',
          theme: 'light',
          dataProvider: this.teacherData.classtestresult,
          valueAxes: [
            {
              gridColor: '#FFFFFF',
              gridAlpha: 0.2,
              dashLength: 0,
              maximum: 100,
            },
          ],
          gridAboveGraphs: true,
          startDuration: 1,
          graphs: [
            {
              balloonText: '[[category]]: <b>[[value]]</b>',
              fillAlphas: 0.8,
              lineAlpha: 0.2,
              type: 'column',
              valueField: 'result',
              colorField: 'color',
            },
          ],
          chartCursor: {
            categoryBalloonEnabled: false,
            cursorAlpha: 0,
            zoomable: false,
          },
          categoryField: 'testName',
          categoryAxis: {
            gridPosition: 'start',
            gridAlpha: 0,
            tickPosition: 'start',
            tickLength: 20,
          },
          export: {
            enabled: false,
          },
        });
        $('a[title="JavaScript charts"]').hide();
        var result = _.groupBy(this.teacherData.testmarks, 'classSubName');
        var i = 2;
        var resultArray: Array<any> = [];
        _.forOwn(result, function (value, key) {
          resultArray.push({
            subjectTitle: key,
            subjectAvg: _.meanBy(value, 'avgRecord').toFixed(2),
          });
        });
        this.teacherSubjectChart = resultArray;
        _.forOwn(result, function (value, key) {
          var tmpdata = _.map(value, function (object) {
            let color = '#0000FF';
            if (object.avgRecord > 80) {
              color = '#875692'; // green#
            } else if (object.avgRecord <= 80 && object.avgRecord > 60) {
              color = '#67b7dc'; // blue
            } else if (object.avgRecord <= 60 && object.avgRecord > 35) {
              color = '#f38400'; // orange
            } else {
              color = '#dc6967'; // red
            }

            return {
              testName: object.testName,
              avgRecord: object.avgRecord.toFixed(2), // Format 'avgRecord' to 2 decimal places
              color: color,
            };
          });
          setTimeout(() => {
            i++;
            newAmCharts.makeChart('m_amcharts_' + i, {
              theme: 'light',
              type: 'serial',
              startDuration: 2,
              dataProvider: tmpdata,
              valueAxes: [
                {
                  position: 'left',
                  maximum: 100,
                },
              ],
              graphs: [
                {
                  balloonText: '[[category]]: <b>[[value]]</b>',
                  fillColorsField: 'color', // Specify the field that contains the color information in your data
                  fillAlphas: 1,
                  lineAlpha: 0.1,
                  type: 'column',
                  valueField: 'avgRecord',
                  colorField: 'color', // Specify the field that contains the color information in your data
                },
              ],
              depth3D: 20,
              angle: 30,
              chartCursor: {
                categoryBalloonEnabled: false,
                cursorAlpha: 0,
                zoomable: false,
              },
              categoryField: 'testName',
              categoryAxis: {
                gridPosition: 'start',
                labelRotation: 90,
              },
              export: {
                enabled: false,
              },
            });
            $('a[title="JavaScript charts"]').hide();
          }, 1000);
        });
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }
  openOverview() {
    this.showButton = false;
    $('#m_user_profile_tab_3').hide();
  }
  openCalender() {
    this.showButton = true;
    $('#m_user_profile_tab_3').hide();
    var result = this.teacherData.timetable;
    const earliestEvent = result.reduce((prev: any, current: any) => {
      return prev.start < current.start ? prev : current;
    });

    const latestEvent = result.reduce((prev: any, current: any) => {
      return prev.end > current.end ? prev : current;
    });
    // Extract the hour and minute from the start and end times.
    const [startHour, startMinute] = earliestEvent.start.split(':').map(Number);
    const [endHour, endMinute] = latestEvent.end.split(':').map(Number);

    var resultArray: Array<any> = [];
    _.forOwn(result, function (value, key) {
      var dayValue;
      if (value.dow == 'Monday') {
        dayValue = 1;
      } else if (value.dow == 'Tuesday') {
        dayValue = 2;
      } else if (value.dow == 'Wednesday') {
        dayValue = 3;
      } else if (value.dow == 'Thursday') {
        dayValue = 4;
      } else if (value.dow == 'Friday') {
        dayValue = 5;
      } else if (value.dow == 'Saturday') {
        dayValue = 6;
      } else if (value.dow == 'Sunday') {
        dayValue = 0;
      }
      resultArray.push({
        title: value.title,
        description:
          'Lecture ' +
          value.title +
          ' from ' +
          value.start +
          ' to ' +
          value.end,
        start: value.start,
        end: value.end,
        dow: [dayValue],
      });
    });
    $('#m_calendar').fullCalendar({
      header: {
        // left: 'prev,next today',
        center: 'Teacher Schedule',
        right: 'agendaDay,listWeek',
      },
      minTime: `${startHour}:${startMinute}:00`,
      maxTime: `${endHour + 1}:${endMinute}:00`,
      columnFormat: 'dddd',
      defaultView: 'listWeek',
      hiddenDays: [0],
      // defaultDate: '2018-01-12',
      navLinks: true, // can click day/week names to navigate views
      // editable: true,
      // height:2000,
      eventLimit: true, // allow "more" link when too many events
      events: resultArray,
    });
  }

  openSubjectList(data: any) {
    var iValue = 1;
    data.subjects.forEach((item: any, index: any) => {
      item.srNo = index + 1;
    });
    this.datatable = $('.m_datatable').mDatatable({
      // this.datatable = $('.m_datatable').mDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: data.subjects,
        pageSize: 10,
      },

      // layout definition
      layout: {
        theme: 'default', // datatable theme
        class: '', // custom wrapper class
        scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
        height: 450, // datatable's body's fixed height
        footer: false, // display/hide footer
      },

      // column sorting
      sortable: true,

      pagination: true,

      // inline and bactch editing(cooming soon)
      // editable: false,

      // columns definition
      columns: [
        {
          field: 'srNo',
          title: 'Sr.No.',
        },
        {
          field: 'className',
          title: 'Class Name',
        },
        {
          field: 'divName',
          title: 'Div Name',
        },
        {
          field: 'subName',
          title: 'Subject Name',
        },
      ],
    });

    const query = this.datatable.getDataSourceQuery();

    const formSearch = this.elRef.nativeElement.querySelector('#m_form_search');
    const formStatus = this.elRef.nativeElement.querySelector('#m_form_status');
    const formType = this.elRef.nativeElement.querySelector('#m_form_type');

    if (formSearch) {
      this.renderer.listen(formSearch, 'keyup', (e) => {
        this.datatable.search(e.target.value.toLowerCase());
      });
    }

    if (formStatus) {
      this.renderer.listen(formStatus, 'change', (e) => {
        this.datatable.search(e.target.value, 'Status');
      });
    }

    if (formType) {
      this.renderer.listen(formType, 'change', (e) => {
        this.datatable.search(e.target.value, 'Type');
      });
    }

    // Assuming selectpicker() is necessary for styling, if it's based on jQuery, you can retain this.
    $(
      this.elRef.nativeElement.querySelectorAll('#m_form_status, #m_form_type')
    ).selectpicker();
  }

  public showSubjectList() {
    $('#m_user_profile_tab_3').show();
    this.showButton = false;
  }
}
