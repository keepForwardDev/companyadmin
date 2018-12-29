import axios from '@/libs/api.request'
export const getMenuList = () => {
  return axios.request({
    url: '/menu/menuList',
    method: 'get'
  })
}

export const getTree = () => {
  return axios.request({
    url: '/menu/menuTree',
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
    params: id,
    method: 'get'
  })
}

export const getMenuResources = (data) => {
  return axios.postForm({
    url: '/menu/menuResources',
    data,
    method: 'post'
  })
}
