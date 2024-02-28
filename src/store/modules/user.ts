import type { UserInfo, LoginParams, BackMenuList } from '#/store';
import type { ErrorMessageMode } from '#/axios';
import type { RouteRecordRaw } from 'vue-router';
import { ref, computed, h } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { router } from '@/router';
import { useMessage } from '@/hooks/web/useMessage';
import { PageEnum } from '@/enums/pageEnum';
import { RoleEnum } from '@/enums/roleEnum';
import { ROLE_KEY, IS_ADMIN_KEY, TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { loginRequest } from '@/api/user';
import { usePermissionStore } from './permission';

interface UserState {
  userInfo: Nullable<UserInfo>;
  menuList?: BackMenuList;
  token?: string;
  roleId?: number;
  roles?: RoleEnum[];
  isAdmin?: boolean;
  // 登陆是否过期
  sessionTimeout?: boolean;
  // 最后获取数据的时间
  lastUpdateTime: number;
}

export const useUserStore = defineStore('app-user', () => {
  const state = ref<UserState>({
    userInfo: null,
    menuList: [],
    token: undefined,
    roleId: undefined,
    roles: [],
    isAdmin: undefined,
    sessionTimeout: false,
    lastUpdateTime: 0,
  });

  /** getters start */
  const getUserInfo = computed<UserInfo>(() => {
    return state.value.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || ({} as UserInfo);
  });
  const getMenuList = computed(() => state.value.menuList || []);
  const getToken = computed(() => state.value.token || getAuthCache<string>(TOKEN_KEY));
  const getIsAdmin = computed(() => state.value.isAdmin || getAuthCache<boolean>(IS_ADMIN_KEY));
  const getRoleId = computed(() => state.value.roleId || getAuthCache<number>(ROLE_KEY));
  const getRoleList = computed(() => state.value.roles);
  const getSessionTimeout = computed(() => state.value.sessionTimeout);
  const getLastUpdateTime = computed(() => state.value.lastUpdateTime);
  /** getters end */

  /** sync actions start */
  function setUserInfo(info: Nullable<UserInfo>) {
    state.value.userInfo = info;
    state.value.lastUpdateTime = new Date().getTime();
    setAuthCache(USER_INFO_KEY, info);
  }

  function setMenuList(menuList: BackMenuList | null) {
    state.value.menuList = menuList || [];
  }

  function setToken(token: string | undefined) {
    state.value.token = token ? token : '';
    setAuthCache(TOKEN_KEY, token);
  }

  function setRoleId(roleId: number | undefined) {
    state.value.roleId = roleId;
    setAuthCache(ROLE_KEY, roleId);
  }

  function setIsAdmin(isAdmin: boolean) {
    state.value.isAdmin = isAdmin;
    setAuthCache(IS_ADMIN_KEY, isAdmin);
  }

  function setSessionTimeout(flag: boolean) {
    state.value.sessionTimeout = flag;
  }
  /** sync actions end */

  /** async actions start */
  async function login(
    params: LoginParams & {
      goHome?: boolean;
      mode?: ErrorMessageMode;
    },
  ) {
    try {
      const { goHome = true, mode, ...loginParams } = params;
      const data = await loginRequest(loginParams, mode);
      const { token, menu, roleId, isAdmin } = data;

      setUserInfo(data);
      setMenuList(menu);
      setToken(token);
      setRoleId(roleId);
      setIsAdmin(isAdmin);

      return afterLoginAction(goHome);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async function afterLoginAction(goHome?: boolean): Promise<Nullable<UserInfo>> {
    if (!getToken.value) return null;
    const { sessionTimeout } = state.value;
    if (sessionTimeout) {
      setSessionTimeout(false);
    } else {
      const permissionStore = usePermissionStore();
      let homePath = state.value.userInfo?.homePath || '';

      // 动态路由加载（首次）
      if (!permissionStore.getIsDynamicAddedRoute) {
        const routes = await permissionStore.buildRoutesAction();
        [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw);
        });
        // 记录动态路由加载完成
        permissionStore.setDynamicAddedRoute(true);
      }

      // 设置homePath为第一个菜单的路径
      if (!homePath) {
        homePath = state.value.menuList?.[0]?.path || PageEnum.BASE_HOME;
      }

      goHome && (await router.replace(homePath));
    }
    return state.value.userInfo;
  }

  /**
   * @description: logout
   */
  async function logout(goLogin = false) {
    setUserInfo(null);
    setToken(undefined);
    setMenuList(null);
    setSessionTimeout(false);
    setIsAdmin(false);
    setRoleId(undefined);

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
  }
  /** actions end */

  /** method actions start */
  /**
   * @description: Confirm before logging out
   */
  function confirmLoginOut() {
    const { createConfirm } = useMessage();
    createConfirm({
      iconType: 'warning',
      title: () => h('span', '温馨提醒'),
      content: () => h('span', '是否确认退出系统?'),
      onOk: async () => {
        // 主动登出，不带redirect地址
        await logout(true);
      },
    });
  }

  /** method actions end */

  return {
    getUserInfo,
    getMenuList,
    getToken,
    getIsAdmin,
    getRoleId,
    getRoleList,
    getSessionTimeout,
    getLastUpdateTime,
    setToken,
    setSessionTimeout,
    login,
    logout,
    afterLoginAction,
    confirmLoginOut,
  };
});

// 需要在setup之外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
