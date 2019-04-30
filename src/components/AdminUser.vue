<template>
  <section id="AdminUser">
    <mdb-row>
      <mdb-col md="12">
        <mdb-card cascade narrow class="mt-5">
          <mdb-view class="gradient-card-header blue darken-2">
            <h4 class="h4-responsive text-white">用户列表</h4>
          </mdb-view>
          <mdb-card-body>
            <h3 class="mt-5 text-left"><strong>Basic examples</strong></h3>
            <p>Using the most basic table markup, here’s how .table-based tables look in Bootstrap. All table styles are inherited in Bootstrap 4, meaning any nested tables will be styled in the same manner as the parent.</p>
            <mdb-tbl>
              <thead>
              <tr>
                <th>#</th>
                <th>ID</th>
                <th>昵称</th>
                <th>性别</th>
                <th>年龄</th>
                <th>签名</th>
                <th>电话</th>
                <th>权限</th>
              </tr>
              </thead><tbody>
            <tr v-for="(user,index) in users">
              <th scope="row">{{index}}</th>
              <td>{{user.id}}</td>
              <td><img class="card-img-64 d-flex mx-auto mb-3 rounded-circle" :src="user.img" alt="Generic placeholder image">
              </td>
              <td>{{user.sex}}</td>
              <td>{{user.age}}</td>
              <td>{{user.sign}}</td>
              <td>{{user.number}}</td>
              <td>{{user.status}}</td>
            </tr>
            </tbody>
            </mdb-tbl>
          </mdb-card-body>
        </mdb-card>
      </mdb-col>
    </mdb-row>
  </section>
</template>

<script>
  import { mdbRow, mdbCol, mdbCard, mdbView, mdbCardBody, mdbTbl } from 'mdbvue'

  export default {
    name: 'AdminUser',
    components: {
      mdbRow,
      mdbCol,
      mdbCard,
      mdbView,
      mdbCardBody,
      mdbTbl
    },
    data () {
      return {
        users: []
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
