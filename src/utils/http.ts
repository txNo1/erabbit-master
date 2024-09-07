import { useMemberStore } from '@/stores'
const baseURL = 'https://pcapi-xiaotuxian-front-devtest.itheima.net/'

// 添加拦截器
const httpInterceptor = {
  invoke(options: UniApp.RequestOptions) {
    // 1. 非http开头需要拼接地址
    if (!options.url.startsWith('http')) {
      options.url = `${baseURL}/${options.url}`; // 确保拼接正确
    }
    // 2. 超时时间，默认10s
    options.timeout = 10000;

    // 3.添加小程序端请求头标识
    options.header = {
      ...options.header,
      'source': 'miniapp',
    }
    // 4.添加token 请求头标识
    const memberStore = useMemberStore();
    const token = memberStore.profile?.token;
    if (token) {
      options.header.Authorization = token
    }
  },
};

uni.addInterceptor('request', httpInterceptor);
uni.addInterceptor('uploadFile', httpInterceptor);

interface Data<T> {
  code: number,
  msg: string,
  result: T
}

export const http = <T>(options: UniApp.RequestOptions) => {
  return new Promise((resolve, reject) => {
    uni.request({
      ...options,
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data as Data<T>)
        } else if (res.statusCode === 401) {
          const memberStore = useMemberStore()
          memberStore.clearProfile()
          uni.navigateTo({
            url: '/pages/login/login'
          })
          reject(res)
        } else {
          uni.showToast({
            icon: 'none',
            title: (res.data as Data<T>).msg || '请求错误'
          })
        }
        reject(res)
      },
      fail(err) {
        uni.showToast({
          icon: 'none',
          title: '网络错误,换个网络试试!'
        })
        reject(err)
      }
    })
  })
}