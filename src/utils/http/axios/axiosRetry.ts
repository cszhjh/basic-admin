import type { AxiosError, AxiosInstance } from 'axios';
/**
 *  请求重试机制
 */

export class AxiosRetry {
  /**
   * 重试
   */
  async retry(axiosInstance: AxiosInstance, error: AxiosError) {
    // @ts-ignore
    const { config } = error.response;
    const { waitTime, count } = config?.requestOptions?.retryRequest ?? {};
    config.__retryCount = config.__retryCount || 0;
    if (config.__retryCount >= count) {
      return Promise.reject(error);
    }
    config.__retryCount += 1;
    // 请求返回后 config 的 header 不正确造成重试请求失败, 删除返回 headers 采用默认 headers
    delete config.headers;
    await this.delay(waitTime);
    return await axiosInstance(config);
  }

  /**
   * 延迟
   */
  private delay(waitTime: number) {
    return new Promise((resolve) => setTimeout(resolve, waitTime));
  }
}
