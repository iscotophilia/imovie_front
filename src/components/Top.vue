<template>
  <div class="home">
    <NavHeader></NavHeader>

    <mdb-card class="z-depth-2">
      <mdb-view src="http://120.79.184.27:81/front/top.jpg" alt="Sample image">
        <mdb-mask pattern="1" />
      </mdb-view>
    </mdb-card>

    <mdb-container>

      <div>

        <mdb-card class="z-depth-1 mt-3" v-for="(movie,index) in movies">

          <a v-on:click="getMovieInfo(movie.id)">
          <mdb-row>
            <mdb-col md="3" class="mt-3 ml-3 mb-3">
              <mdb-view>
                <mdb-card-image :src="movie.img" alt="Card image cap" block style="width:80%;height:80%"></mdb-card-image>
                <mdb-mask flex-center waves overlay="white-slight"></mdb-mask>
              </mdb-view>
            </mdb-col>

            <mdb-col md="7" class="mt-3">
              <div><mdb-badge pill color="orange" class="float-left" style="font-size: 20px">Top {{(index +1) + (current-1)*25}}</mdb-badge></div>

              <mdb-row class="pt-4 mx-auto" center>
                <h2>{{movie.cnName}}</h2><h5 class="pt-2"> &nbsp;&nbsp;&nbsp; ( {{movie.enName}} ) &nbsp;&nbsp;&nbsp; </h5>
              </mdb-row>

              <p><mdb-badge pill color="pink" style="font-size: 15px" >上映日期：{{movie.showTime}}</mdb-badge></p>
              <p><mdb-badge pill color="light-blue" style="font-size: 15px">地区：{{movie.area}}</mdb-badge></p>
              <p><mdb-badge pill color="orange" style="font-size: 15px">时长：{{movie.time}}分钟</mdb-badge></p>
              <p><mdb-badge pill color="indigo" style="font-size: 15px">评分：{{movie.score}}</mdb-badge></p>
              <p><mdb-badge pill color="purple" style="font-size: 15px">热度：{{movie.hot}}</mdb-badge></p>
            </mdb-col>
          </mdb-row>
          </a>
        </mdb-card>

        <mdb-card class="z-depth-1 mt-4">
          <v-pagination class="mx-auto mt-2" :total="total" :current-page='current' @pagechange="pagechange"></v-pagination>
        </mdb-card>

      </div>

    </mdb-container>



    <div style="background-color: #eee">

      <v-footer></v-footer>

    </div>


  </div>
</template>

<script>
  import Footer from '@/components/Footer'
  import Pagination from '@/components/Pagination'
  import axios from 'axios'
  import NavHeader from "@/components/NavHeader";
  import { mdbBadge, mdbMask,mdbView,mdbCardGroup,mdbCardTitle,mdbCardText,mdbCardImage,mdbTabs,mdbCard,mdbCardBody,mdbContainer,mdbInput,mdbBtn,mdbIcon,mdbRow,mdbCol,mdbCarousel, mdbCarouselItem, mdbCarouselCaption } from 'mdbvue';
  import CardPage from "mdbvue/src/docs/CardPage";
  export default {
    name: 'home',

    components: {
      mdbBadge,
      CardPage,
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
        movies:[],
        total:10,
        current:1,
        orderWay:'score',
        kw:'',
      }
    },
    created() {
      axios.get('movie/getMovieWithOrderBy?way=score&pageSize=25&pageIndex=0')
        .then(data => {
            this.total = data.data.data.pages;
            this.movies = data.data.data.list;
          }
        )
    },
    methods: {
      pagechange:function (currentPage) {
        this.current = currentPage;
        this.$options.methods.requestMovies.bind(this)();
      },

      changeTabs: function (event) {
        if (event) {
          var select = event.target.text.trim();
          if ( select=== '评分')
            this.orderWay = 'score';
          else if (select === '热度')
            this.orderWay = 'hot';
          else
            this.orderWay = 'show_time';
          this.current=1;
          this.$options.methods.requestMovies.bind(this)();
        }
      },

      requestMovies: function() {
        axios.get('movie/getMovieWithOrderBy',{
          params: {
            way:this.orderWay,
            pageIndex:this.current-1,
            pageSize:25,
          }
        }).then(data => {
            if (data.data.code === '000000')
              this.movies = data.data.data.list;
            else
              alert(data.data.message)
          }
        )
      },

      search: function() {
        axios.get('movie/search',{
          params: {
            pageIndex:0,
            pageSize:12,
            kw:this.kw
          }
        }).then(data => {
            if (data.data.code === '000000')
              this.movies = data.data.data.list;
            else
              alert(data.data.message)
          }
        )
      },
      toSearch: function (event) {
        this.$router.push({name:'Search',params:{name:event.target.value}})
      },

      getMovieInfo: function (id) {
        this.$router.push({name:'MovieInfo',params:{id:id}})
      }

    }
  }
</script>

<style scoped>

</style>
