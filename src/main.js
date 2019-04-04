// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import 'bootstrap-css-only/css/bootstrap.min.css'
import 'mdbvue/build/css/mdb.css'
import App from './App'
import router from './router'
import axios from 'axios'
import Vuex from 'vuex'
import store from './store/store'
import alert from './alert/alert'
Vue.use(Vuex)

axios.defaults.baseURL='http://120.79.184.27/'
axios.defaults.withCredentials=true


Vue.config.productionTip = false

import { mdbModal,mdbBtn,mdbIcon,mdbModalHeader,mdbModalTitle,mdbModalFooter,mdbModalBody } from 'mdbvue';

/* eslint-disable no-new */
var one =new Vue({
  el: '#app',
  router,
  store,
  components: { App ,mdbBtn,mdbIcon,mdbModal,mdbModalHeader,mdbModalTitle,mdbModalFooter,mdbModalBody},
  template: '<div><App/>' +
    '<div>\n' +
    '      <mdb-modal v-if="optionsShow" @close="optionsShow = false" :success="!this.options.error" :danger="this.options.error">\n' +
    '        <mdb-modal-header>\n' +
    '          <mdb-modal-title>{{this.options.title}}</mdb-modal-title>\n' +
    '        </mdb-modal-header>\n' +
    '        <mdb-modal-body  class="text-center">\n' +
    '          <mdb-icon v-if="!this.options.error" icon="check" size="4x" class="mb-3 animated rotateIn"/>\n' +
    '          <mdb-icon v-if="this.options.error" icon="times" size="4x" class="animated rotateIn"/>\n' +
    '          <p>{{this.options.text}}</p>\n' +
    '        </mdb-modal-body>\n' +
    '        <mdb-modal-footer center>\n' +
    '          <mdb-btn :color="!this.options.error ? \'success\':\'danger\'" @click="optionsShow = false">确定</mdb-btn>\n' +
    '          <mdb-btn :outline="!this.options.error ? \'success\':\'danger\'" @click="optionsShow = false">关闭</mdb-btn>\n' +
    '        </mdb-modal-footer>\n' +
    '      </mdb-modal>\n' +
    '    </div></div>',
  data() {
    return {
      optionsShow:false,
      options:{
        title:'',
        text:'',
        error:false
      }
  }
  }
})

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  if (response.data.toString() === '401'){
    one.optionsShow=true
    one.options.error = true
    one.options.title = '错误'
    one.options.text = '您还未登录'
  }
  return response;
}, function (error) {
  return Promise.reject(error);
});

