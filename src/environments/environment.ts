// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'https://testapi.techinnowiz.com/api/',
  apiImageUrl: 'https://testapi.techinnowiz.com/uploads/',
  userLocalStorage: 'user',
  userType: 'userType',
  accessTokenLocalStorage: 'accessToken',
  schoolProfileStoage: 'schoolprofile',
  addContentTypeHeader: true,
  resourceAccessLocalStorage: 'resourceAccessRaw',
  accessTokenServer: 'X-Auth-Token',
  defaultContentTypeHeader: 'application/json',
  loginPageUrl: '/login',
  registrationPageUrl: '/register',
  errorInputClass: 'has-error',
  successInputClass: 'has-success',
  actionSearchKey: 'Entity',
  resourceActions: {
    getActionName: 'Read',
    addActionName: 'Create',
    updateActionName: 'Update',
    deleteActionName: 'Delete',
  },
  rateUnits: [
    { id: 1, name: 'Hourly' },
    { id: 2, name: 'Monthly' },
    { id: 3, name: 'Annually' },
  ],
  defaultAvatarUrl: 'default_user',
  defaultDdlOptionValue: '-1',
  defaultDdlOptionText: 'Select',
  defaultStateDdlOptionText: 'Select State',
  defaultCityDdlOptionText: 'Select City',
  defaultClientDdlOptionText: 'Select Client',
  defaultRateUnitDdlOptionText: 'Select Unit',
  ng2SlimLoadingBarColor: 'red',
  ng2SlimLoadingBarHeight: '4px',
  resourceNameIdentifier: 'Entity',
  docViewerurl: 'http://docs.google.com/gview?url=',
  msOfficeDocViewerPath: 'https://view.officeapps.live.com/op/embed.aspx?src=',
  goodleDocViewerPath: (url: any) => {
    return `http://docs.google.com/gview?url=${url}&embedded=true`;
  },
};
