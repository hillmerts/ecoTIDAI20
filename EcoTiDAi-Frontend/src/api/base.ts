import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { camelizeKeys, decamelizeKeys } from 'humps';

const fetchApi: AxiosInstance = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'Authorization': '',
    }
});

// Axios middleware to convert all api responses to camelCase
fetchApi.interceptors.response.use((response: AxiosResponse) => {
    if (
      response.data &&
      response.headers['content-type'] === 'application/json'
    ) {
      response.data = camelizeKeys(response.data);
    }
  
    return response;
  });

// Axios middleware to convert all api requests to snake_case
// fetchApi.interceptors.request.use((config: InternalAxiosRequestConfig) => {
//   const newConfig = { ...config };

//   if (newConfig.headers['Content-Type'] === 'multipart/form-data')
//     return newConfig;

//   if (config.params) {
//     newConfig.params = decamelizeKeys(config.params);
//   }

//   if (config.data) {
//     newConfig.data = decamelizeKeys(config.data);
//   }

//   return newConfig;
// });

export default fetchApi;