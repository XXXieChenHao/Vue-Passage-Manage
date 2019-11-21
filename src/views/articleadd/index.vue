<template>
  <el-form ref="addFormRef" :rules="addFormRules" label-width="120px" :model="addForm">
    <el-form-item label="标题" prop="title">
      <el-input placeholder="请输入标题" v-model="addForm.title"></el-input>
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
      <ul>
        <li v-for="item in covernum" :key="item" class="uploadbox" @click="showdialog(item)">
          <span>点击图标选择图片</span>
          <img v-if="addForm.cover.images[item-1]" :src="addForm.cover.images[item-1]" alt />
          <div v-else class="el-icon-picture-outline"></div>
        </li>
      </ul>
      <el-dialog title="素材图片" :visible.sync="dialogVisible" width="60%" @close="celarImage">
        <span>选择你中意的图片</span>
        <ul class="image_bg">
          <li v-for="item in imageList" :key="item.id" class="image_box">
            <img :src="item.url" alt width="200" height="200" @click="clkImage"/>
          </li>
        </ul>
        <el-pagination :current-page.sync="querycdt.page" @current-change="handleCurrentChange" layout="prev, pager, next" :total="tot"></el-pagination>
        <span slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="imgOk">确 定</el-button>
        </span>
      </el-dialog>
    </el-form-item>
    <el-form-item label="频道" prop="channel_id">
      <channel-com @slt="onSuccess" :cid="addForm.channel_id"></channel-com>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="addarticle(false)">提交</el-button>
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
      xu: 0, // 上传图片框序号
      materialUrl: '', // 素材选择中间地址
      dialogVisible: false, // 素材列表显示控制开关
      channel_list: '', // 下拉菜单列表

      addForm: { // 添加文章对象
        title: '', // 标题信息
        content: '', // 内容
        channel_id: '', // 频道信息
        cover: {
          // 图片相关信息
          type: 0,
          images: []
        }
      },

      imageList: [], // 图片列表，返回后台获取素材图片信息

      querycdt: { // 素材获取参数，query类型
        collect: false, // 素材是否被收藏
        page: 1, // 素材获取页码
        per_page: 12 // 素材获取数量
      },
      tot: 0, // 素材总页数

      // 文章表单自然验证
      addFormRules: {
        title: [
          { required: true, message: '请填写标题' },
          { min: 5, max: 30, message: '5 到 30 个字符' }
        ],
        content: [{ required: true, message: '请填写内容' }],
        channel_id: [{ required: true, message: '请选择频道信息' }]
      }
    }
  },
  created () {
    this.getImageList()
  },
  watch: {
    // 监听页码变化
    querycdt: {
      handler (newV) {
        this.getImageList()
      },
      deep: true
    }
  },
  methods: {
    onSuccess (val) {
      this.addForm.channel_id = val
    },

    // 验证表单数据是否符合规定
    addarticle (flag) {
      this.$refs.addFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.post('/articles', this.addForm, {
            param: { draft: flag }
          })
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
    async getImageList () {
      // 获取素材图片列表
      let pro = await this.$http.get('user/images', { params: this.querycdt })
      this.imageList = pro.data.data.results
      this.tot = pro.data.data.total_count
      this.querycdt.page = pro.data.data.page
    },

    // 分页系统数据更改修改 data 数据
    handleCurrentChange (val) {
      this.querycdt.page = val
    },

    // 添加选择图片高亮效果
    clkImage (evt) {
      let lis = document.querySelectorAll('.image_box')
      for (let i = 0; i < lis.length; ++i) {
        lis[i].style.opacity = '0.5'
      }
      evt.target.parentNode.style.opacity = '1'
      this.materialUrl = evt.target.src
    },

    // 清空图片选择区选择效果和地址暂存
    celarImage () {
      let lis = document.querySelectorAll('.image_box')
      for (let i = 0; i < lis.length; ++i) {
        lis[i].style.opacity = '1'
      }
      this.materialUrl = ''
    },

    // 绑定图片上传框选项
    showdialog (n) {
      this.xu = n - 1
      this.dialogVisible = true
    },

    // 同步选择图片地址与上传图片展示区地址
    imgOk () {
      if (this.materialUrl) {
        this.addForm.cover.images[this.xu] = this.materialUrl
        this.dialogVisible = false // 关闭对话框
      } else {
        this.$message.error('请选择一个')
      }
    }
  },
  computed: {

    // 判断用户选择封面类型，返回值用作图片上传框数量渲染
    covernum () {
      if (this.addForm.cover.type > 0) {
        return this.addForm.cover.type
      }
      return 0
    }
  }
}
</script>

<style lang="less" scoped>
.el-form /deep/ .ql-editor {
  height: 200px;
}
.uploadbox {
  list-style: none;
  width: 200px;
  height: 200px;
  margin: 10px;
  float: left;
  cursor: pointer;
  border: 1px solid #ccc;
  span {
    width: 200px;
    height: 50px;
    line-height: 50px;
    display: block;
    text-align: center;
  }

  div {
    width: 200px;
    height: 150px;
    font-size: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  img {
    width: 200px;
    height: 150px;
  }
}
.image_bg {
  overflow: hidden;
  .image_box {
    float: left;
    list-style: none;
    margin: 25px;
  }
}
.el-pagination {
  text-align: center;
}
</style>
