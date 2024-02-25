import { MENU_CONFIG } from './layouts/aside-nav/aside-nav-config';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ThemeComponent } from './theme.component';
import { AuthGuard } from '../auth/_guards/auth.guard';

// // Function to generate dynamic routes
// function generateDynamicRoutes() {
//   const routes: Routes = [];

//   MENU_CONFIG.admin.forEach((menuItem) => {
//     if (menuItem.subItems) {
//       menuItem.subItems.forEach((subItem) => {
//         if (subItem.loadChildren && subItem.module) {
//           routes.push({
//             path: subItem.path || '',
//             loadChildren: () =>
//               import(`.${subItem.loadChildren}`).then(
//                 (module) => module[subItem.module]
//               ),
//           });
//         }
//       });
//     } else if (menuItem.loadChildren && menuItem.module) {
//       routes.push({
//         path: menuItem.path || '',
//         loadChildren: () =>
//           import(`.${menuItem.loadChildren}`).then(
//             (module) => module[menuItem.module]
//           ),
//       });
//     }
//   });

//   return routes;
// }

// const dynamicRoutes = generateDynamicRoutes();
// console.log('Dynamic Routes:', dynamicRoutes);
const routes: Routes = [
  {
    path: '',
    component: ThemeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./pages/default/components/dashboard/dashboard.module').then(
            (x) => x.DashboardModule
          ),
      },
      {
        path: 'teacher',
        loadChildren: () =>
          import('./pages/default/components/teacher/teacher.module').then(
            (x) => x.TeacherModule
          ),
        data: { roles: ['admin', 'teacher'] }, // Admin and teacher roles can access
      },
      {
        path: 'teacher-leave',
        loadChildren: () =>
          import(
            './pages/default/components/teacher-leave/teacher-leave.module'
          ).then((x) => x.TeacherLeaveModule),
        data: { roles: ['admin', 'teacher'] }, // Admin and teacher roles can access
      },
      {
        path: 'teacher/profile/:id',
        loadChildren: () =>
          import(
            './pages/default/components/teacher-profile/teacher-profile.module'
          ).then((x) => x.TeacherProfileModule),
        data: { roles: ['admin'] }, // Admin and teacher roles can access
      },
      //student section
      {
        path: 'student',
        loadChildren: () =>
          import('./pages/default/components/student/student.module').then(
            (x) => x.StudentModule
          ),
        data: { roles: ['admin', 'classteacher', 'teacher'] },
      },
      {
        path: 'absent-student',
        loadChildren: () =>
          import(
            './pages/default/components/absent-student/absent-student.module'
          ).then((x) => x.AbsentStudentModule),
        data: { roles: ['admin', 'classteacher'] },
      },

      {
        path: 'student/profile/:id',
        loadChildren: () =>
          import(
            './pages/default/components/student-profile/student-profile.module'
          ).then((x) => x.StudentProfileModule),
        data: { roles: ['admin', 'classteacher', 'teacher'] },
      },
      // attendence section
      {
        path: 'attendance',
        loadChildren: () =>
          import(
            './pages/default/components/attendance/attendance.module'
          ).then((x) => x.AttendanceModule),
        data: { roles: ['admin', 'classteacher'] },
      },
      {
        path: 'pending-attendance-record',
        loadChildren: () =>
          import(
            './pages/default/components/pending-attendance-record/pending-attendance-record.module'
          ).then((x) => x.PendingAttendanceRecordModule),
        data: { roles: ['admin', 'classteacher'] },
      },
      {
        path: 'today-absent-student',
        loadChildren: () =>
          import(
            './pages/default/components/today-absent-student/today-absent-student.module'
          ).then((x) => x.TodayAbsentStudentModule),
        data: { roles: ['admin', 'classteacher', 'teacher'] },
      },
      // test marks section
      {
        path: 'test-marks',
        loadChildren: () =>
          import(
            './pages/default/components/test-marks/test-marks.module'
          ).then((x) => x.TestMarksModule),
        data: { roles: ['admin', 'classteacher', 'teacher'] },
      },
      {
        path: 'pending-marks-test',
        loadChildren: () =>
          import(
            './pages/default/components/pending-marks-test/pending-marks-test.module'
          ).then((x) => x.PendingMarksTestModule),
        data: { roles: ['admin', 'classteacher', 'teacher'] },
      },
      //timetable section
      {
        path: 'timetable',
        loadChildren: () =>
          import('./pages/default/components/timetable/timetable.module').then(
            (x) => x.TimeTableModule
          ),
        data: { roles: ['admin', 'classteacher', 'teacher'] },
      },
      {
        path: 'division',
        loadChildren: () =>
          import('./pages/default/components/division/division.module').then(
            (x) => x.DivisionModule
          ),
        data: { roles: ['admin'] },
      },
      {
        path: 'subject',
        loadChildren: () =>
          import('./pages/default/components/subject/subject.module').then(
            (x) => x.SubjectModule
          ),
        data: { roles: ['admin'] },
      },
      {
        path: 'test',
        loadChildren: () =>
          import('./pages/default/components/test/test.module').then(
            (x) => x.TestModule
          ),
        data: { roles: ['admin'] },
      },
      {
        path: 'class',
        loadChildren: () =>
          import(
            './pages/default/components/class-subject-test/class-subject-test.module'
          ).then((x) => x.ClassSubjectTestModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'class-teacher',
        loadChildren: () =>
          import(
            './pages/default/components/class-teacher/class-teacher.module'
          ).then((x) => x.ClassTeacherModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'teacher-subject',
        loadChildren: () =>
          import(
            './pages/default/components/teacher-subject/teacher-subject.module'
          ).then((x) => x.TeacherSubjectModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'holidays',
        loadChildren: () =>
          import('./pages/default/components/holidays/holidays.module').then(
            (x) => x.HolidaysModule
          ),
        data: { roles: ['admin'] },
      },
      //report section
      {
        path: 'attendance-report',
        loadChildren: () =>
          import(
            './pages/default/components/attendance-report/attendance-report.module'
          ).then((x) => x.AttendanceReportModule),
        data: { roles: ['admin', 'classteacher'] },
      },
      {
        path: 'test-result-report',
        loadChildren: () =>
          import(
            './pages/default/components/test-result-report/test-result-report.module'
          ).then((x) => x.testResultReportModule),
        data: { roles: ['admin', 'classteacher'] },
      },
      {
        path: 'final-result-report',
        loadChildren: () =>
          import(
            './pages/default/components/final-result-report/final-result-report.module'
          ).then((x) => x.finalResultReportModule),
        data: { roles: ['admin', 'classteacher'] },
      },
      {
        path: 'leaving-certificate',
        loadChildren: () =>
          import(
            './pages/default/components/leaving-certificate/leaving-certificate.module'
          ).then((x) => x.leavingCertificateModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'library-books',
        loadChildren: () =>
          import('./pages/default/components/books/books.module').then(
            (x) => x.BooksModule
          ),
        data: { roles: ['admin', 'librarian'] },
      },
      {
        path: 'books-allocation',
        loadChildren: () =>
          import(
            './pages/default/components/books-allocation/books-allocation.module'
          ).then((x) => x.BooksAllocationModule),
        data: { roles: ['admin', 'librarian'] },
      },
      {
        path: 'homework',
        loadChildren: () =>
          import('./pages/default/components/homework/homework.module').then(
            (x) => x.HomeworkModule
          ),
        data: { roles: ['admin', 'classteacher', 'teacher'] },
      },
      {
        path: 'fees-structure',
        loadChildren: () =>
          import(
            './pages/default/components/fees-structure/fees-structure.module'
          ).then((x) => x.FeesStructureModule),
        data: { roles: ['admin'] },
      },
      // bus track Section
      {
        path: 'bus-track',
        loadChildren: () =>
          import('./pages/default/components/bus-track/bus-track.module').then(
            (x) => x.BusTrackModule
          ),
        data: { roles: ['admin'] },
      },

      {
        path: 'school-setting',
        loadChildren: () =>
          import(
            './pages/default/components/school-setting/school-setting.module'
          ).then((x) => x.SchoolSettingModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'admission',
        loadChildren: () =>
          import('./pages/default/components/admission/admission.module').then(
            (x) => x.AdmissionModule
          ),
        data: { roles: ['admin'] },
      },
      {
        path: 'division-allocation',
        loadChildren: () =>
          import(
            './pages/default/components/division-allocation/division-allocation.module'
          ).then((x) => x.DivisionAllocationModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'student-class-list-report',
        loadChildren: () =>
          import(
            './pages/default/components/student-class-list-report/student-class-list-report.module'
          ).then((x) => x.StudentClassListReportModule),
        data: { roles: ['admin', 'classteacher', 'teacher'] },
      },
      {
        path: 'school-docs',
        loadChildren: () =>
          import(
            './pages/default/components/school-docs/school-docs.module'
          ).then((x) => x.SchoolDocsModule),
        data: { roles: ['admin', 'classteacher', 'teacher'] },
      },

      {
        path: 'index',
        loadChildren: () =>
          import('./pages/default/index/index.module').then(
            (x) => x.IndexModule
          ),
        data: { roles: ['admin'] },
      },

      {
        path: 'components/icons/flaticon',
        loadChildren: () =>
          import(
            './pages/default/components/icons/icons-flaticon/icons-flaticon.module'
          ).then((x) => x.IconsFlaticonModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/icons/fontawesome',
        loadChildren: () =>
          import(
            './pages/default/components/icons/icons-fontawesome/icons-fontawesome.module'
          ).then((x) => x.IconsFontawesomeModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/icons/lineawesome',
        loadChildren: () =>
          import(
            './pages/default/components/icons/icons-lineawesome/icons-lineawesome.module'
          ).then((x) => x.IconsLineawesomeModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/icons/socicons',
        loadChildren: () =>
          import(
            './pages/default/components/icons/icons-socicons/icons-socicons.module'
          ).then((x) => x.IconsSociconsModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/portlets/base',
        loadChildren: () =>
          import(
            './pages/default/components/portlets/portlets-base/portlets-base.module'
          ).then((x) => x.PortletsBaseModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/portlets/advanced',
        loadChildren: () =>
          import(
            './pages/default/components/portlets/portlets-advanced/portlets-advanced.module'
          ).then((x) => x.PortletsAdvancedModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/portlets/creative',
        loadChildren: () =>
          import(
            './pages/default/components/portlets/portlets-creative/portlets-creative.module'
          ).then((x) => x.PortletsCreativeModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/portlets/tabbed',
        loadChildren: () =>
          import(
            './pages/default/components/portlets/portlets-tabbed/portlets-tabbed.module'
          ).then((x) => x.PortletsTabbedModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/portlets/draggable',
        loadChildren: () =>
          import(
            './pages/default/components/portlets/portlets-draggable/portlets-draggable.module'
          ).then((x) => x.PortletsDraggableModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/portlets/tools',
        loadChildren: () =>
          import(
            './pages/default/components/portlets/portlets-tools/portlets-tools.module'
          ).then((x) => x.PortletsToolsModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/widgets/general',
        loadChildren: () =>
          import(
            './pages/default/components/widgets/widgets-general/widgets-general.module'
          ).then((x) => x.WidgetsGeneralModule),
        data: { roles: ['admin'] },
      },
      {
        path: 'components/widgets/chart',
        loadChildren: () =>
          import(
            './pages/default/components/widgets/widgets-chart/widgets-chart.module'
          ).then((x) => x.WidgetsChartModule),
      },
      {
        path: 'components/charts/amcharts/charts',
        loadChildren: () =>
          import(
            './pages/default/components/charts/amcharts/amcharts-charts/amcharts-charts.module'
          ).then((x) => x.AmchartsChartsModule),
      },
      {
        path: 'components/charts/amcharts/stock-charts',
        loadChildren: () =>
          import(
            './pages/default/components/charts/amcharts/amcharts-stock-charts/amcharts-stock-charts.module'
          ).then((x) => x.AmchartsStockChartsModule),
      },
      {
        path: 'components/charts/amcharts/maps',
        loadChildren: () =>
          import(
            './pages/default/components/charts/amcharts/amcharts-maps/amcharts-maps.module'
          ).then((x) => x.AmchartsMapsModule),
      },

      {
        path: 'components/maps/google-maps',
        loadChildren: () =>
          import(
            './pages/default/components/maps/maps-google-maps/maps-google-maps.module'
          ).then((x) => x.MapsGoogleMapsModule),
      },
      {
        path: 'components/maps/jqvmap',
        loadChildren: () =>
          import(
            './pages/default/components/maps/maps-jqvmap/maps-jqvmap.module'
          ).then((x) => x.MapsJqvmapModule),
      },
      {
        path: 'components/utils/idle-timer',
        loadChildren: () =>
          import(
            './pages/default/components/utils/utils-idle-timer/utils-idle-timer.module'
          ).then((x) => x.UtilsIdleTimerModule),
      },
      {
        path: 'components/utils/session-timeout',
        loadChildren: () =>
          import(
            './pages/default/components/utils/utils-session-timeout/utils-session-timeout.module'
          ).then((x) => x.UtilsSessionTimeoutModule),
      },
      {
        path: 'header/actions',
        loadChildren: () =>
          import(
            './pages/default/header/header-actions/header-actions.module'
          ).then((x) => x.HeaderActionsModule),
      },
      {
        path: 'header/profile',
        loadChildren: () =>
          import(
            './pages/default/header/header-profile/header-profile.module'
          ).then((x) => x.HeaderProfileModule),
      },
      {
        path: '404',
        loadChildren: () =>
          import('./pages/default/not-found/not-found/not-found.module').then(
            (x) => x.NotFoundModule
          ),
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: 'snippets/pages/user/login-1',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/user/user-login-1/user-login-1.module'
      ).then((x) => x.UserLogin1Module),
  },
  {
    path: 'login',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/user/user-login-2/user-login-2.module'
      ).then((x) => x.UserLogin2Module),
  },
  {
    path: 'snippets/pages/user/login-3',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/user/user-login-3/user-login-3.module'
      ).then((x) => x.UserLogin3Module),
  },
  {
    path: 'snippets/pages/user/login-4',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/user/user-login-4/user-login-4.module'
      ).then((x) => x.UserLogin4Module),
  },
  {
    path: 'snippets/pages/user/login-5',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/user/user-login-5/user-login-5.module'
      ).then((x) => x.UserLogin5Module),
  },
  {
    path: 'snippets/pages/errors/error-1',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/errors/errors-error-1/errors-error-1.module'
      ).then((x) => x.ErrorsError1Module),
  },
  {
    path: 'snippets/pages/errors/error-2',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/errors/errors-error-2/errors-error-2.module'
      ).then((x) => x.ErrorsError2Module),
  },
  {
    path: 'snippets/pages/errors/error-3',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/errors/errors-error-3/errors-error-3.module'
      ).then((x) => x.ErrorsError3Module),
  },
  {
    path: 'snippets/pages/errors/error-4',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/errors/errors-error-4/errors-error-4.module'
      ).then((x) => x.ErrorsError4Module),
  },
  {
    path: 'snippets/pages/errors/error-5',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/errors/errors-error-5/errors-error-5.module'
      ).then((x) => x.ErrorsError5Module),
  },
  {
    path: 'snippets/pages/errors/error-6',
    loadChildren: () =>
      import(
        './pages/self-layout-blank/snippets/pages/errors/errors-error-6/errors-error-6.module'
      ).then((x) => x.ErrorsError6Module),
  },
  {
    path: '**',
    redirectTo: '404',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThemeRoutingModule {}
