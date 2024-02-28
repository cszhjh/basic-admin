import type { RouteMeta } from 'vue-router';
import { ErrorTypeEnum } from '@/enums/exceptionEnum';
import { MenuModeEnum, MenuTypeEnum } from '@/enums/menuEnum';
import type { RoleInfo } from '@/api/user/model';

export interface LockInfo {
  pwd?: string;
  isLock?: boolean;
}

export interface ApiAddress {
  key: string;
  val: string;
}

// 错误日志信息
export interface ErrorLogInfo {
  // 错误类型
  type: ErrorTypeEnum;
  // 错误文件
  file: string;
  // 错误名称
  name?: string;
  // 错误消息
  message: string;
  // 错误堆栈
  stack?: string;
  // 错误详情
  detail: string;
  // 错误URL
  url: string;
  // 错误时间
  time?: string;
}

export interface UserInfo {
  userId: number;
  token: string;
  roleId: number;
  roles?: RoleInfo[];
  name: string;
  currencyType: string;
  isAdmin: boolean;
  time: number;
  menu: BackMenuList;
  channelNames: string[];
  homePath?: string;
}

export interface RouteItem {
  path: string;
  component: any;
  meta: RouteMeta;
  name?: string;
  alias?: string | string[];
  redirect?: string;
  caseSensitive?: boolean;
  children?: RouteItem[];
}

/**
 * @description: Get menu return value
 */
export type BackMenuList = RouteItem[];

export interface LoginParams {
  username: string;
  password: string;
}

export interface BeforeMiniState {
  menuCollapsed?: boolean;
  menuSplit?: boolean;
  menuMode?: MenuModeEnum;
  menuType?: MenuTypeEnum;
}

export interface TableSetting {
  size: Nullable<SizeType>;
  showIndexColumn: Recordable<Nullable<boolean>>;
  columns: Recordable<Nullable<Array<ColumnOptionsType>>>;
  showRowSelection: Recordable<Nullable<boolean>>;
}
