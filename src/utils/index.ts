import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';

export function getRawRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map(({ meta, name, path }) => ({ meta, name, path }))
      : undefined) as RouteRecordNormalized[],
  };
}
