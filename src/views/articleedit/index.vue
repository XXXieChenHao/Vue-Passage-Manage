<template>
  <el-form ref="editFormRef" :rules="editFormRules" label-width="120px" :model="editForm">
    <el-form-item label="标题" prop="title">
      <el-input placeholder="请输入标题"  v-model="editForm.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <quillEditor v-model="editForm.content"></quillEditor>
    </el-form-item>
    <el-form-item label="封面">
      <el-radio-group v-model="editForm.cover.type">
        <el-radio :label="1">单图</el-radio>
        <el-radio :label="3">三图</el-radio>
        <el-radio :label="0">无图</el-radio>
        <el-radio :label="-1">自动</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="频道" prop="channel_id">
      <el-select v-model="editForm.channel_id" clearable="">
        <el-option v-for="item in channel_list" :key="item.id" :value="item.id" :label="item.name"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  @click="editarticle(false)">修改</el-button>
      <el-button @click="editarticle(true)">存入草稿</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'Articleedit',
  components: {
    quillEditor
  },
  data () {
    return {
      channel_list: '',
      editForm: {
        title: '', // 标题信息
        content: '', // 内容
        channel_id: '', // 频道信息
        cover: { // 图片相关信息
          type: 0,
          images: []
        }
      },
      editFormRules: {
        title: [
          { required: true, message: '请填写标题' },
          { min: 5, max: 30, message: '5 到 30 个字符' }
        ],
        content: [{ required: true, message: '请填写内容' }],
        channel_id: [
          { required: true, message: '请选择频道信息' }
        ]
      }
    }
  },
  created () {
    this.getChannelList()
    this.getArticleInfo()
  },
  computed: {
    aid () {
      return this.$route.params.aid
    }
  },
  methods: {
    editarticle (flag) {
      this.$refs.editFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.post('/articles', this.editForm, { param: { draft: flag } })
          pro
            .then(res => {
              if (res.data.message === 'OK') {
                this.$message.success('恭喜你文章添加成功')
                this.$router.push({ name: 'article' })
              }
            })
            .catch(() => {
              this.$message.error('对不起，新增文章出错了')
            })
        }
      })
    },
    getChannelList () {
      let pro = this.$http.get('/channels')
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            this.channel_list = res.data.data.channels
          }
        })
        .catch(() => {
          this.$message.error('出错啦')
        })
    },
    getArticleInfo () {
      let pro = this.$http.get(`/articles/${this.aid}`)
      pro
        .then(res => {
          if (res.data.message === 'OK') {
            this.editForm = res.data.data
          }
        })
        .catch(err => {
          return this.$message.error('获取文章信息失败' + err)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
