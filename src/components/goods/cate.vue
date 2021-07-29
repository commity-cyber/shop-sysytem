<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addfenlei">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 树形表格 -->
      <tree-table
        class="trree-table"
        :data="CateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
      >
        <!-- 是否有效的定义模板 -->
        <template slot="isOk" slot-scope="scope">
          <i
            class="el-icon-error"
            style="color: red"
            v-if="scope.row.cat_deleted"
          ></i>
          <i class="el-icon-success" style="color: lightgreen" v-else></i>
        </template>
        <template slot="paixu" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level == 0">一级</el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level == 1"
            >二级</el-tag
          >
          <el-tag size="mini" type="warning" v-else>三级</el-tag>
        </template>
        <template slot="caozuo" slot-scope="scope">
          <el-button icon="el-icon-edit" size="mini" type="primary" @click="setshop(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button icon="el-icon-delete" size="mini" type="danger" @click="removeshop(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>

      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 5, 6, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加分类的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="fenleidialogVisible"
      width="50%"
      @close="addclealData"
    >
      <el-form
        :model="addfenleiForm"
        :rules="addrules"
        ref="addruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addfenleiForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader
            v-model="selectKeys"
            :options="optionsList"
            :props="cascaderprops"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="fenleidialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="setdialogVisible"
      width="50%"
      
    >
       <el-form
        :model="setfenleiForm"
        :rules="setrules"
        ref="setruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="setfenleiForm.cat_name"></el-input>
        </el-form-item>
       </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setshopxiugai "
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      //   分页列表
      CateList: [],
      //   总条数
      total: 0,
      //   列的定义
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isOk",
        },
        {
          label: "排序",
          type: "template",
          template: "paixu",
        },
        {
          label: "操作",
          type: "template",
          template: "caozuo",
        },
      ],
      // 对话框初始值
      fenleidialogVisible: false,
      // 添加分类框里面的数据
      addfenleiForm: {
        cat_name: "",
        cat_pid: 0, //父级分类的id，默认为一级
        cat_level: 0, //分类的级别，默认为一级
      },
      // 添加分类的表单验证
      addrules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 父级分类的数据
      optionsList: [],
      // 配置级联选择器的配置对象
      cascaderprops: {
        label: "cat_name",
        value: "cat_id",
        expandTrigger: "hover",
        checkStrictly: "true",
      },
      // 级联选择器选中的值存储的地方
      selectKeys: [],
      // 控制编辑对话框显示元素初始值
      setdialogVisible:false,
      // 获取商品的分类名称储存的地方
      setfenleiForm:{},
      setrules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      console.log(res);
      this.CateList = res.data.result;
      this.total = res.data.total;
    },
    // 监听页面条数事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getCateList();
    },
    // 监听页面页数事件
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getCateList();
    },
    // 获取父级分类的数据
    async getParentCatList() {
      const { data: res } = await this.$http.get("categories", {
        params: { type: 2 },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.optionsList = res.data;
      console.log(this.optionsList);
    },
    // 点击展开添加分类的对话框
    addfenlei() {
      this.fenleidialogVisible = true;
      this.getParentCatList();
    },
    // 监听级联选择器的改变事件
    handleChange() {
      // 判断是否选择了父级分类
      if (this.selectKeys.length > 0) {
        this.addfenleiForm.cat_pid =
          this.selectKeys[this.selectKeys.length - 1];
        this.addfenleiForm.cat_level = this.selectKeys.length;
      } else {
        this.addfenleiForm.cat_pid = 0;
        this.addfenleiForm.cat_level = 0;
      }
    },
    // 将新添加的数据存入后台
    addcate() {
      this.$refs.addruleForm.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          "categories",
          this.addfenleiForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("请求失败");
        }
        this.fenleidialogVisible = false;
        this.getCateList();
        this.$message.success("添加分类成功");
      });
    },
    // 对话框关闭重置内容
    addclealData() {
      this.$refs.addruleForm.resetFields();
      this.selectKeys = [];
      this.addfenleiForm.cat_level = 0;
      this.addfenleiForm.cat_pid = 0;
    },
    // 点击编辑出现对话框
   async setshop(id){
      this.setdialogVisible=true
      const{data:res} = await this.$http.get(`categories/${id}`)
       if (res.meta.status !== 200) {
          return this.$message.error("请求失败");
        }
        this.setfenleiForm = res.data

    },
    // 确认修改
    setshopxiugai(){
      // 表单校验，根据element ui提供的方法进行校验 
      this.$refs.setruleFormRef.validate(async valid=>{
        if(!valid){
          return
        }
        const {data:res} =await this.$http.put(`categories/${this.setfenleiForm.cat_id}`,{
          cat_name:this.setfenleiForm.cat_name
        })
        if (res.meta.status !== 200) {
          return this.$message.error("修改分类名称失败");
        }
        this.setdialogVisible = false;
        this.getCateList();
        this.$message.success("修改分类名称成功");
      })
    },
    // 删除目标
    removeshop(id){
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`categories/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("修改用户失败");
          }
          this.getCateList();
          this.$message.success("删除用户成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    }
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
.trree-table {
  margin-top: 15px;
}
</style>