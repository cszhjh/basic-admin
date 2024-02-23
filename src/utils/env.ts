import type { GlobEnvConfig } from '#/config';
import pkg from '../../package.json';

/**
 * 获取通用存储前缀
 * @returns 通用存储前缀
 */
export function getCommonStoragePrefix() {
  const { VITE_GLOB_APP_TITLE } = getAppEnvConfig();
  return `${VITE_GLOB_APP_TITLE.replace(/\s/g, '_')}__${getEnv()}`.toUpperCase();
}

// 根据版本生成缓存键
export function getStorageShortName() {
  return `${getCommonStoragePrefix()}${`__${pkg.version}`}__`.toUpperCase();
}

/**
 * 获取生产模式下的变量名称
 * @param title 标题字符串
 * @returns 变量名称：'__PRODUCTION__' + (hex(title) || '__APP') + '__CONF__'
 */
const getVariableName = (title: string) => {
  function strToHex(str: string) {
    const result: string[] = [];
    for (let i = 0; i < str.length; ++i) {
      const hex = str.charCodeAt(i).toString(16);
      result.push(('000' + hex).slice(-4));
    }
    return result.join('').toUpperCase();
  }
  return `__PRODUCTION__${strToHex(title) || '__APP'}__CONF__`.toUpperCase().replace(/\s/g, '');
};

/**
 * 获取应用环境配置
 * @returns 环境配置对象
 */
export function getAppEnvConfig() {
  const ENV_NAME = getVariableName(import.meta.env.VITE_GLOB_APP_TITLE);
  const ENV = import.meta.env.DEV
    ? // 获取全局配置(打包时将独立提取配置)
      (import.meta.env as unknown as GlobEnvConfig)
    : (window[ENV_NAME] as unknown as GlobEnvConfig); // tag: 找到在哪里给window添加的属性
  return { ...ENV };
}

/**
 * @description: Development mode
 */
export const devMode = 'development';

/**
 * @description: Production mode
 */
export const prodMode = 'production';

/**
 * @description: Get environment variables
 * @returns:
 * @example:
 */
export function getEnv(): string {
  return import.meta.env.MODE;
}

/**
 * @description: Is it a development mode
 * @returns:
 * @example:
 */
export function isDevMode(): boolean {
  return import.meta.env.DEV;
}

/**
 * @description: Is it a production mode
 * @returns:
 * @example:
 */
export function isProdMode(): boolean {
  return import.meta.env.PROD;
}
