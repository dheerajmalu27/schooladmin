// menu-config.ts
export const MENU_CONFIG = {
  admin: [
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: 'flaticon-line-graph',
      path: 'dashboard',
      loadChildren: './pages/default/components/dashboard/dashboard.module',
      module: 'DashboardModule',
    },
    {
      label: 'Admission',
      icon: 'fa fa-user-plus',
      subItems: [
        {
          label: 'Admission List',
          link: '/admission',
          icon: 'fa fa-user-plus',
          path: 'admission',
          loadChildren:
            './pages/default/components/admission/admission.module#AdmissionModule',
          module: 'AdmissionModule',
        },
        {
          label: 'Division Allocation',
          link: '/division-allocation',
          icon: 'fa fa-user-plus',
          path: 'division-allocation',
          loadChildren:
            './pages/default/components/division-allocation/division-allocation.module#DivisionAllocationModule',
          module: 'DivisionAllocationModule',
        },
      ],
    },
    {
      label: 'Teachers',
      icon: 'flaticon-users',
      subItems: [
        {
          label: 'Teacher List',
          link: '/teacher',
          icon: 'flaticon-users',
          path: 'teacher',
          loadChildren: './pages/default/components/teacher/teacher.module',
          module: 'TeacherModule',
        },
        {
          path: 'teacher-leave',
          loadChildren:
            './pages/default/components/teacher-leave/teacher-leave.module',
          module: 'TeacherLeaveModule',
        },
        // You can add more sub-items here if needed
      ],
    },
    {
      label: 'Student',
      icon: 'flaticon-user',
      subItems: [
        {
          label: 'Student List',
          link: '/student',
          icon: 'flaticon-user',
          path: 'student',
          loadChildren: './pages/default/components/student/student.module',
          module: 'StudentModule',
        },
        {
          label: 'Absent Student List',
          link: '/absent-student',
          icon: 'flaticon-user',
          path: 'absent-student',
          loadChildren:
            './pages/default/components/absent-student/absent-student.module',
          module: 'AbsentStudentModule',
        },
        {
          label: 'Today Absent Student',
          link: '/today-absent-student',
          icon: 'flaticon-user',
          path: 'today-absent-student',
          loadChildren:
            './pages/default/components/today-absent-student/today-absent-student.module',
          module: 'TodayAbsentStudentModule',
        },
      ],
    },
    {
      label: 'Attendance',
      icon: 'flaticon-list-1',
      subItems: [
        {
          label: 'Attendance List',
          link: '/attendance',
          icon: 'flaticon-list-1',
          path: 'attendance',
          loadChildren:
            './pages/default/components/attendance/attendance.module',
          module: 'AttendanceModule',
        },
        {
          label: 'Pending Attendance List',
          link: '/pending-attendance-record',
          icon: 'flaticon-list-1',
          path: 'pending-attendance-record',
          loadChildren:
            './pages/default/components/pending-attendance-record/pending-attendance-record.module',
          module: 'PendingAttendanceRecordModule',
        },
      ],
    },
    {
      label: 'Test Marks',
      icon: 'fa fa-edit',
      subItems: [
        {
          label: 'Test Marks',
          link: '/test-marks',
          icon: 'fa fa-edit',
          path: 'test-marks',
          loadChildren:
            './pages/default/components/test-marks/test-marks.module',
          module: 'TestMarksModule',
        },
        {
          label: 'Pending Test Marks',
          link: '/pending-marks-test',
          icon: 'fa fa-edit',
          path: 'pending-marks-test',
          loadChildren:
            './pages/default/components/pending-marks-test/pending-marks-test.module',
          module: 'PendingMarksTestModule',
        },
      ],
    },
    {
      label: 'Time Table',
      link: '/timetable',
      icon: 'flaticon-calendar-2',
      path: 'timetable',
      loadChildren: './pages/default/components/timetable/timetable.module',
      module: 'TimeTableModule',
    },
    {
      label: 'Home Work',
      link: '/homework',
      icon: 'fa fa-tasks',
      path: 'homework',
      loadChildren:
        './pages/default/components/homework/homework.module#HomeworkModule',
      module: 'HomeworkModule',
    },
    {
      label: 'Library',
      icon: 'fa fa-book',
      subItems: [
        {
          label: 'Book Allocation',
          link: '/books-allocation',
          path: 'books-allocation',
          loadChildren:
            './pages/default/components/books-allocation/books-allocation.module#BooksAllocationModule',
          module: 'BooksAllocationModule',
        },
        {
          label: 'Books List',
          link: '/library-books',
          path: 'library-books',
          loadChildren:
            './pages/default/components/books/books.module#BooksModule',
          module: 'BooksModule',
        },
      ],
    },
    {
      label: 'Other Doc',
      icon: 'flaticon-interface-6',
      subItems: [
        {
          label: 'ID cards',
          link: '/attendance-report',
        },
        {
          label: 'Living certificate',
          link: '/leaving-certificate',
        },
        {
          label: 'School Documents',
          link: '/school-docs',
          path: 'school-docs',
          loadChildren:
            './pages/default/components/school-docs/school-docs.module#SchoolDocsModule',
          module: 'SchoolDocsModule',
        },
      ],
    },
    {
      label: 'Report',
      icon: 'flaticon-diagram',
      subItems: [
        {
          label: 'Attendance Report',
          link: '/attendance-report',
          path: 'attendance-report',
          loadChildren:
            './pages/default/components/attendance-report/attendance-report.module#AttendanceReportModule',
          module: 'AttendanceReportModule',
        },
        {
          label: 'Class Sheet',
          link: '/student-class-list-report',
          path: 'student-class-list-report',
          loadChildren:
            './pages/default/components/student-class-list-report/student-class-list-report.module#StudentClassListReportModule',
          module: 'StudentClassListReportModule',
        },
        {
          label: 'Test Result',
          link: '/test-result-report',
          path: 'test-result-report',
          loadChildren:
            './pages/default/components/test-result-report/test-result-report.module#testResultReportModule',
          module: 'testResultReportModule',
        },
        {
          label: 'Final Result',
          link: '/final-result-report',
          path: 'final-result-report',
          loadChildren:
            './pages/default/components/final-result-report/final-result-report.module#finalResultReportModule',
          module: 'finalResultReportModule',
        },
      ],
    },
    {
      label: 'Setting',
      icon: 'flaticon-settings',
      subItems: [
        {
          label: 'Fees Structure',
          link: '/fees-structure',
          path: 'fees-structure',
          loadChildren:
            './pages/default/components/fees-structure/fees-structure.module#FeesStructureModule',
          module: 'FeesStructureModule',
        },
        {
          label: 'Division List',
          link: '/division',
          path: 'division',
          loadChildren:
            './pages/default/components/division/division.module#DivisionModule',
          module: 'DivisionModule',
        },
        {
          label: 'Subject List',
          link: '/subject',
          path: 'subject',
          loadChildren:
            './pages/default/components/subject/subject.module#SubjectModule',
          module: 'SubjectModule',
        },
        {
          label: 'Test List',
          link: '/test',
          path: 'test',
          loadChildren:
            './pages/default/components/test/test.module#TestModule',
          module: 'TestModule',
        },
        {
          label: 'Class list',
          link: '/class',
          path: 'class',
          loadChildren:
            './pages/default/components/class-subject-test/class-subject-test.module#ClassSubjectTestModule',
          module: 'ClassSubjectTestModule',
        },
        {
          label: 'Class Teacher',
          link: '/class-teacher',
          path: 'class-teacher',
          loadChildren:
            './pages/default/components/class-teacher/class-teacher.module#ClassTeacherModule',
          module: 'ClassTeacherModule',
        },
        {
          label: 'Teacher Subject',
          link: '/teacher-subject',
          path: 'teacher-subject',
          loadChildren:
            './pages/default/components/teacher-subject/teacher-subject.module#TeacherSubjectModule',
          module: 'TeacherSubjectModule',
        },
        {
          label: 'Holidays List',
          link: '/holidays',
          path: 'holidays',
          loadChildren:
            './pages/default/components/holidays/holidays.module#HolidaysModule',
          module: 'HolidaysModule',
        },
      ],
    },
    {
      path: 'student/profile/:id',
      loadChildren:
        './pages/default/components/student-profile/student-profile.module',
      module: 'StudentProfileModule',
    },
    {
      path: 'bus-track',
      loadChildren:
        './pages/default/components/bus-track/bus-track.module#BusTrackModule',
      module: 'BusTrackModule',
    },
    {
      path: 'school-setting',
      loadChildren:
        './pages/default/components/school-setting/school-setting.module#SchoolSettingModule',
      module: 'SchoolSettingModule',
    },
    {
      path: 'index',
      loadChildren: './pages/default/index/index.module#IndexModule',
      module: 'IndexModule',
    },
    {
      path: 'components/icons/flaticon',
      loadChildren:
        './pages/default/components/icons/icons-flaticon/icons-flaticon.module#IconsFlaticonModule',
      module: 'IconsFlaticonModule',
    },
    {
      path: 'components/icons/fontawesome',
      loadChildren:
        './pages/default/components/icons/icons-fontawesome/icons-fontawesome.module#IconsFontawesomeModule',
      module: 'IconsFontawesomeModule',
    },
    {
      path: 'components/icons/lineawesome',
      loadChildren:
        './pages/default/components/icons/icons-lineawesome/icons-lineawesome.module#IconsLineawesomeModule',
      module: 'IconsLineawesomeModule',
    },
    {
      path: 'components/icons/socicons',
      loadChildren:
        './pages/default/components/icons/icons-socicons/icons-socicons.module#IconsSociconsModule',
      module: 'IconsSociconsModule',
    },
    {
      path: 'components/portlets/base',
      loadChildren:
        './pages/default/components/portlets/portlets-base/portlets-base.module#PortletsBaseModule',
      module: 'PortletsBaseModule',
    },
    {
      path: 'components/portlets/advanced',
      loadChildren:
        './pages/default/components/portlets/portlets-advanced/portlets-advanced.module#PortletsAdvancedModule',
      module: 'PortletsAdvancedModule',
    },
    {
      path: 'components/portlets/creative',
      loadChildren:
        './pages/default/components/portlets/portlets-creative/portlets-creative.module#PortletsCreativeModule',
      module: 'PortletsCreativeModule',
    },
    {
      path: 'components/portlets/tabbed',
      loadChildren:
        './pages/default/components/portlets/portlets-tabbed/portlets-tabbed.module#PortletsTabbedModule',
      module: 'PortletsTabbedModule',
    },
    {
      path: 'components/portlets/draggable',
      loadChildren:
        './pages/default/components/portlets/portlets-draggable/portlets-draggable.module#PortletsDraggableModule',
      module: 'PortletsDraggableModule',
    },
    {
      path: 'components/portlets/tools',
      loadChildren:
        './pages/default/components/portlets/portlets-tools/portlets-tools.module#PortletsToolsModule',
      module: 'PortletsToolsModule',
    },
    {
      path: 'components/widgets/general',
      loadChildren:
        './pages/default/components/widgets/widgets-general/widgets-general.module#WidgetsGeneralModule',
      module: 'WidgetsGeneralModule',
    },
    {
      path: 'components/widgets/chart',
      loadChildren:
        './pages/default/components/widgets/widgets-chart/widgets-chart.module#WidgetsChartModule',
      module: 'WidgetsChartModule',
    },
    {
      path: 'components/charts/amcharts/charts',
      loadChildren:
        './pages/default/components/charts/amcharts/amcharts-charts/amcharts-charts.module#AmchartsChartsModule',
      module: 'AmchartsChartsModule',
    },
    {
      path: 'components/charts/amcharts/stock-charts',
      loadChildren:
        './pages/default/components/charts/amcharts/amcharts-stock-charts/amcharts-stock-charts.module#AmchartsStockChartsModule',
      module: 'AmchartsStockChartsModule',
    },
    {
      path: 'components/charts/amcharts/maps',
      loadChildren:
        './pages/default/components/charts/amcharts/amcharts-maps/amcharts-maps.module#AmchartsMapsModule',
      module: 'AmchartsMapsModule',
    },
    {
      path: 'components/maps/google-maps',
      loadChildren:
        './pages/default/components/maps/maps-google-maps/maps-google-maps.module#MapsGoogleMapsModule',
      module: 'MapsGoogleMapsModule',
    },
    {
      path: 'components/maps/jqvmap',
      loadChildren:
        './pages/default/components/maps/maps-jqvmap/maps-jqvmap.module#MapsJqvmapModule',
      module: 'MapsJqvmapModule',
    },
    {
      path: 'components/utils/idle-timer',
      loadChildren:
        './pages/default/components/utils/utils-idle-timer/utils-idle-timer.module#UtilsIdleTimerModule',
      module: 'UtilsIdleTimerModule',
    },
    {
      path: 'components/utils/session-timeout',
      loadChildren:
        './pages/default/components/utils/utils-session-timeout/utils-session-timeout.module#UtilsSessionTimeoutModule',
      module: 'UtilsSessionTimeoutModule',
    },
    {
      path: 'header/actions',
      loadChildren:
        './pages/default/header/header-actions/header-actions.module#HeaderActionsModule',
      module: 'HeaderActionsModule',
    },
    {
      path: 'header/profile',
      loadChildren:
        './pages/default/header/header-profile/header-profile.module#HeaderProfileModule',
      module: 'HeaderProfileModule',
    },
    {
      path: '404',
      loadChildren:
        './pages/default/not-found/not-found/not-found.module#NotFoundModule',
      module: 'NotFoundModule',
    },
    // Other admin menu items
  ],
  teacher: [
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: 'flaticon-line-graph',
      path: 'dashboard',
      loadChildren: './pages/default/components/dashboard/dashboard.module',
      module: 'DashboardModule',
    },
    {
      label: 'Student',
      icon: 'flaticon-user',
      subItems: [
        {
          label: 'Student List',
          link: '/student',
          icon: 'flaticon-user',
          path: 'student',
          loadChildren: './pages/default/components/student/student.module',
          module: 'StudentModule',
        },
        {
          label: 'Today Absent Student',
          link: '/today-absent-student',
          icon: 'flaticon-user',
          path: 'today-absent-student',
          loadChildren:
            './pages/default/components/today-absent-student/today-absent-student.module',
          module: 'TodayAbsentStudentModule',
        },
      ],
    },
    {
      label: 'Test Marks',
      icon: 'fa fa-edit',
      subItems: [
        {
          label: 'Test Marks',
          link: '/test-marks',
          icon: 'fa fa-edit',
          path: 'test-marks',
          loadChildren:
            './pages/default/components/test-marks/test-marks.module',
          module: 'TestMarksModule',
        },
        {
          label: 'Pending Test Marks',
          link: '/pending-marks-test',
          icon: 'fa fa-edit',
          path: 'pending-marks-test',
          loadChildren:
            './pages/default/components/pending-marks-test/pending-marks-test.module',
          module: 'PendingMarksTestModule',
        },
      ],
    },
    {
      label: 'Time Table',
      link: '/timetable',
      icon: 'flaticon-calendar-2',
      path: 'timetable',
      loadChildren: './pages/default/components/timetable/timetable.module',
      module: 'TimeTableModule',
    },
    {
      label: 'Home Work',
      link: '/homework',
      icon: 'fa fa-tasks',
      path: 'homework',
      loadChildren:
        './pages/default/components/homework/homework.module#HomeworkModule',
      module: 'HomeworkModule',
    },
    {
      label: 'Report',
      icon: 'flaticon-diagram',
      subItems: [
        {
          label: 'Attendance Report',
          link: '/attendance-report',
          path: 'attendance-report',
          loadChildren:
            './pages/default/components/attendance-report/attendance-report.module#AttendanceReportModule',
          module: 'AttendanceReportModule',
        },
        {
          label: 'Class Sheet',
          link: '/student-class-list-report',
          path: 'student-class-list-report',
          loadChildren:
            './pages/default/components/student-class-list-report/student-class-list-report.module#StudentClassListReportModule',
          module: 'StudentClassListReportModule',
        },
        {
          label: 'Test Result',
          link: '/test-result-report',
          path: 'test-result-report',
          loadChildren:
            './pages/default/components/test-result-report/test-result-report.module#testResultReportModule',
          module: 'testResultReportModule',
        },
        {
          label: 'Final Result',
          link: '/final-result-report',
          path: 'final-result-report',
          loadChildren:
            './pages/default/components/final-result-report/final-result-report.module#finalResultReportModule',
          module: 'finalResultReportModule',
        },
      ],
    },

    // Other teacher menu items
  ],
  classteacher: [
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: 'flaticon-line-graph',
      path: 'dashboard',
      loadChildren: './pages/default/components/dashboard/dashboard.module',
      module: 'DashboardModule',
    },
    {
      label: 'Student',
      icon: 'flaticon-user',
      subItems: [
        {
          label: 'Student List',
          link: '/student',
          icon: 'flaticon-user',
          path: 'student',
          loadChildren: './pages/default/components/student/student.module',
          module: 'StudentModule',
        },
        {
          label: 'Today Absent Student',
          link: '/today-absent-student',
          icon: 'flaticon-user',
          path: 'today-absent-student',
          loadChildren:
            './pages/default/components/today-absent-student/today-absent-student.module',
          module: 'TodayAbsentStudentModule',
        },
      ],
    },
    {
      label: 'Attendance',
      icon: 'flaticon-list-1',
      subItems: [
        {
          label: 'Attendance List',
          link: '/attendance',
          icon: 'flaticon-list-1',
          path: 'attendance',
          loadChildren:
            './pages/default/components/attendance/attendance.module',
          module: 'AttendanceModule',
        },
        {
          label: 'Pending Attendance List',
          link: '/pending-attendance-record',
          icon: 'flaticon-list-1',
          path: 'pending-attendance-record',
          loadChildren:
            './pages/default/components/pending-attendance-record/pending-attendance-record.module',
          module: 'PendingAttendanceRecordModule',
        },
      ],
    },
    {
      label: 'Test Marks',
      icon: 'fa fa-edit',
      subItems: [
        {
          label: 'Test Marks',
          link: '/test-marks',
          icon: 'fa fa-edit',
          path: 'test-marks',
          loadChildren:
            './pages/default/components/test-marks/test-marks.module',
          module: 'TestMarksModule',
        },
        {
          label: 'Pending Test Marks',
          link: '/pending-marks-test',
          icon: 'fa fa-edit',
          path: 'pending-marks-test',
          loadChildren:
            './pages/default/components/pending-marks-test/pending-marks-test.module',
          module: 'PendingMarksTestModule',
        },
      ],
    },
    {
      label: 'Time Table',
      link: '/timetable',
      icon: 'flaticon-calendar-2',
      path: 'timetable',
      loadChildren: './pages/default/components/timetable/timetable.module',
      module: 'TimeTableModule',
    },
    {
      label: 'Home Work',
      link: '/homework',
      icon: 'fa fa-tasks',
      path: 'homework',
      loadChildren:
        './pages/default/components/homework/homework.module#HomeworkModule',
      module: 'HomeworkModule',
    },

    {
      label: 'Report',
      icon: 'flaticon-diagram',
      subItems: [
        {
          label: 'Attendance Report',
          link: '/attendance-report',
          path: 'attendance-report',
          loadChildren:
            './pages/default/components/attendance-report/attendance-report.module#AttendanceReportModule',
          module: 'AttendanceReportModule',
        },
        {
          label: 'Class Sheet',
          link: '/student-class-list-report',
          path: 'student-class-list-report',
          loadChildren:
            './pages/default/components/student-class-list-report/student-class-list-report.module#StudentClassListReportModule',
          module: 'StudentClassListReportModule',
        },
        {
          label: 'Test Result',
          link: '/test-result-report',
          path: 'test-result-report',
          loadChildren:
            './pages/default/components/test-result-report/test-result-report.module#testResultReportModule',
          module: 'testResultReportModule',
        },
        {
          label: 'Final Result',
          link: '/final-result-report',
          path: 'final-result-report',
          loadChildren:
            './pages/default/components/final-result-report/final-result-report.module#finalResultReportModule',
          module: 'finalResultReportModule',
        },
      ],
    },
    // Other teacher menu items
  ],
  librarian: [
    {
      label: 'Dashboard',
      link: '/dashboard',
      icon: 'flaticon-line-graph',
      path: 'dashboard',
      loadChildren: './pages/default/components/dashboard/dashboard.module',
      module: 'DashboardModule',
    },
    {
      label: 'Library',
      icon: 'fa fa-book',
      subItems: [
        {
          label: 'Book Allocation',
          link: '/books-allocation',
          path: 'books-allocation',
          loadChildren:
            './pages/default/components/books-allocation/books-allocation.module#BooksAllocationModule',
          module: 'BooksAllocationModule',
        },
        {
          label: 'Books List',
          link: '/library-books',
          path: 'library-books',
          loadChildren:
            './pages/default/components/books/books.module#BooksModule',
          module: 'BooksModule',
        },
      ],
    },
    // Other teacher menu items
  ],

  // Define menu items for other roles as needed
};
