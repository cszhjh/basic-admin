import { defHttp } from '@/utils/http/axios';
import type { LoginParams, UserInfo } from '#/store';
import type { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/login',
}

export function loginRequest(data: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<UserInfo>({ url: Api.Login, data }, { errorMessageMode: mode });
}
