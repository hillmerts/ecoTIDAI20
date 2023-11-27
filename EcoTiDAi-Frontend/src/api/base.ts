import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { camelizeKeys } from 'humps';

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

export default fetchApi;