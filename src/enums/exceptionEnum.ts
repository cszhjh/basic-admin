/**
 * @description: 异常相关的枚举
 */
export enum ExceptionEnum {
  // 页面无访问权限
  PAGE_NOT_ACCESS = 403,

  // 页面未找到
  PAGE_NOT_FOUND = 404,

  // 错误
  ERROR = 500,

  // 网络错误
  NET_WORK_ERROR = 10000,

  // 页面无数据。实际上，这不是一个异常页面
  PAGE_NOT_DATA = 10100,
}

export enum ErrorTypeEnum {
  VUE = 'vue',
  SCRIPT = 'script',
  RESOURCE = 'resource',
  AJAX = 'ajax',
  PROMISE = 'promise',
}
