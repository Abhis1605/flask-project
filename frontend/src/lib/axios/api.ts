import { AxiosRequestConfig } from 'axios';
import { axiosInstance } from './axiosInstance';

export const api = {
  get: async <TResponse>(url: string, config?: AxiosRequestConfig): Promise<TResponse> => {
    const { data } = await axiosInstance.get<TResponse>(url, config);
    return data;
  },

  post: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> => {
    const { data } = await axiosInstance.post<TResponse>(url, body, config);
    return data;
  },

  put: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> => {
    const { data } = await axiosInstance.put<TResponse>(url, body, config);
    return data;
  },

  patch: async <TResponse, TBody = unknown>(
    url: string,
    body?: TBody,
    config?: AxiosRequestConfig
  ): Promise<TResponse> => {
    const { data } = await axiosInstance.patch<TResponse>(url, body, config);
    return data;
  },

  delete: async <TResponse = void>(url: string, config?: AxiosRequestConfig): Promise<TResponse> => {
    const { data } = await axiosInstance.delete<TResponse>(url, config);
    return data;
  },
};