<template>
  <el-container>
    <el-aside :width="isCollapse?'65px':'200px'">
      <el-menu
        background-color="#353B4E"
        text-color="#fff"
        active-text-color="#3C9DFF"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="1" :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span slot="title">首页</span>
        </el-menu-item>
        <el-submenu index="2" :style="{width:isCollapse?'65px':'200px'}">
          <template slot="title">
            <i class="el-icon-menu"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="2-1">发布文章</el-menu-item>
          <el-menu-item index="2-2">文章列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
        </el-submenu>
        <el-menu-item :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span>粉丝管理</span>
        </el-menu-item>
        <el-menu-item :style="{width:isCollapse?'65px':'200px'}">
          <i class="el-icon-location"></i>
          <span>账户管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header>
        <div class="left">
          <i class="el-icon-s-fold" style="margin: 0 10px" @click="isCollapse = !isCollapse"></i>
          <span>闲情逸致，读书三余</span>
        </div>
        <div class="right">
          <el-input placeholder="请输入搜索关键字" style="width: 300px"></el-input>
          <span style="margin: 0 15px">消息</span>
          <img src alt />
          <el-dropdown>
            <span class="el-dropdown-link">
              <img
                :src="photo"
                alt
                width="40"
                height="40"
                style="border-radius: 50%; margin: 0 10px"
              />
              {{name}}
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>GitHub</el-dropdown-item>
              <el-dropdown-item>个人信息</el-dropdown-item>
              <el-dropdown-item @click.native="logout()">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      isCollapse: false
    }
  },
  methods: {
    logout () {
      this.$confirm('此操作将退出登录，是否确定?', '退出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.clear()
          this.$router.push('/login')
          this.$message({
            type: 'success',
            message: '退出成功!'
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消退出'
          })
        })
    }
  },
  computed: {
    photo () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).photo
    },
    name () {
      return JSON.parse(window.sessionStorage.getItem('userinfo')).name
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-aside {
  background-color: rgb(50, 55, 69);
}
.el-header {
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    width: 40%;
  }
  .right {
    width: 50%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    .el-dropdown-link {
      display: flex;
      align-items: center;
    }
  }
}
.el-main {
  background: gray;
}
</style>
