// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import i18n from '@/locale'
import config from '@/config'
import importDirective from '@/directive'
import installPlugin from '@/plugin'
import './index.less'
import '@/assets/icons/iconfont.css'
import TreeTable from 'tree-table-vue'
import { directive as clickOutside } from 'v-click-outside-x'
import VOrgTree from 'v-org-tree'
import 'v-org-tree/dist/v-org-tree.css'
import { oneOf } from '@/libs/tools'
// 实际打包时应该不引入mock
/* eslint-disable */
if (process.env.NODE_ENV !== 'production') require('@/mock')

/** 注册全局函数权限判断 res 为 resCode*/
Vue.prototype.hasResources = function (res) {
  return oneOf(res, store.state.user.resources)
}

Vue.use(iView, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.use(VOrgTree)
Vue.use(TreeTable)
/**
 * @description 注册admin内置插件
 */
installPlugin(Vue)
/**
 * @description 生产环境关掉提示
 */
Vue.config.productionTip = false
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
Vue.directive('clickOutside', clickOutside)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  store,
  render: h => h(App)
})
