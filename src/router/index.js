import Vue from 'vue'
import Router from 'vue-router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { setToken, getToken, canTurnTo, setTitle, filterAsyncRouter } from '@/libs/util'
import config from '@/config'
import { getRouterReq } from '@/api/routers'
import rot from '@/router/routers'
const { homeName } = config
Vue.use(Router)
const router = new Router({
  routes,
  mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

const turnTo = (to, access, next) => {
  if (canTurnTo(to.name, access, routes)) next() // 有权限，可访问
  else next({ replace: true, name: 'error_401' }) // 无权限，重定向到401页面
}

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  // 已被初始化菜单
  var menus = store.state.app.menus

  if (to.name === 'error_404') { // 错误页面
    next()
    return
  } else if (to.name === 'error_401') {
    next()
    return
  }

  if (store.state.user.hasGetInfo && to.name!== LOGIN_PAGE_NAME) { // 已登录跳转页面不是登录页
    turnTo(to, store.state.user.access, next)
  } else if (store.state.user.hasGetInfo && to.name === LOGIN_PAGE_NAME) { // 已登录跳转页面为登录页
    next({
      name: homeName // 跳转到homeName页
    })
  } else if (to.name === LOGIN_PAGE_NAME) { // 未登录跳转到登录页
    next()
  } else {
    store.dispatch('getUserInfo').then(user => {
      var temp = [...[], ...rot]
      var routes = router.options.routes
      var menu = filterAsyncRouter(user.data.menu)
      router.addRoutes(menu)
      for (var i in menu) {
        routes.push(menu[i])
      }
      var menu1 = [...temp, ...menu]
      store.commit('setMenus', menu1)
      store.commit('setInitMenus', true)
      next({
        name: homeName // 跳转到homeName页
      })
    }).catch(() => {
      // 暂时不用cookie登录
      setToken('')
      // store.commit('setToken','')
      next({
        name: 'login'
      })
    })
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
export default router
