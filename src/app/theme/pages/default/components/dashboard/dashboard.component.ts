import { Component,Renderer2,ElementRef, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { Helpers } from '../../../../../helpers';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import {BaseService} from '../../../../../_services/base.service';
import { Router } from '@angular/router';
declare let $: any
declare const Chart: any; // You might replace `any` with the actual Chart.js type if available
declare const mUtil: any; // Assuming mUtil is from an external library and its type is not available

@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./dashboard.html",
  encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit, AfterViewInit {
  showTemplate:any;
  dashboardData:any=null;
  datatable: any ;
  datatable1: any ;
  newsEventData:any;
  todayabsentstudentlistlength=true;
  todayattendancependinglistlength=true;
  constructor(private renderer: Renderer2, 
    private elRef: ElementRef, private _script: ScriptLoaderService,private baseservice: BaseService,private AmCharts: AmChartsService, private router: Router) {
    this.getDashboardData(this.AmCharts);
  }
  ngOnInit() {

  }
  ngAfterViewInit() {
    this.dailySales();
    this.datepicker();
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/datatables/base/html-table.js');

  
  }

  public datepicker() {
    if ($('#m_dashboard_daterangepicker').length === 0) {
        return;
    }

    var picker = $('#m_dashboard_daterangepicker');
    var start = new Date();
    var end = new Date();

    function cb(start:any, end:any, label:any) {
        var title = '';
        var range = '';

        if ((end - start) < 100) {
            title = 'Today:';
            range = formatDate(start, 'MMM D');
        } else if (label == 'Yesterday') {
            title = 'Yesterday:';
            range = formatDate(start, 'MMM D');
        } else {
            range = formatDate(start, 'MMM D') + ' - ' + formatDate(end, 'MMM D');
        }

       picker.find('.m-subheader__daterange-date').html(range);
       picker.find('.m-subheader__daterange-title').html(title);
    }

    function formatDate(date:any, format:any) {
        var options = { month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    }

    // picker.daterangepicker({
    //     startDate: start,
    //     endDate: end,
    //     // opens: 'left',
    //     // ranges: {
    //     //     'Today': [new Date(), new Date()],
    //     //     'Yesterday': [new Date(new Date().setDate(new Date().getDate() - 1)), new Date(new Date().setDate(new Date().getDate() - 1))],
    //     //     'Last 7 Days': [new Date(new Date().setDate(new Date().getDate() - 6)), new Date()],
    //     //     'Last 30 Days': [new Date(new Date().setDate(new Date().getDate() - 29)), new Date()],
    //     //     'This Month': [new Date(new Date().getFullYear(), new Date().getMonth(), 1), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)],
    //     //     'Last Month': [new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1), new Date(new Date().getFullYear(), new Date().getMonth(), 0)]
    //     // }
    // }, cb);

    cb(start, end, '');
}


    // Daily Sales chart based on Chartjs plugin (http://www.chartjs.org/)
    private  dailySales() {
        let  chartData = {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [{
              //label: 'Dataset 1',
              backgroundColor: mUtil.getColor('success'),
              data: [
                  100, 98, 95, 93, 90, 98
              ]
          }, {
              //label: 'Dataset 2',
              backgroundColor: '#f3f3fb',
              data: [
                  0, 2, 5, 7, 10, 2
              ]
          }]
      };

        const chartContainer = $('#m_chart_daily_sales');

        if (chartContainer.length === 0) {
            return;
        }

        const chart = new Chart(chartContainer, {
          type: 'bar',
          data: chartData,
          options: {
              title: {
                  display: false,
              },
              tooltips: {
                  intersect: false,
                  mode: 'nearest',
                  xPadding: 10,
                  yPadding: 10,
                  caretPadding: 10
              },
              legend: {
                  display: false
              },
              responsive: true,
              maintainAspectRatio: false,
              barRadius: 4,
              scales: {
                  xAxes: [{
                      display: true,
                      gridLines: false,
                      stacked: true
                  }],
                  yAxes: [{
                      display: true,
                      stacked: true,
                      gridLines: false
                  }]
              },
              layout: {
                  padding: {
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0
                  }
              }
          }
      });
    }

 
 public redirectToRoute(route: string) {
  this.router.navigate([route]);
}
  private getDashboardData(newAmCharts:any) {
   


    this.baseservice.get('dashboard').subscribe(
      (data: any) => {
        this.dashboardData = data.dashboarddata[0];
        if(data.todayattendancependinglist.length>0){
          this.todayattendancependinglistlength=true;
        this.showpendingattendancelist(data.todayattendancependinglist);
        }else{
          this.todayattendancependinglistlength=false;
        }
        if(data.todayabsentstudentlist.length>0){
          this.todayabsentstudentlistlength=true;
          this.showabsentstudentlist(data.todayabsentstudentlist);
        }else{
          this.todayabsentstudentlistlength=false;
        }
        this.newsEventData=data.newseventlist
        $("#dashboard-data").show();
        const redirectToRoute = this.redirectToRoute.bind(this);
        //weekly attendance
        if(data.weeklyattendancelist && data.weeklyattendancelist.length>0){
         
          newAmCharts.makeChart("m_amcharts_1", {
            "type": "serial",
            "theme": "light",
            "dataProvider": data.weeklyattendancelist,
            "valueAxes": [{
                "gridColor": "#FFFFFF",
                "gridAlpha": 0.2,
                "dashLength": 0
            }],
            "gridAboveGraphs": true,
            "startDuration": 1,
            "graphs": [{
                "balloonText": "[[category]]: <b>[[value]]</b>",
                "fillAlphas": 0.8,
                "lineAlpha": 0.2,
                "type": "column",
                "valueField": "presentPercentage",
                "fillColors": "#34bfa3" //#34bfa3 
            }],
            "chartCursor": {
                "categoryBalloonEnabled": false,
                "cursorAlpha": 0,
                "zoomable": false
            },
            "categoryField": "dayOfWeek",
            "categoryAxis": {
                "gridPosition": "start",
                "gridAlpha": 0,
                "tickPosition": "start",
                "tickLength": 20
            },
            // "export": {
            //     "enabled": true
            // }
            "listeners": [{
              "event": "clickGraphItem",
              "method": function(event:any) {
                // console.log(event);
                  // Assuming you want to redirect to a route named 'dashboard'
                  redirectToRoute('attendance');
              },
              "scope": this // Ensure the scope of 'this' refers to your component
          }]
          });
        }
       //
       if(data.feesdetaillist && data.feesdetaillist.length>0){
        newAmCharts.makeChart("m_amcharts_12", {
          "type": "pie",
          "theme": "light",
          "depth3D": 10,
          "radius": "32%", 
          "dataProvider": [{
              "title": "Paid Fees",
              "seats": data.feesdetaillist[0].totalPaidFeesSum,
          }, {
              "title": "Remaining Fees",
              "seats": data.feesdetaillist[0].remainingFeesSum
          }],
          "valueField": "seats",
          "titleField": "title",
          "balloon": {
            "fixedPosition": true,
            "textAlign": "left",
            // "maxWidth": 300,
            "offsetX": 10,
            "offsetY": 0,
            // "horizontalPadding": 15,
            "verticalPadding": 10,
            "animationDuration": 0,
            "borderThickness": 1,
            "cornerRadius": 5,
            "fillAlpha": 1,
            "showBullet": true,
            "bullet": "round",
            "bulletSize": 4,
            "shadowAlpha": 0,
            "text": "[[title]]<br/><b>Value: [[value]]</b> ([[percents]]%)"
        },
        // "labelText": "[[text]]",
        "colors": ["#34bfa3", "#f4516c" ] // Custom colors for the slices
          // "export": {
          //     "enabled": true
          // }
        }); 
       }
       
        // class wise seat availability
        if(data.seatavailibility && data.seatavailibility.length>0)
      newAmCharts.makeChart("m_amcharts_4", {
        "theme": "light",
        "type": "serial",
        "dataProvider": data.seatavailibility,
        "valueAxes": [{
            "stackType": "3d",
            // "unit": "%",
            "position": "left",
           
        }],
        "startDuration": 1,
        "graphs": [{
            "balloonText": "Class <b>[[className]]</b> Available Seats: <b>[[value]]</b>",
            "fillAlphas": 0.9,
            "lineAlpha": 0.2,
            "title": "Available Seats",
            "type": "column",
            "valueField": "availableSeats",
            "fillColors": "#9b90e2" //#34bfa3 
        }, {
            "balloonText": "Class <b>[[className]]</b> Total Seats: <b>[[value]]</b>",
            "fillAlphas": 0.9,
            "lineAlpha": 0.2,
            "title": "Total Seats",
            "type": "column",
            "valueField": "totalSeats",
            "fillColors": "#716aca" //#67b7dc
        }],
        "plotAreaFillAlphas": 0.1,
        "depth3D": 40,
        "angle": 20,
        "categoryField": "className",
        "categoryAxis": {
            "gridPosition": "start"
        },
        // "export": {
        //     "enabled": true
        // }
        "listeners": [{
          "event": "clickGraphItem",
          "method": function(event:any) {
            // console.log(event);
              // Assuming you want to redirect to a route named 'dashboard'
              redirectToRoute('admission');
          },
          "scope": this // Ensure the scope of 'this' refers to your component
      }]
    });
    
        setTimeout(() => {
        $('a[title="JavaScript charts"]').hide();
      }, 1000);
      },
      (err) => {
        console.log(err);
        // Handle the error here, or clear localStorage as needed.
      }
    );
  }
  public showpendingattendancelist(data: any) {
    data.forEach((item:any, index:any) => {
      item.srNo = index + 1;
    }); 
    // Assuming you've set up the datatable correctly
    this.datatable = $('.m_datatable').mDatatable({
      // datasource definition
      data: {
        type: 'local',
        source: data,
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
      columns: [ {
        field: "srNo",
        title: "Sr.No.",
      }, {
        field: "className",
        title: "Class-Div",
        template: function (row:any) {
         
          return row.className+'-'+row.divName;
        },
      }, {
        field: "teacherName",
        title: "Class Teacher",
        
      }, {
        field: "selectedDate",
        title: "Date",
        
      }, {
        field: "active",
        title: "Status",
        template: function (row:any) {
          return '<span class="m-badge m-badge–brand m-badge–wide"> Pending </span>';
         
        },
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
    //... Other event bindings using the same approach as above ...

    $(this.elRef.nativeElement.querySelector('.m_datatable')).on('click', '.edit-button', (e:any) => {
      e.preventDefault();
      const id = $(e.target).attr('data-id');
    //  this.getAttendanceData(id);
    });
}
  
public showabsentstudentlist(data: any) {
  let i = 1;

  // Assuming you've set up the datatable correctly
  this.datatable = $(this.elRef.nativeElement.querySelector('.m_datatable1')).mDatatable({
    // datasource definition
    data: {
      type: 'local',
      source: data,
      pageSize: 10,
      i:1
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
    columns: [{
      field: "",
      title: "Sr No",
      textAlign: 'center',
      template: function (row:any) {
        return i++;        
        },
    },{
      
      field: "rollNo",
      title: "Roll No",
     
    }, {
      field: "studentName",
      title: "Student Name",
      template: function (row:any) {
      
        return '<span (click)="detailProfile('+row.studentId+')"  class="teacherFn" data-id="'+row.id+'">'+row.studentName+'</span>';
      },
    }, {
      field: "className",
      title: "Class-Div",
      template: function (row:any) {
        
        return row.className+'-'+row.divName;
      },
    },
    //  {
    //   field: "fatherName",
    //   title: "Father Name ",
      
    // }, {
    //   field: "mobNumber",
    //   title: "Mob Number",
      
    // },
     {
      field: "teacherName",
      title: "Teacher Name",
      
    },
    {
     field: "attendanceDate",
     title: "Attendance Date",
     
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
  //... Other event bindings using the same approach as above ...

  $(this.elRef.nativeElement.querySelector('.m_datatable')).on('click', '.edit-button', (e:any) => {
    e.preventDefault();
    const id = $(e.target).attr('data-id');
  //  this.getAttendanceData(id);
  });
  // $('.m_datatable').on('click', '.teacherFn', (e) => {
  //   e.preventDefault();
  //   var id = $(e.target).attr('data-id');
   
  //   this.router.navigate(['/student/profile/', id]); 
  //   });
  //  $('.m_datatable').on('click', '.edit-button', (e) => {
  //   e.preventDefault();
  //   var id = $(e.target).attr('data-id');
  
  //   //this.router.navigate(['/student/profile/', id]); 
  //   });
}


}
