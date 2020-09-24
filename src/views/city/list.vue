<template>
  <div class="app-container">
    <el-table :data="tableData" style="width: 100%">
      <el-table-column type="index" label="序号" width="100" />
      <el-table-column
        property="name"
        label="姓名"
        width="240"
      />
      <el-table-column property="index" label="索引" width="100" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="handleEdit(scope.row._id)"
          >编辑</el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(scope.row._id)"
          >删除</el-button>
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
  name: 'CityList',
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
    this.getCityList()
  },
  methods: {
    // getCityList() {
    //   axios.get('/getCityList').then(res => {
    //     if(res.data.code === 20000){
    //       this.tableData = res.data.list
    //     }
    //   })
    // },
    getCityList() {
      axios
        .get(`/getCityList?page=${this.currentPage}&pagesize=${this.pagesize}`)
        .then((res) => {
          this.tableData = res.data.list
          this.total = res.data.total
        })
    },

    changePage(page) {
      this.currentPage = page
      this.getCityList()
    },
    handleEdit(id) {
      this.$router.push({
        path: '/city/edit/' + id
      })
    },
    handleDelete(id) {
      this.$confirm('此操作将永久删除该数据，是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          axios.delete('/deletecity/' + id).then((res) => {
            this.$message({
              type: 'success',
              message: res.data.msg
            })
            this.getCityList()
          })
        })
        .catch(() => {
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
