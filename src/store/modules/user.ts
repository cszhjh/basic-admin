import type { UserInfo } from '#/store';
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

interface UserState {
  userInfo: Nullable<UserInfo>;
  token?: string;
  roleId?: number;
  isAdmin?: boolean;
}

export const useUserStore = defineStore('app-user', () => {
  const state = ref<UserState>({ userInfo: null });

  const getUserInfo = computed(() => {
    return state.value.userInfo || getAuthCache<UserInfo>(USER_INFO_KEY) || {};
  });

  return {
    getUserInfo,
  };
});

// 需要在setup之外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}
