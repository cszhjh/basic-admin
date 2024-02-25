/**
 * @description: 菜单类型
 */
export enum MenuTypeEnum {
  // 左侧菜单
  SIDEBAR = 'sidebar',

  MIX_SIDEBAR = 'mix-sidebar',
  // 混合菜单
  MIX = 'mix',
  // 顶部菜单
  TOP_MENU = 'top-menu',
}

// 菜单折叠按钮位置
export enum TriggerEnum {
  // 不显示
  NONE = 'NONE',
  // 菜单底部
  FOOTER = 'FOOTER',
  // 头部
  HEADER = 'HEADER',
}

export type Mode = 'vertical' | 'vertical-right' | 'horizontal' | 'inline';

// 菜单模式
export enum MenuModeEnum {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  VERTICAL_RIGHT = 'vertical-right',
  INLINE = 'inline',
}

// 菜单分割类型
export enum MenuSplitTyeEnum {
  NONE,
  TOP,
  LEFT,
}

// 顶部菜单布局
export enum TopMenuAlignEnum {
  CENTER = 'center',
  START = 'start',
  END = 'end',
}

// 混合菜单触发方式
export enum MixSidebarTriggerEnum {
  HOVER = 'hover',
  CLICK = 'click',
}
