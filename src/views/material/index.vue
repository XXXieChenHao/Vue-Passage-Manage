<template>
  <div>
    <el-card>
      <div slot="header">
        <span>素材中心</span>
        <el-upload
        style="float: right; padding: 3px 0"
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="setToken"
        name="image"
        :show-file-list="false"
        :on-success="onSuccess"
      >
        <el-button size="small" type="primary">上传图片</el-button>
      </el-upload>
      </div>
      <div class="text item">
        <ul>
          <li v-for="item in imageList" :key="item.id" class="image-box">
            <img :src="item.url" alt />
            <div class="image-bot">
              <el-button type="success" v-if="item.is_collected" icon="el-icon-star-on" circle @click="starImg(item.id)"></el-button>
              <el-button type="success" v-else icon="el-icon-star-off" circle @click="starImg(item.id)"></el-button>
              <el-button type="danger" icon="el-icon-delete" circle @click="delImg(item.id)"></el-button>
            </div>
          </li>
        </ul>
      </div>
    </el-card>
    <el-card>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="querycdt.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="querycdt.per_page"
        layout="sizes, prev, pager, next, total"
        :total="page_total"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'material',
  data () {
    return {
      page_total: 0,
      imageList: [],
      star_collect: false,
      querycdt: {
        collect: false,
        page: 1,
        per_page: 10
      }
    }
  },
  created () {
    this.getImageList()
  },
  watch: {
    querycdt: {
      handler (newV) {
        this.getImageList()
      },
      deep: true
    }
  },
  computed: {
    setToken () {
      let token = JSON.parse(window.sessionStorage.getItem('userinfo')).token
      return { Authorization: 'Bearer ' + token }
    }
  },
  methods: {
    async getImageList () {
      try {
        let pro = await this.$http.get('/user/images', {
          params: this.querycdt
        })
        this.imageList = pro.data.data.results
        this.page_total = pro.data.data.total_count
      } catch (error) {
        this.$message.error('对不起，获取出错了' + error)
      }
    },
    async delImg (id) {
      try {
        let pro = await this.$http.delete(`user/images/${id}`)
        if (pro.status === 204) {
          this.$message.success('删除成功')
          this.getImageList()
        } else {
          this.$$message.error('删除素材失败')
        }
      } catch (error) {
        this.$message.error('删除素材失败' + error)
      }
    },
    async starImg (id) {
      let pro = await this.$http.put(`user/images/${id}`, { collect: this.querycdt.collect })
      console.log(pro)
    },
    onSuccess () {
      this.$message.success('图片上传成功！')
      this.getImageList() // 刷新图片
    },
    handleSizeChange (val) {
      this.querycdt.per_page = val
    },
    handleCurrentChange (val) {
      this.querycdt.page = val
    }
  }
}
</script>

<style lang="less" scoped>
.image-box {
  list-style: none;
  width: 200px;
  height: 200px;
  background-color: #fff;
  margin: 10px;
  float: left;
  border: 1px solid #eee;
  img {
    width: 200px;
    height: 140px;
  }
  .image-bot {
    width: 200px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
}
</style>
