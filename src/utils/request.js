import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  // withCredentials: true, // 发送cookie时，跨域请求
  timeout: 5000 // request timeout
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    //  在发送请求之前做些什么

    if (store.getters.token) {
      // 让每个请求都带有令牌
      //  [' x token']是自定义标头键
      // 请根据实际情况修改 Authorization
      // config.headers['X-Token'] = getToken()
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // 做一些请求错误
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获得HTTP信息，如标头或状态
   * return  response => response
  */

  /**
   * 根据自定义代码确定请求状态
   * 这里只是一个例子
   * 您也可以通过ttp状态码来判断状态
   */
  response => {
    const res = response.data
    // 根据后端状态码调整
    // 后端的状态码为 status 所以同步修改
    res.code = res.status
    if (res.code !== 0) {
      console.log('22222 :>> ', 22222);
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: 非法令牌;50012:其他客户端已登录;50014:令牌过期;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
        MessageBox.confirm('您已退出登录，您可以取消以留在此页面上，或重新登录', '确认退出登录', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
