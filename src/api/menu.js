import axios from '@/libs/api.request'
export const getMenuList = (token) => {
  return axios.request({
    url: '/menu/menuList',
    method: 'get'
  })
}
