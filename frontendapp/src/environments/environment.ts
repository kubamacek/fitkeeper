// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false
};

const apiversion = 'http://127.0.0.1:8000/api/v1/';
export const urls = {
  user: apiversion + 'users/',
  login: apiversion + 'api-token-auth/',
  refresh: apiversion + 'api-token-refresh/',
  about: apiversion + 'about/',
  foodbase: apiversion + 'ingredients/',
  activities: apiversion + 'activities/',
  diet: apiversion + 'meals/',
  trainings: apiversion + 'trainings/',
  settings: apiversion + 'settings/',
  dailysummaries: apiversion + 'dailysummaries/',
  bmrs: apiversion + 'bmrs/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
