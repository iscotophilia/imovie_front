<template>
  <div class="MovieInfo" style="background-color: #eee">
    <NavHeader></NavHeader>

    <mdb-container>
      <div style="background-color: #eee">
          <mdb-card style="border-radius: 20px" class="mt-3">
            <mdb-card-body >
              <mdb-row class="align-items-center">
                <mdb-media-image :src="movie.img" class="d-flex ml-4 mt-3" alt="Generic placeholder image" />
                <mdb-media-body>
                  <mdb-row class="pt-4 mx-auto" center>
                    <h2>{{movie.cnName}}</h2><h5 class="pt-2"> &nbsp;&nbsp;&nbsp; ( {{movie.enName}} ) &nbsp;&nbsp;&nbsp; </h5>
                  </mdb-row>

                  <p><mdb-badge pill color="pink" style="font-size: 15px" >上映日期：{{movie.showTime}}</mdb-badge></p>
                  <p><mdb-badge pill color="light-blue" style="font-size: 15px">地区：{{movie.area}}</mdb-badge></p>
                  <p><mdb-badge pill color="orange" style="font-size: 15px">时长：{{movie.time}}分钟</mdb-badge></p>
                  <p><mdb-badge pill color="indigo" style="font-size: 15px">评分：{{movie.score}}</mdb-badge></p>
                  <p><mdb-badge pill color="purple" style="font-size: 15px">热度：{{movie.hot}}</mdb-badge></p>
                  <mdb-btn :color="this.movie.isSeen ? 'warning':'secondary'" v-on:click.native="seen" v-text="this.movie.isSeen ? '已看过':'未看过'"></mdb-btn>
                  <mdb-btn :color="this.movie.isSave ? 'success':'info'" v-on:click.native="save" v-text="this.movie.isSave ? '已收藏':'收藏'"></mdb-btn>
                </mdb-media-body>
              </mdb-row>
            </mdb-card-body>
          </mdb-card>
      </div>

      <div style="background-color: #eee">
        <mdb-row>
          <mdb-col md="6" sm="12" xs="12" class="mt-3">
            <mdb-card class="p-3" style="border-radius: 20px">
              <mdb-badge pill color="green"><h5>简介</h5></mdb-badge>
              <hr/>

              <mdb-card-text  class="text-justify font-weight-bolder text-monospace" style=" -webkit-line-clamp: 10;overflow: hidden;display: -webkit-box;-webkit-box-orient: vertical;white-space: normal;">
                &nbsp;&nbsp;&nbsp;&nbsp; {{movie.description}}
              </mdb-card-text>
            </mdb-card>
          </mdb-col>

          <mdb-col md="6" sm="12" xs="12" class="mt-3">
            <mdb-card style="border-radius: 20px" class="p-3">
              <mdb-badge pill color="orange"><h5>预告片</h5></mdb-badge>
              <hr/>
              <video :src="movie.videoUrl" controls="controls">
                <p>抱歉，该视频暂时找不到预告片</p>
              </video>
            </mdb-card>
          </mdb-col>
        </mdb-row>

      </div>

      <div>
        <mdb-card style="border-radius: 20px" class="mt-5">
          <mdb-card-body>
            <mdb-tabs :active="0" v-on:click.native="changeTabs" tabs color="light-blue" class="lighten-1 mx-0 mb-0 mt-1" :links="[
              { text: '评论'},
              { text: '帖子'}]"
            />

            <div class="mt-4" v-if="showOne">
              <div class="input-group">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon">
                     <i class="fas fa-pencil-alt prefix"></i>
                   </span>
                </div>
                <textarea id="comment_text" class="form-control" rows="5"></textarea>
              </div>

              <div>
                <mdb-btn color="success" class="float-right" v-on:click.native="sendComment">发表</mdb-btn>
              </div>
              <br/>
              <br/>

              <div>
                <hr class="mt-3"/>
              </div>


              <section class="demo-section">
                <section v-for="(comment,index) in comments">
                  <mdb-media class="d-block d-md-flex mt-4 pb-2">
                    <a v-on:click="getUserInfo(comment.userId)"><img class="card-img-64 d-flex mx-auto mb-3 rounded-circle" :src="comment.img" alt="Generic placeholder image"></a>
                    <mdb-media-body class="text-center text-md-left ml-md-3 ml-0 text-monospace font-weight-bolder">
                      <h5 class="font-weight-bold mt-0">
                        <a v-on:click="getUserInfo(comment.userId)" style="color: blue">{{comment.name}}</a>
                        <a v-on:click="showResponseTextarea = showResponseTextarea === comment.id ? -1 : comment.id  " class="pull-right" style="color: blue">
                          <mdb-icon icon="reply" />
                        </a>
                      </h5>
                      <p>{{comment.createTime}}</p>
                      {{comment.comment}}


                      <a v-on:click="deleteComment(comment.id)" v-if="$store.state.user ? comment.userId === $store.state.user.id : false" class="float-right"><mdb-icon far icon="trash-alt" />删除</a>

                      <h6 class="float-right mt-1 mr-2">回复数：{{comment.subNum}}</h6>

                      <a v-on:click="getSubComment(comment.id)" class="float-right"><mdb-icon  icon="caret-down" class=" indigo-text mr-4" size="2x" /></a>


                      <a v-on:click="love(comment)">
                        <mdb-icon :far="$store.state.user ? (comment.userId === $store.state.user.id && !comment.isLove) : true" icon="heart" class="red-text float-right mr-4" size="2x" ></mdb-icon>
                      </a>
                      <h4 class="float-right mr-2 mt-1">{{comment.loveNum}}</h4>

                      <div  v-if="showResponseTextarea === comment.id">
                        <div class="input-group">
                          <div class="input-group-prepend">
                          <span class="input-group-text">
                            <i class="fas fa-pencil-alt prefix"></i>
                          </span>
                          </div>
                          <textarea id="response_comment_text" class="form-control" rows="5"></textarea>
                        </div>
                        <div>
                          <mdb-btn color="success" class="float-right" v-on:click.native="sendSubComment(comment.id,false,'')">回复</mdb-btn>
                        </div>
                      </div>

                      <mdb-media class="d-block d-md-flex mt-4" v-for="(subComment,index) in subComments" v-if="showSubComment === comment.id">
                        <a v-on:click="getUserInfo(subComment.userId)"><img class="card-img-64 d-flex mx-auto mb-3 rounded-circle" :src="subComment.img" alt="Generic placeholder image"></a>
                        <mdb-media-body class="text-center text-md-left ml-md-3 ml-0">
                          <h5 class="font-weight-bold mt-0">
                            <a v-on:click="getUserInfo(comment.userId)" style="color: blue">{{subComment.name}}</a>
                            <a v-on:click="showResponseTextarea = showResponseTextarea === subComment.id ? -1 : subComment.id  " class="pull-right" style="color: blue">
                              <mdb-icon icon="reply" />
                            </a>
                          </h5>
                          {{subComment.comment}}

                          <a v-on:click="deleteComment(subComment.id)" v-if="$store.state.user ? comment.userId === $store.state.user.id : false" class="float-right ml-2"><mdb-icon far icon="trash-alt" />删除</a>

                          <a v-on:click="love(subComment)"><mdb-icon :far="$store.state.user ? (subComment.userId === $store.state.user.id && !subComment.isLove) : true" icon="heart" class="red-text float-right mr-4" size="2x" ></mdb-icon></a>
                          <h4 class="float-right mr-2 mt-1">{{subComment.loveNum}}</h4>

                          <div  v-if="showResponseTextarea === subComment.id">
                            <div class="input-group">
                              <div class="input-group-prepend">
                          <span class="input-group-text">
                            <i class="fas fa-pencil-alt prefix"></i>
                          </span>
                              </div>
                              <textarea id="response_sub_comment_text" class="form-control" rows="5"></textarea>
                            </div>
                            <div>
                              <mdb-btn color="success" class="float-right" v-on:click.native="sendSubComment(comment.id,true,subComment.name)">回复</mdb-btn>
                            </div>
                          </div>
                          <hr/>
                        </mdb-media-body>

                      </mdb-media>
                      <hr/>
                    </mdb-media-body>
                  </mdb-media>
                </section>
              </section>

            </div>

            <div class="mt-4 d-flex align-items-stretch" v-if="!showOne">
              <mdb-row>
                <mdb-col md="12" col="12">
                  <div class="input-group">
                    <div class="input-group-prepend">
                  <span class="input-group-text">
                     <i class="fas fa-pencil-alt prefix"></i>
                   </span>
                    </div>
                    <textarea id="post_text" class="form-control" rows="5"></textarea>
                  </div>
                </mdb-col>
                <mdb-col md="12" col="12">
                  <div class="upload_warp_left" @click="fileClick" >
                    <button class="btn btn-success" ><mdb-icon style="font-size: 20px"  icon="plus-square" class="green-text pr-3"/>上传图片</button>
                  </div>
                </mdb-col>
                <mdb-col md="12" col="12" class="mt-3">
                  <div id="app" >
                    <div class="hello" >
                      <div class="upload">

                        <div >
                          选中{{imgList.length}}张文件，共{{bytesToSize(this.size)}}; 最多上传<span class="text-primary"> 6</span> 张图片！
                        </div>
                        <div class="upload_warp" style="border: 1px solid white;">
                          <div class="upload_warp_img" v-show="imgList.length!==0" >
                            <div class="upload_warp_img_div" v-for="(item,index) of imgList" >
                              <div class="upload_warp_img_div_top" >
                                <div class="upload_warp_img_div_text" >
                                  {{item.file.name}}
                                </div>
                                <button type="button" class="close" aria-label="Close" @click="fileDel(index)">
                                  <span aria-hidden="true">×</span>
                                </button>
                              </div>
                              <img :src="item.file.src">
                            </div>
                          </div>
                        </div>

                        <input @change="fileChange($event)" type="file" id="upload_file" multiple style="display: none"/>

                      </div>
                    </div>
                  </div>
                </mdb-col>

                <mdb-col md="12" col="12" class="float-right">
                  <div>
                    <mdb-btn color="success" class="float-right" v-on:click.native="sendPost">发表</mdb-btn>
                  </div>
                </mdb-col>

                <mdb-col md="12" col="12">

                  <mdb-row v-for="(post,index) in posts">
                    <mdb-col md="12" col="12">
                      <section>
                        <mdb-media class="d-block d-md-flex mt-4 pb-2">
                          <a v-on:click="getUserInfo(post.userId)"><img class="card-img-64 d-flex mx-auto mb-3 rounded-circle" :src="post.img" alt="Generic placeholder image"></a>
                          <mdb-media-body class="text-center text-md-left ml-md-3 ml-0 text-monospace font-weight-bolder">
                            <h5 class="font-weight-bold mt-0">
                              <a v-on:click="getUserInfo(post.userId)" style="color: blue">{{post.userName}}</a>
                              <a v-on:click="getMovieInfo(post.movieId)" style="color: green"> #{{post.movieName}}</a>
                            </h5>
                            <p>{{post.createTime}}</p>
                            {{post.text}}

                            <a v-on:click="deleteComment(post.id)" v-if="$store.state.user ? post.userId === $store.state.user.id : false" class="float-right"><mdb-icon far icon="trash-alt" />删除</a>

                            <mdb-row>
                              <mdb-col v-for="(img,index) in post.imgs" md="3" col="3">
                                <img :src="img" class="img-thumbnail">
                              </mdb-col>
                            </mdb-row>

                            <hr/>
                          </mdb-media-body>
                        </mdb-media>
                      </section>

                    </mdb-col>
                  </mdb-row>

                </mdb-col>


              </mdb-row>


            </div>
          </mdb-card-body>

          <v-pagination class="mx-auto mt-2" :total="total" :current-page='current' @pagechange="pagechange"></v-pagination>

        </mdb-card>
      </div>

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
  import { mdbBadge,mdbModal,mdbModalHeader,mdbModalTitle,mdbModalFooter,mdbModalBody,mdbMedia,mdbMediaImage,mdbMediaBody,mdbMask,mdbView,mdbCardGroup,mdbCardTitle,mdbCardText,mdbCardImage,mdbTabs,mdbCard,mdbCardBody,mdbContainer,mdbInput,mdbBtn,mdbIcon,mdbRow,mdbCol,mdbCarousel, mdbCarouselItem, mdbCarouselCaption } from 'mdbvue';
  export default {
    name: 'MovieInfo',

    components: {
      mdbBadge,
      mdbModal,mdbModalHeader,mdbModalTitle,mdbModalFooter,mdbModalBody,
      mdbMedia,
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
      mdbMediaImage,mdbMediaBody,
      'v-pagination': Pagination,
      'v-footer':Footer,
      mdbCard,mdbCardBody,mdbCardGroup,mdbCardTitle,mdbCardText,mdbCardImage
    },
    data(){
      return{
        total:10,
        current:1,
        showOne:true,
        comments:[],
        subComments:[],
        posts:[],

        optionsShow:false,
        options:{
          title:'',
          text:'',
          error:false
        },

        showResponseTextarea:-1,
        showSubComment:-1,

        movie:{
          id:this.$route.params.id || null,
          cnName:'',
          enName:'',
          img:'',
          time:'',
          showTime:'',
          score:0,
          hot:0,
          videoUrl:'',
          description:'',
          area:'',
          isSave:false,
          isSeen:false,
        },

        imgList: [],
        size: 0
      }
    },
    created() {
      if (this.movie.id!=null){
        axios.get('movie/get?movieId='+this.movie.id)
          .then(data => {
              if (data.data.code === '000000')
                this.movie = data.data.data;
              else
                alert(data.data.message)
            }
          )
        this.$options.methods.requestComments.bind(this)()
      }
    },
    methods: {
      pagechange:function (currentPage) {
        this.current = currentPage;
        if (this.showOne)
          this.$options.methods.requestComments.bind(this)()
        else
          this.$options.methods.getPost.bind(this)()
      },

      requestComments: function() {
        axios.get('comment/movieComment',{
          params:{
            movieId:this.movie.id,
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

      changeTabs: function (event) {
        if (event) {
          var select = event.target.text.toString().trim();
          if ( select=== '评论'){
            this.showOne=true
            this.current = 1
            this.$options.methods.requestComments.bind(this)()
          } else{
            this.showOne=false
            this.current = 1
            axios.get('post/moviePost',{
              params:{
                movieId:this.movie.id,
                pageIndex:this.current-1,
                pageSize:12
              }
            })
              .then(data => {
                  if (data.data.code === '000000'){
                    this.total = data.data.data.pages
                    this.posts = data.data.data.list
                  }
                  else
                    alert(data.data.message)
                }
              )
          }
        }
      },

      seen: function () {
        if (this.movie.isSeen){
          axios.get('seen/unSeen?movieId='+this.movie.id) .then(data => {
              if (data.data.toString() !== '401' && data.data.code === '000000'){
                this.movie.isSeen = !this.movie.isSeen
                this.$options.methods.showModal.bind(this)(true,'取消成功')
              }
            }
          )
        } else {
          axios.get('seen/seen?movieId='+this.movie.id)
            .then(data => {
              if (data.data.toString() !== '401'  && data.data.code === '000000'){
                this.movie.isSeen = !this.movie.isSeen
                this.$options.methods.showModal.bind(this)(true,'标记成功')
              }
            })
        }
      },

      save: function () {
        if (this.movie.isSave){
          axios.get('save/del?movieId='+this.movie.id).then(data => {
            console.log(data.data)
            if (data.data.toString() !== '401' && data.data.code === '000000'){
              this.movie.isSave = !this.movie.isSave
              this.$options.methods.showModal.bind(this)(true,'取消收藏成功')
            }
          })
        } else {
          axios.get('save/add?movieId='+this.movie.id).then(data => {
            if (data.data.toString() !== '401'   && data.data.code === '000000'){
              this.movie.isSave = !this.movie.isSave
              this.$options.methods.showModal.bind(this)(true,'收藏成功')
            }
          })
        }
      },

      love: function (comment) {
        if (comment.isLove) {
          axios.get('comment/unLove?commentId='+comment.id).then(data => {
            if (data.data.toString() !== '401' && data.data.code === '000000'){
              comment.isLove = !comment.isLove;
              comment.loveNum = comment.loveNum-1
            }
          })
        } else {
          axios.get('comment/love?commentId=' + comment.id).then(data => {
            if (data.data.toString() !== '401' && data.data.code === '000000') {
              comment.isLove = !comment.isLove;
              comment.loveNum = comment.loveNum+1
            }
          })
        }

      },

      sendComment(){
        var comment = document.getElementById("comment_text").value
        if (comment.length === 0){
          this.$options.methods.showModal.bind(this)(false,'评论不能为空')
          return
        }
        axios.post('comment/add',{
          movieId:this.movie.id,
          comment:comment
        })
          .then(data => {
              if (data.data.code === '000000'){
                this.$options.methods.showModal.bind(this)(true,'发表成功')
                document.getElementById("comment_text").value = ''
                this.current = 1
                this.$options.methods.requestComments.bind(this)()
              }
              else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
            }
          )
      },

      sendSubComment(parentId,isSub,name){
        var comment = ''
        if (isSub)
          comment = document.getElementById("response_sub_comment_text").value
        else
          comment = document.getElementById("response_comment_text").value
        if (comment.length === 0){
          this.$options.methods.showModal.bind(this)(false,'评论不能为空')
          return
        }
        if(isSub)
          comment = '@'+name+'  '+comment
        axios.post('comment/add',{
          movieId:this.movie.id,
          parentId:parentId,
          comment:comment
        })
          .then(data => {
              if (data.data.code === '000000'){
                this.$options.methods.showModal.bind(this)(true,'发表成功')
                this.showResponseTextarea = -1
                this.$options.methods.getSubComment.bind(this)(parentId)
                this.showSubComment = parentId
                if (isSub)
                  document.getElementById("response_sub_comment_text").value=''
                else
                  document.getElementById("response_comment_text").value=''
              }
              else
                this.$options.methods.showModal.bind(this)(false,data.data.message)
            }
          )
      },

      sendPost(){
        var text = document.getElementById("post_text").value.toString().trim()
        if (text.length ===0 && this.imgList.length === 0){
          this.$options.methods.showModal.bind(this)(false,'必须提供文本或者图片')
          return
        }
        var fd = new FormData()
        for (var i=0;i<this.imgList.length;i++){
          fd.append('files',this.imgList[i].file)
        }
        fd.append('movieId',this.movie.id)
        fd.append('text',text)
        fd.append('tag',new Date().toString())
        axios.post('/post/add', fd,{headers:{'content-type':'multipart/form-data'}})
          .then((response)=>{
            if (response.data.code === '000000'){
              this.$options.methods.showModal.bind(this)(true,'上传成功')
              this.imgList = []
              this.size = 0
              document.getElementById("post_text").value = ''
              this.$options.methods.getPost.bind(this)()
            }
            else{
              this.$options.methods.showModal.bind(this)(false,response.data.message)
            }
          })
          .catch(function (error) {
            this.$options.methods.showModal.bind(this)(false,error)
          });
      },

      getPost(){
        axios.get('post/moviePost',{
          params:{
            movieId:this.movie.id,
            pageIndex:this.current-1,
            pageSize:12
          }
        })
          .then(data => {
              if (data.data.code === '000000'){
                this.total = data.data.data.pages
                this.posts = data.data.data.list
              }
              else
                alert(data.data.message)
            }
          )
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

      getSubComment(index){
        if (this.showSubComment !== index){
          this.subComments = []
          this.showSubComment = index
        } else{
          this.showSubComment=-1
        }
        console.log(this.showSubComment)
        console.log(index)
        axios.get('comment/subComment', {
          params: {
            movieId: this.movie.id,
            pageIndex: 0,
            pageSize: 50,
            parentId: index
          }
        }).then(data => {
              if (data.data.code === '000000')
                this.subComments = data.data.data.list;
              else
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

      getUserInfo: function (id) {
        this.$router.push({name:'UserInfo',params:{userId:id}})
      },

      fileClick(){
        document.getElementById('upload_file').click()
      },
      fileChange(el){
        if (!el.target.files[0].size) return;
        this.fileList(el.target.files);
        el.target.value = ''
      },
      fileList(files){
        for (let i = 0; i < files.length; i++) {
          this.fileAdd(files[i]);
        }
      },
      fileAdd(file){
        this.size = this.size + file.size;//总大小
        let reader = new FileReader();
        reader.vue = this;
        reader.readAsDataURL(file);
        reader.onload = function () {
          file.src = this.result;
          this.vue.imgList.push({
            file
          });
        }
      },
      fileDel(index){
        this.size = this.size - this.imgList[index].file.size;//总大小
        this.imgList.splice(index, 1);
      },
      bytesToSize(bytes){
        if (bytes === 0) return '0 B';
        let k = 1000, // or 1024
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
        return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
      },
      dragenter(el){
        el.stopPropagation();
        el.preventDefault();
      },
      dragover(el){
        el.stopPropagation();
        el.preventDefault();
      },
      drop(el){
        el.stopPropagation();
        el.preventDefault();
        this.fileList(el.dataTransfer.files);
      },

      getMovieInfo: function (id) {
        this.$router.push({name:'MovieInfo',params:{id:id}})
      },

    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  .upload_warp_img_div_del {
    position: absolute;
    top: 6px;
    width: 16px;
    right: 4px;
  }

  .upload_warp_img_div_top {
    position: absolute;
    top: 0;
    width: 100%;
    height: 30px;
    background-color: rgba(0, 0, 0, 0.4);
    line-height: 30px;
    text-align: left;
    color: #fff;
    font-size: 12px;
    text-indent: 4px;
  }

  .upload_warp_img_div_text {
    white-space: nowrap;
    width: 80%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .upload_warp_img_div img {
    max-width: 100%;
    max-height: 100%;
    vertical-align: middle;
  }

  .upload_warp_img_div {
    position: relative;
    height: 100px;
    width: 120px;
    border: 1px solid #ccc;
    margin: 0px 5px 5px 0px;
    float: left;
    line-height: 100px;
    display: table-cell;
    text-align: center;
    background-color: #eee;
    cursor: pointer;
  }

  .upload_warp_img {
    border-top: 1px solid #D2D2D2;
    padding: 5px 0 0 5px;
    overflow: hidden
  }

  .upload_warp_text {
    text-align: left;
    margin-bottom: 5px;
    padding-top: 5px;
    text-indent: 14px;
    border-top: 1px solid #ccc;
    font-size: 14px;
  }

  .upload_warp_right {
    float: left;
    width: 57%;
    margin-left: 2%;
    height: 100%;
    border: 1px dashed #999;
    border-radius: 4px;
    line-height: 130px;
    color: #999;
  }

  .upload_warp_left button {

    margin: 8px 5px 0px 5px;
    cursor:pointer;


  }

  .upload_warp_left {
    float: left;

  }

  .upload_warp {
    margin: 5px;

  }

  .upload {
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
    background-color: #fff;
    width: 100%;
    box-shadow: 0px 1px 0px #ccc;
    border-radius: 4px;
  }

  .hello {
    width: 100%;
    text-align: center;
  }

</style>
