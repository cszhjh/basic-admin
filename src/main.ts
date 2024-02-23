import 'normalize.css';
import 'ant-design-vue/dist/reset.css';
import './assets/css/index.less';
import './assets/icon/iconfont.css';

import { createApp } from 'vue';

import { setupStore } from '@/store';
import { router, setupRouter } from '@/router';
import { setupRouterGuard } from '@/router/guard';

import App from './App.vue';

async function bootstrap() {
  const app = createApp(App);

  // 配置 store
  setupStore(app);

  // 初始化内部系统配置
  // initAppConfigStore();

  // 配置路由
  setupRouter(app);

  // 路由守卫
  setupRouterGuard(router);

  app.mount('#app');
}

bootstrap();
