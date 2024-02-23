export interface UserInfo {
  userId: number;
  token: string;
  roleId: 1 | 2;
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
