import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message } from 'antd';
import { BaseResponseCode, ErrorCode } from '@/const/error';
import { history } from '@umijs/max';
import { stringify } from 'querystring';
// 与后端约定的响应数据格式
interface ResponseStructure {
  code: ErrorCode;
  data: any;
  msg?: string;
}

/**
 * @name 错误处理
 * pro 自带的错误处理， 可以在这里做自己的改动
 * @doc https://umijs.org/docs/max/request#配置
 */
export const errorConfig: RequestConfig = {
  // 错误处理： umi@3 的错误处理方案。
  errorConfig: {
    // 错误抛出
    errorThrower: (error) => {
      console.log('errorThrower', error);
      // const { success, data } = res;
      // if (!success) {
      // const error: any = new Error(errorMessage);
      // error.name = 'BizError';
      // error.info = { errorCode, errorMessage, showType, data };
      throw error; // 抛出自制的错误
      // }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      console.log('errorHandler', error, opts);
      if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        message.error('Request error, please retry.');
      }
    },
  },
  // 请求拦截器
  requestInterceptors: [
    (config: RequestOptions) => {
      const token = localStorage.getItem('token');
      const authHeader = { Authorization: `Bearer ${token}` };
      return {
        ...config,
        url: config?.url,
        headers: {
          ...config.headers,
          ...authHeader,
        },
      };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      console.log('responseInterceptors:', response);
      // 拦截响应数据，进行个性化处理
      const {
        data: { code, msg },
      } = response as unknown as ResponseStructure;
      if (code !== BaseResponseCode.SUCCESS) {
        switch (code) {
          case BaseResponseCode.UNAUTHORIZED: {
            const { search, pathname } = window.location;
            const urlParams = new URL(window.location.href).searchParams;
            /** 此方法会跳转到 redirect 参数所在的位置 */
            const redirect = urlParams.get('redirect');
            if (
              `${code}` === `${BaseResponseCode.UNAUTHORIZED}` &&
              window.location.pathname !== '/user/login' &&
              !redirect
            ) {
              void message.warning(msg);
              // 跳转到登录页
              history.replace({
                pathname: '/user/login',
                search: stringify({
                  redirect: pathname + search,
                }),
              });
            }
            break;
          }
          default: {
            if (!(response.config as any)?.skipErrorHandler) {
              void message.error(msg);
            }
            break;
          }
        }
        return response;
      }
      return response;
    },
  ],
};
