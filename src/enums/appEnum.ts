export enum SessionTimeoutProcessingEnum {
  ROUTE_JUMP,
  PAGE_COVERAGE,
}

export enum ContentEnum {
  // auto width
  FULL = 'full',
  // fixed width
  FIXED = 'fixed',
}

export enum ThemeEnum {
  DARK = 'dark',
  LIGHT = 'light',
}

export enum RouterTransitionEnum {
  ZOOM_FADE = 'zoom-fade',
  ZOOM_OUT = 'zoom-out',
  FADE_SIDE = 'fade-slide',
  FADE = 'fade',
  FADE_BOTTOM = 'fade-bottom',
  FADE_SCALE = 'fade-scale',
}

export enum SettingButtonPositionEnum {
  AUTO = 'auto',
  HEADER = 'header',
  FIXED = 'fixed',
}

/**
 * 路由权限模式
 */
export enum PermissionModeEnum {
  // 后端路由
  BACK = 'BACK',
  // 路由映射（前端路由）
  ROUTE_MAPPING = 'ROUTE_MAPPING',
}
