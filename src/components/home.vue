<template>
  <el-container>
    <!-- 头部 -->
    <el-header>
      <div class="t-left">
        <img src="../assets/imgs/shop.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <div class="t-right">
        <span>欢迎您：{{ userInfo.username }}</span>
        <el-button type="danger" size="mini" @click="loginout">推出</el-button>
      </div>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px':'200px'">
        <!-- 切换菜单的折叠与显示 -->
        <div class="toggle-btn" @click="isCollapse = !isCollapse">|||</div>
        <!-- 激活状态通过default-active决定，此时子导航栏在那个路劲，则就是哪个路劲处于激活状态 -->
        <el-menu
          :default-active="$route.path"
          unique-opened
          router
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <el-submenu :index="item.id+''" v-for="item in menuList" :key="item.id">
            <template #title>
              <i :class="iconobj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>     
              <el-menu-item :index="'/'+i.path" v-for="i in item.children" :key="i.id">
                <i class="el-icon-menu"></i>
                {{i.authName}}</el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      userInfo: null,
      menuList:[],
      iconobj:{
        '201':'iconfont icon-shouye',
        '125':'iconfont icon-users',
        '103':'iconfont icon-tijikongjian',
        '101':'iconfont icon-shangpin',
        '102':'iconfont icon-danju'
      },
      // 折叠菜单的变量
      isCollapse:false
    };
  },
  created() {
    this.userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
    console.log(this.userInfo);
    this.getLoginlist();
  },
  methods: {
    // 用户登出炒作
    loginout() {
      this.$confirm("是否退出登入", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          sessionStorage.clear();
          this.$router.push("/Login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 获取左侧侧边栏的信息，但是需要登入状态下去获取，因此需要判断token，来验证权限
     async getLoginlist(){
     const {data:res} =await this.$http.get('menus');
     console.log(res)
     if(res.meta.status !== 200){
              return  this.$message.error(res.meta.message)
     }
      this.menuList = res.data;
      console.log(this.menuList)
    },
    
  },
};
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
}
.el-header {
  background: url("../assets/imgs/header_bg.gif") repeat-x center;
  height: 50px !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  .t-left {
    display: flex;
    align-items: center;
    img {
      width: 40px;
      margin-right: 20px;
    }
    span {
      font-size: 20px;
    }
  }
  .t-right {
    span {
      font-size: 16px;
      margin-right: 10px;
    }
  }
}
.el-aside{
  .toggle-btn{
    background: #60779d;
    line-height: 24px;
    font-size: 10px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2rem;
    // 标记让用户可以知道这里可以点击
    cursor: pointer;
  }
  .el-menu{
    .iconfont{
      margin-right: 10px;
    }
  }
}
.el-main{
  background: #eaedf1;
}
</style>
