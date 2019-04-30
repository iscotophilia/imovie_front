<template>
  <div class="UserInfo">
    <NavHeader></NavHeader>

    <mdb-edge-header color="white">
      <img src="../assets/userInfo.jpg" style="width: 100%"/>
    </mdb-edge-header>
    <div class="container">
      <mdb-row>
        <mdb-col md="10" class="mx-auto float-none white z-depth-2 py-2 px-2">
          <mdb-card-body>

            <a @click.prevent="collapse1 === true ? collapse1 = false : collapse1 = true">
              <img class="card-img-100 rounded-circle d-flex z-depth-1 mx-auto" :src="user.img" alt="Generic placeholder image">
            </a>

            <div>
              <mdb-modal centered v-if="collapse1" @close="collapse1 = false">
                <mdb-modal-header>
                  <mdb-modal-title>修改头像</mdb-modal-title>
                </mdb-modal-header>
                <mdb-modal-body>

                  <div class="input-group">
                    <div class="input-group-prepend">
                      <span class="input-group-text" id="inputGroupFileAddon01">Upload</span>
                    </div>
                    <div class="custom-file">
                      <input type="file" class="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01">
                      <label class="custom-file-label" for="inputGroupFile01">选择文件</label>
                    </div>
                  </div>

                </mdb-modal-body>
                <mdb-modal-footer>
                  <mdb-btn color="secondary" @click.native="collapse1 = false">关闭</mdb-btn>
                  <mdb-btn color="primary" v-on:click.native="updateImg">保存</mdb-btn>
                </mdb-modal-footer>
              </mdb-modal>
            </div>

            <h2 class="h2-responsive mt-3"><strong>{{user.name}}</strong></h2>
            <p>age : {{user.age}}</p>
            <mdb-icon v-if="user.sex.length > 0" :icon="user.sex === '男'? 'mars': 'venus' " :class="user.sex === '男' ? 'indigo-text':'red-text'" size="2x"/>
            <p class="text-monospace">sign : [..{{user.sign}}..]</p>
            <mdb-row class="d-flex flex-row justify-content-center">
              <mdb-btn v-if="$store.state.user ? this.user.id === $store.state.user.id : false" color="primary" waves-fixed class="border nav-link border-light rounded mr-1" @click.native.prevent="collapse2 === true ? collapse2 = false : collapse2 = true"><mdb-icon icon="edit" class="mr-2"/>修改信息</mdb-btn>
              <mdb-btn v-if="!$store.state.user || this.user.id !== $store.state.user.id " :color="isFollow ? 'primary':'green'" v-text="isFollow ? '已关注' : '关注'" waves-fixed class="border nav-link border-light rounded mr-1" @click.native="follow"></mdb-btn>
            </mdb-row>

            <transition @before-enter="beforeEnter" @enter="enter" @before-leave="beforeLeave">
              <mdb-card v-if="collapse2" class="collapse-item mt-2">
                <mdb-card-body>
                    <p class="h4 text-center mb-4">修改信息</p>
                    <div class="grey-text">
                      <label for="nickname_text" class="grey-text float-left">昵称</label>
                      <input type="text" id="nickname_text" class="form-control"/>
                      <hr/>
                      <label for="age_text" class="grey-text float-left">年龄</label>
                      <input type="number" id="age_text" class="form-control"/>
                      <hr/>
                      <p class="grey-text float-left">性别</p>
                      <br/>
                      <div class="mt-2 mb-2">
                        <!-- Default inline 1-->
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" name="radioInline" class="custom-control-input" id="defaultInline1">
                          <label class="custom-control-label" for="defaultInline1">男</label>
                        </div>

                        <!-- Default inline 2-->
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" name="radioInline" class="custom-control-input" id="defaultInline2">
                          <label class="custom-control-label" for="defaultInline2">女</label>
                        </div>

                        <!-- Default inline 3-->
                        <div class="custom-control custom-radio custom-control-inline">
                          <input type="radio" name="radioInline" class="custom-control-input" id="defaultInline3">
                          <label class="custom-control-label" for="defaultInline3">不方便透露</label>
                        </div>
                      </div>
                      <hr/>
                      <label for="sign_text" class="grey-text float-left">签名</label>
                      <textarea type="text" id="sign_text" class="form-control"/>
                    </div>
                    <div class="text-center">
                      <mdb-btn color="primary" v-on:click.native="changeUserInfo">修改</mdb-btn>
                    </div>
                </mdb-card-body>
              </mdb-card>
            </transition>

          </mdb-card-body>
        </mdb-col>
      </mdb-row>

      <div class="mt-4">
        <mdb-row>
          <mdb-col md="9" class="mx-auto float-none white z-depth-2 py-2 px-2">
            <section>
              <mdb-navbar class="yellow lighten-4 py-4">
                <mdb-navbar-nav nav class="font-weight-bold">
                  <mdb-nav-item v-on:click.native="changeTabs(navChoose = 1)" :class="navChoose === 1 ? 'z-depth-1': 'z-depth-0'">看过</mdb-nav-item>
                  <mdb-nav-item v-if="$store.state.user ? this.user.id === $store.state.user.id : false" v-on:click.native="changeTabs(navChoose = 2)" :class="navChoose === 2 ? 'z-depth-1': 'z-depth-0'">收藏</mdb-nav-item>
                  <mdb-nav-item v-on:click.native="changeTabs(navChoose = 3)" :class="navChoose === 3 ? 'z-depth-1': 'z-depth-0'">评论</mdb-nav-item>
                </mdb-navbar-nav>
              </mdb-navbar>
            </section>

            <div class="mt-4 d-flex align-items-stretch" v-if="navChoose === 1 || navChoose === 2">
              <mdb-row class="clearfix">
                <mdb-col class="mt-3" v-for="(movie,index) in movies" key="index" md="3" col="3" style="height:0;padding-bottom: 35%" v-on:click.native="getMovieInfo(movie.id)">
                  <mdb-card>
                    <mdb-view>
                      <mdb-card-image :src="movie.img" alt="Card image cap" block style="height: 0; padding-bottom: 140%" ></mdb-card-image>
                      <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
                    </mdb-view>
                    <mdb-card-body class="p-0">
                      <mdb-card-text class="text-truncate text-monospace font-weight-bold"><b>
                        {{movie.cnName}}     评分：{{movie.score}}</b>
                      </mdb-card-text>
                    </mdb-card-body>
                  </mdb-card>
                </mdb-col>
              </mdb-row>
            </div>

            <section class="demo-section" v-if="navChoose === 3">
              <section v-for="(comment,index) in comments" key="index">
                <mdb-media class="d-block d-md-flex mt-4 pb-2">
                  <img class="card-img-64 d-flex mx-auto mb-3 rounded-circle" :src="comment.img" alt="Generic placeholder image">
                  <mdb-media-body class="text-center text-md-left ml-md-3 ml-0 text-monospace font-weight-bolder">
                    <h5 class="font-weight-bold mt-0">
                      <router-link :to="{name:'UserInfo',params:{userId:$store.state.user.id.toString()}}"><a>{{comment.name}}</a></router-link>   <label> <a style="color: #00e25b" v-on:click="getMovieInfo(comment.movieId)">  #{{comment.movieId}}</a> </label>
                    </h5>
                    <p>{{comment.createTime}}</p>
                    {{comment.comment}}
                    <a v-on:click="deleteComment(comment.id)" v-if="$store.state.user ? comment.userId === $store.state.user.id : false" class="float-right"><mdb-icon far icon="trash-alt" />删除</a>
                    <h6 class="float-right mt-1 mr-2">回复数：{{comment.subNum}}</h6>
                    <a>
                      <mdb-icon icon="heart" class="red-text float-right mr-4" size="2x" ></mdb-icon>
                    </a>
                    <h4 class="float-right mr-2 mt-1">{{comment.loveNum}}</h4>
                    <hr/>
                  </mdb-media-body>
                </mdb-media>
              </section>
            </section>

            <v-pagination class="mx-auto mt-2" :total="total" :current-page='current' @pagechange="pagechange"></v-pagination>
          </mdb-col>
          <mdb-col md="2" class="float-right white z-depth-2">
            <h5>关注</h5>
            <mdb-media class="d-block d-md-flex mt-4" v-for="(follow,index) in follows" key="index">
              <router-link :to="{name:'UserInfo',params:{userId:follow.followId}}"><img class="card-img-64 card-img d-flex mx-auto mb-3 rounded-circle" :src="follow.img" alt="Generic placeholder image" /></router-link>
              <mdb-media-body class="text-center text-md-left ml-md-3 ml-0">
                <h5 class="font-weight-bold mt-0">
                  <a v-on:click="jumpUserInfo(follow.userId)" style="color: blue">{{follow.name}}</a>
                </h5>
                ...{{follow.sign}}...

                <a v-on:click="deleteComment(follow.id)" v-if="$store.state.user ? follow.userId === $store.state.user.id : false" class="float-right ml-2"><mdb-icon far icon="trash-alt" />取消关注</a>

              </mdb-media-body>

            </mdb-media>
            <hr/>

            <mdb-pagination circle color="blue" class="mx-auto">
              <mdb-page-item  :class="{'disabled': followpage === 0}" v-on:click.native="getFollow(followpage -1)">
              上一页</mdb-page-item>
              <mdb-page-item :class="{'disabled': followpage === followtotal}" v-on:click.native="getFollow(followpage -1)">
              下一页</mdb-page-item>
            </mdb-pagination>

          </mdb-col>
        </mdb-row>
      </div>

    </div>

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
          <mdb-btn :color="!this.options.error ? 'success':'danger'" @click="optionsShow = false">确认</mdb-btn>
          <mdb-btn :outline="!this.options.error ? 'success':'danger'" @click="optionsShow = false">关闭</mdb-btn>
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
    name: 'UserInfo',

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
        total:10,
        current:1,
        optionsShow:false,
        options:{
          title:'',
          text:'',
          error:false
        },

        collapse1: false,
        collapse2: false,

        user:{
          id:0,
          name:'',
          sex:'',
          age:'',
          sign:'',
          img:'',
          exp:'',
          status:'',
          number:''
        },

        follows:[],
        followpage:0,
        followtotal:1,

        navChoose:1,
        movies:[],

        comments:[],

        isFollow:false,
      }
    },
    created() {
      this.user.id = this.$route.params.userId
      this.$options.methods.getUserInfo.bind(this)()

      axios.get('follow/all',{
        params:{
          id:this.user.id,
          pageIndex:this.followpage,
          pageSize:5
        }
      })
        .then(data => {
            if (data.data.code ==='000000'){
              this.follows = data.data.data.list
            } else
              this.$options.methods.showModal.bind(this)(false,data.data.message)
          }
        )

        axios.get('seen/all?way=score&pageSize=12&pageIndex=0&id='+this.user.id)
          .then(data => {
              if (data.data.code === '000000') {
                this.total = data.data.data.pages;
                this.movies = data.data.data.list;
              } else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
            }
          )

      if (this.$store.state.user ? this.$store.state.user.id !== this.user.id : false){
        axios.get('follow/isFollow',{
          params:{
            followId: this.user.id
          }
        })
          .then(data => {
              if (data.data.code === '000000') {
                this.isFollow = data.data.data
                console.log(this.isFollow)
              } else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
            }
          )
      }

    },
    methods: {
      pagechange:function (currentPage) {
        this.current = currentPage;
        if (this.navChoose === 1) {
          axios.get('seen/all', {
            params:{
              id:this.user.id,
              pageSize: 12,
              pageIndex: this.current - 1
            }
          })
            .then(data => {
                if (data.data.code === '000000') {
                  this.total = data.data.data.pages;
                  this.movies = data.data.data.list;
                } else
                  this.$options.methods.showModal.bind(this)(false,data.data.message)
              }
            )
        } else if (this.navChoose === 2){
          axios.get('save/get',{
            params:{
              pageSize: 12,
              pageIndex: this.current - 1
            }
          })
            .then(data => {
                if (data.data.code === '000000') {
                  this.total = data.data.data.pages;
                  this.movies = data.data.data.list;
                } else
                  this.$options.methods.showModal.bind(this)(false,data.data.message)
              }
            )
        } else  if(this.navChoose === 3){
          axios.get('comment/userComment',{
            params:{
              pageSize: 12,
              pageIndex: this.current - 1
            }
          })
            .then(data => {
                this.total = data.data.data.pages || 1;
                if (data.data.code === '000000') {
                  this.total = data.data.data.pages;
                  this.comments = data.data.data.list;
                } else
                  this.$options.methods.showModal.bind(this)(false,data.data.message)
              }
            )
        }

      },

      getUserInfo(){
        axios.get('user/info?id='+this.user.id)
          .then(data => {
              if (data.data.code ==='000000'){
                this.user = data.data.data
              } else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
            }
          )
      },

      changeTabs: function (index) {
        this.current = 1
        if (this.navChoose === 1) {
          axios.get('seen/all', {
            params:{
              id:this.user.id,
              pageSize: 12,
              pageIndex: this.current - 1
            }
          })
            .then(data => {
              if (data.data.code === '000000') {
                this.total = data.data.data.pages;
                this.movies = data.data.data.list;
              } else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
              }
            )
        } else if (this.navChoose === 2){
          axios.get('save/get',{
            params:{
              pageSize: 12,
              pageIndex: this.current - 1
            }
          })
            .then(data => {
              if (data.data.code === '000000') {
                this.total = data.data.data.pages;
                this.movies = data.data.data.list;
              } else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
              }
            )
        } else  if(this.navChoose === 3){
          axios.get('comment/userComment',{
            params:{
              pageSize: 12,
              pageIndex: this.current - 1
            }
          })
            .then(data => {
              this.total = data.data.data.pages || 1;
              if (data.data.code === '000000') {
                this.total = data.data.data.pages;
                this.comments = data.data.data.list;
              } else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
              }
            )
        }
      },

      getMovieInfo: function (id) {
        this.$router.push({name:'MovieInfo',params:{id:id}})
      },

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

      beforeEnter(el) {
        el.style.height = 0;
      },
      enter(el) {
        el.style.height = el.scrollHeight + 'px';
      },
      beforeLeave(el) {
        el.style.height = 0;
      },

      changeUserInfo(){
        var name = document.getElementById("nickname_text").value.toString().trim()
        var age = document.getElementById("age_text").value
        var one = document.getElementById("defaultInline1").checked
        var two = document.getElementById("defaultInline2").checked
        var three = document.getElementById("defaultInline3").checked
        var sign = document.getElementById("sign_text").value.toString().trim()

        if (name.length === 0 && age.toString().length === 0 && !(one || two ) && sign.length === 0) {
          this.$options.methods.showModal.bind(this)(false,"请输入需要修改的内容")
          return
        }

        axios.post('/user/update', {
          id : this.user.id,
          name: name.length === 0 ? null : name,
          age: age.toString().length === 0 ? null : age,
          sex: one ? '男' : two ? '女' : null,
          sign: sign.length === 0 ? null:sign
        })
          .then((response)=>{
            if (response.data.code === '000000'){
              this.$options.methods.showModal.bind(this)(true,'修改成功')
              this.$options.methods.getUserInfo.bind(this)()
              this.$store.commit('login',this.user)
              this.collapse2 = false
            }
            else{
              this.$options.methods.showModal.bind(this)(false,response.data.message)
            }
          })
          .catch(function (error) {
            this.$options.methods.showModal.bind(this)(false,error)
          });
      },

      updateImg(){
        let file = document.getElementById("inputGroupFile01").files[0]
        var fd = new FormData()
        fd.append('file',file)
        axios.post('/user/img', fd,{headers:{'content-type':'multipart/form-data'}})
          .then((response)=>{
            if (response.data.code === '000000'){
              this.$options.methods.showModal.bind(this)(true,'上传成功')
              this.$options.methods.getUserInfo.bind(this)()
              this.collapse1 = false
            }
            else{
              this.$options.methods.showModal.bind(this)(false,response.data.message)
            }
          })
          .catch(function (error) {
            this.$options.methods.showModal.bind(this)(false,error)
          });
      },

      getFollow(index){
        axios.get('follow/all',{
          params:{
            pageIndex:index,
            pageSize:5
          }
        })
          .then(data => {
              if (data.data.code ==='000000'){
                this.follows = data.data.data.list
              } else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
            }
          )
      },

      deleteComment(index){
        axios.get('comment/delete?id='+index
        ).then(data => {
            if (data.data.code === '000000'){
              this.$options.methods.showModal.bind(this)(true,'删除成功')
              this.$options.methods.requestComments.bind(this)()
            }
            else
              this.$options.methods.showModal.bind(this)(false,data.data.message)
          }
        )
      },

      requestComments: function() {
        axios.get('comment/userComment',{
          params:{
            movieId:this.user.id,
            pageIndex:this.current-1,
            pageSize:12
          }
        })
          .then(data => {
              if (data.data.code === '000000'){
                this.comments = data.data.data.list
                this.total = data.data.data.pages
              }
              else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
            }
          )
      },

      jumpUserInfo(id) {
        console.log(id)
        this.$router.push({name:'UserInfo',params:{userId:id}})
        this.$router.go(0)
      },

      follow(){
        if (!this.isFollow) {
          axios.get('follow/add',{
            params:{
              followId: this.user.id
            }
          })
            .then(data => {
                if (data.data.code === '000000') {
                  this.isFollow = true
                } else
                  this.$options.methods.showModal.bind(this)(false,data.data.message)
              }
            )
        } else {
          axios.get('follow/cancel',{
            params:{
              followId: this.user.id
            }
          })
            .then(data => {
                if (data.data.code === '000000') {
                  this.isFollow = false
                } else
                  this.$options.methods.showModal.bind(this)(false,data.data.message)
              }
            )
        }

      }
    },
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
