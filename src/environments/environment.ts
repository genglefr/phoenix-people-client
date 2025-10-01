// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  searchInputDelay: 600,
  searchMultiSelectDelay: 300,
  changeRadioButtonDelay: 300,
  spinnerDelay: 700,
  myDetailsBtnAllowedUrls: ['/'],
  evaLink: 'http://arhs-internaltools-ci.aris-lux.lan:9055/eva/api/redirect?redirect_url=overview/',
  comparisLink: 'http://arhs-internaltools-ci.aris-lux.lan:9017/comparis/?account=',
  plarisLink: 'http://arhs-internaltools-ci.aris-lux.lan:9033/plaris/#/tm/',
  holarisLink: 'http://arhs-internaltools-ci.aris-lux.lan:9020/holaris/#/calendar-viewer/calendar/',
  timesheetLink: 'http://arhs-internaltools-ci.aris-lux.lan:9024/timesheet/#/timesheetviewer/',
  nbElementsAutoComplete: 5,
  usourceLink: 'http://arhs-internaltools-ci.aris-lux.lan:9028/usource/#/',
  smartRecruiterLink: 'https://www.smartrecruiters.com/app/people/applications/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
