import axios from '@/libs/api.request'
export const getRouterReq = () => {
  return axios.request({
    url: '/menu/me',
    params: {
    },
    method: 'get'
  })
}
