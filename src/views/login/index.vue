<template>
  <div class="login_contain">
    <div class="login_box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./pic.jpg" width="25%" alt />
        <el-form-item prop="mobile">
          <el-input placeholder="请输入手机号码" v-model="loginForm.mobile"></el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input placeholder="请输入验证码" v-model="loginForm.code"></el-input>
        </el-form-item>

        <el-form-item style="text-align: left" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
          <span style="margin-left: 10px">我已阅读并同意隐私协议</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login()">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'login',
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        // 表单域校验成功
        if (valid) {
          // 账号真实性校验
          this.loginAct()
        }
      })
    },
    loginAct () {
      let pro = this.$http.post('/authorizations', this.loginForm)
      pro
        .then(result => {
          if (result.data.message === 'OK') {
            // 进入后台系统
            window.sessionStorage.setItem(
              'userinfo',
              JSON.stringify(result.data.data)
            )
            this.$router.push('/home')
          }
        })
        .catch(err => {
          return this.$message.error('用户名或密码错误' + err)
        })
    }
  },
  data () {
    var xieyiText = function (rule, value, callback) {
      value ? callback() : callback(new Error('请同意隐私协议'))
    }
    return {
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码禁止为空' },
          { pattern: /^1[135678]\d{9}$/, message: '请填写正确手机号码' }
        ],
        code: [{ required: true, message: '验证码禁止为空' }],
        xieyi: [{ validator: xieyiText }]
      },
      loginForm: {
        mobile: '15555555555', // 手机号码
        code: '246810', // 验证码
        xieyi: true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.login_contain {
  height: 100%;
  background: #e4e4e4;
  display: flex;
  justify-content: center;
  align-items: center;

  .login_box {
    width: 550px;
    height: 450px;
    background: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    .el-form {
      width: 70%;
    }
  }
}
</style>
