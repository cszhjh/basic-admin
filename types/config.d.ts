import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import {
  SessionTimeoutProcessingEnum,
  ContentEnum,
  ThemeEnum,
  SettingButtonPositionEnum,
  RouterTransitionEnum,
} from '@/enums/appEnum';

/**
 * 表示全局环境配置。
 */
export interface GlobEnvConfig {
  /**
   * 应用程序的标题。
   */
  VITE_GLOB_APP_TITLE: string;
  /**
   * API 的 URL。
   */
  VITE_GLOB_API_URL: string;
  /**
   * API URL 的前缀。
   */
  VITE_GLOB_API_URL_PREFIX?: string;
  /**
   * 上传文件的 URL。
   */
  VITE_GLOB_UPLOAD_URL?: string;

  /**
   * AJAX 请求的超时时间。
   */
  VITE_GLOB_TIMEOUT: number;
}

export interface MenuSetting {
  bgColor: string;
  fixed: boolean;
  collapsed: boolean;
  siderHidden: boolean;
  canDrag: boolean;
  show: boolean;
  hidden: boolean;
  split: boolean;
  menuWidth: number;
  mode: MenuModeEnum;
  type: MenuTypeEnum;
  theme: ThemeEnum;
  topMenuAlign: 'start' | 'center' | 'end';
  trigger: TriggerEnum;
  accordion: boolean;
  closeMixSidebarOnChange: boolean;
  collapsedShowTitle: boolean;
  mixSideTrigger: MixSidebarTriggerEnum;
  mixSideFixed: boolean;
}

export interface MultiTabsSetting {
  // 是否缓存标签
  cache: boolean;
  show: boolean;
  showQuick: boolean;
  // 拖拽
  canDrag: boolean;
  showRedo: boolean;
  showFold: boolean;
}

export interface HeaderSetting {
  bgColor: string;
  fixed: boolean;
  show: boolean;
  theme: ThemeEnum;
  // 网页全屏显示
  showFullScreen: boolean;
  // 是否显示锁屏
  useLockPage: boolean;
  // 全站搜索
  showSearch: boolean;
}

export interface TransitionSetting {
  // 是否开启页面切换动画
  enable: boolean;
  // 路由切换动画
  basicTransition: RouterTransitionEnum;
  // 是否开启页面切换加载
  openPageLoading: boolean;
  // 是否开启顶部进度条
  openNProgress: boolean;
}

export interface ProjectConfig {
  // 存储权限相关信息的位置
  permissionCacheType: CacheTypeEnum;
  // 是否显示配置按钮
  showSettingButton: boolean;
  // 是否显示主题切换按钮
  showDarkModeToggle: boolean;
  // 配置按钮显示位置
  settingButtonPosition: SettingButtonPositionEnum;
  // 权限模式
  permissionMode: PermissionModeEnum;
  // 会话超时处理
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum;
  // 网站灰色模式，用于可能的哀悼日期
  grayMode: boolean;
  // 是否开启色弱模式
  colorWeak: boolean;
  // 主题颜色
  themeColor: string;

  // 主界面全屏显示，仅保留tabs显示
  fullContent: boolean;
  // 内容宽度
  contentMode: ContentEnum;
  // 是否显示logo
  showLogo: boolean;
  // 是否显示全局页脚
  showFooter: boolean;
  // 菜单设置
  headerSetting: HeaderSetting;
  // 菜单设置
  menuSetting: MenuSetting;
  // 多标签页设置
  multiTabsSetting: MultiTabsSetting;
  // 动画配置
  transitionSetting: TransitionSetting;
  // 页面布局是否启用keep-alive
  openKeepAlive: boolean;
  // 锁屏时间
  lockTime: number;
  // 是否显示面包屑
  showBreadCrumb: boolean;
  // 是否显示面包屑图标
  showBreadCrumbIcon: boolean;
  // 使用错误处理插件
  useErrorHandle: boolean;
  // 是否开启返回顶部
  useOpenBackTop: boolean;
  // 切换界面时是否删除未关闭的 Modal 和 Notification
  closeMessageOnSwitch: boolean;
  // 切换界面时是否取消已发送但未响应的http请求
  removeAllHttpPending: boolean;
}

export interface GlobConfig {
  // 网站标题
  title: string;
  // 服务接口URL
  apiUrl: string;
  // 上传URL
  uploadUrl?: string;
  // 服务接口URL前缀
  urlPrefix?: string;
  // 项目缩写
  shortName: string;
  // AJAX请求超时时间
  timeout: number;
}
