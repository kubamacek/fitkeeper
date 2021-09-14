export const environment = {
  production: true
};

const apiversion = 'https://fitkeeper-backend.herokuapp.com/api/v1/';
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
  dailysummaries: apiversion + 'dailysummaries/'
};
