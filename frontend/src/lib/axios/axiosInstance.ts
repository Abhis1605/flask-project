import axios from 'axios';
import { env } from '@/config/env';
import { attachInterceptors } from './interceptors';

export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true, // required — Flask-Login uses session cookies, not bearer tokens
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

attachInterceptors(axiosInstance);