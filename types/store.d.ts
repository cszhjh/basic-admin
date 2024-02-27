export interface LockInfo {
  pwd?: string;
  isLock?: boolean;
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
  name: string;
  currencyType: string;
  isAdmin: boolean;
  time: number;
  menu: Menu[];
  channelNames: string[];
}

export interface Menu {
  menuId: number;
  name: string;
  url: string;
  grade: number;
  children?: Menu;
}

export interface LoginParams {
  username: string;
  password: string;
}

export interface TableSetting {
  size: Nullable<SizeType>;
  showIndexColumn: Recordable<Nullable<boolean>>;
  columns: Recordable<Nullable<Array<ColumnOptionsType>>>;
  showRowSelection: Recordable<Nullable<boolean>>;
}
