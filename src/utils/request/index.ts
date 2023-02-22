import {
  onResponse401,
  onResponse403,
  onResponse404,
  onResponse500,
  onResponse504
} from '@/utils/request/errorCode';
import { omitUndefinedAndNull } from '@/utils';

export interface RequestOptions {
  params?: Record<string, any>;
  data?: any;
  showLoading?: boolean;
  showErrors?: boolean;
  showStatusErrors?: boolean;
  toastOnSuccess?: string;
  toastDuration?: number;
  method?: UniNamespace.RequestOptions['method'];
  timeout?: number;
}

export interface ApiResponse<T = any> {
  // 成功标识
  succeeded: boolean;
  // 响应数据
  data?: T;
  // 自定义响应码
  code?: number;
  // 响应数据提示
  message?: string;
}

export class Api {
  private static formatUrl(url: string, params: any) {
    if (typeof params === 'object' && params !== null) {
      params = omitUndefinedAndNull(params);
      const searchParamsArray = Object.keys(params).map((item) => `${item}=${params[item]}`);
      const searchParamsString = searchParamsArray.join('&');
      url = `${url}${url.includes('?') ? '&' : '?'}${searchParamsString}`;
    }
    return url;
  }

  static async request<T = any>(url: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    const {
      params,
      data,
      method = 'GET',
      showErrors,
      showLoading,
      showStatusErrors = true,
      toastOnSuccess,
      toastDuration = 2000,
      timeout = 15000
    } = options ?? {};

    return await new Promise((resolve) => {
      if (showLoading === true) {
        uni.showLoading({ mask: false });
      }

      uni.request({
        url: this.formatUrl(url, params),
        method,
        header: {},
        data,
        timeout,
        success(result) {
          if (showLoading === true) {
            uni.hideLoading();
          }
          if (result.statusCode === 200) {
            const data = result.data as ApiResponse<T>;
            if (data.succeeded) {
              if (toastOnSuccess != null) {
                uni.showToast({
                  title: toastOnSuccess,
                  duration: toastDuration,
                  icon: 'none'
                });
              }
            } else {
              if (showErrors === true) {
                uni.showToast({
                  title: data.message,
                  duration: 3000,
                  icon: 'none'
                });
              } else {
                console.error(data);
              }
            }
            resolve(data);
          } else {
            const data: ApiResponse = {
              succeeded: false,
              code: result.statusCode
            };
            if (!showStatusErrors) {
              resolve(data);
            }
            if (result.statusCode === 401) {
              onResponse401();
              resolve(data);
            } else if (result.statusCode === 403) {
              onResponse403();
              resolve(data);
            } else if (result.statusCode === 404) {
              onResponse404();
              resolve(data);
            } else if (result.statusCode === 500) {
              onResponse500();
              resolve(data);
            } else if (result.statusCode === 504) {
              onResponse504();
              resolve(data);
            } else {
              resolve(data);
            }
          }
        },
        fail(result) {
          const data: ApiResponse = {
            succeeded: false,
            code: -1,
            message: result.errMsg
          };
          if (showLoading === true) {
            uni.hideLoading();
          }
          resolve(data);
        }
      });
    });
  }

  // GET
  static async get<T>(
    url: string,
    options?: Omit<RequestOptions, 'data'>
  ): Promise<ApiResponse<T>> {
    return await this.request(url, options);
  }

  // POST
  static async post<T>(url: string, options: RequestOptions): Promise<ApiResponse<T>> {
    return await this.request(url, {
      method: 'POST',
      ...options
    });
  }

  // PUT
  static async put<T>(url: string, options: RequestOptions): Promise<ApiResponse<T>> {
    return await this.request(url, {
      method: 'PUT',
      ...options
    });
  }

  // DELETE
  static async delete<T>(
    url: string,
    options: Omit<RequestOptions, 'data'>
  ): Promise<ApiResponse<T>> {
    return await this.request(url, {
      method: 'DELETE',
      ...options
    });
  }
}
