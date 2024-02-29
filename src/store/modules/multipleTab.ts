import type { RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';

import { ref, computed, toRaw, unref } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';

import { useGo, useRedo } from '@/hooks/web/usePage';
import { Persistent } from '@/utils/cache/persistent';

import { PageEnum } from '@/enums/pageEnum';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '@/router/routes/basic';
import { getRawRoute } from '@/utils';
import { MULTIPLE_TABS_KEY } from '@/enums/cacheEnum';

import projectSetting from '@/settings/projectSetting';
import { useUserStore } from '@/store/modules/user';

export interface MultipleTabState {
  cacheTabList: Set<string>;
  tabList: RouteLocationNormalized[];
  lastDragEndIndex: number;
}

function handleGotoPage(router: Router) {
  const go = useGo(router);
  go(unref(router.currentRoute).fullPath, true);
}

const getToTarget = (tabItem: RouteLocationNormalized) => {
  const { params = {}, path, query = {} } = tabItem;
  return {
    params,
    path,
    query,
  };
};

const cacheTab = projectSetting.multiTabsSetting.cache;

export const useMultipleTabStore = defineStore('app-multiple-tab', () => {
  const state = ref<MultipleTabState>({
    // 需要缓存的标签页
    cacheTabList: new Set(),
    // 多标签页列表
    tabList: cacheTab ? Persistent.getLocal(MULTIPLE_TABS_KEY) || [] : [],
    // 最后移动的标签页的索引
    lastDragEndIndex: 0,
  });

  /** getters start */
  const getTabList = computed<RouteLocationNormalized[]>(() => state.value.tabList);
  const getCacheTabList = computed(() => Array.from(state.value.cacheTabList));
  const getLastDragEndIndex = computed(() => state.value.lastDragEndIndex);
  /** getters end */

  /** mutations start */
  function setCacheTabList(list: Set<string>) {
    state.value.cacheTabList = list;
  }

  function spliceTabs(index: number, deleteCount: number, ...tabs: RouteLocationNormalized[]) {
    state.value.tabList.splice(index, deleteCount, ...tabs);
  }

  function deleteCacheTab(name: string) {
    state.value.cacheTabList.delete(name);
  }

  function clearCacheTabs() {
    state.value.cacheTabList = new Set();
  }

  function resetState() {
    state.value.tabList = [];
    clearCacheTabs();
  }

  function setLastDragEndIndex(index: number) {
    state.value.lastDragEndIndex = index;
  }
  /** mutations end */

  /** actions start */
  /**
   * @description 根据当前打开的标签页更新缓存
   */
  async function updateCacheTab() {
    const cacheMap: Set<string> = new Set();

    for (const tab of state.value.tabList) {
      const item = getRawRoute(tab);
      // 忽略这个缓存
      const needCache = !item.meta?.ignoreKeepAlive;
      if (!needCache) {
        continue;
      }
      const name = item.name as string;
      cacheMap.add(name);
    }
    setCacheTabList(cacheMap);
  }

  /**
   * @description 刷新 tabs
   * @param router
   */
  async function refreshPage(router: Router) {
    const { currentRoute } = router;
    const route = unref(currentRoute);
    const name = route.name;

    const findTab = getCacheTabList.value.find((item) => item === name);
    if (findTab) {
      deleteCacheTab(findTab);
    }
    const redo = useRedo(router);
    await redo();
  }

  async function addTab(route: RouteLocationNormalized) {
    const { path, name, fullPath, params, query, meta } = getRawRoute(route);
    // 404 与重定向页面不需要添加
    if (
      path === PageEnum.ERROR_PAGE ||
      path === PageEnum.BASE_LOGIN ||
      !name ||
      [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name].includes(name as string)
    ) {
      return;
    }

    let updateIndex = -1;
    // 已存在的页面，不重复添加标签页
    const tabHasExits = getTabList.value.some((tab, index) => {
      updateIndex = index;
      return (tab.fullPath || tab.path) === (fullPath || path);
    });

    // 如果标签页已经存在，则执行更新操作
    if (tabHasExits) {
      const curTab = toRaw(getTabList.value)[updateIndex];
      if (!curTab) {
        return;
      }
      curTab.params = params || curTab.params;
      curTab.query = query || curTab.query;
      curTab.fullPath = fullPath || curTab.fullPath;
      spliceTabs(updateIndex, 1, curTab);
    } else {
      // 获取动态路由打开数，超过 0 即代表需要控制打开数
      const dynamicLevel = meta?.dynamicLevel ?? -1;
      if (dynamicLevel > 0) {
        // 如果动态路由层级大于 0 了，那么就要限制该路由的打开数限制了
        // 首先获取到真实的路由，使用配置方式减少计算开销
        // const realName: string = path.match(/(\S*)\//)![1];
        const realPath = meta?.realPath ?? '';
        // 获取到已经打开的动态路由数, 判断是否大于某一个值
        if (
          getTabList.value.filter((e) => e.meta?.realPath ?? '' === realPath).length >= dynamicLevel
        ) {
          // 关闭第一个
          const index = getTabList.value.findIndex((item) => item.meta.realPath === realPath);
          index !== -1 && spliceTabs(index, 1);
        }
      }
      state.value.tabList.push(route);
    }
    updateCacheTab();
    cacheTab && Persistent.setLocal(MULTIPLE_TABS_KEY, getTabList.value);
  }

  async function closeTab(tab: RouteLocationNormalized, router: Router) {
    const close = (route: RouteLocationNormalized) => {
      const { fullPath, meta: { affix } = {} } = route;
      if (affix) return;
      const index = getTabList.value.findIndex((item) => item.fullPath === fullPath);
      index !== -1 && spliceTabs(index, 1);
    };

    const { currentRoute, replace } = router;

    const { path } = unref(currentRoute);
    if (path !== tab.path) {
      // Closed is not the activation tab
      close(tab);
      updateCacheTab();
      return;
    }

    // 关闭的是当前激活的标签页
    let toTarget: RouteLocationRaw = {};

    const index = getTabList.value.findIndex((item) => item.path === path);

    // 如果当前标签页是最左边的标签页
    if (index === 0) {
      // 如果只有一个标签页，则跳转到首页，否则跳转到右边的标签页
      if (getTabList.value.length === 1) {
        const userStore = useUserStore();
        toTarget = userStore.getUserInfo.homePath || PageEnum.BASE_HOME;
      } else {
        // 跳转到右边的标签页
        const page = getTabList.value[index + 1];
        toTarget = getToTarget(page);
      }
    } else {
      // 跳转到左边的标签页
      const page = getTabList.value[index - 1];
      toTarget = getToTarget(page);
    }
    close(currentRoute.value);
    await replace(toTarget);
  }

  // 根据 key 关闭tab
  async function closeTabByKey(key: string, router: Router) {
    const index = getTabList.value.findIndex((item) => (item.fullPath || item.path) === key);
    if (index !== -1) {
      await closeTab(getTabList.value[index], router);
      const { currentRoute, replace } = router;
      // 检查当前路由是否存在于tabList中
      const isActivated = getTabList.value.findIndex((item) => {
        return item.fullPath === currentRoute.value.fullPath;
      });
      // 如果当前路由不存在于TabList中，尝试切换到其它路由
      if (isActivated === -1) {
        let pageIndex: number;
        if (index > 0) {
          pageIndex = index - 1;
        } else if (index < getTabList.value.length - 1) {
          pageIndex = index + 1;
        } else {
          pageIndex = -1;
        }
        if (pageIndex >= 0) {
          const page = getTabList.value[index - 1];
          const toTarget = getToTarget(page);
          await replace(toTarget);
        }
      }
    }
  }

  async function sortTabs(oldIndex: number, newIndex: number) {
    const currentTab = getTabList.value[oldIndex];
    spliceTabs(oldIndex, 1);
    spliceTabs(newIndex, 0, currentTab);
    setLastDragEndIndex(getLastDragEndIndex.value + 1);
  }

  // 关闭左侧的标签页并跳转
  async function closeLeftTabs(route: RouteLocationNormalized, router: Router) {
    const index = getTabList.value.findIndex((item) => item.path === route.path);

    if (index > 0) {
      const leftTabs = getTabList.value.slice(0, index);
      const pathList: string[] = [];
      for (const item of leftTabs) {
        const affix = item?.meta?.affix ?? false;
        if (!affix) {
          pathList.push(item.fullPath);
        }
      }
      bulkCloseTabs(pathList);
    }
    updateCacheTab();
    handleGotoPage(router);
  }

  // 关闭右侧的标签页并跳转
  async function closeRightTabs(route: RouteLocationNormalized, router: Router) {
    const index = getTabList.value.findIndex((item) => item.fullPath === route.fullPath);

    if (index >= 0 && index < getTabList.value.length - 1) {
      const rightTabs = getTabList.value.slice(index + 1, getTabList.value.length);

      const pathList: string[] = [];
      for (const item of rightTabs) {
        const affix = item?.meta?.affix ?? false;
        if (!affix) {
          pathList.push(item.fullPath);
        }
      }
      bulkCloseTabs(pathList);
    }
    updateCacheTab();
    handleGotoPage(router);
  }

  // 关闭所有标签页并跳转
  async function closeAllTab(router: Router) {
    state.value.tabList = getTabList.value.filter((item) => item?.meta?.affix ?? false);
    clearCacheTabs();
    goToPage(router);
  }

  // 关闭其他标签
  async function closeOtherTabs(route: RouteLocationNormalized, router: Router) {
    const closePathList = getTabList.value.map((item) => item.fullPath);

    const pathList: string[] = [];

    for (const path of closePathList) {
      if (path !== route.fullPath) {
        const closeItem = getTabList.value.find((item) => item.fullPath === path);
        if (!closeItem) {
          continue;
        }
        const affix = closeItem?.meta?.affix ?? false;
        if (!affix) {
          pathList.push(closeItem.fullPath);
        }
      }
    }
    bulkCloseTabs(pathList);
    updateCacheTab();
    Persistent.setLocal(MULTIPLE_TABS_KEY, getTabList.value, true);
    handleGotoPage(router);
  }

  // 批量关闭标签页
  async function bulkCloseTabs(pathList: string[]) {
    state.value.tabList = getTabList.value.filter((item) => !pathList.includes(item.fullPath));
  }

  // 设置标签页的标题
  async function setTabTitle(title: string, route: RouteLocationNormalized) {
    const findTab = getTabList.value.find((item) => item === route);
    if (findTab) {
      findTab.meta.title = title;
      await updateCacheTab();
    }
  }

  // 替换标签页的路径
  async function updateTabPath(fullPath: string, route: RouteLocationNormalized) {
    const findTab = getTabList.value.find((item) => item === route);
    if (findTab) {
      findTab.fullPath = fullPath;
      findTab.path = fullPath;
      await updateCacheTab();
    }
  }
  /** actions end */

  /** methods start */
  function goToPage(router: Router) {
    const go = useGo(router);
    const len = getTabList.value.length;
    const { path } = unref(router.currentRoute);

    let toPath: string = PageEnum.BASE_HOME;

    if (len > 0) {
      const page = getTabList.value[len - 1];
      const p = page.fullPath || page.path;
      if (p) {
        toPath = p;
      }
    }

    // 跳转到当前页面并报告错误
    path !== toPath && go(toPath, true);
  }
  /** methods end */

  return {
    getTabList,
    getCacheTabList,
    getLastDragEndIndex,
    setCacheTabList,
    spliceTabs,
    deleteCacheTab,
    clearCacheTabs,
    resetState,
    setLastDragEndIndex,
    updateCacheTab,
    refreshPage,
    addTab,
    closeTab,
    closeTabByKey,
    sortTabs,
    closeLeftTabs,
    closeRightTabs,
    closeAllTab,
    closeOtherTabs,
    setTabTitle,
    updateTabPath,
  };
});

// Need to be used outside the setup
export function useMultipleTabWithOutStore() {
  return useMultipleTabStore(store);
}
