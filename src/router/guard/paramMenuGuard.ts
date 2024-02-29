import type { Router } from 'vue-router';
import type { Menu } from '../types';
import { configureDynamicParamsMenu } from '../helper/menuHelper';
import { PermissionModeEnum } from '@/enums/appEnum';
import { useAppStoreWithOut } from '@/store/modules/app';
import { usePermissionStoreWithOut } from '@/store/modules/permission';

export function createParamMenuGuard(router: Router) {
  const permissionStore = usePermissionStoreWithOut();
  router.beforeEach(async (to, _, next) => {
    // 过滤没有名称的路由
    if (!to.name) {
      next();
      return;
    }

    // 菜单已构建
    if (!permissionStore.getIsDynamicAddedRoute) {
      next();
      return;
    }

    let menus: Menu[] = [];
    if (isBackMode()) {
      menus = permissionStore.getBackMenuList;
    } else if (isRouteMappingMode()) {
      menus = permissionStore.getFrontMenuList;
    }
    menus.forEach((item) => configureDynamicParamsMenu(item, to.params));

    next();
  });
}

const getPermissionMode = () => {
  const appStore = useAppStoreWithOut();
  return appStore.getProjectConfig.permissionMode;
};

const isBackMode = () => {
  return getPermissionMode() === PermissionModeEnum.BACK;
};

const isRouteMappingMode = () => {
  return getPermissionMode() === PermissionModeEnum.ROUTE_MAPPING;
};
