import type { AppRouteRecordRaw, Menu } from '@/router/types';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { useUserStore } from './user';
import { useAppStoreWithOut } from './app';
import { toRaw } from 'vue';
import { transformObjToRoute, flatMultiLevelRoutes } from '@/router/helper/routeHelper';
import { transformRouteToMenu } from '@/router/helper/menuHelper';
import projectSetting from '@/settings/projectSetting';
import { PermissionModeEnum } from '@/enums/appEnum';
import { asyncRoutes } from '@/router/routes';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { filter } from '@/utils/helper/treeHelper';
import { useMessage } from '@/hooks/web/useMessage';
import { PageEnum } from '@/enums/pageEnum';

interface PermissionState {
  // 路由是否动态添加
  isDynamicAddedRoute: boolean;
  // 触发菜单更新
  lastBuildMenuTime: number;
  // 前端菜单列表
  frontMenuList: Menu[];
  // 后端菜单列表
  backMenuList: Menu[];
}

export const usePermissionStore = defineStore('app-permission', () => {
  const state = ref<PermissionState>({
    isDynamicAddedRoute: false,
    lastBuildMenuTime: 0,
    frontMenuList: [],
    backMenuList: [],
  });

  /** getters start */
  const getFrontMenuList = computed(() => {
    return state.value.frontMenuList;
  });

  const getBackMenuList = computed(() => {
    return state.value.backMenuList;
  });

  const getLastBuildMenuTime = computed(() => {
    return state.value.lastBuildMenuTime;
  });

  const getIsDynamicAddedRoute = computed(() => {
    return state.value.isDynamicAddedRoute;
  });
  /** getters end */

  /** sync actions start */
  function setFrontMenuList(menuList: Menu[]) {
    state.value.frontMenuList = menuList;
  }

  function setBackMenuList(menuList: Menu[]) {
    state.value.backMenuList = menuList;
    menuList?.length > 0 && setLastBuildMenuTime();
  }

  function setLastBuildMenuTime() {
    state.value.lastBuildMenuTime = new Date().getTime();
  }

  function setDynamicAddedRoute(added: boolean) {
    state.value.isDynamicAddedRoute = added;
  }

  function resetState() {
    state.value = {
      isDynamicAddedRoute: false,
      lastBuildMenuTime: 0,
      frontMenuList: [],
      backMenuList: [],
    };
  }
  /** sync actions end */

  /** async actions start */
  // 构建路由
  async function buildRoutesAction(): Promise<AppRouteRecordRaw[]> {
    const userStore = useUserStore();
    const appStore = useAppStoreWithOut();

    let routes: AppRouteRecordRaw[] = [];
    const roleList = toRaw(userStore.getRoleList) || [];
    const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;

    // 路由过滤器 在 函数filter 作为回调传入遍历使用
    const routeFilter = (route: AppRouteRecordRaw) => {
      const { meta } = route;
      // 抽出角色
      const { roles } = meta || {};
      if (!roles) return true;
      // 用户角色是否包含当前路由的角色权限
      return roleList.some((role) => roles.includes(role));
    };

    const routeRemoveIgnoreFilter = (route: AppRouteRecordRaw) => {
      const { meta } = route;
      // ignoreRoute 为true 则路由仅用于菜单生成，不会在实际的路由表中出现
      const { ignoreRoute } = meta || {};
      // arr.filter 返回 true 表示该元素通过测试
      return !ignoreRoute;
    };

    /**
     * @description 根据设置的首页path，修正routes中的affix标记（固定首页）
     * */
    const patchHomeAffix = (routes: AppRouteRecordRaw[]) => {
      if (!routes || routes.length === 0) return;
      let homePath: string = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;

      function patcher(routes: AppRouteRecordRaw[], parentPath = '') {
        if (parentPath) parentPath = parentPath + '/';
        routes.forEach((route: AppRouteRecordRaw) => {
          const { path, children, redirect } = route;
          const currentPath = path.startsWith('/') ? path : parentPath + path;
          if (currentPath === homePath) {
            if (redirect) {
              homePath = route.redirect! as string;
            } else {
              route.meta = Object.assign({}, route.meta, { affix: true });
              throw new Error('end');
            }
          }
          children && children.length > 0 && patcher(children, currentPath);
        });
      }

      try {
        patcher(routes);
      } catch (e) {
        // 已处理完毕跳出循环
      }
      return;
    };

    switch (permissionMode) {
      // 路由映射，默认进入该case
      case PermissionModeEnum.ROUTE_MAPPING:
        // 对非一级路由进行权限过滤
        routes = filter(asyncRoutes, routeFilter);
        // 对一级路由再次根据角色权限过滤
        routes = routes.filter(routeFilter);
        // 将路由转换成菜单
        const menuList = transformRouteToMenu(routes, true);
        // 移除掉 ignoreRoute: true 的非一级路由
        routes = filter(routes, routeRemoveIgnoreFilter);
        // 移除掉 ignoreRoute: true 的一级路由；
        routes = routes.filter(routeRemoveIgnoreFilter);
        // 对菜单进行排序
        menuList.sort((a, b) => {
          return (a.meta?.orderNo || 0) - (b.meta?.orderNo || 0);
        });

        // 设置菜单列表
        setFrontMenuList(menuList);

        // 将多级路由转换为 2 级路由
        routes = flatMultiLevelRoutes(routes);
        break;

      // 后端路由
      case PermissionModeEnum.BACK:
        const { createMessage } = useMessage();

        createMessage.loading({
          content: '菜单加载中...',
          duration: 1,
        });

        // 获取登陆后的用户菜单
        let routeList = userStore.getMenuList as AppRouteRecordRaw[];

        // 动态引入组件
        routeList = transformObjToRoute(routeList);

        //  后台路由转为菜单结构
        const backMenuList = transformRouteToMenu(routeList);
        setBackMenuList(backMenuList);

        // 删除 meta.ignoreRoute 项
        routeList = filter(routeList, routeRemoveIgnoreFilter);
        routeList = routeList.filter(routeRemoveIgnoreFilter);

        // 将多级路由转换为 2 级路由
        routeList = flatMultiLevelRoutes(routeList);
        routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
        break;
    }

    routes.push(ERROR_LOG_ROUTE);
    patchHomeAffix(routes);
    return routes;
  }
  /** async actions end */

  return {
    getFrontMenuList,
    getBackMenuList,
    getLastBuildMenuTime,
    getIsDynamicAddedRoute,
    setFrontMenuList,
    setBackMenuList,
    setLastBuildMenuTime,
    setDynamicAddedRoute,
    resetState,
    buildRoutesAction,
  };
});

// 需要在设置之外使用
export function usePermissionStoreWithOut() {
  return usePermissionStore(store);
}
