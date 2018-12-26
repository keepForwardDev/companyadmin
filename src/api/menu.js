import axios from '@/libs/api.request'
export const getMenuList = (token) => {
  return axios.request({
    url: '/menu/menuList',
    method: 'get'
  })
}

export const saveMenu = (data) => {
  return axios.request({
    url: '/menu/save',
    data,
    method: 'post'
  })
}

export const deleteMenu = (id) => {
  return axios.request({
    url: '/menu/delete',
    id,
    method: 'get'
  })
}
