import { RoleInfo } from '@/api/user/model';

export {};

declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, unknown> {
    orderNo?: number;
    // 标题
    title: string;
    // 动态路由层级
    dynamicLevel?: number;
    // 动态路由真实路径（用于性能）
    realPath?: string;
    // 是否忽略权限
    ignoreAuth?: boolean;
    // 角色信息
    roles?: RoleInfo[];
    // 是否忽略缓存
    ignoreKeepAlive?: boolean;
    // 是否固定在标签页上
    affix?: boolean;
    // 标签页图标
    icon?: string;
    // 标签页图片
    img?: string;
    // 当前页面过渡动画名称
    transitionName?: string;
    // 路由是否动态添加
    hideBreadcrumb?: boolean;
    // 隐藏子菜单
    hideChildrenInMenu?: boolean;
    // 携带参数
    carryParam?: boolean;
    // 用于标记单级菜单的内部使用
    single?: boolean;
    // 当前激活的菜单
    currentActiveMenu?: string;
    // 不在标签页中显示
    hideTab?: boolean;
    // 不在菜单中显示
    hideMenu?: boolean;
    isLink?: boolean;
    // 仅用于菜单构建
    ignoreRoute?: boolean;
    // 隐藏子菜单的路径
    hidePathForChildren?: boolean;
  }
}
