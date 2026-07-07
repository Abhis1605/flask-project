import axios from 'axios';
import { env } from '@/config/env';
import { attachInterceptors } from './interceptors';

export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  withCredentials: true, // required — sends the httpOnly refresh_token cookie on /auth/refresh and /auth/logout
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

attachInterceptors(axiosInstance);