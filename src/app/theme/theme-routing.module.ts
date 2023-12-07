import { NgModule } from '@angular/core';
import { ThemeComponent } from './theme.component';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from "../auth/_guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    "component": ThemeComponent,
    "canActivate": [AuthGuard],
    "children": [
      {
        path: "dashboard",
        loadChildren: () => import('./pages/default/components/dashboard/dashboard.module').then(x => x.DashboardModule)

         },
      {
        path: "teacher",
        loadChildren: () => import('./pages/default/components/teacher/teacher.module').then(x => x.TeacherModule)
      },
      {
        path: "teacher-leave",
        loadChildren: () => import('./pages/default/components/teacher-leave/teacher-leave.module').then(x => x.TeacherLeaveModule)
      },
      {
        path: "teacher/profile/:id",
        loadChildren: () => import('./pages/default/components/teacher-profile/teacher-profile.module').then(x => x.TeacherProfileModule)
      },
//student section
      {
        path: "student",
        loadChildren: () => import('./pages/default/components/student/student.module').then(x => x.StudentModule)
      },
      {
        path: "absent-student",
        loadChildren: () => import('./pages/default/components/absent-student/absent-student.module').then(x => x.AbsentStudentModule)
      },
     
      {
        path: "student/profile/:id",
        loadChildren: () => import('./pages/default/components/student-profile/student-profile.module').then(x => x.StudentProfileModule)
      },
     // attendence section
      {
        path: "attendance",
        loadChildren: () => import('./pages/default/components/attendance/attendance.module').then(x => x.AttendanceModule)
      },  
      {
        path: "pending-attendance-record",
        loadChildren: () => import('./pages/default/components/pending-attendance-record/pending-attendance-record.module').then(x => x.PendingAttendanceRecordModule)
      },
      {
        path: "today-absent-student",
        loadChildren: () => import('./pages/default/components/today-absent-student/today-absent-student.module').then(x => x.TodayAbsentStudentModule)
      },
     // test marks section
     {
      path: "test-marks",
      loadChildren: () => import('./pages/default/components/test-marks/test-marks.module').then(x => x.TestMarksModule)
    },
    {
      path: "pending-marks-test",
      loadChildren: () => import('./pages/default/components/pending-marks-test/pending-marks-test.module').then(x => x.PendingMarksTestModule)
    }, 
    //timetable section
    {
      path: "timetable",
      loadChildren: () => import('./pages/default/components/timetable/timetable.module').then(x => x.TimeTableModule)
    }, 

      // Setting section 
      // {
      //   path: "class",
      //   loadChildren: () => import('./pages/default/components/class/class.module').then(x => x.ClassModule)
      // },
    
      {
        path: "division",
        loadChildren: () => import('./pages/default/components/division/division.module').then(x => x.DivisionModule)
      },
      {
        path: "subject",
        loadChildren: () => import('./pages/default/components/subject/subject.module').then(x => x.SubjectModule)
      },   
      {
        path: "test",
        loadChildren: () => import('./pages/default/components/test/test.module').then(x => x.TestModule)
      },
      {
        path: "class",
        loadChildren: () => import('./pages/default/components/class-subject-test/class-subject-test.module').then(x => x.ClassSubjectTestModule)
      },
       {
        path: "class-teacher",
        loadChildren: () => import('./pages/default/components/class-teacher/class-teacher.module').then(x => x.ClassTeacherModule)
      },
      {
        path: "teacher-subject",
        loadChildren: () => import('./pages/default/components/teacher-subject/teacher-subject.module').then(x => x.TeacherSubjectModule)
      },
      {
        path: "holidays",
        loadChildren: () => import('./pages/default/components/holidays/holidays.module').then(x => x.HolidaysModule)
      },
     //report section
      {
        path: "attendance-report",
        loadChildren: () => import('./pages/default/components/attendance-report/attendance-report.module').then(x => x.AttendanceReportModule)
      },
      {
        path: "test-result-report",
        loadChildren: () => import('./pages/default/components/test-result-report/test-result-report.module').then(x => x.testResultReportModule)
      },
      {
        path: "final-result-report",
        loadChildren: () => import('./pages/default/components/final-result-report/final-result-report.module').then(x => x.finalResultReportModule)
      },
      {
        path: "leaving-certificate",
        loadChildren: () => import('./pages/default/components/leaving-certificate/leaving-certificate.module').then(x => x.leavingCertificateModule)
      },
      {
        path: "library-books",
        loadChildren: () => import('./pages/default/components/books/books.module').then(x => x.BooksModule)
      },
      {
        path: "books-allocation",
        loadChildren: () => import('./pages/default/components/books-allocation/books-allocation.module').then(x => x.BooksAllocationModule)
      },
      {
        path: "homework",
        loadChildren: () => import('./pages/default/components/homework/homework.module').then(x => x.HomeworkModule)
      },
      // bus track Section
      {
        path: "bus-track",
        loadChildren: () => import('./pages/default/components/bus-track/bus-track.module').then(x => x.BusTrackModule)
      },
     
      {
        path: "school-setting",
        loadChildren: () => import('./pages/default/components/school-setting/school-setting.module').then(x => x.SchoolSettingModule)
      },
     
      {
        path: "index",
        loadChildren: () => import('./pages/default/index/index.module').then(x => x.IndexModule)
      },
     
      {
        path: "components/icons/flaticon",
        loadChildren: () => import('./pages/default/components/icons/icons-flaticon/icons-flaticon.module').then(x => x.IconsFlaticonModule)
      },
      {
        path: "components/icons/fontawesome",
        loadChildren: () => import('./pages/default/components/icons/icons-fontawesome/icons-fontawesome.module').then(x => x.IconsFontawesomeModule)
      },
      {
        path: "components/icons/lineawesome",
        loadChildren: () => import('./pages/default/components/icons/icons-lineawesome/icons-lineawesome.module').then(x => x.IconsLineawesomeModule)
      },
      {
        path: "components/icons/socicons",
        loadChildren: () => import('./pages/default/components/icons/icons-socicons/icons-socicons.module').then(x => x.IconsSociconsModule)
      },
      {
        path: "components/portlets/base",
        loadChildren: () => import('./pages/default/components/portlets/portlets-base/portlets-base.module').then(x => x.PortletsBaseModule)
      },
      {
        path: "components/portlets/advanced",
        loadChildren: () => import('./pages/default/components/portlets/portlets-advanced/portlets-advanced.module').then(x => x.PortletsAdvancedModule)
      },
      {
        path: "components/portlets/creative",
        loadChildren: () => import('./pages/default/components/portlets/portlets-creative/portlets-creative.module').then(x => x.PortletsCreativeModule)
      },
      {
        path: "components/portlets/tabbed",
        loadChildren: () => import('./pages/default/components/portlets/portlets-tabbed/portlets-tabbed.module').then(x => x.PortletsTabbedModule)
      },
      {
        path: "components/portlets/draggable",
        loadChildren: () => import('./pages/default/components/portlets/portlets-draggable/portlets-draggable.module').then(x => x.PortletsDraggableModule)
      },
      {
        path: "components/portlets/tools",
        loadChildren: () => import('./pages/default/components/portlets/portlets-tools/portlets-tools.module').then(x => x.PortletsToolsModule)
      },
      {
        path: "components/widgets/general",
        loadChildren: () => import('./pages/default/components/widgets/widgets-general/widgets-general.module').then(x => x.WidgetsGeneralModule)
      },
      {
        path: "components/widgets/chart",
        loadChildren: () => import('./pages/default/components/widgets/widgets-chart/widgets-chart.module').then(x => x.WidgetsChartModule)
      },  
      {
        path: "components/charts/amcharts/charts",
        loadChildren: () => import('./pages/default/components/charts/amcharts/amcharts-charts/amcharts-charts.module').then(x => x.AmchartsChartsModule)
      },
      {
        path: "components/charts/amcharts/stock-charts",
        loadChildren: () => import('./pages/default/components/charts/amcharts/amcharts-stock-charts/amcharts-stock-charts.module').then(x => x.AmchartsStockChartsModule)
      },
      {
        path: "components/charts/amcharts/maps",
        loadChildren: () => import('./pages/default/components/charts/amcharts/amcharts-maps/amcharts-maps.module').then(x => x.AmchartsMapsModule)
      },
     
      {
        path: "components/maps/google-maps",
        loadChildren: () => import('./pages/default/components/maps/maps-google-maps/maps-google-maps.module').then(x => x.MapsGoogleMapsModule)
      },
      {
        path: "components/maps/jqvmap",
        loadChildren: () => import('./pages/default/components/maps/maps-jqvmap/maps-jqvmap.module').then(x => x.MapsJqvmapModule)
      },
      {
        path: "components/utils/idle-timer",
        loadChildren: () => import('./pages/default/components/utils/utils-idle-timer/utils-idle-timer.module').then(x => x.UtilsIdleTimerModule)
      },
      {
        path: "components/utils/session-timeout",
        loadChildren: () => import('./pages/default/components/utils/utils-session-timeout/utils-session-timeout.module').then(x => x.UtilsSessionTimeoutModule)
      },
      {
        path: "header/actions",
        loadChildren: () => import('./pages/default/header/header-actions/header-actions.module').then(x => x.HeaderActionsModule)
      },
      {
        path: "header/profile",
        loadChildren: () => import('./pages/default/header/header-profile/header-profile.module').then(x => x.HeaderProfileModule)
      },
      {
        path: "404",
        loadChildren: () => import('./pages/default/not-found/not-found/not-found.module').then(x => x.NotFoundModule)
      },
      {
        path: "",
        "redirectTo": "index",
        "pathMatch": "full"
      }
    ]
  },
  {
    path: "snippets/pages/user/login-1",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/user/user-login-1/user-login-1.module').then(x => x.UserLogin1Module)
  },
  {
    path: "login",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/user/user-login-2/user-login-2.module').then(x => x.UserLogin2Module)
  },
  {
    path: "snippets/pages/user/login-3",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/user/user-login-3/user-login-3.module').then(x => x.UserLogin3Module)
  },
  {
    path: "snippets/pages/user/login-4",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/user/user-login-4/user-login-4.module').then(x => x.UserLogin4Module)
  },
  {
    path: "snippets/pages/user/login-5",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/user/user-login-5/user-login-5.module').then(x => x.UserLogin5Module)
  },
  {
    path: "snippets/pages/errors/error-1",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/errors/errors-error-1/errors-error-1.module').then(x => x.ErrorsError1Module)
  },
  {
    path: "snippets/pages/errors/error-2",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/errors/errors-error-2/errors-error-2.module').then(x => x.ErrorsError2Module)
  },
  {
    path: "snippets/pages/errors/error-3",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/errors/errors-error-3/errors-error-3.module').then(x => x.ErrorsError3Module)
  },
  {
    path: "snippets/pages/errors/error-4",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/errors/errors-error-4/errors-error-4.module').then(x => x.ErrorsError4Module)
  },
  {
    path: "snippets/pages/errors/error-5",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/errors/errors-error-5/errors-error-5.module').then(x => x.ErrorsError5Module)
  },
  {
    path: "snippets/pages/errors/error-6",
    loadChildren: () => import('./pages/self-layout-blank/snippets/pages/errors/errors-error-6/errors-error-6.module').then(x => x.ErrorsError6Module)
  },
  {
    path: "**",
    "redirectTo": "404",
    "pathMatch": "full"
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ThemeRoutingModule { }
