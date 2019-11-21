<template>
  <div>
    <el-card>
      <div slot="header">
        <span>个人信息修改</span>
      </div>
      <div class="text item cardbody">
        <div class="lt">
          <el-upload
            class="avatar-uploader"
            action
            :show-file-list="false"
            :http-request="httpRequest"
          >
            <img v-if="accountForm.photo" :src="accountForm.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </div>

        <div class="rt">
          <el-form ref="accountFormRef" :rules="accountFormRules" :model="accountForm">
            <el-form-item label="昵称" prop="name">
              <el-input v-model="accountForm.name"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobile">
              <el-input disabled v-model="accountForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="E-mail" prop="email">
              <el-input v-model="accountForm.email"></el-input>
            </el-form-item>
            <el-form-item label="简介">
              <el-input type="textarea" v-model="accountForm.intro"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" style="float: right" @click="upDataUserInfo()">更新资料</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import bus from '@/utlis/bus.js'
export default {
  name: 'Account',
  data () {
    return {
      accountForm: {
        // 用户信息对象
        id: '',
        name: '',
        mobile: '',
        email: '',
        intro: '',
        photo: ''
      },
      accountFormRules: {
        name: [
          { required: true, message: '请输入用户名' },
          { min: 1, max: 7, message: '1到7个字符之间' }
        ],
        email: [
          { required: true, message: '请输入邮箱' },
          { type: 'email', message: '请输入正确地址' }
        ]
      }
    }
  },
  created () {
    this.getAccountInfo()
  },
  methods: {
    async getAccountInfo () {
      let pro = await this.$http.get('user/profile')
      this.accountForm = pro.data.data
    },
    upDataUserInfo () {
      this.$refs.accountFormRef.validate(valid => {
        if (valid) {
          let pro = this.$http.patch('/user/profile', this.accountForm)
          pro
            .then(res => {
              if (res.data.message === 'OK') {
                bus.$emit('upDataName', res.data.data.name)
              }
            })
            .catch(err => {
              this.$message.error('更新用户名失败' + err)
            })
        }
      })
    },
    async httpRequest (resource) {
      try {
        let fd = new FormData()
        fd.append('photo', resource.file)
        let pro = await this.$http.patch('user/photo', fd)
        console.log(pro)
        this.accountForm.photo = pro.data.data.photo
        this.$message.success('头像更新成功！')
      } catch (error) {
        this.$message.error('图片上传失败' + error)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.cardbody {
  display: flex;
  justify-content: space-between;
  .lt {
    width: 50%;
  }
  .rt {
    width: 40%;
  }
}
.el-upload {
  border: 1px solid #000;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 300px;
  height: 300px;
  line-height: 300px;
  text-align: center;
  margin: 30px 0 0 30px;
}
.el-icon-plus,
.avatar-uploader-icon {
  border: 1px solid #000;
}
.avatar {
  width: 300px;
  height: 300px;
  margin: 30px 0 0 30px;
  display: block;
}
</style>
