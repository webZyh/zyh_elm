import Vue from 'vue';
import VueRouter from 'vue-router'; //引入vue-router
import VueResource from 'vue-resource'; //引入vue-resource
import App from './App';
//引入子组件
import Goods from 'components/goods/goods';
import Ratings from 'components/ratings/ratings';
import Seller from 'components/seller/seller';

import "./common/stylus/index.styl"

/*如果在一个模块化工程中使用它，必须要通过 Vue.use() 明确地安装路由功能*/
//全局注册
Vue.use(VueRouter);
Vue.use(VueResource);

//创建组件
let app = Vue.extend(App);

/* vue-router 2 写法
//定义路由
let routes = [
  {path:'/goods', component : Goods},
  {path:'/ratings', component : Ratings},
  {path:'/seller', component : Seller},
];
//创建路由实例
let router = new VueRouter({
  routes
});

//创建vue实例，并挂载
new Vue({
  router
}).$mount('#app');*/

let router = new VueRouter({
  linkActiveClass:'active'
});

//注册子组件
router.map({
  '/goods':{
    component: Goods
  },
  '/ratings':{
    component: Ratings
  },
  '/seller':{
    component: Seller
  }
});
//挂载
router.start(app,'#app');
router.go('/goods');
