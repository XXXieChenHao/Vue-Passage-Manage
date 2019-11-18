<template>
  <el-form ref="addFormRef" :rules="addFormRules" label-width="120px" :model="addForm">
    <el-form-item label="标题" prop="title">
      <el-input placeholder="请输入标题"  v-model="addForm.title"></el-input>
    </el-form-item>
    <el-form-item label="内容" prop="content">
      <quillEditor v-model="addForm.content"></quillEditor>
    </el-form-item>
    <el-form-item label="封面">
      <el-radio-group v-model="addForm.cover.type">
        <el-radio :label="1">单图</el-radio>
        <el-radio :label="3">三图</el-radio>
        <el-radio :label="0">无图</el-radio>
        <el-radio :label="-1">自动</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="频道" prop="channel_id">
      <channel-com @slt="onSuccess" :cid="addForm.channel_id"></channel-com>
    </el-form-item>
    <el-form-item>
      <el-button type="primary"  @click="addarticle(false)">提交</el-button>
      <el-button @click="addarticle(true)">存入草稿</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import { quillEditor } from 'vue-quill-editor'

import ChannelCom from '@/components/channel.vue'

export default {
  name: 'ArticleAdd',
  components: {
    quillEditor,
    ChannelCom
  },
  data () {
    return {
      channel_list: '',
      addForm: {
        title: '', // 标题信息
        content: '', // 内容
        channel_id: '', // 频道信息
        cover: { // 图片相关信息
          type: 0,
          images: []
        }
      },
      addFormRules: {
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
  methods: {
    onSuccess (val) {
      this.addForm.channel_id = val
    },
    addarticle (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.post('/articles', this.addForm, { param: { draft: flag } })
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
    }
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
</style>
