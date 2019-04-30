<template>
  <div id="Register" class="bg">
    <NavHeader></NavHeader>

    <mdb-container>
      <mdb-row>
        <mdb-col md="4"  class="mt-5 mb-5" >
          <mdb-card class="collapse-item mt-2 text-left" >
            <mdb-card-body>
              <p class="h4 text-center mb-4">注册</p>
              <div class="grey-text">
                <mdb-input id="name" size="sm" required label="用户名" icon="user" group type="text" validate error="wrong" success="right" />
                <mdb-input id="number" size="sm" required label="手机号" icon="user" group type="text" validate error="wrong" success="right" />
                <mdb-input id="check" class="mt-3" required size="sm" label="验证码" icon="tag" group type="text" validate error="wrong" success="right" />
                <mdb-btn color="secondary" size="md" v-on:click.native="sms" class="float-right">{{this.smsTip}}</mdb-btn>
                <mdb-input id="pwd" class="mt-5" required size="sm" label="密码" icon="lock" group type="password" validate error="wrong" success="right"/>
                <mdb-input id="pwd_check" class="mt-3" required size="sm" label="确认密码" icon="lock" group type="password" validate error="wrong" success="right"/>
              </div>
                <mdb-btn class="float-right" color="primary" v-on:click.native="changeUserInfo">注册</mdb-btn>
            </mdb-card-body>
          </mdb-card>
        </mdb-col>
      </mdb-row>

    </mdb-container>


    <v-footer></v-footer>

    <div>
      <mdb-modal v-if="optionsShow" @close="optionsShow = false" :success="!this.options.error" :danger="this.options.error">
        <mdb-modal-header>
          <mdb-modal-title>{{this.options.title}}</mdb-modal-title>
        </mdb-modal-header>
        <mdb-modal-body  class="text-center">
          <mdb-icon v-if="!this.options.error" icon="check" size="4x" class="mb-3 animated rotateIn"/>
          <mdb-icon v-if="this.options.error" icon="times" size="4x" class="animated rotateIn"/>
          <p>{{this.options.text}}</p>
        </mdb-modal-body>
        <mdb-modal-footer center>
          <mdb-btn v-if="this.options.error" color="danger" @click="optionsShow = false">确认</mdb-btn>
          <router-link to="/"><mdb-btn v-if="!this.options.error" color="success">跳转到主页面</mdb-btn></router-link>
        </mdb-modal-footer>
      </mdb-modal>
    </div>

  </div>
</template>

<script>
  import Footer from '@/components/Footer'
  import Pagination from '@/components/Pagination'
  import axios from 'axios'
  import NavHeader from "@/components/NavHeader";
  import { mdbNavbarNav,mdbNavItem,mdbNavbar,mdbPagination,mdbPageItem,mdbMedia,mdbMediaBody ,mdbEdgeHeader,mdbModal,mdbModalHeader,mdbModalTitle,mdbModalFooter,mdbModalBody,mdbMask,mdbView,mdbCardGroup,mdbCardTitle,mdbCardText,mdbCardImage,mdbTabs,mdbCard,mdbCardBody,mdbContainer,mdbInput,mdbBtn,mdbIcon,mdbRow,mdbCol,mdbCarousel, mdbCarouselItem, mdbCarouselCaption } from 'mdbvue';
  export default {
    name: 'Register',

    components: {
      mdbNavbarNav,mdbNavItem,
      mdbNavbar,
      mdbPagination,mdbPageItem,
      mdbMedia,mdbMediaBody,
      mdbEdgeHeader,
      mdbModal,mdbModalHeader,mdbModalTitle,mdbModalFooter,mdbModalBody,
      mdbMask,
      mdbView,
      mdbTabs,
      NavHeader,
      mdbCarousel,
      mdbCarouselItem,
      mdbCarouselCaption,
      mdbRow,
      mdbCol,
      mdbInput,
      mdbBtn,
      mdbIcon,
      mdbContainer,
      'v-pagination': Pagination,
      'v-footer':Footer,
      mdbCard,mdbCardBody,mdbCardGroup,mdbCardTitle,mdbCardText,mdbCardImage
    },
    data(){
      return{
        optionsShow:false,
        options:{
          title:'',
          text:'',
          error:false
        },

        checkNum:'',
        canClick:true,
        smsTip:'发送验证码',
        totalTime:60,

      }
    },
    methods: {


      showModal(success,text){
        this.optionsShow=true
        this.options.error = true
        this.options.title = '错误'
        if (success === true) {
          this.options.title = '成功'
          this.options.error = false
        }
        this.options.text=text
      },

      changeUserInfo(){
        var name = document.getElementById("name").value.toString().trim()
        var number = document.getElementById("number").value.toString().trim()
        var check = document.getElementById("check").value.toString().trim()
        var pwd = document.getElementById("pwd").value.toString().trim()
        var pwd_check = document.getElementById("pwd_check").value.toString().trim()

        if (name.length === 0){
          this.$options.methods.showModal.bind(this)(false,'用户名不能为空')
          return
        }
        if (number.length === 0){
          this.$options.methods.showModal.bind(this)(false,'手机号不能为空')
          return
        }
        if (check.length === 0 || check.toString() !== this.checkNum.toString()){
          this.$options.methods.showModal.bind(this)(false,'验证码不正确')
          return
        }
        if (pwd.length === 0){
          this.$options.methods.showModal.bind(this)(false,'密码不能为空')
          return
        }
        if (pwd_check.length === 0 || pwd.toString() !== pwd_check.toString()){
          this.$options.methods.showModal.bind(this)(false,'两次输入密码不一致')
          return
        }

        axios.post('/account/register', {
          name: name,
          number: number,
          pwd: pwd,
        })
          .then((response)=>{
            if (response.data.code === '000000'){
              this.$options.methods.showModal.bind(this)(true,'注册成功')
            }
            else{
              this.$options.methods.showModal.bind(this)(false,response.data.message)
            }
          })
          .catch(function (error) {
            this.$options.methods.showModal.bind(this)(false,error)
          });
      },

      sms(){
        this.$options.methods.countDown.bind(this)();
        var number = document.getElementById("number").value
        console.log(number)
        if (number === null || number.length === 0){
          this.$options.methods.showModal.bind(this)(false,'手机号不能为空')
          return
        }
        axios.get('account/sms?number='+number)
          .then(data => {
              if (data.data.code === '000000'){
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

    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .bg {
    /* The image used */
    background-image: url("http://120.79.184.27:81/front/register.jpg");

    /* Half height */
    height: 50%;

    /* Center and scale the image nicely */
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
</style>
