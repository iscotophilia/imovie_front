<template>
  <div id="Post">
    <NavHeader></NavHeader>

    <mdb-container>
      <mdb-row v-for="(post,index) in posts">
        <mdb-col md="12" col="12" class="pb-3 z-depth-2 mt-5">
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

              </mdb-media-body>
            </mdb-media>
          </section>

        </mdb-col>
      </mdb-row>


      <v-pagination class="mx-auto mt-5" :total="total" :current-page='current' @pagechange="pagechange"></v-pagination>


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
    name: 'Post',

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
      this.$options.methods.getPost.bind(this)()
    },
    methods: {
      pagechange:function (currentPage) {
        this.current = currentPage;
        this.$options.methods.getPost.bind(this)()
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


      getUserInfo: function (id) {
        this.$router.push({name:'UserInfo',params:{userId:id}})
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
