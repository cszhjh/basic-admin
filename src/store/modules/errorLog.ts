import type { ErrorLogInfo } from '#/store';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { formatToDateTime } from '@/utils/dateUtil';
import projectSetting from '@/settings/projectSetting';
import { ErrorTypeEnum } from '@/enums/exceptionEnum';

export interface ErrorLogState {
  errorLogInfoList: Nullable<ErrorLogInfo[]>;
  errorLogListCount: number;
}

export const useErrorLogStore = defineStore('app-error-log', () => {
  const state = ref<ErrorLogState>({
    errorLogInfoList: null,
    errorLogListCount: 0,
  });

  /** getters start */
  const getErrorLogInfoList = computed(() => {
    return state.value.errorLogInfoList || [];
  });

  const getErrorLogListCount = computed(() => {
    return state.value.errorLogListCount;
  });

  /** actions start */
  function addErrorLogInfo(info: ErrorLogInfo) {
    const item = {
      ...info,
      time: formatToDateTime(new Date()),
    };
    state.value.errorLogInfoList = [item, ...(state.value.errorLogInfoList || [])];
    state.value.errorLogListCount += 1;
  }

  function setErrorLogListCount(count: number): void {
    state.value.errorLogListCount = count;
  }

  /**
   * Triggered after ajax request error
   * @param error
   * @returns
   */
  function addAjaxErrorInfo(error) {
    const { useErrorHandle } = projectSetting;
    if (!useErrorHandle) {
      return;
    }
    const errInfo: Partial<ErrorLogInfo> = {
      message: error.message,
      type: ErrorTypeEnum.AJAX,
    };
    if (error.response) {
      const {
        config: { url = '', data: params = '', method = 'get', headers = {} } = {},
        response: { data, status, statusText },
      } = error;
      errInfo.url = url;
      errInfo.name = 'Ajax Error!';
      errInfo.file = '-';
      errInfo.stack = '-';
      errInfo.detail = JSON.stringify({ data, status, statusText, params, method, headers });
    }
    addErrorLogInfo(errInfo as ErrorLogInfo);
  }
  /** actions end */

  return {
    state,
    getErrorLogInfoList,
    getErrorLogListCount,
    addErrorLogInfo,
    setErrorLogListCount,
    addAjaxErrorInfo,
  };
});

// Need to be used outside the setup
export function useErrorLogStoreWithOut() {
  return useErrorLogStore(store);
}
