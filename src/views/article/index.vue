<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>数据筛选</span>
        <el-button style="float: right; padding: 3px 0" type="text">操作按钮</el-button>
      </div>
      <div class="text">
        <el-form ref="searchFormRef" :model="searchForm">
          <el-form-item label="文章状态">
            <el-radio v-model="searchForm.status" label>全部</el-radio>
            <el-radio v-model="searchForm.status" label="0">草稿</el-radio>
            <el-radio v-model="searchForm.status" label="1">已发布</el-radio>
            <el-radio v-model="searchForm.status" label="2">未审核</el-radio>
            <el-radio v-model="searchForm.status" label="3">已删除</el-radio>
          </el-form-item>
          <el-form-item label="频道列表">
            <channel-com @slt="onSuccess"></channel-com>
          </el-form-item>
          <el-form-item label="发表日期">
            <el-date-picker
              v-model="time"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>共找到 {{total_count}} 条数据</span>
      </div>
      <el-table :data="article_list" stripe style="width: 100%">
        <el-table-column label="图片">
          <img
            :src="stData.row.cover.images[0]"
            slot-scope="stData"
            alt="暂无图片"
            width="150"
            height="100"
          />
        </el-table-column>
        <el-table-column label="标题" prop="title" width="300"></el-table-column>
        <el-table-column label="发布状态" prop="status" width="200">
          <template slot-scope="stData">
            <el-tag v-if="stData.row.status===0">草稿</el-tag>
            <el-tag v-else-if="stData.row.status===1" type="success">已通过</el-tag>
            <el-tag v-else-if="stData.row.status===2" type="info">未审核</el-tag>
            <el-tag v-else-if="stData.row.status===3" type="warning">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布日期" prop="pubdate"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="stData">
              <el-button type="primary" size="mini" @click="$router.push(`/articleedit/${stData.row.id}`)">修改</el-button>
              <el-button type="danger" size="mini" @click="del(stData.row.id)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchForm.page"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total_count"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>

import ChannelCom from '@/components/channel.vue'

export default {
  name: 'ArticleList',
  components: {
    ChannelCom
  },
  data () {
    return {
      time: [],
      article_list: [],
      channel_list: [],
      total_count: 0,
      searchForm: {
        status: '',
        channel_id: '',
        begin_pubdate: '',
        end_pubdate: '',
        page: 1,
        per_page: 10
      }
    }
  },
  created () {
    this.getChannelList()
    this.getArticleList()
  },
  methods: {
    handleSizeChange (val) {
      this.searchForm.per_page = val
    },
    handleCurrentChange (val) {
      this.searchForm.page = val
    },
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            this.channel_list = res.data.data.channels
          }
        })
        .catch(err => {
          return this.$message.error('对不起网络走丢了' + err)
        })
    },
    getArticleList () {
      let searchData = {}
      for (var i in this.searchForm) {
        if (this.searchForm[i]) {
          searchData[i] = this.searchForm[i]
        }
      }
      let pro = this.$http.get('/articles', { params: searchData })
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            this.article_list = res.data.data.results
            this.total_count = res.data.data.total_count
          }
        })
        .catch(err => {
          return this.$message.error('对不起网络走丢了' + err)
        })
    },
    del (id) {
      this.$confirm('确认要删除该数据么？', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let pro = this.$http.delete(`/articles/${id}`)
        pro
          .then(result => {
            this.getArticleList()
          })
          .catch(err => {
            return this.$message.error('删除文章失败:' + err)
          })
      }).catch(() => { })
    },
    onSuccess (val) {
      this.searchForm.channel_id = val
    }
  },
  watch: {
    time (newval) {
      if (newval) {
        this.searchForm.begin_pubdate = newval[0]
        this.searchForm.end_pubdate = newval[1]
      } else {
        this.searchForm.begin_pubdate = ''
        this.searchForm.end_pubdate = ''
      }
    },
    searchForm: {
      handler (newv) {
        if (newv) {
          this.getArticleList()
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="less" scoped>
.box-card {
  margin-bottom: 20px;
}
</style>
