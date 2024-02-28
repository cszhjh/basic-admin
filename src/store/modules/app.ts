import type { ProjectConfig, MenuSetting } from '#/config';
import type { BeforeMiniState, ApiAddress } from '#/store';

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';

import { ThemeEnum } from '@/enums/appEnum';
import { APP_DARK_MODE_KEY, PROJ_CFG_KEY, API_ADDRESS } from '@/enums/cacheEnum';
import { Persistent } from '@/utils/cache/persistent';
import { darkMode } from '@/settings/designSetting';
import { resetRouter } from '@/router';
import { deepMerge } from '@/utils';

interface AppState {
  darkMode?: ThemeEnum;
  // 页面加载状态
  pageLoading: boolean;
  // 项目配置
  projectConfig: ProjectConfig | null;
  // 当窗口缩小时，记住一些状态，并在窗口恢复时恢复这些状态
  beforeMiniInfo: BeforeMiniState;
}

let timeId: TimeoutHandle;
export const useAppStore = defineStore('app', () => {
  const state = ref<AppState>({
    darkMode: undefined,
    pageLoading: false,
    projectConfig: Persistent.getLocal(PROJ_CFG_KEY),
    beforeMiniInfo: {},
  });

  /** getters start */
  const getPageLoading = computed(() => state.value.pageLoading);
  const getDarkMode = computed(
    () => state.value.darkMode || localStorage.getItem(APP_DARK_MODE_KEY) || darkMode,
  );
  const getBeforeMiniInfo = computed(() => state.value.beforeMiniInfo);
  const getProjectConfig = computed(() => state.value.projectConfig || ({} as ProjectConfig));
  const getHeaderSetting = computed(() => getProjectConfig.value.headerSetting);
  const getMenuSetting = computed(() => getProjectConfig.value.menuSetting);
  const getTransitionSetting = computed(() => getProjectConfig.value.transitionSetting);
  const getMultiTabsSetting = computed(() => getProjectConfig.value.multiTabsSetting);
  const getApiAddress = computed(() => JSON.parse(localStorage.getItem(API_ADDRESS) || '{}'));
  /** getters end */

  /** sync actions start */
  function setPageLoading(loading: boolean): void {
    state.value.pageLoading = loading;
  }

  function setDarkMode(mode: ThemeEnum): void {
    state.value.darkMode = mode;
    localStorage.setItem(APP_DARK_MODE_KEY, mode);
  }

  function setBeforeMiniInfo(info: BeforeMiniState): void {
    state.value.beforeMiniInfo = info;
  }

  function setProjectConfig(config: DeepPartial<ProjectConfig>): void {
    state.value.projectConfig = deepMerge(state.value.projectConfig || {}, config) as ProjectConfig;
    Persistent.setLocal(PROJ_CFG_KEY, state.value.projectConfig);
  }

  function setMenuSetting(setting: Partial<MenuSetting>): void {
    state.value.projectConfig!.menuSetting = deepMerge(
      state.value.projectConfig!.menuSetting,
      setting,
    );
    Persistent.setLocal(PROJ_CFG_KEY, state.value.projectConfig);
  }
  /** sync actions end */

  /** async actions start */
  async function resetAllState() {
    resetRouter();
    Persistent.clearAll();
  }

  async function setPageLoadingAction(loading: boolean): Promise<void> {
    if (loading) {
      clearTimeout(timeId);
      // 防止闪烁
      timeId = setTimeout(() => {
        setPageLoading(loading);
      }, 50);
    } else {
      setPageLoading(loading);
      clearTimeout(timeId);
    }
  }
  /** async actions end */

  /** method actions start */
  function setApiAddress(config: ApiAddress): void {
    localStorage.setItem(API_ADDRESS, JSON.stringify(config));
  }
  /** method actions end */

  return {
    getPageLoading,
    getDarkMode,
    getBeforeMiniInfo,
    getProjectConfig,
    getHeaderSetting,
    getMenuSetting,
    getTransitionSetting,
    getMultiTabsSetting,
    getApiAddress,
    setPageLoading,
    setDarkMode,
    setBeforeMiniInfo,
    setProjectConfig,
    setMenuSetting,
    resetAllState,
    setPageLoadingAction,
    setApiAddress,
  };
});

// 需要在 setup 外部使用
export function useAppStoreWithOut() {
  return useAppStore(store);
}
