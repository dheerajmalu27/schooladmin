import { Component, OnInit, ViewEncapsulation, AfterViewInit,ElementRef,Renderer2  } from '@angular/core';
import { Router } from '@angular/router'; 
import { CommonService } from '../../../../../_services/common-api.service';
import { Helpers } from '../../../../../helpers';
import {ReactiveFormsModule,FormsModule,FormGroup,FormControl,Validators,FormBuilder} from '@angular/forms';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
// import * as $ from 'jquery';
import {BaseService} from '../../../../../_services/base.service';
declare let $: any;
@Component({
  selector: ".m-grid__item.m-grid__item--fluid.m-wrapper",
  templateUrl: "./teacher.html",
  encapsulation: ViewEncapsulation.None,
})
export class TeacherComponent implements OnInit, AfterViewInit {
  datatable: any; // Change the type to your actual data type
  teachers: any[] = []; // Replace any with your actual data type
  showTemplate: any;
  teacherDetail: any;
  teacherData: any = null;
  TitleSet: any = null;
  stateData:any=null;
  cityData:any=null;
  selectedFiles:any;
  addTeacherForm : any;

  constructor(private elRef: ElementRef, private renderer: Renderer2,private commonservice: CommonService,private _script: ScriptLoaderService, private router: Router,public fb: FormBuilder,private baseservice: BaseService) {
    
  }
  ngOnInit() {
    this.getTeacherList();
   this.listTemplate();
  
   this.addTeacherForm = this.fb.group({
    'id' : new FormControl(),
    'firstName' : new FormControl('', Validators.required),
    'middleName' : new FormControl('', Validators.required),
    'lastName' : new FormControl('', Validators.required),
    'image': new FormControl(),
    'dob' : new FormControl(),
    'joiningDate' : new FormControl(),
    'nationality': new FormControl('', Validators.required),
    'caste': new FormControl('', Validators.required),
    'qualification': new FormControl('', Validators.required),
    'experience': new FormControl('', Validators.required),
    'address': new FormControl('', Validators.required),
    'bloodGroup': new FormControl(),
    'gender' : new FormControl('', Validators.required),
    'stateId' : new FormControl(),
    'cityId' : new FormControl(),
    'mobileNumber' : new FormControl('', [
      Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(12),
    ]),
     'mobileNumberSecond' : new FormControl('', [
      Validators.required,
      Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
    ]),
    // 'lastName': [null,  Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
  });
  }
  listTemplate() {
    $("#addTemplate").hide();
    $("#listTemplate").show();
  }
  get address() {
    return this.addTeacherForm.get('address');
}
  addTemplate() {
    
    this.TitleSet='Add Student';
    this.addTeacherForm.reset();
    $("#addTemplate").show();
    $("#listTemplate").hide();
    this.getStateList();
    // this.getClassList();
    // this.getDivisionList();
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js');
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
      
      $('#m_datepickerSet').datepicker({
        todayHighlight: true,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    $('#m_datepickerSet1').datepicker({
      todayHighlight: true,
      templates: {
          leftArrow: '<i class="la la-angle-left"></i>',
          rightArrow: '<i class="la la-angle-right"></i>'
      }
  });
    $('#m_datepickerSet').on('change', function(){
    });

  }
  editTemplate(teacherData:any) {
    this.TitleSet='Edit Student';
    this.addTeacherForm.reset();
    this.getStateList();
    // this.getClassList();
    // this.getDivisionList();
    
    $("#listTemplate").hide();
    $("#addTemplate").show();
    this.addTeacherForm.setValue({
      id: teacherData.id,
      firstName: teacherData.firstName,
      middleName: teacherData.middleName,
      lastName: teacherData.lastName,
      image: teacherData.profileImage,
      dob: teacherData.dateOfBirth,
      qualification: teacherData.qualification,
      experience: teacherData.experience,
      nationality: teacherData.nationality,
      caste: teacherData.caste,
      address: teacherData.address,
      bloodGroup: teacherData.bloodGroup,
      gender: teacherData.gender,
      mobileNumber: teacherData.mobileNumber,
      mobileNumberSecond: teacherData.mobileNumberSecond,
      stateId: teacherData.stateId,
      cityId: teacherData.cityId,
      joiningDate: teacherData.joiningDate,
     
    });
  
   

    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js');
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
      $('#m_datepickerSet').datepicker({
        todayHighlight: true,
        templates: {
            leftArrow: '<i class="la la-angle-left"></i>',
            rightArrow: '<i class="la la-angle-right"></i>'
        }
    });
    setTimeout(() => 
    {
      $(".class_select2_drop_down").val(<string>teacherData.classId).trigger('change');
      $(".division_select2_drop_down").val(<string>teacherData.divId).trigger('change');
      $(".state_select2_drop_down").val(<string>teacherData.stateId).trigger('change');
    },
    2000);
  }
  detailProfile(id:any){
    alert(id);
    this.router.navigate(['/teacher/profile/', id]); 
  }
  tableToExcel(table:any, EmployeeList: string) {
    const uri = 'data:application/vnd.ms-excel;base64,';
    const template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>';
    const base64 = function (s:any) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) };
    const format = function (s:any, c:any) { return s.replace(/{(\w+)}/g, function (m:any, p:any) { return c[p]; }) };
    
    // Using Angular's ViewChild to get the table content
    const ctx = { worksheet: EmployeeList || 'Worksheet',  table: table.innerHTML };
    const link = document.createElement('a');
    link.href = uri + base64(format(template, ctx));
    link.download = 'data.xls';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  // tableToExcel(table, EmployeeList){
  //   let uri = 'data:application/vnd.ms-excel;base64,'
  //       , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--><meta http-equiv="content-type" content="text/plain; charset=UTF-8"/></head><body><table>{table}</table></body></html>'
  //       , base64 = function(s) { return window.btoa(decodeURIComponent(encodeURIComponent(s))) }
  //       , format = function(s,c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
  //           if (!table.nodeType) table = document.getElementById(table)
  //           var ctx = {worksheet: name || 'Worksheet', table: table.innerHTML}
  //           window.location.href = uri + base64(format(template, ctx))
  //               }
  ngAfterViewInit() {
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js');
    this._script.load('.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js');
      

  }
  private getTeacherList() {
    this.baseservice.get('teacher').subscribe((data: any) => {
      this.teacherData = data.teacher;
      this.showtablerecord(data);
    },
    (err) => {
      // Handle errors as necessary
      // localStorage.clear();
    });
  }

  private getStateList() {  
    this.baseservice.get('statelist').subscribe((data: any) => {
      if (data && data.state && data.state.length > 0) {
        this.getCityList(data.state[0].id);
      }
      this.stateData = data.state;
      (<any>$('.state_select2_drop_down')).select2({ data: this.stateData });
    },
    (err) => {
      // Handle errors as necessary
      // localStorage.clear();
    });
  }

  private getCityList(stateId: number) {
    this.baseservice.get(`citylist/${stateId}`).subscribe((data: any) => {
      this.cityData = data.city;
      (<any>$('.city_select2_drop_down')).select2({ data: this.cityData });
    },
    (err) => {
      // Handle errors as necessary
      // localStorage.clear();
    });
  }
    selectFile(event: any) {
      this.selectedFiles = event.target.files[0];
    }
    public addTeacherSubmitForm(data:any){
      data.stateId=$('.state_select2_drop_down').val();
      data.cityId=$('.city_select2_drop_down').val();
      // data.divId=$('.division_select2_drop_down').val();
      // data.classId=$('.class_select2_drop_down').val();
      data.dateOfBirth=$("#m_datepickerSet").val();
      data.joiningDate=$("#m_datepickerSet1").val();
    
      
      const formData: FormData = new FormData(data);
    
    if(data.id!=''&& data.id!=undefined && data.id!=null)  {
    // data.image=this.selectedFiles;
    this.baseservice.put('teacher/'+data.id,data).subscribe((data:any) => {
      this.getTeacherList();
      this.listTemplate();
    },
    (err) => {
    
    //  localStorage.clear();
    });
    }else{
    // data.image=this.selectedFiles;
    delete data.id;
    this.baseservice.post('teacher',data).subscribe((data:any) => { 
      this.getTeacherList();
      this.listTemplate();
    },
    (err) => {
    
    //  localStorage.clear();
    });
    }
         
    }

    private getTeacherData(Id:any) {
      this.baseservice.get(<string>('teacher/'+Id)).subscribe((data:any) => { 
        this.editTemplate(data.teacher);
      },
      (err) => {
        //localStorage.clear();
      });
     
  
    }
    showtablerecord(data:any) {
      this.datatable = $('.m_datatable').mDatatable({
        // datasource definition
        data: {
          type: 'local',
          source: data.teacher,
          pageSize: 10
        },
        // layout definition
        layout: {
          theme: 'default',
          class: '',
          scroll: false,
          height: 450,
          footer: false
        },
        sortable: true,
        pagination: true,
        columns: [
          {
            field: 'id',
            title: 'Sr.No.',
            textAlign: 'center'
          },
          {
            field: 'firstName',
            title: 'Teacher Name',
            template: (row: any) => {
              return `<span (click)="detailProfile(${row.id})" style="cursor: pointer;" class="teacherFn" data-id="${row.id}">${row.firstName} ${row.lastName}</span>`;
            }
          },
          {
            field: 'className',
            title: 'Class-Div',
            template: (row: any) => {
              return `${row.className}-${row.divName}`;
            }
          },
          {
            field: 'mobileNumber',
            title: 'Mob Number'
          },
          {
            field: 'joiningDate',
            title: 'Joining Date'
          },
          {
            field: 'lastName',
            title: 'Actions',
            template: (row: any) => {
              return `<span class="btn m-btn m-btn--hover-accent m-btn--icon m-btn--icon-only m-btn--pill">
                <i class="edit-button la la-edit" data-id="${row.id}"></i>
              </span>`;
            }
          }
        ]
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
  
    this.renderer.listen(this.elRef.nativeElement.querySelector('.m_datatable'), 'click', (e) => {
      if ((e.target as HTMLElement).classList.contains('edit-button')) {
        e.preventDefault();
        const id = (e.target as HTMLElement).getAttribute('data-id');
        this.getTeacherData(id);
      }
      if ((e.target as HTMLElement).classList.contains('teacherFn')) {
                   e.preventDefault();
                   const id = (e.target as HTMLElement).getAttribute('data-id');
            this.router.navigate(['/teacher/profile/', id]);
      }
    });
  
      // this.renderer.selectRootElement(this.elRef.nativeElement).querySelector('.m_datatable')
      //   .addEventListener('click', (e:any) => {
      //     const target = e.target as HTMLElement;
      //     if (target.classList.contains('teacherFn')) {
      //       e.preventDefault();
      //       const id = target.getAttribute('data-id');
      //       this.router.navigate(['/teacher/profile/', id]);
      //     } else if (target.classList.contains('edit-button')) {
      //       e.preventDefault();
      //       const id = target.getAttribute('data-id');
      //       this.getTeacherData(id);
      //     }
      //   });
    }         
  }
 

    
    
  
