<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="addrolesd">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 角色列表的展示 -->
      <el-table :data="rolesList" style="width: 100%">
        <!-- 展开列 -->
        <el-table-column type="expand" label="明细">
          <template slot-scope="scope">
            <!-- 一级菜单的渲染 -->
            <el-row
              v-for="(item1, i1) in scope.row.children"
              :key="item1.id"
              :class="{ bdbottom: true, bdtop: i1 == 0, vcenter: true }"
            >
              <el-col :span="5">
                <el-tag closable @close="removtag(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 渲染二级权限 -->
                <el-row
                  v-for="(item2, i2) in item1.children"
                  :key="item2.id"
                  :class="{ bdbottom: true, bdtop: i2 != 0, vcenter: true }"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removtag(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removtag(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="220">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="editroles(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeroles(scope.row.id)"
              >删除</el-button
            >
            <el-button size="mini" type="warning" icon="el-icon-setting" @click="fpright(scope.row)"
              >分配角色</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色的功能 -->
    <el-dialog
      title="提示"
      :visible.sync="addRoledialogVisible"
      width="50%"
      @close="clearRole"
    >
      <el-form
        :model="addroleruleForm"
        :rules="addrolerules"
        ref="ruleFormREFS"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addroleruleForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addroleruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addroless">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色的功能 -->
    <el-dialog
      title="提示"
      :visible.sync="editRoledialogVisible"
      width="50%"
      @close="cleareditRole"
    >
      <el-form
        :model="editroleruleForm"
        :rules="editrolerules"
        ref="editruleFormREFS"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editroleruleForm.roleName">{{
            editroleruleForm.roleName
          }}</el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editroleruleForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editRoledialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editroless">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配权限 -->
    <el-dialog title="提示" :visible.sync="rightdialogVisible" width="50%" @close="righttreeclear">
      <el-tree ref="treeRef" :data="treelist" :props="treeProps" node-key="id" show-checkbox default-expand-all :default-checked-keys="defaultkey"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="rightqx">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rolesList: [],
      addRoledialogVisible: false,
      addroleruleForm: {
        roleName: "",
        roleDesc: "",
      },
      addrolerules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      editRoledialogVisible: false,
      editroleruleForm: {},
      editrolerules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
        ],
      },
      rightdialogVisible:false,
      treelist:[],
    //   指定树形组件里面的label和子一级数据名
    treeProps:{
        label:'authName',
        children:'children'
    },
    // 权限树形图的选中状态时存储的id(唯一标识就是id)
    defaultkey:[],
    // 存储当前分配角色的id
    nowid:''
    };
  },
  created() {
    this.getRloesList();
  },
  methods: {
    async getRloesList() {
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.rolesList = res.data;
      console.log(this.rolesList);
    },
    // 添加角色的方法
    addrolesd() {
      this.addRoledialogVisible = true;
    },
    // 添加用户的成功确认按钮触发的方法
    addroless() {
      this.$refs.ruleFormREFS.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请求数据失败");
        }
        const { data: res } = await this.$http.post(
          "roles",
          this.addroleruleForm
        );
        if (res.meta.status !== 201) {
          return this.$message.error("获取用户成功");
        }
        this.addRoledialogVisible = false;
        this.getRloesList();
        this.$message.success("添加角色成功");
      });
    },
    // 清理内容
    clearRole() {
      this.$refs.ruleFormREFS.resetFields();
    },
    // 修改用户的方法
    async editroles(id) {
      const { data: res } = await this.$http.get(`roles/${id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户数据失败");
      }
      this.editroleruleForm = res.data;
      console.log(this.editroleruleForm);
      this.editRoledialogVisible = true;
    },
    // 确认用户修改完成
    editroless() {
      this.$refs.editruleFormREFS.validate(async (valid) => {
        if (!valid) {
          return;
        }
        // 更具id上传修改后的值,记得是异步请求的，需要加await和async，
        const { data: res } = await this.$http.put(
          `roles/${this.editroleruleForm.roleId}`,
          {
            roleName: this.editroleruleForm.roleName,
            roleDesc: this.editroleruleForm.roleDesc,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改角色失败");
        }
        this.editRoledialogVisible = false;
        this.getRloesList();
        this.$message.success("修改角色成功");
      });
    },
    cleareditRole() {
      this.editroleruleForm = {};
    },
    // 删除角色
    removeroles(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(`roles/${id}`);
          if (res.meta.status !== 200) {
            return this.$message.error("修改用户失败");
          }
          this.getRloesList();
          this.$message.success("删除用户成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 删除权限
    removtag(role, rightId) {
      this.$confirm("此操作将永久删除该权限, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `roles/${role.id}/rights/${rightId}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("修改用户失败");
          }
          //   this.getRloesList();//不需要重新刷新页面
          role.children = res.data; //根据返回的该角色的最新权限数据，直接给到该角色上重新遍历即可
          this.$message.success("删除用户成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },

    // 分配权限
   async   rightqx() {
      const keys =  this.$refs.treeRef.getCheckedKeys().concat(this.$refs.treeRef.getHalfCheckedNodes())
      const idStr = keys.join(',')
      const{data:res} =await this.$http.post(`roles/${this.nowid}/rights`,{
            rids:idStr
            
        })
         if (res.meta.status !== 200) {
          return this.$message.error("修改权限失败");
        }
        this.rightdialogVisible=false
        this.getRloesList();
        this.$message.success('分配权限成功')
      
    },
    // 获取用户权限框的开关，并且以树形图展示权限内容
   async fpright(role){
        this.rightdialogVisible=true
        const {data:res} =await this.$http.get('rights/tree')
        if (res.meta.status !== 200) {
          return this.$message.error("获取用户成功");
        }
        this.treelist = res.data
        this.getLeafKeys(role)
        this.nowid  = role.id
        console.log(this.treelist)
         console.log(this.defaultkey)
    },
    // 使用递归方法判断是否为三级菜单
    getLeafKeys(node){
        // 判断是否还有下一级菜单，
        if(!node.children){
           return this.defaultkey.push(node.id)
        }
        // 如果还有下一层就使用递归
        node.children.forEach(item => {
            // item指的是下一级菜单对象,把该对象在此进行getLeafKeys方法
            this.getLeafKeys(item)
        });
    },
    // 清除上一个角色的所具有的权限id
    righttreeclear(){
        this.defaultkey=[]
        
    }
  },
};
</script>

<style>
.el-tag {
  margin: 6px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>