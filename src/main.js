// 兼容 IE
// https://github.com/zloirock/core-js/blob/master/docs/2019-03-19-core-js-3-babel-and-a-look-into-the-future.md#babelpolyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import './assets/icon/iconfont.css'
import './assets/icon/iconfont.js'
import '@babel/polyfill'
import Es6Promise from 'es6-promise'
Es6Promise.polyfill()

import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 设置 js中可以访问 $cdn
import { $cdn } from '@/config'
Vue.prototype.$cdn = $cdn

// 全局引入按需引入UI库 vant
import '@/plugins/vant'
// 引入全局样式
import '@/assets/css/index.scss'
// 移动端适配
import 'lib-flexible/flexible.js'
// echarts
import * as echarts from 'echarts'
Vue.prototype.$echarts = echarts
// filters
import './filters'
Vue.config.productionTip = false

// import VCalendar from 'v-calendar' // 引入日历插件
// Vue.use(VCalendar, {
//   componentPrefix: 'vc'
// })

/**
 * 按数字大小转换为 万 或者 亿 为单位的数字
 */
Vue.filter('NumToUnitNum', function(value) {
  if (!value) return '0.00'
  if (value > 100000000 || value < -100000000) {
    return Number(value / 100000000).toFixed(2)
  } else if (value > 10000 || value < -10000) {
    return Number(value / 10000).toFixed(2)
  } else {
    return Number(value).toFixed(2)
  }
})

/**
   * 通过数字获取到数字转换后的单位
   */
Vue.filter('GetUnit', function(value) {
  if (!value) ' '
  value = Math.abs(value)
  if (value > 100000000) {
    return '亿元'
  } else if (value > 10000) {
    return '万元'
  } else {
    return '元'
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
