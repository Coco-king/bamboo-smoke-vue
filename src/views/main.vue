<template>
  <div
    class="site-wrapper"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中"
  >
    <template v-if="!loading">
      <el-container>
        <el-header>
          <el-row>
            <el-col :span="3">&nbsp;</el-col>
            <el-col :span="4">
              <img
                src="~@/assets/img/logo.png"
                width="168"
                height="47"
                alt="竹隐寒烟社区"
              >
            </el-col>
            <el-col :span="8">&nbsp;</el-col>
            <el-col :span="9">
              <el-menu
                :default-active="activeIndex"
                mode="horizontal"
                @select="handleSelect"
              >
                <el-menu-item class="site-navbar__avatar" index="1">
                  <el-dropdown :show-timeout="0" placement="bottom">
                    <span class="el-dropdown-link">
                      <img src="~@/assets/img/avatar.png" :alt="userName">{{ userName }}
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
                      <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-menu-item>
                <el-menu-item index="2">处理中心</el-menu-item>
                <el-submenu index="3">
                  <template slot="title">我的工作台</template>
                  <el-menu-item index="3-1">选项1</el-menu-item>
                  <el-menu-item index="3-2">选项2</el-menu-item>
                  <el-menu-item index="3-3">选项3</el-menu-item>
                  <el-submenu index="3-4">
                    <template slot="title">选项4</template>
                    <el-menu-item index="3-4-1">选项1</el-menu-item>
                    <el-menu-item index="3-4-2">选项2</el-menu-item>
                    <el-menu-item index="3-4-3">选项3</el-menu-item>
                  </el-submenu>
                </el-submenu>
                <el-menu-item index="4" disabled>消息中心</el-menu-item>
                <el-menu-item index="5">
                  <a href="https://www.ele.me" target="_blank">订单管理</a>
                </el-menu-item>
              </el-menu>
            </el-col>
          </el-row>
        </el-header>
        <el-main>
          <router-view/>
        </el-main>
        <el-footer></el-footer>
      </el-container>
    </template>
    <main-navbar-update-password v-if="updatePasswordVisible" ref="updatePassword"></main-navbar-update-password>
  </div>
</template>

<script>
import { clearLoginInfo } from '@/utils'
import MainNavbarUpdatePassword from './main-navbar-update-password'

export default {
  components: {
    MainNavbarUpdatePassword
  },
  data() {
    return {
      token: '',
      loading: true,
      updatePasswordVisible: false,
      activeIndex: '2'
    }
  },
  computed: {
    userId: {
      get() {
        return this.$store.state.user.id
      },
      set(val) {
        this.$store.commit('user/updateId', val)
      }
    },
    userName: {
      get() {
        return this.$store.state.user.name
      },
      set(val) {
        this.$store.commit('user/updateName', val)
      }
    }
  },
  created() {
    this.getUserInfo()
    this.token = sessionStorage.getItem('jwtToken')
  },
  methods: {
    // 获取当前登录用户的信息
    getUserInfo() {
      this.$http({
        url: this.$http.adornUrl('/auth/member/info'),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.loading = false
          sessionStorage.setItem('member', JSON.stringify(data.member))
          this.userId = data.member.id
          this.userName = data.member.memberName
        }
      })
    },
    handleSelect(key, keyPath) {
      console.log(key, keyPath)
    },
    // 修改密码
    updatePasswordHandle() {
      this.updatePasswordVisible = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    },
    // 退出
    logoutHandle() {
      this.$confirm(`确定进行[退出]操作?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http({
          url: this.$http.adornUrl('/verify/logout'),
          method: 'post',
          data: this.$http.adornData()
        }).then(({data}) => {
          if (data && data.code === 0) {
            clearLoginInfo()
            this.$router.push({name: 'login'})
          }
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style>
.el-header, .el-footer {
  padding: 0;
  color: #333;
  text-align: center;
  line-height: 60px;
}

.el-aside {
  background-color: #D3DCE6;
  color: #333;
  text-align: center;
  line-height: 200px;
}

.el-main {
  background-color: #E9EEF3;
  color: #333;
  text-align: center;
  line-height: 160px;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
</style>
