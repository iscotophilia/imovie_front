<template>
  <section id="AdminUser">
    <mdb-row>
      <mdb-col md="12">
        <mdb-card cascade narrow class="mt-5">
          <mdb-view class="gradient-card-header blue darken-2">
            <h4 class="h4-responsive text-white">用户列表</h4>

            <!-- Search form -->
            <mdb-input id="search_text" testimonial basic class= "p-2" placeholder="根据昵称搜索用户" ariaDescribedBy="button-addon2" @keyup.native.enter="toSearch">
              <mdb-btn outline="primary" size="md" group slot="append" id="button-addon2" v-on:click.native="toSearch">
                <mdb-icon  icon="search" />
              </mdb-btn>
            </mdb-input>

          </mdb-view>
          <mdb-card-body>
            <mdb-tbl bordered  btn responsive striped id="tbl">
              <mdb-tbl-head>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>头像</th>
                <th>昵称</th>
                <th>性别</th>
                <th>年龄</th>
                <th>签名</th>
                <th>电话</th>
                <th>权限</th>
                <th>保存</th>
              </tr>
              </mdb-tbl-head><mdb-tbl-body>
            <tr v-for="(user,index) in users">
              <td scope="row">{{index}}</td>
              <td>{{user.id}}</td>
              <td><img class="card-img-64 d-flex mx-auto mb-3 rounded-circle" :src="user.img" alt="Generic placeholder image">
              </td>
              <td>{{user.name}}</td>
              <td>{{user.sex}}</td>
              <td>{{user.age}}</td>
              <td style="text-overflow: ellipsis;">{{user.sign}}</td>
              <td>{{user.number}}</td>
              <td><input type="number" :value="user.status" /></td>
              <td><mdb-btn color="primary" v-on:click="update(user.id,index)">修改</mdb-btn></td>
            </tr>
            </mdb-tbl-body>
            </mdb-tbl>

            <v-pagination class="mx-auto mt-2" :total="total" :current-page='current' @pagechange="pagechange"></v-pagination>
          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>

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
  import axios from 'axios'
  import Pagination from '@/components/Pagination'
  import { mdbModal,mdbModalHeader,mdbModalTitle,mdbModalFooter,mdbModalBody,mdbInput,mdbIcon,mdbTblHead, mdbTblBody,mdbRow, mdbCol, mdbCard, mdbView, mdbCardBody, mdbTbl,mdbBtn } from 'mdbvue'

  export default {
    name: 'AdminUser',
    components: {
      mdbRow,
      mdbCol,
      mdbCard,
      mdbView,
      mdbCardBody,
      mdbTbl,
      mdbBtn,
      mdbTblHead,
      mdbTblBody,
      mdbInput,
      mdbIcon,
      'v-pagination': Pagination,
      mdbModal,mdbModalHeader,mdbModalTitle,mdbModalFooter,mdbModalBody,
    },
    data () {
      return {
        users: [],
        total:10,
        current:1,
        optionsShow:false,
        options:{
          title:'',
          text:'',
          error:false
        },
      }
    },
    created() {
      this.$options.methods.load.bind(this)()
    },
    methods:{
      pagechange:function (currentPage) {
        this.current = currentPage;
        this.$options.methods.load.bind(this)();
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

      update(id,index){
        var status = document.getElementById("tbl").children[0].rows[index+1].cells[8].children[0].value
        axios.post('/user/update', {
          id: id,
          status:status,
        }).then((response)=>{
            if (response.data.code === '000000'){
              this.$options.methods.load.bind(this)()
              this.$options.methods.showModal.bind(this)(true,'修改成功')
            }
            else{

            }
          })
          .catch(function (error) {
            console.log(error)
          });
      },

      load(){
        axios.get('user/getAllUser',{
          params: {
            pageIndex:this.current-1,
            pageSize:12,
          }
        }).then(data => {
            if (data.data.code ==='000000'){
              this.total = data.data.data.pages
              this.users = data.data.data.list
            } else
              this.$options.methods.showModal.bind(this)(false,data.data.message)
          }
        )
      },

      toSearch(){
        var name = document.getElementById('search_text').value.toString().trim()
        axios.get('user/getLikeUser',{
            params: {
              pageIndex:this.current-1,
              pageSize:12,
              like:name
            }
          }
        ).then(data => {
            if (data.data.code ==='000000'){
              this.total = data.data.data.pages
              this.current = 1
              this.users = data.data.data.list
            } else
              this.$options.methods.showModal.bind(this)(false,data.data.message)
          }
        )
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .card.card-cascade .view.gradient-card-header {
    padding: 1rem 1rem;
    text-align: center;
  }
  .card.card-cascade h3,
  .card.card-cascade h4 {
    margin-bottom: 0;
  }
</style>
