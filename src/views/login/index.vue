<template>
  <div class="login_contain">
    <div class="login_box">
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules">
        <img src="./pic.jpg" width="25%" alt />
        <el-form-item prop="mobile">
          <el-input placeholder="请输入手机号码" v-model="loginForm.mobile">
             <i slot="prefix" class="iconfont icon-shouji"></i>
          </el-input>
        </el-form-item>

        <el-form-item prop="code">
          <el-input placeholder="请输入验证码" v-model="loginForm.code">
            <i slot="prefix" class="iconfont icon-yanzhengma"></i>
          </el-input>
        </el-form-item>

        <el-form-item style="text-align: left" prop="xieyi">
          <el-checkbox v-model="loginForm.xieyi"></el-checkbox>
          <span style="margin-left: 10px">我已阅读并同意隐私协议</span>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" style="width:100%" @click="login()" :disabled="isActive" :loading="isActive">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import '@/assets/js/gt.js'
import '@/assets/font/iconfont.css'
export default {
  name: 'login',
  methods: {
    login () {
      this.$refs.loginFormRef.validate(valid => {
        // 表单域校验成功
        if (valid) {
          if (this.cptObj !== null) {
            return this.cptObj.verify()
          }
          this.isActive = true
          // 第三方插件 极验 人机交互验证
          let pro = this.$http.get(`/captchas/${this.loginForm.mobile}`)
          pro
            .then(res => {
              if (res.data.message === 'OK') {
                let { data } = res.data
                window.initGeetest(
                  {
                    // 以下配置参数来自服务端 SDK
                    gt: data.gt,
                    challenge: data.challenge,
                    offline: !data.success,
                    new_captcha: true,
                    product: 'bind'
                  },
                  captchaObj => {
                    captchaObj.appendTo('#captchaBox') // 将验证按钮插入到宿主页面中captchaBox元素内
                    captchaObj
                      .onReady(() => {
                        captchaObj.verify()
                        this.isActive = false
                        this.cptObj = captchaObj
                      })
                      .onSuccess(() => {
                        // 账号真实性校验
                        this.loginAct()
                      })
                  }
                )
              }
            })
            .catch(err => {
              this.$message.error('出错啦' + err)
            })
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
      isActive: false,
      cptObj: null,
      loginFormRules: {
        mobile: [
          { required: true, message: '手机号码禁止为空' },
          { pattern: /^1[135678]\d{9}$/, message: '请填写正确手机号码' }
        ],
        code: [{ required: true, message: '验证码禁止为空' }],
        xieyi: [{ validator: xieyiText }]
      },
      loginForm: {
        mobile: '13911111111', // 手机号码
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
