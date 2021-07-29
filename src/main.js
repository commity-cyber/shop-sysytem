import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'


import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 导入全局的眼样式表
import '../src/assets/css/qj.css'

// 导入字体图标图片
import '../src/assets/fonts/iconfont.css'
Vue.config.productionTip = false

// 全局引入axios
import axios from 'axios'

axios.defaults.baseURL = ' http://www.tangxiaoyang.vip:8888/api/v2/'
// 在axios中设置拦截器，拦截请求的信息，为其添加token值
axios.interceptors.request.use(config =>{
  // 请求一发送就开启滚动条
  NProgress.start()
  // console.log(config)
  // 拿到登入用户的token，用户信息坐在本地缓存中，命名为userInfo里面
 const userInfo = JSON.parse( sessionStorage.getItem('userInfo'))
  // 进入到header字段中去,把token加到该字段中
  config.headers.Authorization =userInfo ? userInfo.token :''

  return config
}),
 
axios.interceptors.response.use(config=>{
  NProgress.done()
  return config
})

// 在vue实例中设置全局axios,因为后面的也要用到哦
Vue.prototype.$http = axios

import ZkTable from 'vue-table-with-tree-grid'
Vue.component('tree-table', ZkTable)

 

// 工具库
import untils from './libs/until'
// 挂载到原型上面去
Vue.prototype.$untils = untils

// 引入富文本编辑器
import  VueQuillEditor from 'vue-quill-editor'
 // require styles 引入样式
 import 'quill/dist/quill.core.css'
 import 'quill/dist/quill.snow.css'
 import 'quill/dist/quill.bubble.css'
 
 Vue.use(VueQuillEditor)


new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
