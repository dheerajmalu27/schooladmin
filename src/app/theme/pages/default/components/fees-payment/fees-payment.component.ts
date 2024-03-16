import {
  Component,
  OnInit,
  ViewEncapsulation,
  AfterViewInit,
  Renderer2,
  ElementRef,
} from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { CommonService } from '../../../../../_services/common-api.service';
import { FormControl, Validators, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseService } from '../../../../../_services/base.service';
import * as _ from 'lodash';
declare let $: any;
declare var toastr: any;
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { environment } from 'src/environments/environment';
@Component({
  selector: '.m-grid__item.m-grid__item--fluid.m-wrapper',
  templateUrl: './fees-payment.html',
  encapsulation: ViewEncapsulation.None,
})
export class feesPaymentComponent implements OnInit, AfterViewInit {
  imageUrlPath = environment.apiImageUrl;
  datatable: any; // Change the type to your actual data type
  admissionData: any = null;
  admissionReportData: any = null;
  isDisabled: boolean = true;
  TitleSet: any = null;
  stateData: any = null;
  cityData: any = null;
  pdfFileName = 'fees receipt';
  feesData: any = null;
  divisionData: any = null;
  classData: any = null;
  showTemplate: any;
  selectedFiles: any;
  addAdmissionForm: any;
  student: any;
  studentId = null;
  selectedAdmissionType: string | null = null;
  isStudentSelectionVisible: boolean = true;
  selectedStudent: any;
  finalResultStudentData: any;
  constructor(
    private elRef: ElementRef,
    private renderer: Renderer2,
    private commonservice: CommonService,
    private _script: ScriptLoaderService,
    private router: Router,
    public fb: FormBuilder,
    private baseservice: BaseService
  ) {}
  ngOnInit() {
    this.getAdmissionList();
    this.addAdmissionForm = this.fb.group({
      id: new FormControl(),
      studentId: new FormControl(),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      image: new FormControl(),
      dob: new FormControl(),
      classId: new FormControl(),
      divId: new FormControl(),
      nationality: new FormControl('', Validators.required),
      caste: new FormControl('', Validators.required),
      religion: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      bloodGroup: new FormControl(),
      gender: new FormControl('', Validators.required),
      motherName: new FormControl('', Validators.required),
      stateId: new FormControl(),
      cityId: new FormControl(),
      motherQual: new FormControl('', Validators.required),
      parentNumber: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
        Validators.maxLength(12),
      ]),
      fatherName: new FormControl('', Validators.required),
      fatherProf: new FormControl('', Validators.required),
      parentNumberSecond: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'),
        Validators.minLength(10),
      ]),
      prevPercentage: [0, Validators.required],
      totalFee: [null, Validators.required],
      tuitionFee: [null, Validators.required],
      developmentFee: [null, Validators.required],
      examinationFee: [null, Validators.required],
      sportsFee: [null, Validators.required],
      transportationFee: [null, Validators.required],
      libraryFee: [null, Validators.required],
      labFee: [null, Validators.required],
      securityFee: [null, Validators.required],
      otherFee: [null, Validators.required],
      paymentFrequency: [null],
      dueDate: [null],
      lateFee: [null],
      discount: [null],
      remainingAmount: [null, Validators.required],
      paymentMethod: [null, Validators.required],
      paymentDetail: [null, Validators.required],
      // 'lastName': [null,  Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(10)])],
    });

    this.listTemplate();
  }
  listTemplate() {
    $('#addTemplate').hide();
    $('#listTemplate').show();
  }

  addTemplate() {
    $('#m_user_profile_tab_1').show();
    $('#m_user_profile_tab_2').hide();
    this.TitleSet = 'Add Admission';
    this.studentId = null;
    this.addAdmissionForm.reset();
    this.disableOtherFeeControl();

    $('#addTemplate').show();
    $('#listTemplate').hide();
    this.getStateList();
    this.getClassList();
    // this.getDivisionList();
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js'
    );
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js'
    );

    $('#m_datepickerSet').datepicker({
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
    });
    $('#m_datepickerSet').on('change', function () {});
  }
  disableOtherFeeControl() {
    // this.addAdmissionForm.get('totalFee').disable();
    this.addAdmissionForm.get('tuitionFee').disable();
    this.addAdmissionForm.get('developmentFee').disable();
    // Disable individual form controls
    this.addAdmissionForm.get('examinationFee').disable();
    this.addAdmissionForm.get('sportsFee').disable();
    this.addAdmissionForm.get('transportationFee').disable();
    this.addAdmissionForm.get('libraryFee').disable();
    this.addAdmissionForm.get('labFee').disable();
    this.addAdmissionForm.get('securityFee').disable();
    this.addAdmissionForm.get('otherFee').disable();
    this.addAdmissionForm.get('paymentFrequency').disable();
    this.addAdmissionForm.get('remainingAmount').disable();
  }
  enableOtherFeeControl() {
    this.addAdmissionForm.get('tuitionFee').enable();
    this.addAdmissionForm.get('developmentFee').enable();
    // enable individual form controls
    this.addAdmissionForm.get('examinationFee').enable();
    this.addAdmissionForm.get('sportsFee').enable();
    this.addAdmissionForm.get('transportationFee').enable();
    this.addAdmissionForm.get('libraryFee').enable();
    this.addAdmissionForm.get('labFee').enable();
    this.addAdmissionForm.get('securityFee').enable();
    this.addAdmissionForm.get('otherFee').enable();
    this.addAdmissionForm.get('paymentFrequency').enable();
    this.addAdmissionForm.get('remainingAmount').enable();
  }

  public paymenttab() {
    $('#m_user_profile_tab_1').hide();
    $('#m_user_profile_tab_2').show();
  }
  public previoustab() {
    $('#m_user_profile_tab_2').hide();
    $('#m_user_profile_tab_1').show();
  }
  public calculatepayment(event: any, feeData: any) {
    const totalFeeValue = event.target.value;
    // Now you can use the totalFeeValue in your calculation logic
    console.log('Total Fee:', totalFeeValue);
    console.log('feeData Fee:', feeData);
    const remainingAmount = parseFloat(
      (parseFloat(this.feesData.totalFee) - totalFeeValue).toFixed(2)
    );
    this.addAdmissionForm.get('remainingAmount').setValue(remainingAmount);
    const newTuitionFee = parseFloat(
      (
        (parseFloat(this.feesData.tuitionFee) / this.feesData.totalFee) *
        totalFeeValue
      ).toFixed(2)
    );
    this.addAdmissionForm.get('tuitionFee').setValue(newTuitionFee);
    const newExaminationFee = parseFloat(
      (
        (parseFloat(this.feesData.examinationFee) / this.feesData.totalFee) *
        totalFeeValue
      ).toFixed(2)
    );
    this.addAdmissionForm.get('examinationFee').setValue(newExaminationFee);
    const newLabFee = parseFloat(
      (
        (parseFloat(this.feesData.labFee) / this.feesData.totalFee) *
        totalFeeValue
      ).toFixed(2)
    );
    this.addAdmissionForm.get('labFee').setValue(newLabFee);
    const newDevelopmentFee = parseFloat(
      (
        (parseFloat(this.feesData.developmentFee) / this.feesData.totalFee) *
        totalFeeValue
      ).toFixed(2)
    );
    this.addAdmissionForm.get('developmentFee').setValue(newDevelopmentFee);
    const newLibraryFee = parseFloat(
      (
        (parseFloat(this.feesData.libraryFee) / this.feesData.totalFee) *
        totalFeeValue
      ).toFixed(2)
    );
    this.addAdmissionForm.get('libraryFee').setValue(newLibraryFee);
    const newOtherFee = parseFloat(
      (
        (parseFloat(this.feesData.otherFee) / this.feesData.totalFee) *
        totalFeeValue
      ).toFixed(2)
    );
    this.addAdmissionForm.get('otherFee').setValue(newOtherFee);
    const newSecurityFee = parseFloat(
      (
        (parseFloat(this.feesData.securityFee) / this.feesData.totalFee) *
        totalFeeValue
      ).toFixed(2)
    );
    this.addAdmissionForm.get('securityFee').setValue(newSecurityFee);
    const newSportsFee = parseFloat(
      (
        (parseFloat(this.feesData.sportsFee) / this.feesData.totalFee) *
        totalFeeValue
      ).toFixed(2)
    );
    this.addAdmissionForm.get('sportsFee').setValue(newSportsFee);
    const newTransportationFee = parseFloat(
      (
        (parseFloat(this.feesData.transportationFee) / this.feesData.totalFee) *
        totalFeeValue
      ).toFixed(2)
    );
    this.addAdmissionForm
      .get('transportationFee')
      .setValue(newTransportationFee);
  }
  public AddOldStudentTemplate(admissionData: any) {
    this.TitleSet = 'Add Admission';

    this.addAdmissionForm.reset();
    this.getClassList();
    // this.getDivisionList();
    this.getStateList();
    $('#listTemplate').hide();
    $('#addTemplate').show();

    let feesPaymentDetails = {};
    this.addAdmissionForm.setValue({
      id: null,
      studentId: admissionData.id,
      // firstName: admissionData.firstName,
      // middleName: admissionData.middleName,
      // lastName: admissionData.lastName,
      // // image: admissionData.profileImage,
      // image: '',
      // dob: admissionData.dateOfBirth,
      // classId: admissionData.classId,
      // divId: admissionData.divId,
      // nationality: admissionData.nationality,
      // caste: admissionData.caste,
      // religion: admissionData.religion,
      // address: admissionData.address,
      // bloodGroup: admissionData.bloodGroup,
      // gender: admissionData.gender,
      // motherName: admissionData.motherName,
      // stateId: admissionData.stateId,
      // cityId: admissionData.cityId,
      // motherQual: admissionData.motherQual,
      // parentNumber: admissionData.parentNumber,
      // fatherName: admissionData.fatherName,
      // fatherProf: admissionData.fatherProf,
      // parentNumberSecond: admissionData.parentNumberSecond,
      // prevPercentage: 0,
      totalFee: '',
      tuitionFee: '',
      developmentFee: '',
      examinationFee: '',
      sportsFee: '',
      transportationFee: '',
      libraryFee: '',
      labFee: '',
      securityFee: '',
      otherFee: '',
      paymentFrequency: '',
      dueDate: '',
      lateFee: '',
      discount: '',
      remainingAmount: '',
      paymentMethod: '',
      paymentDetail: '',
    });

    this.disableOtherFeeControl();
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js'
    );
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js'
    );
    $('#m_datepickerSet').datepicker({
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
    });
    setTimeout(() => {
      $('.class_select2_drop_down')
        .val(<string>admissionData.classId)
        .trigger('change');
      // $(".division_select2_drop_down").val(<string>admissionData.divId).trigger('change');
      $('.state_select2_drop_down')
        .val(<string>admissionData.stateId)
        .trigger('change');
    }, 2000);
  }

  public editTemplate(admissionData: any) {
    this.TitleSet = 'Edit Admission';

    this.addAdmissionForm.reset();
    this.getClassList();
    // this.getDivisionList();
    this.getStateList();
    $('#listTemplate').hide();
    $('#addTemplate').hide();
    $('#addTemplate').show();
    let feesPaymentDetails = JSON.parse(admissionData.feesPaymentDetails);
    this.addAdmissionForm.setValue({
      id: admissionData.id,
      studentId: admissionData.studentId,
      // firstName: admissionData.firstName,
      // middleName: admissionData.middleName,
      // lastName: admissionData.lastName,
      // // image: admissionData.profileImage,
      // image: '',
      // dob: admissionData.dateOfBirth,
      // classId: admissionData.classId,
      // divId: admissionData.divId,
      // nationality: admissionData.nationality,
      // caste: admissionData.caste,
      // religion: admissionData.religion,
      // address: admissionData.address,
      // bloodGroup: admissionData.bloodGroup,
      // gender: admissionData.gender,
      // motherName: admissionData.motherName,
      // stateId: admissionData.stateId,
      // cityId: admissionData.cityId,
      // motherQual: admissionData.motherQual,
      // parentNumber: admissionData.parentNumber,
      // fatherName: admissionData.fatherName,
      // fatherProf: admissionData.fatherProf,
      // parentNumberSecond: admissionData.parentNumberSecond,
      // prevPercentage: admissionData.prevPercentage,
      totalFee:
        feesPaymentDetails.totalFee !== undefined
          ? feesPaymentDetails.totalFee
          : '',
      tuitionFee:
        feesPaymentDetails.tuitionFee !== undefined
          ? feesPaymentDetails.tuitionFee
          : '',
      developmentFee:
        feesPaymentDetails.developmentFee !== undefined
          ? feesPaymentDetails.developmentFee
          : '',
      examinationFee:
        feesPaymentDetails.examinationFee !== undefined
          ? feesPaymentDetails.examinationFee
          : '',
      sportsFee:
        feesPaymentDetails.sportsFee !== undefined
          ? feesPaymentDetails.sportsFee
          : '',
      transportationFee:
        feesPaymentDetails.transportationFee !== undefined
          ? feesPaymentDetails.transportationFee
          : '',
      libraryFee:
        feesPaymentDetails.libraryFee !== undefined
          ? feesPaymentDetails.libraryFee
          : '',
      labFee:
        feesPaymentDetails.labFee !== undefined
          ? feesPaymentDetails.labFee
          : '',
      securityFee:
        feesPaymentDetails.securityFee !== undefined
          ? feesPaymentDetails.securityFee
          : '',
      otherFee:
        feesPaymentDetails.otherFee !== undefined
          ? feesPaymentDetails.otherFee
          : '',
      paymentFrequency:
        feesPaymentDetails.paymentFrequency !== undefined
          ? feesPaymentDetails.paymentFrequency
          : '',
      dueDate:
        feesPaymentDetails.dueDate !== undefined
          ? feesPaymentDetails.dueDate
          : '',
      lateFee:
        feesPaymentDetails.lateFee !== undefined
          ? feesPaymentDetails.lateFee
          : '',
      discount:
        feesPaymentDetails.discount !== undefined
          ? feesPaymentDetails.discount
          : '',

      remainingAmount: admissionData.remainingAmount,
      paymentMethod: admissionData.paymentMethod,
      paymentDetail: admissionData.paymentDetail,
    });

    this.disableOtherFeeControl();
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/select2.js'
    );
    this._script.load(
      '.m-grid__item.m-grid__item--fluid.m-wrapper',
      'assets/demo/default/custom/components/forms/widgets/bootstrap-datepicker.js'
    );
    $('#m_datepickerSet').datepicker({
      todayHighlight: true,
      templates: {
        leftArrow: '<i class="la la-angle-left"></i>',
        rightArrow: '<i class="la la-angle-right"></i>',
      },
    });
    setTimeout(() => {
      $('.class_select2_drop_down')
        .val(<string>admissionData.classId)
        .trigger('change');
      // $(".division_select2_drop_down").val(<string>admissionData.divId).trigger('change');
      $('.state_select2_drop_down')
        .val(<string>admissionData.stateId)
        .trigger('change');
    }, 2000);
  }
  tableToExcel(table: any) {
    this.commonservice.tableToExcel(table, 'fees paid receipt list');
  }
  ngAfterViewInit() {}
  private getAdmissionList() {
    this.baseservice.get('admission').subscribe(
      (data: any) => {
        this.admissionData = data.admission;
        this.admissionReportData = this.admissionData.map((admission: any) => {
          // Parse the feesPaymentDetails string into an object
          const feesPaymentDetails = JSON.parse(admission.feesPaymentDetails);

          // Merge the properties of feesPaymentDetails into the main object using the spread operator
          return { ...admission, ...feesPaymentDetails };
        });

        console.log(this.admissionReportData);
        this.refreshDataTable(data);
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }

  private getFeeReceiptExcel(Id: any) {
    console.log(Id);
    this.student = this.admissionReportData.find((item: any) => item.id == Id);
    setTimeout(() => {
      this.hideModelPopup();
      this.tableToExcel('exportTable');
    }, 1000);
  }

  private getFeeReceiptPdf(Id: any) {
    this.student = this.admissionReportData.find((item: any) => item.id == Id);
    setTimeout(() => {
      let schoolProfileStorageData: any = localStorage.getItem(
        environment.schoolProfileStoage
      );
      if (schoolProfileStorageData !== null) {
        schoolProfileStorageData = JSON.parse(
          this.commonservice.b64_to_utf8(schoolProfileStorageData)
        );
      } else {
        console.error('schoolProfileStorageData is null');
        return;
      }

      // Check if schoolProfileStorageData is an object and has the schoolName property
      if (
        typeof schoolProfileStorageData !== 'object' ||
        !schoolProfileStorageData.schoolName
      ) {
        console.error(
          'schoolProfileStorageData is not in the correct format or missing schoolName property'
        );
        return;
      }
      this.student.schoolName = schoolProfileStorageData.schoolName;
      this.student.schoolAddress = schoolProfileStorageData.schoolAddress;
      this.student.schoolLogo = schoolProfileStorageData.schoolLogo;

      this.showModelPopup();
    }, 1000);
  }
  public onSubmit() {
    // Handle the submission logic here
    if (this.selectedAdmissionType == 'new') {
      this.hideModelPopup();
      this.addTemplate();
    } else {
      this.baseservice.get('student/' + this.selectedStudent).subscribe(
        (data: any) => {
          console.log(data);
          if (data != '') {
            this.hideModelPopup();
            this.AddOldStudentTemplate(data.student);
          } else {
            this.hideModelPopup();
            this.addTemplate();
          }
        },
        (err) => {
          //  localStorage.clear();
        }
      );
    }
    console.log('Admission Type:', this.selectedAdmissionType);
    console.log('Selected Student:', this.selectedStudent);
  }
  public onAdmissionTypeChange() {
    // Reset selected student when admission type changes
    this.selectedStudent = null;

    // Show/hide student selection based on admission type
    this.isStudentSelectionVisible = this.selectedAdmissionType === 'old';
    if (this.selectedAdmissionType === 'old') {
      this.baseservice.get(<string>'finalresultstudentlist').subscribe(
        (data: any) => {
          console.log(data);
          this.finalResultStudentData = data.student;
        },
        (err) => {
          //localStorage.clear();
        }
      );
    }
  }
  public showModelPopup() {
    $('#myModel').addClass('modal fade show');
    $('#myModel').show();
    $('#myModel .modal-open').show();
  }
  public hideModelPopup() {
    $('#myModel').removeClass('modal fade show');
    $('#myModel').hide();
    $('#myModel .modal-open').hide();
  }
  private getStateList() {
    this.baseservice.get('statelist').subscribe(
      (data: any) => {
        if (data != '') {
          this.getCityList(data.state[0].id);
        }
        this.stateData = data.state;
        console.log(data.state[0].id);
        (<any>$('.state_select2_drop_down')).select2({ data: this.stateData });
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }

  private getCityList(stateId: any) {
    this.baseservice.get('citylist/' + stateId).subscribe(
      (data: any) => {
        this.cityData = data.city;
        (<any>$('.city_select2_drop_down')).select2({ data: this.cityData });
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }
  private getClassList() {
    var select2: any;
    var resultArray: Array<any> = [];
    this.baseservice.get('classlist').subscribe(
      (data: any) => {
        this.classData = data.class;
        $('.class_select2_drop_down').empty().trigger('change');
        (<any>$('.class_select2_drop_down')).select2({ data: this.classData });
        $('.class_select2_drop_down').on('change', (event: any) => {
          console.log(event);
          this.onClassChange();
        });
      },
      (err) => {
        //  localStorage.clear();
      }
    );
  }
  onClassChange() {
    const selectedClassId = $('.class_select2_drop_down').val();
    this.addAdmissionForm.controls['classId'].setValue(selectedClassId);
    console.log(selectedClassId);
    if (selectedClassId) {
      // // Make an API call to get divisions based on the selected class
      this.baseservice.get('feesdatabyclass/' + selectedClassId).subscribe(
        (data: any) => {
          if (typeof data.fees == 'undefined') {
            alert('please check this class fees struture...!');
            this.listTemplate();
          } else {
            this.feesData = data.fees;
          }
        },
        (error) => {
          console.error('Error fetching subject:', error);
        }
      );
    } else {
      // Reset divisions if no class is selected
      this.divisionData = [];
    }
  }

  selectFile(event: any) {
    this.selectedFiles = event.target.files[0];
  }
  public addAdmissionSubmitForm(data: any) {
    this.enableOtherFeeControl();
    data = this.addAdmissionForm.value;
    const formData: FormData = new FormData();
    data.stateId = $('.state_select2_drop_down').val();
    data.cityId = $('.city_select2_drop_down').val();
    data.divId = 1;
    data.classId = $('.class_select2_drop_down').val();
    data.dob = $('#m_datepickerSet').val();

    const fileInput = document.getElementById(
      'imageInput'
    ) as HTMLInputElement | null;

    console.log(data);
    for (const key of Object.keys(data)) {
      formData.append(key, data[key]);
    }

    // if (this.selectedFiles && this.selectedFiles.length > 0) {
    //     formData.append('image', this.selectedFiles[0]);
    // }
    formData.set('stateId', $('.state_select2_drop_down').val() as string);
    formData.set('cityId', $('.city_select2_drop_down').val() as string);
    formData.set('divId', '1');
    formData.set('classId', $('.class_select2_drop_down').val() as string);
    formData.set('dateOfBirth', $('#m_datepickerSet').val() as string);
    if (fileInput && fileInput.files) {
      if (fileInput.files.length > 0) {
        formData.set('image', fileInput.files[0]);
      }
    }
    if (data.id != '' && data.id != undefined && data.id != null) {
      // data.image=this.selectedFiles;
      this.baseservice.put('admission/' + data.id, formData).subscribe(
        (data: any) => {
          this.getAdmissionList();
          this.listTemplate();
          toastr.success('Record has been updated successfully...!');
        },
        (err) => {
          console.log(err);
          toastr.error('Something went wrong...!');
          //  localStorage.clear();
        }
      );
    } else {
      data.image = this.selectedFiles;
      delete data.id;
      console.log(formData);
      console.log(data);
      this.baseservice.post('admission', formData).subscribe(
        (data: any) => {
          this.getAdmissionList();
          this.listTemplate();
          toastr.success('Record has been added successfully...!');
        },
        (err) => {
          console.log(err);
          toastr.error('Something went wrong...!');
          //  localStorage.clear();
        }
      );
    }
  }
  getFeeDetails(): { description: string; amount: number }[] {
    const feeDetails = JSON.parse(this.student.feesPaymentDetails);
    const feeArray = [];
    for (const key in feeDetails) {
      if (feeDetails.hasOwnProperty(key)) {
        feeArray.push({ description: key, amount: feeDetails[key] });
      }
    }
    return feeArray;
  }
  public refreshDataTable(newData: any): void {
    // Destroy existing datatable

    if (this.datatable) {
      this.datatable.destroy(); // Destroy existing datatable instance
      this.showtablerecord(newData); // Reinitialize datatable with new data
    } else {
      this.showtablerecord(newData);
    }

    // Show new data in datatable
  }
  public printDiv(divId: string): void {
    const printContents = document.getElementById(divId)?.innerHTML;
    const originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents || '';

    window.print();

    document.body.innerHTML = originalContents;
  }
  public async generateFile() {
    const cards = document.querySelectorAll<HTMLElement>('.contentData');

    if (!cards || cards.length === 0) {
      console.error('No student ID cards found!');
      return;
    }

    const pdf = new jsPDF();

    // Array to store promises for each card
    const promises: Promise<void>[] = [];

    // Iterate over each card and add it to the PDF
    cards.forEach((card, index) => {
      // Convert the card to a canvas
      const promise = html2canvas(card, {
        useCORS: true,
      }).then(async (canvas) => {
        // Add the canvas to a new page in the PDF
        if (index > 0) {
          pdf.addPage();
        }
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        await pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);

        // If this is the last card, save the PDF
        if (index === cards.length - 1) {
          pdf.save(this.pdfFileName);
        }
      });
      promises.push(promise);
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
  }
  public showtablerecord(data: any) {
    try {
      let i = 1;

      // Assuming you're still using the jQuery based datatable.
      // Consider using Angular-based datatable libraries for more integration.
      this.datatable = $('.m_datatable').mDatatable({
        // datasource definition
        data: {
          type: 'local',
          source: data.admission,
          pageSize: 10,
        },

        layout: {
          theme: 'default', // datatable theme
          class: '', // custom wrapper class
          scroll: false, // enable/disable datatable scroll both horizontal and vertical when needed.
          height: 450, // datatable's body's fixed height
          footer: false, // display/hide footer
        },
        sortable: true,

        pagination: true,
        columns: [
          {
            field: '',
            title: 'Sr.No.',
            textAlign: 'center',
            sortable: false,
            template: function (row: any) {
              return i++;
            },
          },
          {
            field: 'firstName',
            title: 'Student Name',
            template: function (row: any) {
              return row.firstName + ' ' + row.lastName;
            },
          },
          {
            field: 'className',
            title: 'Class Name',
            template: function (row: any) {
              return row.className + '-' + row.divName;
            },
          },
          {
            field: 'fatherName',
            title: 'Father Name ',
            template: function (row: any) {
              return row.fatherName;
            },
          },
          {
            field: 'fatherName',
            title: 'Father Name ',
          },
          {
            field: 'paymentAmount',
            title: 'Paid Amount',
          },
          {
            field: 'remainingAmount',
            title: 'Remaining Amount',
          },
          {
            field: 'lastName',
            title: 'Actions',

            template: function (row: any) {
              return (
                '<span class="m-badge m-badge--success m-badge--wide" style="font-size:16px;padding:5px;margin:5px;" > <i class="excel-button fa fa-file-excel-o" data-id="' +
                row.id +
                '"></i> Excel</span><span class="m-badge m-badge--danger m-badge--wide" style="font-size:16px;padding:5px;" ><i class="pdf-button fa	fa-file-pdf-o" data-id="' +
                row.id +
                '"></i> Print</span>'
              );
            },
          },
        ],
      });

      const query = this.datatable.getDataSourceQuery();

      const formSearch =
        this.elRef.nativeElement.querySelector('#m_form_search');
      const formStatus =
        this.elRef.nativeElement.querySelector('#m_form_status');
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
        this.elRef.nativeElement.querySelectorAll(
          '#m_form_status, #m_form_type'
        )
      ).selectpicker();

      this.renderer.listen(
        this.elRef.nativeElement.querySelector('.m_datatable'),
        'click',
        (e) => {
          if ((e.target as HTMLElement).classList.contains('excel-button')) {
            e.preventDefault();
            const id = (e.target as HTMLElement).getAttribute('data-id');
            this.getFeeReceiptExcel(id);
          }
          if ((e.target as HTMLElement).classList.contains('pdf-button')) {
            e.preventDefault();
            const id = (e.target as HTMLElement).getAttribute('data-id');
            this.getFeeReceiptPdf(id);
          }
        }
      );
      // For elements inside datatable, you might still need jQuery.
      $(this.elRef.nativeElement.querySelector('.m_datatable')).on(
        'click',
        '.teacherFn',
        (e: any) => {
          e.preventDefault();
          const id = $(e.target).attr('data-id');
        }
      );

      // $(this.elRef.nativeElement.querySelector('.m_datatable')).on('click', '.edit-button', (e:any) => {
      //   e.preventDefault();
      //   const id = $(e.target).attr('data-id');
      //   this.getFeeReceiptExcel(id);
      // });
    } catch (error) {
      console.log(error);
    }
  }
}
