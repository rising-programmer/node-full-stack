//路由页面

import Vue from 'vue'

//引入路由模块，看下终端，如果终端提示vue-router模块没有安装，安装即可
import Router from 'vue-router'

//分别引入List、Detail两个组件
import List from '@/components/List'
import Detail from '@/components/Detail'


Vue.use(Router)

//定义路由,这两个路由会被映射到App.vue的<router-view></router-view>视口中
export default new Router({
  routes: [
    {
      path: '/',
      name: 'List',
      component: List
    },
    {
      path : '/league/:name',
      name : 'Detail',
      component : Detail
    },
  ]
})
