<template>
  <div id="NavHeader">
    <!--Navbar-->
    <mdb-navbar class="indigo" dark>
      <!-- Navbar brand -->
      <mdb-navbar-brand href="https://mdbootstrap.com/">
        <img src="../assets/imovie_logo.png" height="30" alt="">
      </mdb-navbar-brand>

      <mdb-navbar-toggler>
        <mdb-navbar-nav left>
          <mdb-nav-item href="/" active>主页</mdb-nav-item>
          <mdb-nav-item href="/#/top">榜单</mdb-nav-item>
          <mdb-nav-item @click.native="$router.push({name:'Search',params:{name: '*' }})">类别</mdb-nav-item>
          <mdb-nav-item href="/#/post">帖子</mdb-nav-item>
          <!--<mdb-nav-item href="#">答题</mdb-nav-item>-->
        </mdb-navbar-nav>

        <mdb-navbar-nav right>

          <!-- Search form -->
          <mdb-input id="search" basic class= "p-2" placeholder="搜索电影" ariaDescribedBy="button-addon2" @keyup.native.enter="toSearch">
            <mdb-btn size="md" group slot="append" id="button-addon2" v-on:click.native="toSearch">
              <mdb-icon  icon="search" />
            </mdb-btn>
          </mdb-input>

          <!-- Dropdown -->
          <mdb-dropdown tag="li" class="nav-item" v-show="isLogin">
            <mdb-dropdown-toggle tag="a" navLink color="indigo" slot="toggle" waves-fixed>
              <img  :src="isLogin ? $store.state.user.img : ''" height="30" alt="" class="rounded-circle"/>
            </mdb-dropdown-toggle>
            <mdb-dropdown-menu right>
              <router-link :to="{name:'UserInfo',params:{userId: this.isLogin ? $store.state.user.id.toString() : 0}}"><mdb-dropdown-item>我的主页</mdb-dropdown-item></router-link>
              <mdb-dropdown-item>修改密码</mdb-dropdown-item>
              <div class="dropdown-divider"></div>
              <mdb-dropdown-item v-on:click.native="logout">注销</mdb-dropdown-item>
            </mdb-dropdown-menu>
          </mdb-dropdown>

          <mdb-nav-item v-on:click.native="showModalWithClear" v-show="!isLogin">登录</mdb-nav-item>

        </mdb-navbar-nav>

      </mdb-navbar-toggler>

    </mdb-navbar>

    <mdb-container>
      <mdb-row>
        <mdb-col size="12" class="text-center">
          <mdb-modal v-if="showModal" @close="showModal = false" cascade class="text-left">
            <mdb-modal-header class="primary-color white-text">
              <h4 class="title"> 登录</h4>
            </mdb-modal-header>
            <mdb-modal-body class="grey-text">
              <mdb-alert color="danger" v-show="showError">
                {{this.loginError}}
              </mdb-alert>

              <mdb-tab default class="card-header-tabs mx-auto">
                <mdb-tab-item :active="isPwd" @click.native.prevent="isPwd = true">密码登录</mdb-tab-item>
                <mdb-tab-item :active="!isPwd" @click.native.prevent="isPwd = false">验证码登录</mdb-tab-item>
              </mdb-tab>
              <mdb-input id="login_number_pwd" size="sm" required label="手机号" icon="user" group type="text" validate error="wrong" success="right" />

              <mdb-tab-content>
                <mdb-tab-pane class="fade" key="show1" v-if="isPwd">
                    <mdb-input id="login_pwd_pwd" class="mt-3" required size="sm" label="密码" icon="lock" group type="password" validate error="wrong" success="right"/>
                </mdb-tab-pane>
                <mdb-tab-pane class="fade" key="show1" v-if="!isPwd">
                  <mdb-input id="login_pwd_check" class="mt-3" required size="sm" label="验证码" icon="tag" group type="text" validate error="wrong" success="right" />
                  <mdb-btn color="secondary" size="md" v-on:click.native="sms" :disabled="!canClick">{{this.smsTip}}</mdb-btn>
                </mdb-tab-pane>
              </mdb-tab-content>


              <mdb-row class="pl-4">
                <mdb-col>
                  <p>还没有账号？<router-link to="/register"><a style="color: blue">立即注册</a></router-link></p>
                </mdb-col>
                <mdb-col>
                  <a style="color: blue">忘记密码？</a>
                </mdb-col>
              </mdb-row>

            </mdb-modal-body>
            <mdb-modal-footer>
              <mdb-btn color="secondary" @click.native="showModal = false">取消</mdb-btn>
              <mdb-btn color="primary" v-on:click.native="login">登录</mdb-btn>
            </mdb-modal-footer>
          </mdb-modal>
        </mdb-col>
      </mdb-row>
    </mdb-container>
  </div>
</template>

<script>
  import axios from 'axios'
  import {mdbTab,mdbTabItem,mdbTabContent,mdbTabPane,mdbAlert ,mdbTabs,mdbRow,mdbModal,mdbModalBody,mdbModalFooter,mdbModalHeader,mdbModalTitle,mdbCol,mdbInput, mdbContainer, mdbNavbar, mdbNavbarBrand, mdbNavItem, mdbNavbarNav, mdbNavbarToggler, mdbBtn, mdbIcon, mdbListGroup, mdbListGroupItem, mdbCardBody, mdbFooter,mdbDropdown,mdbDropdownToggle,mdbDropdownItem,mdbDropdownMenu,waves } from 'mdbvue'
  export default {
    name: 'NavHeader',
    components: {
      mdbTabContent,mdbTabPane,mdbTab,mdbTabItem,
      mdbAlert,
      mdbTabs,
      mdbRow,mdbModal,mdbModalBody,mdbModalFooter,mdbModalTitle,mdbModalHeader,
      mdbCol,
      mdbInput,
      mdbContainer,
      mdbNavbar,
      mdbNavbarBrand,
      mdbNavItem,
      mdbNavbarNav,
      mdbNavbarToggler,
      mdbBtn,
      mdbListGroup,
      mdbListGroupItem,
      mdbIcon,
      mdbCardBody,
      'ftr': mdbFooter,
      mdbDropdown,
      mdbDropdownToggle,
      mdbDropdownItem,
      mdbDropdownMenu,

    },
    mixins: [waves],
    data(){
      return{
        showModal:false,
        isLogin:false,
        isPwd:true,
        loginError:'',
        showError:false,
        checkNum:'',
        canClick:true,
        smsTip:'发送验证码',
        totalTime:60,
      }
    },
    created() {
      var user = this.$store.state.user
      if (user){
        this.isLogin = true
      }
    },
    methods:{
      login(){
        this.showError = false
        let path = 'login'
        let number = document.getElementById("login_number_pwd").value
        let value = ''
        if (this.isPwd){
          value = document.getElementById("login_pwd_pwd").value
        } else {
          path = 'captchaLogin'
          value = document.getElementById("login_pwd_check").value
          if (this.checkNum.toString().trim() !== value.trim()){
            this.loginError = '验证码错误'
            this.showError = true
            return
          }
        }
        axios.post('/account/'+path, {
          number: number,
          pwd:value,
        })
          .then((response)=>{
            if (response.data.code === '000000'){
              this.$store.commit('login',response.data.data)
              this.isLogin = true
              this.showModal=false
            }
            else{
              this.loginError = response.data.message
              this.showError = true
            }
          })
          .catch(function (error) {
            console.log(error)
          });
      },

      showModalWithClear(){
        this.isPwd=true
        this.loginError=''
        this.showError=false
        this.checkNum=''
        this.showModal = true
        return true
      },

      sms(){
        this.$options.methods.countDown.bind(this)();
        var number = document.getElementById("login_number_pwd").value
        if (number === null || number.length === 0){
          this.loginError = "手机号不为空"
          this.showError = true
          return
        }
        axios.get('account/sms?number='+number)
          .then(data => {
              if (data.data.code === '000000'){
                console.log(data.data.data)
                this.checkNum = data.data.data
              }
              else
                alert(data.data.message)
            }
          )
      },

      countDown () {
        if (!this.canClick) return  //改动的是这两行代码
        this.canClick = false
        this.smsTip = this.totalTime + 's后重新发送'
        let clock = window.setInterval(() => {
          this.totalTime--
          this.smsTip = this.totalTime + 's后重新发送'
          if (this.totalTime < 0) {
            window.clearInterval(clock)
            this.smsTip = '重新发送验证码'
            this.totalTime = 60
            this.canClick = true  //这里重新开启
          }
        },1000)
      },

      logout(){
        axios.get('account/logout')
          .then(data => {
              if (data.data.code === '000000'){
              }
              else
                alert(data.data.message)
            }
          )
        this.$store.commit('logout')
        this.isLogin = false
      },

      getUserInfo: function () {
        this.$router.push({name:'UserInfo',params:{userId:this.$store.state.user.id.toString()}})
        this.$router.go(0)
      },

      toSearch: function () {
        var key = document.getElementById('search').value.toString().trim()
        this.$router.push({name:'Search',params:{name:key}})
        this.$router.go(0)
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }
  img {
    margin: 0px;
    padding: 0px;
  }
</style>
