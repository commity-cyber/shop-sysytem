<template>
  <div>
    <!-- 标签 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    
    <!-- 卡片视图 -->
    <el-card>
        <!-- 搜索商品，添加商品的功能 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryinfo.query"
            class="input-with-select"
             clearable
             @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAdd">添加用户 </el-button>
        </el-col>
      </el-row>
      <!-- 用户数据显示的地方 -->
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index" label="索引" header-align="center" align="center"> </el-table-column>
        <el-table-column prop="goods_name" label="商品名称"> </el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="100px" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="90px" header-align="center" align="center">
        </el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="150px"> </el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="goEditGoods(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="删除角色"
              placement="top"
              :enterable="false"
              
            >
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="removeShop(scope.row.goods_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

       <!-- 分页功能实现 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  components: {},

  directives: {},

  data() {
    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      goodsList: [],
      total: 0,
    };
  },
  created() {
     
    this.getGoodsList();
  },
  mounted() {},

  methods: {
    
    //   获取商品列表数据的方法
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
        for(let item of res.data.goods){
            item.add_time=this.$untils.formatToTime(item.add_time)
        }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听商品页面大小的方法
    handleSizeChange(pagesize){
        this.queryinfo.pagesize = pagesize
        this.getGoodsList()
    },
    // 监听商品页码的方法
    handleCurrentChange(pagenum){
        this.queryinfo.pagenum = pagenum
        this.getGoodsList();
    },
    // 删除商品
    removeShop(id){
        this.$confirm("此操作将永久删除商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`goods/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("删除失败");
          }
          this.getGoodsList();
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 跳转页面
    goAdd(){
        this.$router.push('/goods/add')
    },
    goEditGoods(id){
      this.$router.push('/goods/editgoods?id='+id)
    }

  },
};
</script>

<style lang="less" scoped>
</style>