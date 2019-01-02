import axios from '@/libs/api.request'

export const getRoleList = (data) => {
  return axios.postForm({
    url: '/role/list',
    data,
    method: 'post'
  })
}

export const deleteRole = (ids) => {
  return axios.request({
    url: '/role/delete',
    params: ids,
    method: 'get'
  })
}

export const saveRole = (data) => {
  return axios.postForm({
    url: '/role/save',
    data,
    method: 'post'
  })
}
