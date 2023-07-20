import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    url: '/manage/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo(token) {
  return request({
    url: '/manage/getUserInfo',
    method: 'post',
    data: { token }
  })
}
// 退出登录
export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
