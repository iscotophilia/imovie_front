<template>
  <div class="home">
    <NavHeader></NavHeader>

    <div>
      <mdb-carousel :interval="8000" showControls showIndicators>
        <mdb-carousel-item img src="http://120.79.184.27:81/front/carousel/carousel01.jpg" mask="black-light" alt="First slide">
          <mdb-carousel-caption title="机器人总动员" text=""></mdb-carousel-caption>
        </mdb-carousel-item>
        <mdb-carousel-item img src="http://120.79.184.27:81/front/carousel/carousel02.jpg" mask="black-light" alt="Second slide">
          <mdb-carousel-caption title="加勒比海盗3" text=""></mdb-carousel-caption>
        </mdb-carousel-item>
        <mdb-carousel-item img src="http://120.79.184.27:81/front/carousel/carousel03.jpg" mask="black-light" alt="Third slide">
          <mdb-carousel-caption title="阿丽塔 战斗天使" text=""></mdb-carousel-caption>
        </mdb-carousel-item>
      </mdb-carousel>
    </div>

    <div style="background-color: #eee">
      <mdb-container class="pt-5">
        <mdb-card style="border-radius: 50px">
          <mdb-card-body>
            <mdb-row class="align-items-center">
                <!-- Search form -->
                <mdb-input testimonial basic class= "p-2" placeholder="搜索电影" ariaDescribedBy="button-addon2" @keyup.native.enter="toSearch">
                  <mdb-btn outline="primary" size="md" group slot="append" id="button-addon2">
                    <mdb-icon  icon="search" />
                  </mdb-btn>
                </mdb-input>
            </mdb-row>
          </mdb-card-body>
        </mdb-card>
      </mdb-container>

      <div>
        <mdb-container>
          <mdb-card style="border-radius: 20px" class="mt-5">
            <mdb-card-body>
              <h2>电影</h2>

              <mdb-tabs :active="0" v-on:click.native="changeTabs" tabs color="light-blue" class="lighten-1 mx-0 mb-0 mt-1" :links="[
              { text: '评分'},
              { text: '热度'},
              { text: '时间'}]"
              />

              <div class="mt-4 d-flex align-items-stretch">
                <mdb-row class="clearfix">
                  <mdb-col class="mt-3" v-for="(movie,index) in movies" md="3" col="3" style="height:0;padding-bottom: 35%" v-on:click.native="getMovieInfo(movie.id)">
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
            </mdb-card-body>


            <v-pagination class="mx-auto mt-2" :total="total-1" :current-page='current' @pagechange="pagechange"></v-pagination>

          </mdb-card>

        </mdb-container>
      </div>

      <v-footer></v-footer>

    </div>


  </div>
</template>

<script>
  import Footer from '@/components/Footer'
  import Pagination from '@/components/Pagination'
  import axios from 'axios'
import NavHeader from "@/components/NavHeader";
import { mdbMask,mdbView,mdbCardGroup,mdbCardTitle,mdbCardText,mdbCardImage,mdbTabs,mdbCard,mdbCardBody,mdbContainer,mdbInput,mdbBtn,mdbIcon,mdbRow,mdbCol,mdbCarousel, mdbCarouselItem, mdbCarouselCaption } from 'mdbvue';
export default {
  name: 'home',

  components: {
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
    axios.get('movie/getMovieWithOrderBy?way=score&pageSize=12&pageIndex=0')
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
          pageSize:12,
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
