import type { UserInfo,LoginParams } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { ROLE_KEY, IS_ADMIN_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { loginRequest } from '@/api/user'
import {usePermissionStore} from './permission';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleId?: number;
  isAdmin?: boolean;
  // 登陆是否过期
  sessionTimeout?: boolean;
  // 最后获取数据的时间
  lastUpdateTime: number;
}

export const useUserStore = defineStore('app-user', () => {
  const state = ref<UserState>({
    userInfo: null,
    token: undefined,
    roleId: undefined,
    isAdmin: undefined,
    sessionTimeout: false,
    lastUpdateTime: 0,
  });

  /** getters start */
  const getUserInfo = computed(() => {
    return state.value.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
  });

  const getToken = computed(() => {
    return state.value.token || getAuthCache<string>(TOKEN_KEY);
  });

  const getIsAdmin = computed(() => {
    return state.value.isAdmin || getAuthCache<boolean>(IS_ADMIN_KEY);
  });

  const getRoleId = computed(() => {
    return state.value.roleId || getAuthCache<number>(ROLE_KEY);
  });
  /** getters end */

  /** sync actions start */
  function setUserInfo(info: Nullable<UserInfo>) {
    state.value.userInfo = info;
    setAuthCache(USER_INFO_KEY, info);
  }

  function setToken(token: string | undefined) {
    state.value.token = token ? token : '';
    setAuthCache(TOKEN_KEY, token);
  }

  function setRoleId(roleId: number) {
    state.value.roleId = roleId;
    setAuthCache(ROLE_KEY, roleId);
  }

  function setIsAdmin(isAdmin: boolean) {
    state.value.isAdmin = isAdmin;
    setAuthCache(IS_ADMIN_KEY, isAdmin);
  }

  function setSessionTimeout(flag: boolean) {
    state.value.sessionTimeout = flag;
  };
  /** sync actions end */

  /** async actions start */
  async function login(params: LoginParams & {
    goHome?: boolean;
    mode?: ErrorMessageMode
  }) {
    try {
      const { goHome = true, mode, ...loginParams } = params;
      const data = await loginRequest(loginParams, mode);
      const { token } = data;

      setUserInfo(data);
      setToken(token);
      return afterLoginAction(goHome);
    } catch (error) {
      return Promise.reject(error);
    }
  }

   async function afterLoginAction(goHome?: boolean): Promise<Nullable<UserInfo>> {
    if (!getToken.value) return null;
      // get user info
      // const userInfo = await this.getUserInfoAction();

      const { sessionTimeout } = state.value;
      if (sessionTimeout) {
        setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }

        goHome && (await router.replace(userInfo?.homePath || PageEnum.BASE_HOME));
      }
      return userInfo;
  };

      /**
     * @description: logout
     */
    async function logout(goLogin = false) {
      if (this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.setUserInfo(null);
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },
  /** actions end */

  return {
    getUserInfo,
    getToken,
    getIsAdmin,
    getRoleId,
    setToken,
    setSessionTimeout,
    login,
    logout
  };
});

// 需要在setup之外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
