<template>
  <div>
    <!-- 导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <template #append>
              <!-- 搜索功能 -->
              <el-button icon="el-icon-search" @click="getUserList"></el-button>
            </template>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="ADDdialogVisible = true"
            >添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户数据显示的地方 -->
      <el-table :data="userList" border stripe>
        <el-table-column type="index" label="索引"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column label="状态">
          <!-- 自定义状态列表的模板，使用作用域插槽，通过scope.row获取当前行的数据 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <!-- 自定义状态列表的模板，使用作用域插槽，通过scope.row获取当前行的数据 -->
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
                @click="edituser(scope.row.id)"
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
                @click="removeuser(scope.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setroles(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页功能实现 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户的标签 -->
    <el-dialog
      title="提示"
      :visible.sync="ADDdialogVisible"
      width="50%"
      @close="clealData"
    >
      <el-form
        :model="Addform"
        :rules="Addformrules"
        ref="AddFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="Addform.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="Addform.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="Addform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="Addform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ADDdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ADDuser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的标签 -->
    <el-dialog title="提示" :visible.sync="editdialogVisible" width="50%">
      <el-form
        :model="editform"
        :rules="editformrules"
        ref="editFormRef"
        label-width="70px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editform.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editform.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editusers">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户的角色 -->
    <el-dialog title="提示" :visible.sync="setdialogVisible" width="50%"  @close="setclealData">
      <p>当前用户：{{ userinfo.username }}</p>
      <p>当前角色:{{ userinfo.role_name }}</p>
      <p>
        分配新的角色：
        <el-select v-model="selectRloeId" placeholder="请选择">
          <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setusers">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询用户列表所传的参数
      queryInfo: {
        query: "",
        pagenum: 1, //页码
        pagesize: 5, //页大小
      },
      // 用户数据的存储
      userList: [],
      total: 0,
      // 对话框的点击事件
      ADDdialogVisible: false,
      // 添加用户的表单数据
      Addform: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 添加用户的规则
      Addformrules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          // { pattern:/^1[3456789]d{9}$/, message: '手机格式不正确', trigger: 'blur'}
        ],
      },
      // 修改用户的表单数据
      editform: {},
      // 修改用户的规则
      editformrules: {
        username: [
          { required: true, message: "请输入用户名称", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
            message: "邮箱格式不正确",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          // { pattern:/^1[3456789]d{9}$/, message: '手机格式不正确', trigger: 'blur'}
        ],
      },
      editdialogVisible: false,
      setdialogVisible: false,
      // 存储用户的id，和用户修改后的邮箱与手机号的信息
      userinfo: {},
      //  角色列表
      rolesList: [],
      // 存放rid，id的地方。通过双向绑定，获取到角色信息的同时就已经获取到这个数据了，并且存放在该字段内
      selectRloeId:null
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // h获取用户列表数据
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表失败");
      }
      this.userList = res.data.users;
      this.total = res.data.total;
      console.log(this.userList);
    },
    // 监听pagesize（页面条数）的事件
    handleSizeChange(pagesize) {
      this.queryInfo.pagesize = pagesize;
      this.getUserList();
    },
    // 监听pagenum（页面数）跳转页面的事件
    handleCurrentChange(pagenum) {
      this.queryInfo.pagenum = pagenum;
      this.getUserList();
    },
    // 监听用户的状态
    async userStateChange(userinfo) {
      //  console.log(userinfo.id);
      //  console.log('${userinfo.id}');
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      );
      //
      if (res.meta.status !== 200) {
        userinfo.mg_state = !userinfo.mg_state;
        return this.$message.error("更新用户状态失败");
      }
      this.$message.success("更新用户状态成功");
    },
    // 点击关闭时清空内容
    clealData() {
      this.$refs.AddFormRef.resetFields();
    },
    // 添加用户
    ADDuser() {
      this.$refs.AddFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post("users", this.Addform);
        if (res.meta.status !== 201) {
          return this.$message.error("获取用户成功");
        }
        // 添加用户成功关闭对话框
        this.ADDdialogVisible = false;
        // 重新刷新下页面，将新添加的用户显示上去
        this.getUserList();
        // 提示添加用户成功的文字
        this.$message.success("添加用户成功");
        // // 清楚添加用户框的内容
        // this.clealData()
      });
    },
    // 获取用户的数据
    async edituser(id) {
      const { data: res } = await this.$http.get(`users/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户数据失败");
      }
      this.editform = res.data;
      this.editdialogVisible = true;
    },
    // 修改用户的信息并且提交
    editusers() {
      // 表单校验
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        // 更具id上传修改后的数据
        const { data: res } = await this.$http.put(
          `users/${this.editform.id}`,
          {
            email: this.editform.email,
            mobile: this.editform.mobile,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户失败");
        }
        this.editdialogVisible = false;
        this.getUserList();
        this.$message.success("修改用户成功");
      });
    },
    // 删除用户请求
    removeuser(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`users/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("修改用户失败");
          }
          this.getUserList();
          this.$message.success("删除用户成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 修改用户角色点击按钮
    async setroles(userinfo) {
      this.userinfo = userinfo;

      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("修改用户失败");
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
      this.setdialogVisible = true;
    },
    // 清空角色信息
    setclealData(){
      this.selectRloeId = null
      this.userinfo = {}
    },
   async setusers() {
     console.log(this.selectRloeId)
      // 判断用户是否选择好了新的角色
      if(!this.selectRloeId){
        return this.$message.error('请选择角色')
      }
      const{data:res} = await this.$http.put(`users/${this.userinfo.id}/role`,{
        rid:this.selectRloeId
      })
      console.log(res.data)
      if (res.meta.status !== 200) {
        return this.$message.error("更新角色失败");
      }
      
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setdialogVisible=false
    },
  },
};
</script>

<style lang="less" scoped></style>
