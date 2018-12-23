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
  const token = getToken()
  let num= store.state.app.menus.length
  if (num === 0) {
    getRouterReq().then(res => {
      if (res.data.code === 1) {
        var temp= [...[],...rot]
        var routes = router.options.routes
        var menu = filterAsyncRouter(res.data.data)
        router.addRoutes(menu)
        for (var i in menu) {
          routes.push(menu[i])
        }
        var menu1=[...temp,...menu]
        store.commit('setMenus',menu1)
      }
    }).catch(error => {
      console.log(error)
    })
  }
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME // 跳转到登录页
    })
  } else if (!token && to.name === LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next() // 跳转
  } else if ((token && to.name === LOGIN_PAGE_NAME )) {
    // 已登录且要跳转的页面是主页 或者刷新浏览器
    next({
      name: homeName // 跳转到homeName页
    })
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, store.state.user.access, next)
    } else {
      store.dispatch('getUserInfo').then(user => {
        // 拉取用户信息，通过用户权限和跳转的页面的name来判断是否有权限访问;access必须是一个数组，如：['super_admin'] ['super_admin', 'admin']
        if (num==0) {
          next({
            name: homeName // 跳转到homeName页
          })
        } else {
          turnTo(to, user.access, next)
        }
      }).catch(() => {
        setToken('')
        next({
          name: 'login'
        })
      })
    }
  }
})

router.afterEach(to => {
  setTitle(to, router.app)
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)
})
export default router
