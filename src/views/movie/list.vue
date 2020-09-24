<template>
  <div class="app-container">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="50" />
      <el-table-column property="title" label="电影名称" width="120" />
      <el-table-column property="stars" label="主演" width="100" />
      <el-table-column property="score" label="评分" width="50" />
      <el-table-column property="p.name" label="上映城市" width="100" />
      <el-table-column property="imgurl" label="图片" width="240">
        <template slot-scope="scope">
          <img :src="scope.row.imgurl" min-width="70" height="70">
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row._id)">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :page-size="pagesize"
      :current-page="currentPage"
      :total="total"
      @current-change="changePage"
    />
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'MovieList',
  components: {},
  filters: {},
  data() {
    return {
      currentPage: 1,
      pagesize: 3,
      total: 0,
      tableData: []
    }
  },
  created() {
    this.getMovieList()
  },
  methods: {
    // getCityList() {
    //   axios.get('/getCityList').then(res => {
    //     if(res.data.code === 20000){
    //       this.tableData = res.data.list
    //     }
    //   })
    // },
    getMovieList() {
      axios.get(`/getMovieList?page=${this.currentPage}&pagesize=${this.pagesize}`).then((res) => {
        console.log(res)
        this.tableData = res.data.list
        // console.log()
        this.total = res.data.total
      })
    },

    // 换页
    changePage(page) {
      this.currentPage = page
      this.getMovieList()
    },
    handleEdit(id) {
      this.$router.push({
        path: '/movie/edit/' + id
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        axios.delete('/deletemovie/' + id).then((res) => {
          this.$message({
            type: 'success',
            message: res.data.msg
          })
          this.getMovieList()
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
</style>
