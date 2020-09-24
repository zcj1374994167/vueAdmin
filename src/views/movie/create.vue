<template>
  <el-row>
    <el-row>
      <el-col :span="12">
        <el-upload
          class="avatar-uploader"
          action=""
          :show-file-list="false"
          :http-request="UploadImage"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon" />
        </el-upload>
      </el-col>
    </el-row>
    <el-col :span="12">
      <el-form ref="form" label-width="80px">
        <el-form-item label="电影名称">
          <el-input v-model="movie.title" />
        </el-form-item>
        <el-form-item label="主演">
          <el-input v-model="movie.stars" />
        </el-form-item>
        <el-form-item label="评分">
          <el-input v-model="movie.score" />
        </el-form-item>
        <el-form-item label="上映城市">
          <el-select v-model="movie.region" placeholder="请选择城市">
            <el-option v-for="item in list" :key="item._id" :label="item.name" :value="item._id" />
          </el-select>
        </el-form-item>
        <el-form-item label="电影简介">
          <el-input v-model="movie.description" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button @click="reset">取消</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>
import axios from 'axios'
export default {
  name: 'CreateMovie',
  components: {},
  data() {
    return {
      movie: {
        title: '',
        stars: '',
        score: '',
        region: '',
        description: '',
        imgurl: ''
      },
      imageUrl: '',
      list: []
    }
  },
  created() {
    this.getCityList()
  },
  methods: {
    getCityList() {
      axios.get('/getCityLists').then(res => {
        this.list = res.data.list
      })
    },

    UploadImage(parmas) {
      // console.log(parmas)
      const uploadData = new FormData()
      uploadData.append('avatar', parmas.file)
      axios.post('/upload', uploadData).then(res => {
        // console.log(res);
        this.imageUrl = res.data.path
      })
    },

    onSubmit() {
      axios.post('/movie/create', {
        title: this.movie.title,
        imgurl: this.imageUrl,
        stars: this.movie.stars,
        score: this.movie.score,
        description: this.movie.description,
        p: this.movie.region
      }).then((res) => {
        this.$message({
          message: res.data.msg,
          type: 'success'
        })
        this.reset()
        this.$router.push({
          path: '/movie/list'
        })
      })
    },
    reset() {
      this.movie.title = ''
      this.movie.stars = ''
      this.movie.score = ''
      this.movie.region = ''
      this.movie.description = ''
      this.movie.imgurl = ''
      this.imageUrl = ''
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg'
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 格式!')
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!')
      }
      return isJPG && isLt2M
    }

  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>

