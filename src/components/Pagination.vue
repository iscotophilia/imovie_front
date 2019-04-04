<template>
  <div class="Pagination">
    <!--Pagination blue-->
    <mdb-pagination circle color="blue" class="align-content-center">
      <mdb-page-nav prev  :class="{'disabled': current === 1}" v-on:click.native="setCurrent(current-1)">
      </mdb-page-nav>
      <mdb-page-item  :class="{'disabled': current === 1}" v-on:click.native="setCurrent(1)">
         首页
      </mdb-page-item>
      <mdb-page-item active v-for="(p,index) in grouplist"  :active="current === p.val" v-on:click.native="setCurrent(p.val)">
        {{ p.text }}
      </mdb-page-item>
      <mdb-page-item  :class="{'disabled': current === page}" v-on:click.native="setCurrent(page)">
        尾页
      </mdb-page-item>
      <mdb-page-nav next :class="{'disabled': current === page}" v-on:click.native="setCurrent(current + 1)">
      </mdb-page-nav>
    </mdb-pagination>

  </div>

</template>

<script>
  import { mdbPagination,mdbPageNav,mdbPageItem } from 'mdbvue';
  export default {
    name: 'Pagination',

    data(){
      return{
        current: this.currentPage
      }
    },
    components: {
      mdbPagination,
      mdbPageNav,
      mdbPageItem,
    },
    props:{
      total: {// 数据总条数
        type: Number,
        default: 0
      },
      display: {// 每页显示条数
        type: Number,
        default: 10
      },
      currentPage: {// 当前页码
        type: Number,
        default: 1
      },
      pagegroup: {// 分页条数
        type: Number,
        default: 5,
        coerce: function (v) {
          v = v > 0 ? v : 5;
          return v % 2 === 1 ? v : v + 1;
        }
      }
    },
    computed: {
      page: function () { // 总页数
        return this.total
      },
      grouplist: function () { // 获取分页页码
        var len = this.page, temp = [], list = [], count = Math.floor(this.pagegroup / 2), center = this.current;
        if (len <= this.pagegroup) {
          while (len--) {
            temp.push({text: this.page - len, val: this.page - len});
          }
          ;
          return temp;
        }
        while (len--) {
          temp.push(this.page - len);
        }
        ;
        var idx = temp.indexOf(center);
        (idx < count) && ( center = center + count - idx);
        (this.current > this.page - count) && ( center = this.page - count);
        temp = temp.splice(center - count - 1, this.pagegroup);
        do {
          var t = temp.shift();
          list.push({
            text: t,
            val: t
          });
        } while (temp.length);
        if (this.page > this.pagegroup) {
          (this.current > count + 1) && list.unshift({text: '...', val: list[0].val - 1});
          (this.current < this.page - count) && list.push({text: '...', val: list[list.length - 1].val + 1});
        }
        return list;
      }
    },
    methods: {
      setCurrent: function (idx) {
        if (this.current !== idx && idx > 0 && idx < this.page + 1) {
          this.current = idx;
          this.$emit('pagechange', this.current);
        }
      }
    },
    watch: {
      currentPage(newPage) {
        this.current=newPage
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
