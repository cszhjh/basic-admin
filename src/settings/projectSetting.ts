import type { ProjectConfig } from '/#/config';
import { MenuTypeEnum, MenuModeEnum, TriggerEnum, MixSidebarTriggerEnum } from '/@/enums/menuEnum';
import { CacheTypeEnum } from '/@/enums/cacheEnum';
import {
  ContentEnum,
  PermissionModeEnum,
  ThemeEnum,
  RouterTransitionEnum,
  SettingButtonPositionEnum,
  SessionTimeoutProcessingEnum,
} from '/@/enums/appEnum';
import { SIDE_BAR_BG_COLOR_LIST, HEADER_PRESET_BG_COLOR_LIST } from './designSetting';

const primaryColor = '#0960bd';

// 更改后需要清除浏览器缓存
const setting: ProjectConfig = {
  // 是否显示配置按钮
  showSettingButton: true,

  // 是否显示主题切换按钮
  showDarkModeToggle: true,

  // '设置'按钮位置
  settingButtonPosition: SettingButtonPositionEnum.AUTO,

  // 权限模式
  permissionMode: PermissionModeEnum.BACK,

  // 权限相关缓存存储在sessionStorage或localStorage中
  permissionCacheType: CacheTypeEnum.LOCAL,

  // 会话超时处理
  sessionTimeoutProcessing: SessionTimeoutProcessingEnum.ROUTE_JUMP,

  // 主题颜色
  themeColor: primaryColor,

  // 网站灰色模式，开启可能是为了哀悼日期
  grayMode: false,

  // 色弱模式
  colorWeak: false,

  // 全屏显示内容
  fullContent: false,

  // 内容模式
  contentMode: ContentEnum.FULL,

  // 是否显示logo
  showLogo: true,

  // 是否显示页脚
  showFooter: false,

  // 头部配置
  headerSetting: {
    // 头部背景颜色
    bgColor: HEADER_PRESET_BG_COLOR_LIST[0],
    // 固定在顶部
    fixed: true,
    // 控制显示
    show: true,
    // 主题
    theme: ThemeEnum.LIGHT,
    // 是否启用锁屏功能
    useLockPage: true,
    // 是否显示全屏按钮
    showFullScreen: true,
    // 是否显示菜单搜索
    showSearch: true,
  },

  // 菜单配置
  menuSetting: {
    // 侧边栏菜单背景颜色
    bgColor: SIDE_BAR_BG_COLOR_LIST[0],
    // 是否固定左侧菜单
    fixed: true,
    // 菜单折叠
    collapsed: false,
    // 响应式布局导致侧边栏隐藏时
    siderHidden: false,
    // 折叠菜单时是否显示菜单名称
    collapsedShowTitle: false,
    // 是否可拖拽
    // 仅限于左侧菜单的展开，鼠标在菜单右侧有一个拖动条
    canDrag: false,
    // 是否显示无dom
    show: true,
    // 是否显示dom
    hidden: false,
    // 菜单宽度
    menuWidth: 210,
    // 菜单模式
    mode: MenuModeEnum.INLINE,
    // 菜单类型
    type: MenuTypeEnum.SIDEBAR,
    // 菜单主题
    theme: ThemeEnum.DARK,
    // 分割菜单
    split: false,
    // 顶部菜单布局
    topMenuAlign: 'center',
    // 折叠触发位置
    trigger: TriggerEnum.HEADER,
    // 开启手风琴模式，只显示一个菜单
    accordion: true,
    // 切换页面关闭菜单
    closeMixSidebarOnChange: false,
    // 模块开启方式 ‘click’ |'hover'
    mixSideTrigger: MixSidebarTriggerEnum.CLICK,
    // 固定展开菜单
    mixSideFixed: false,
  },

  // 多标签页
  multiTabsSetting: {
    cache: false,
    // 开启
    show: true,
    // 是否可拖拽排序标签
    canDrag: true,
    // 开启快速操作
    showQuick: true,
    // 是否显示刷新按钮
    showRedo: true,
    // 是否显示折叠按钮
    showFold: true,
    // 自动折叠
    autoCollapse: false,
  },

  // 过渡设置
  transitionSetting: {
    // 是否开启页面切换动画
    // 禁用状态也会禁用页面加载
    enable: true,

    // 路由基本切换动画
    basicTransition: RouterTransitionEnum.FADE_SIDE,

    // 是否开启页面切换加载
    // 仅在 enable = true 时开启
    openPageLoading: true,

    // 是否开启顶部进度条
    openNProgress: false,
  },

  // 是否启用KeepAlive缓存
  // tag: 开发时最好关闭，否则每次都需要清除缓存
  openKeepAlive: false,

  // 自动锁屏时间，0表示不锁屏。单位分钟，默认0
  lockTime: 0,

  // 是否显示面包屑
  showBreadCrumb: true,

  // 是否显示面包屑图标
  showBreadCrumbIcon: false,

  // 使用错误处理插件
  useErrorHandle: false,

  // 是否开启返回顶部
  useOpenBackTop: true,

  // 切换界面时是否删除未关闭的 Modal 和 Notification
  closeMessageOnSwitch: true,

  // 切换界面时是否取消已发送但未响应的http请求。
  // 如果启用，可以在单独的接口中进行覆盖设置
  removeAllHttpPending: false,
};

export default setting;
