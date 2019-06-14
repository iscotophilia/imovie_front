<template>
  <section id="AdminComment" style="background-color: #eee">

    <mdb-container>

      <div>
        <mdb-card style="border-radius: 20px" class="mt-5">
          <mdb-card-body>
            <div class="mt-4">

              <section class="demo-section">
                <section v-for="(comment,index) in comments" key="index">
                  <mdb-media class="d-block d-md-flex mt-4 pb-2">
                    <a v-on:click="getUserInfo(comment.userId)"><img class="card-img-64 d-flex mx-auto mb-3 rounded-circle" :src="comment.img" alt="Generic placeholder image"></a>
                    <mdb-media-body class="text-center text-md-left ml-md-3 ml-0 text-monospace font-weight-bolder">
                      <h5 class="font-weight-bold mt-0">
                        <a v-on:click="getUserInfo(comment.userId)" style="color: blue">{{comment.name}}</a>
                      </h5>
                      <p>{{comment.createTime}}</p>
                      {{comment.comment}}


                      <a v-on:click="deleteComment(comment.id)" class="float-right"><mdb-icon far icon="trash-alt" />删除</a>

                      <h6 class="float-right mr-4 mt-1 mb-2"><b>被举报数：</b>{{comment.reportNum}}</h6>

                      <a v-on:click="getReport(comment.id)" class="float-right"><mdb-icon  icon="caret-down" class=" indigo-text mr-4" size="2x" /></a>

                      <mdb-media class="d-block d-md-flex mt-4" v-for="(report,index) in reports" key="index" v-if="showSubComment === comment.id">
                        <mdb-media-body class="text-center text-md-left ml-md-3 ml-0">
                          {{report.reason}}

                          <hr/>
                        </mdb-media-body>

                      </mdb-media>
                      <hr/>
                    </mdb-media-body>
                  </mdb-media>
                </section>
              </section>

            </div>
          </mdb-card-body>

          <v-pagination class="mx-auto mt-2" :total="total" :current-page='current' @pagechange="pagechange"></v-pagination>

        </mdb-card>
      </div>

    </mdb-container>


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
  </section>
</template>

<script>
  import Footer from '@/components/Footer'
  import Pagination from '@/components/Pagination'
  import axios from 'axios'
  import NavHeader from "@/components/NavHeader";
  import { mdbBadge,mdbModal,mdbModalHeader,mdbModalTitle,mdbModalFooter,mdbModalBody,mdbMedia,mdbMediaImage,mdbMediaBody,mdbMask,mdbView,mdbCardGroup,mdbCardTitle,mdbCardText,mdbCardImage,mdbTabs,mdbCard,mdbCardBody,mdbContainer,mdbInput,mdbBtn,mdbIcon,mdbRow,mdbCol,mdbCarousel, mdbCarouselItem, mdbCarouselCaption } from 'mdbvue';
  export default {
    name: 'AdminComment',

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
        reports:[],

        optionsShow:false,
        options:{
          title:'',
          text:'',
          error:false
        },

        showSubComment:-1,
      }
    },
    created() {
      this.$options.methods.requestComments.bind(this)()
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
        axios.get('report/comment',{
          params:{
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

      getReport(index){
        if (this.showSubComment !== index){
          this.reports = []
          this.showSubComment = index
        } else{
          this.showSubComment=-1
        }
        console.log(this.showSubComment)
        console.log(index)
        axios.get('report/commentReport', {
          params: {
            id: index
          }
        }).then(data => {
            if (data.data.code === '000000'){
              this.reports = data.data.data;
            }

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

      getMovieInfo: function (id) {
        this.$router.push({name:'MovieInfo',params:{id:id}})
      },

    }
  }
</script>

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
