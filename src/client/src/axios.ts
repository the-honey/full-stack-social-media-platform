import axios from 'axios';

export const makeRequest = axios.create({
  baseURL: process.env.BASE_API_URL,
  withCredentials: true,
});
