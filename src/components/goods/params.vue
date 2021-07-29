<template>
  <div>
    <!-- 标签 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 提示信息 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 级联选择器 -->
      <el-row class="cat_row">
        <el-col>
          <span>请选择商品分类:</span>
          <el-cascader
            v-model="shopvalue"
            :options="cateList"
            :props="cascardprops"
            @change="handleChange"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnDisabled"
            @click="addparams"
            >添加参数</el-button
          >
          <el-table :data="paramslist">
            <el-table-column label="明细" type="expand">
              <template slot-scope="scope">
                <!-- 标签 -->
                <!-- 渲染遍历的数据到标签上 -->
                <el-tag
                  :key="i"
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  @close="handleClose(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="shoeweditdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeparams(scope.row.attr_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="btnDisabled"
            @click="addparams"
            >添加属性</el-button
          >
          <el-table :data="paramslist">
            <el-table-column label="明细" type="expand">
              <template slot-scope="scope">
                <!-- 标签 -->
                <!-- 渲染遍历的数据到标签上 -->
                <el-tag
                  :key="i"
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  @close="handleClose(scope.row, i)"
                >
                  {{ item }}
                </el-tag>
                <!-- 输入的文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加的按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="序号" type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="shoeweditdialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  icon="el-icon-delete"
                  @click="removeparams(scope.row.attr_id)"
                  >删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框 -->
    <el-dialog
      :title="'添加' + tittle"
      :visible.sync="adddialogVisible"
      width="50%"
      @close="cleardialog"
    >
      <el-form
        :model="addpatamsForm"
        :rules="addrules"
        ref="addParamsRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="tittle" prop="attr_name">
          <el-input v-model="addpatamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcanshu">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + tittle"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editcleardialog"
    >
      <el-form
        :model="editpatamsForm"
        :rules="editrules"
        ref="editParamsRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="tittle" prop="attr_name">
          <el-input v-model="editpatamsForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editcanshu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      cateList: [],
      //   级联选择器的配置
      cascardprops: {
        label: "cat_name",
        value: "cat_id",
        childrem: "children",
        expandTrigger: "hover",
      },
      // 返回的数据
      shopvalue: [],
      //   默认激活的标签页
      activeName: "many",
      // 存储的数据
      paramslist: [],
      adddialogVisible: false,
      addpatamsForm: {},
      addrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editdialogVisible: false,
      editpatamsForm: {},
      editrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  //   获取分类数据
  async created() {
    const { data: res } = await this.$http.get("categories");
    if (res.meta.status !== 200) {
      return this.$message.error("请求失败");
    }
    this.cateList = res.data;
  },
  methods: {
    //   级联选择触发时的方法
    handleChange() {
      this.getParamsCat();
    },
    // 监听标签的点击事件
    handleClick() {
      this.getParamsCat();
    },
    async getParamsCat() {
      //   判断是否选中三级分类，如果未选中，则要重新选择
      if (this.shopvalue.length !== 3) {
        (this.shopvalue = []), (this.paramslist = []);
        return;
      }
      // 根据分类选择静态或者动态属性
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes`,
        {
          params: {
            sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      // 对参数明细进行处理,按空格拆分
      res.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        item.inputVisible = false; //控制文本框的显示和隐藏
        item.inputValue = ""; //文本框中输入的值
      });

      this.paramslist = res.data;
    },
    addparams() {
      this.adddialogVisible = true;
    },
    // 添加参数确认
    addcanshu() {
      this.$refs.addParamsRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.post(
          `categories/${this.catId}/attributes`,
          {
            attr_name: this.addpatamsForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        if (res.meta.status !== 201) {
          return this.$message.error("请求失败");
        }
        this.adddialogVisible = false;
        this.getParamsCat();
        this.$message.success("添加参数成功");
      });
    },
    // 监听表单的重置
    cleardialog() {
      this.$refs.addParamsRef.resetFields();
    },
    editcleardialog() {
      this.$refs.editParamsRef.resetFields();
    },
    // 删除展示的参数和属性
    removeparams(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          const { data: res } = await this.$http.delete(
            `categories/${this.catId}/attributes/${id}`
          );
          if (res.meta.status !== 200) {
            return this.$message.error("修改失败");
          }
          this.getParamsCat();
          this.$message.success("删除成功");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    // 显示编辑对话框
    async shoeweditdialog(id) {
      const { data: res } = await this.$http.get(
        `categories/${this.catId}/attributes/${id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("请求失败");
      }
      this.editpatamsForm = res.data;
      this.editdialogVisible = true;
    },
    editcanshu() {
      this.$refs.editParamsRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `categories/${this.catId}/attributes/${this.editpatamsForm.attr_id}`,
          {
            attr_name: this.editpatamsForm.attr_name,
            attr_sel: this.activeName,
            attr_vals: this.editpatamsForm.attr_vals,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("请求失败");
        }
        this.editdialogVisible = false;
        this.getParamsCat();
        this.$message.success("修改参数名称成功");
      });
    },
    // 监视tag标签关闭
    handleClose(row, i) {
      row.attr_vals.splice(i, 1);
      // 更新参数明细
      this.updatParamsList(row);
    },
    // 控制显示和隐藏
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick(() => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 当文本框失去焦点或者按下文本框的时候触发的方法
    handleInputConfirm(row) {
      if (row.inputValue.trim()) {
        row.attr_vals.push(row.inputValue.trim());
        // 更新参数明细
        this.updatParamsList(row);
      }
      row.inputVisible = false;
      row.inputValue = "";
    },
    // 更新明细的方法
    async updatParamsList(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.catId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("更新失败");
      }
      this.$message.success("更新成功");
    },
  },
  computed: {
    //   当前选择的第三级分类的id
    catId() {
      return this.shopvalue.length == 3 ? this.shopvalue[2] : null;
    },
    // 启用禁用按钮
    btnDisabled() {
      return this.shopvalue.length === 3 ? false : true;
    },
    // 显示的标题
    tittle() {
      return this.activeName === "many" ? "动态参数" : "静态属性";
    },
  },
};
</script>

<style>
.cat_row {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
.input-new-tag {
  width: 120px;
}
</style>