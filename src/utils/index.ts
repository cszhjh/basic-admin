import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';
import { intersectionWith, isEqual, mergeWith, unionWith } from 'lodash-es';
import { isArray, isObject } from '@/utils/is';

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map(({ meta, name, path }) => ({ meta, name, path }))
      : undefined) as RouteRecordNormalized[],
  };
}

/**
 * 将对象作为参数添加到URL中
 * @param baseUrl url
 * @param obj
 * @returns {string}
 * eg:
 *  let obj = {a: '3', b: '4'}
 *  setObjToUrlParams('www.baidu.com', obj)
 *  ==>www.baidu.com?a=3&b=4
 */
export function setObjToUrlParams(baseUrl: string, obj: any): string {
  let parameters = '';
  for (const key in obj) {
    parameters += key + '=' + encodeURIComponent(obj[key]) + '&';
  }
  parameters = parameters.replace(/&$/, '');
  return /\?$/.test(baseUrl) ? baseUrl + parameters : baseUrl.replace(/\/?$/, '?') + parameters;
}

/**
 * 递归合并两个对象。
 *
 * @param source 要合并的源对象
 * @param target 目标对象，合并后结果存放于此
 * @param mergeArrays
 *        如何合并数组。默认为replace
 *        - "union": 对数组执行并集操作
 *        - "intersection": 对数组执行交集操作
 *        - "concat": 连接数组
 *        - "replace": 用目标数组替换源数组
 * @returns 合并后的对象
 */
export function deepMerge<T extends object | null | undefined, U extends object | null | undefined>(
  source: T,
  target: U,
  mergeArrays: 'union' | 'intersection' | 'concat' | 'replace' = 'replace',
): T & U {
  if (!target) {
    return source as T & U;
  }
  if (!source) {
    return target as T & U;
  }
  return mergeWith({}, source, target, (sourceValue, targetValue) => {
    if (isArray(targetValue) && isArray(sourceValue)) {
      switch (mergeArrays) {
        case 'union':
          return unionWith(sourceValue, targetValue, isEqual);
        case 'intersection':
          return intersectionWith(sourceValue, targetValue, isEqual);
        case 'concat':
          return sourceValue.concat(targetValue);
        case 'replace':
          return targetValue;
        default:
          throw new Error(`Unknown merge array strategy: ${mergeArrays as string}`);
      }
    }
    if (isObject(targetValue) && isObject(sourceValue)) {
      return deepMerge(sourceValue, targetValue, mergeArrays);
    }
    return undefined;
  });
}
