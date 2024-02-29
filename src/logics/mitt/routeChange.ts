/**
 * 用于监控路由变化以改变菜单和选项卡的状态。无需监控路由，因为路由状态的变化受页面渲染时间的影响，这会很慢。
 */

import type { RouteLocationNormalized } from 'vue-router';
import { mitt } from '@/utils/mitt';
import { getRawRoute } from '@/utils';

const key = Symbol();

const emitter = mitt<{
  [key]: RouteLocationNormalized;
}>();

let lastChangeTab: RouteLocationNormalized;

export function setRouteChange(lastChangeRoute: RouteLocationNormalized) {
  const r = getRawRoute(lastChangeRoute);
  emitter.emit(key, r);
  lastChangeTab = r;
}

export function listenerRouteChange(
  callback: (route: RouteLocationNormalized) => void,
  immediate = true,
) {
  emitter.on(key, callback);
  immediate && lastChangeTab && callback(lastChangeTab);
}

export function removeTabChangeListener() {
  emitter.all.clear();
}
