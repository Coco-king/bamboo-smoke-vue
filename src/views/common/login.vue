<template>
  <div class="body">
    <div class="login__container right-panel-active">
      <div class="container__form login__container--signup">

        <form @submit="regFormSubmit" method="post" class="form" ref="regForm">
          <h2 class="form__title">注册</h2>
          <el-input type="text" v-model="regForm.memberName" placeholder="请输入用户名" class="input"></el-input>
          <el-input type="email" v-model="regForm.email" placeholder="请输入邮箱" class="input"></el-input>
          <el-input type="password" v-model="regForm.password" placeholder="请输入密码" class="input"></el-input>
          <el-input type="password" v-model="regForm.rePass" placeholder="请再次输入密码" class="input"></el-input>
          <el-row>
            <el-col :span="12">
              <el-input type="text" v-model="regForm.captcha" placeholder="验证码" class="input"></el-input>
            </el-col>
            <el-col :span="12">
              <img
                :src="captchaPath"
                @click="getCaptcha()"
                width="130"
                style="margin: 0.63rem 0 0 0.5rem;height: 2.15rem"
                alt=""
              />
            </el-col>
          </el-row>
          <button class="btn">注册</button>
        </form>
      </div>

      <div class="container__form login__container--signin">
        <form @submit="loginFormSubmit" class="form" id="form2" ref="logonForm">
          <h2 class="form__title">登录</h2>
          <el-input type="text" v-model="loginForm.loginName" placeholder="用户名/邮箱/手机号" class="input"></el-input>
          <el-input type="password" v-model="loginForm.password" placeholder="密码" class="input"></el-input>
          <el-row>
            <el-col :span="12">
              <el-input type="text" v-model="loginForm.captcha" placeholder="验证码" class="input"></el-input>
            </el-col>
            <el-col :span="12">
              <img
                :src="captchaPath"
                @click="getCaptcha()"
                width="130"
                style="margin: 0.63rem 0 0 0.5rem;height: 2.15rem"
                alt=""
              />
            </el-col>
          </el-row>
          <el-link class="link" :underline="false" @click="updatePasswordHandle">忘记密码？</el-link>
          <button class="btn">登录</button>
        </form>
      </div>

      <div class="container__overlay">
        <div class="login__overlay">
          <div class="overlay__panel login__overlay--left">
            <button class="btn" id="signIn" @click="signIn">登录</button>
          </div>
          <div class="overlay__panel login__overlay--right">
            <button class="btn" id="signUp" @click="signUp">注册</button>
          </div>
        </div>
      </div>
      <!-- 弹窗, 修改密码 -->
      <update-password v-if="updatePasswordVisible" ref="updatePassword"></update-password>
    </div>
  </div>
</template>

<script>
import { getUUID } from '@/utils'
import UpdatePassword from '../main-navbar-update-password'

export default {
  data() {
    return {
      updatePasswordVisible: false,
      loginForm: {
        loginName: '竹隐寒烟',
        password: 'WangXX666',
        uuid: '',
        captcha: ''
      },
      regForm: {
        memberName: '竹隐寒烟',
        password: 'WangXX666',
        rePass: 'WangXX666',
        email: '',
        uuid: '',
        captcha: ''
      },
      dataRule: {
        loginName: [
          {required: true, message: '帐号不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'}
        ],
        captcha: [
          {required: true, message: '验证码不能为空', trigger: 'blur'}
        ]
      },
      captchaPath: ''
    }
  },
  components: {UpdatePassword},
  created() {
    this.getCaptcha()
  },
  methods: {
    // 修改密码
    updatePasswordHandle() {
      this.updatePasswordVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    },
    signIn() {
      document.querySelector('.login__container').classList.remove('right-panel-active')
      this.getCaptcha()
    },
    signUp() {
      document.querySelector('.login__container').classList.add('right-panel-active')
      this.getCaptcha()
    },
    // 提交登录表单
    loginFormSubmit() {
      this.$http({
        url: this.$http.adornUrl('/verify/login'),
        method: 'post',
        data: this.$http.adornData({
          loginName: this.loginForm.loginName,
          password: this.loginForm.password,
          uuid: this.loginForm.uuid,
          captcha: this.loginForm.captcha
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$cookie.set('jwtToken', data.jwtToken)
          sessionStorage.setItem('jwtToken', data.jwtToken)
          this.$router.replace({name: 'home'})
        } else {
          this.getCaptcha()
          this.$message.error(data.msg)
        }
      })
    },
    // 提交注册表单
    regFormSubmit() {
      this.$http({
        url: this.$http.adornUrl('/verify/registry'),
        method: 'post',
        data: this.$http.adornData({
          memberName: this.regForm.memberName,
          email: this.regForm.email,
          password: this.regForm.password,
          rePass: this.regForm.rePass,
          uuid: this.regForm.uuid,
          captcha: this.regForm.captcha
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.$cookie.set('jwtToken', data.jwtToken)
          sessionStorage.setItem('jwtToken', data.jwtToken)
          this.$router.replace({name: 'home'})
        } else {
          this.getCaptcha()
          this.$message.error(data.msg)
        }
      })
    },
    // 获取验证码
    getCaptcha() {
      this.loginForm.uuid = getUUID()
      this.regForm.uuid = this.loginForm.uuid
      this.captchaPath = this.$http.adornUrl(
        `/verify/captcha.jpg?uuid=${this.loginForm.uuid}`
      )
    }
  }
}
</script>

<style>
:root {
  /* COLORS */
  --white: #e9e9e9;
  --gray: #333;
  --blue: #0367a6;
  --lightblue: #008997;

  /* RADII */
  --button-radius: 0.7rem;

  /* SIZES */
  --max-width: 758px;
  --max-height: 420px;

  font-size: 16px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
  Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
}

.body {
  align-items: center;
  /* 决定背景图像的位置是在视口内固定，或者随着包含它的区块滚动。 */
  /* https://developer.mozilla.org/zh-CN/docs/Web/CSS/background-attachment */
  background: var(--white) url("https://img-figure-bed.oss-cn-shanghai.aliyuncs.com/cnblogs-banner/tdqx7et1629818656755.jpg") no-repeat fixed center;
  background-size: cover;
  display: grid;
  height: 100vh;
  place-items: center;
}

.form__title {
  font-weight: 300;
  margin: 0 0 1.25rem;
}

.link {
  color: var(--gray);
  font-size: 0.9rem;
  margin: 1rem 0 0.5rem 0;
  text-decoration: none;
}

.login__container {
  background-color: var(--white);
  border-radius: var(--button-radius);
  box-shadow: 0 0.9rem 1.7rem rgba(0, 0, 0, 0.25),
  0 0.7rem 0.7rem rgba(0, 0, 0, 0.22);
  height: var(--max-height);
  max-width: var(--max-width);
  overflow: hidden;
  position: relative;
  width: 100%;
}

.container__form {
  height: 100%;
  position: absolute;
  top: 0;
  transition: all 0.6s ease-in-out;
}

.login__container--signin {
  left: 0;
  width: 50%;
  z-index: 2;
}

.login__container.right-panel-active .login__container--signin {
  transform: translateX(100%);
}

.login__container--signup {
  left: 0;
  opacity: 0;
  width: 50%;
  z-index: 1;
}

.login__container.right-panel-active .login__container--signup {
  animation: show 0.6s;
  opacity: 1;
  transform: translateX(100%);
  z-index: 5;
}

.container__overlay {
  height: 100%;
  left: 50%;
  overflow: hidden;
  position: absolute;
  top: 0;
  transition: transform 0.6s ease-in-out;
  width: 50%;
  z-index: 100;
}

.login__container.right-panel-active .container__overlay {
  transform: translateX(-100%);
}

.login__overlay {
  background: var(--lightblue) url("https://img-figure-bed.oss-cn-shanghai.aliyuncs.com/cnblogs-banner/tdqx7et1629818656755.jpg") no-repeat fixed center;
  background-size: cover;
  height: 100%;
  left: -100%;
  position: relative;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 200%;
}

.login__container.right-panel-active .login__overlay {
  transform: translateX(50%);
}

.overlay__panel {
  align-items: center;
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
  position: absolute;
  text-align: center;
  top: 0;
  transform: translateX(0);
  transition: transform 0.6s ease-in-out;
  width: 50%;
}

.login__overlay--left {
  transform: translateX(-20%);
}

.login__container.right-panel-active .login__overlay--left {
  transform: translateX(0);
}

.login__overlay--right {
  right: 0;
  transform: translateX(0);
}

.login__container.right-panel-active .login__overlay--right {
  transform: translateX(20%);
}

.btn {
  background-color: var(--blue);
  background-image: linear-gradient(90deg, var(--blue) 0%, var(--lightblue) 74%);
  border-radius: 20px;
  border: 1px solid var(--blue);
  color: var(--white);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 0.1rem;
  padding: 0.9rem 4rem;
  text-transform: uppercase;
  transition: transform 80ms ease-in;
}

.form > .btn {
  margin-top: 1.5rem;
}

.btn:active {
  transform: scale(0.95);
}

.btn:focus {
  outline: none;
}

.form {
  background-color: var(--white);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0 3rem;
  height: 100%;
  text-align: center;
}

.input {
  border: none;
  margin: 0.5rem 0;
  width: 100%;
}

@keyframes show {

  0%,
  49.99% {
    opacity: 0;
    z-index: 1;
  }

  50%,
  100% {
    opacity: 1;
    z-index: 5;
  }
}
</style>
