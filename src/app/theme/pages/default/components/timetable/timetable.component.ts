import { Component, OnInit, ViewEncapsulation, AfterViewInit, ViewChild, ElementRef,Renderer2 } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
// import { Observable, Subject } from 'rxjs';
// import { filter } from 'rxjs/operators';
// import { CalendarOptions } from '@fullcalendar/core';
// import dayGridPlugin from '@fullcalendar/daygrid';
import { BaseService } from '../../../../../_services/base.service';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
declare var moment: any;
declare var mApp: any;
declare let $: any;
declare var toastr: any;
import * as _ from 'lodash';
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./timetable.html",
  // styleUrls: ['./timetable.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class TimeTableComponent implements OnInit, AfterViewInit {
  // calendarOptions: Options;
  // @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;
  // calendarOptions: CalendarOptions = {
  //   plugins: [dayGridPlugin],
  //   initialView: 'dayGridMonth',
  //   weekends: false,
  //   events: [
  //     { title: 'Meeting', start: new Date() }
  //   ]
  // };
  public test_date: any;
  subjectList:any= null;
  timeTableData: any = null;
  isValid = false;
  datatable:any=null;
  calendarData:any=Array;
  divisionData:any=null;
  classData:any =null;
  editclassId: any = null;
  editdivId: any = null;
  showTemplate: any;
  studentDetail:any;
 addTimetableFormList: any;
 
  public datavalue:any;
  
  public id: any;
  
  constructor(private elRef: ElementRef, private renderer: Renderer2,private _script: ScriptLoaderService,private baseservice: BaseService, private router: Router,public fb: FormBuilder) {
this.getTimeTableList();
  }
  ngOnInit() {
   
    this.listTemplate();
    this.addTimetableFormList = this.fb.group({
       'classId': new FormControl(),
        'divId': new FormControl(),
      });

  }
  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/vendors/custom/jquery-ui/jquery-ui.bundle.js');
    //   var tmp=this;
    //   jQuery(document).ready(function() {
    //     tmp.openCalender();
    // });
   
  }
  listTemplate() {
    $("#addTemplate").hide();
    $("#editTemplate").hide();
    $("#listTemplate").show();
  }
  addTemplate() {
    $("#addTemplate").show();
    $("#addTimetableForm1").show();
    $("#addTimetableForm2").hide();
    $("#editTemplate").hide();
    $("#listTemplate").hide();
    this.getClassList();
    this.getDivisionList();
    
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js');
   
  }
  public editTemplate() {
    this.isValid=true;
  
    $("#addTemplate").hide();
    $("#editTemplate").show();
    $("#listTemplate").hide();
  
      
  }

  private getClassList() {
 this.baseservice.get('classlist').subscribe((data:any) => {
      this.classData = data.class;
      (<any>$('.class_select2_drop_down')).select2({ data: this.classData });
     
    },
      (err) => {
        //  localStorage.clear();
      });
  }
  private getDivisionList() {
    this.baseservice.get('divisionlist').subscribe((data:any) => {
      this.divisionData = data.division;
      (<any>$('.division_select2_drop_down')).select2({ data: this.divisionData });
    },
      (err) => {
        //  localStorage.clear();
      });

  }
  private getSubjectTestList(classId:any) {
    // var classId = $('.class_select2_drop_down').val();
    this.baseservice.get('getsubjecttestlist?classId=' +classId).subscribe((result:any) => {

       
     this.subjectList=result.subjectlist ;
     $("#addTimetableForm1").hide();
        $("#addTimetableForm2").show();
        this.openCalender(this.calendarData);
        var tmp=this;
        setTimeout(function(){ tmp.externalEvents(); }, 2000);
        
    },
      (err) => {
        //  localStorage.clear();
      });

  }
  private getTimeTableList() {
    this.baseservice.get('gettimetablelist').subscribe((data:any) => {
      this.timeTableData = data.timetabledatalist;
      this.showtablerecord(data.timetabledatalist);
    },
    (err) => {
    //  localStorage.clear();
    });
  }
  public deleteTimeTableById(id:any){
    console.log(id);
    this.baseservice.delete('timetable/'+id).subscribe((data:any) => { 
      // this.datatable.destroy();
      // this.getTimeTableList();
      // this.listTemplate();
      toastr.success('Record has been deleted successfully...!');
    },
    (err) => {
    console.log(err);
    toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }
  public addTimetableSubmitForm(data:any){

    data.divId = $('.division_select2_drop_down').val();
    data.classId = $('.class_select2_drop_down').val();
     if (data.classId!= '' && data.divId!= '') {
        this.calendarData=[];
        this.getSubjectTestList(data.classId);
       
    }

  }
  public showtablerecord(data: any) {
    let i = 1;
    
    // Your existing initialization logic for datatable
    this.datatable = $(this.elRef.nativeElement.querySelector('.m_datatable')).mDatatable({
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
        title: "Sr.No.",
        textAlign: 'center',
       
        template: function (row:any) {
          return i++;
        },
      }, {
        field: "className",
        title: "Class Name",
      },  {
        field: "divName",
        title: "division Name",
      }, {
        field: "classId",
        title: "Actions",
        template: function (row:any) {
          return '<span  class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill" > <i class="edit-button la la-edit" data-id="'+row.classId+ '*'+row.divId+'"></i></span>';
         
         
        }
      }]
    });

    const formSearch = this.elRef.nativeElement.querySelector('#m_form_search');
    const formStatus = this.elRef.nativeElement.querySelector('#m_form_status');
    const formType = this.elRef.nativeElement.querySelector('#m_form_type');

    // Attach event listeners using Renderer2
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


    this.renderer.listen(this.elRef.nativeElement.querySelector('.m_datatable'), 'click', (e) => {
      if ((e.target as HTMLElement).classList.contains('edit-button')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        this.getTimeTableData(id);
      }
      // if ((e.target as HTMLElement).classList.contains('teacherFn')) {
      //              e.preventDefault();
      //              const id = (e.target as HTMLElement).getAttribute('data-id');
      //       this.router.navigate(['/teacher/profile/', id]);
      // }
    });
  
  }

private getTimeTableData(data:any){
 
    let excludeData  = data.split('*');
  this.getTimeTableDataList(excludeData);    
    }
    private getTimeTableDataList(Arraydata:any){ 
       this.editclassId=Arraydata[0];
       this.editdivId=Arraydata[1];
      this.baseservice.get('gettimetable?classId=' + Arraydata[0] + '&divId=' + Arraydata[1]).subscribe((data:any) => {  
        
        var resultArray: Array<any> = [];
        _.forOwn(data.classtimetabledata, function(value, key) {
        
          resultArray.push(
            {
              "id":value.id,
              "title": value.title,
              "description":"Lecture "+value.title+" taken by "+value.teacherName,
              "start":moment().startOf('week').add('days', value.dayId).format("YYYY-MM-DD")+" "+value.start,
              
              "end":moment().startOf('week').add('days', value.dayId).format("YYYY-MM-DD")+" "+value.end,
              "dow":[value.dayId],
              
              "classId":value.classId,
              "divId":value.divId,
              "subId":value.subId,
               "dayId":value.dayId,
               "teacherId":value.teacherId
            });
        });
        this.calendarData=resultArray;
        
        this.addTemplate(); 
        
        
        $("#addTimetableForm1").hide();
        $("#addTimetableForm2").show();
        this.getSubjectTestList(this.editclassId);
        
      },
        (err) => {
          console.log(err);        
        });
    
  } 



  private openCalender(data:any){
      var tmpMain=this;
      var subID=null;

      var result = data;
    const earliestEvent = result.reduce((prev:any, current:any) => {
      return (prev.start < current.start) ? prev : current;
  });
 
  const latestEvent = result.reduce((prev:any, current:any) => {
    return (prev.end > current.end) ? prev : current;
});
// Extract the hour and minute from the start and end times.
const [startHour, startMinute] = earliestEvent.start.split(' ')[1].split(':').map(Number);
const [endHour, endMinute] = latestEvent.end.split(' ')[1].split(':').map(Number);

$('#m_calendar').fullCalendar({
  timeZone: 'UTC',
  defaultTimedEventDuration: '00:30:00',
  forceEventDuration: true,
  header: {
      left: 'today',
      center: 'title',
      right: 'agendaWeek,listWeek'
  },
  defaultView: 'agendaWeek',
  hiddenDays: [0],
  allDaySlot: false,
  minTime: `${startHour}:${startMinute}:00`,
  maxTime: '18:00:00',
  slotDuration: '00:05:00',
  slotLabelInterval: 5,
  slotMinutes: 30,
  slotEventOverlap: false,
  navLinks: true,
  height: 900,
  eventLimit: true,
  events: data,
  draggable: true,
  editable: true,
  droppable: true,
  eventReceive: (event:any, view:any) => {
      let ind = _.findIndex(tmpMain.subjectList, { text: event.title });
      if (ind !== -1) {
          subID = tmpMain.subjectList[ind].id;
      } else {
          subID = null;
      }
      event.subId = subID;
      $('#m_calendar').fullCalendar('updateEvent', event);
  },
  eventRender: (event:any, element:any) => {
    // element.css('background-color', 'red');
    // element.css('color', 'white');
    // element.find('.fc-content').css('color', 'white');
    // element.find('.fc-content .fc-time').css('color', 'white');
      if (element.hasClass('fc-day-grid-event')) {
          element.data('content', event.description);
          element.data('placement', 'top');
          mApp.initPopover(element);
      } else if (element.hasClass('fc-time-grid-event')) {
          element.find('.fc-title').append('<div class="fc-description">' + event.description + '</div>');
      } else if (element.find('.fc-list-item-title').length !== 0) { // Corrected 'lenght' to 'length'
          element.find('.fc-list-item-title').append('<div class="fc-description">' + event.description + '</div>');
      }
  },
  eventClick: (event:any, jsEvent:any, view:any) => {
      // Confirm before removing
      let isConfirmed = confirm("Are you sure you want to remove this event?");

      if (isConfirmed) {
          $('#m_calendar').fullCalendar('removeEvents', event._id);
          console.log(event);
          this.deleteTimeTableById(event.id);
      }
  }
});


    
  }

  public externalEvents() {
    $('#m_calendar_external_events .fc-event').each((index:any, element:any) => {
        // Use element instead of this
        const $element = $(element);
       
        // store data so the calendar knows to render an event upon drop
        $element.data('event', {
            title: $.trim($element.text()), // use the element's text as the event title
            stick: false, // maintain when user navigates (see docs on the renderEvent method)
            className: $element.data('color'),
            description: ''
        });
  
        // make the event draggable using jQuery UI
        $element.draggable({
            zIndex: 999,
            revert: true, // will cause the event to go back to its original position after the drag
            revertDuration: 0
        });
        $element.draggable({
          zIndex: 999,
          revert: true, // will cause the event to go back to its original position after the drag
          revertDuration: 0
      });
    });
}


  public showSubjectList(){
    $('#m_user_profile_tab_3').show();
  }

  public saveTimeTable(){
    var events = $('#m_calendar').fullCalendar('clientEvents');
    var resultArray: Array<any> = [];
    var tmp=this;
    _.forOwn(events, function(value, key) {
        var start_time =moment(value.start._i).format("HH:mm");
        var end_time =moment(value.end._i).format("HH:mm"); 
       resultArray.push(
        {
          
          "id": value.id,
          "divId":tmp.editdivId,
          "subId":value.subId,
          "classId":tmp.editclassId,
          "dayId":moment(value.start._i).day(),
          "timeSlot":start_time+'-'+end_time,
        });
    });
   
let postdata=(resultArray);
    this.baseservice.post('bulktimetable',postdata).subscribe((data:any) => { 
      this.datatable.destroy();
      this.getTimeTableList();
      this.listTemplate();
      toastr.success('Record has been added/updated successfully...!');
    },
    (err) => {
     console.log(err);
     toastr.error('Something went wrong...!');
    //  localStorage.clear();
    });
  }

}
