<template>
  <div class="Footer">
      <!-- Footer -->
      <mdb-footer color="black" class="font-small pt-3 mt-3">
        <mdb-container class="text-left">
          <mdb-row>
            <mdb-col sm="6">
              <img src="../assets/imovie_logo.png" height="30" alt="">
              <p>欢迎使用IMovie，这里有好玩的电影资讯</p>
            </mdb-col>
            <mdb-col sm="6">
              <h5 class="title">Links</h5>
              <ul>
                <li class="list-unstyled"><a href="#!">关于我们</a></li>
                <li class="list-unstyled"><a href="#!">联系我们</a></li>
              </ul>
            </mdb-col>
          </mdb-row>
        </mdb-container>
        <div class="footer-copyright text-center py-3">
          <mdb-container fluid>
            &copy; 2018 Copyright: <a href="https://www.MDBootstrap.com"> MDBootstrap.com </a>
          </mdb-container>
        </div>
      </mdb-footer>
    </div>

</template>

<script>
  import { mdbFooter,mdbContainer,mdbRow,mdbCol } from 'mdbvue';
  export default {
    name: 'home',

    components: {
      mdbFooter,
      mdbRow,
      mdbCol,
      mdbContainer
    },
  }

</script>

<style scoped>

</style>
