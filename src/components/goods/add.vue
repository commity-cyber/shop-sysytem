<template>
  <div>
    <!-- 标签 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 文字提示信息 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        :closable="false"
        center
      >
      </el-alert>
      <!-- 步骤条 -->
      <!-- 该类型是number类型的 -->
      <el-steps
        :active="activeIndex - 0"
        finish-status="success"
        align-center
        :space="200"
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addFrom"
        :rules="addFromrules"
        ref="addFromRef"
        label-width="100px"
        label-position="top"
      >
        <!-- 标签页 -->
        <!--activeIndex是string  -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="tabPosition"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addFrom.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model.number="addFrom.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model.number="addFrom.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model.number="addFrom.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <el-cascader
                v-model="addFrom.goods_cat"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              v-for="item in manyData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(value, i) in item.attr_vals"
                  :key="i"
                  :label="value"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="text in onlyData"
              :key="text.attr_id"
              :label="text.attr_name"
            >
              <el-input v-model="text.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- action指定上传的地址 -->
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handlesuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addFrom.goods_introduce"> </quill-editor>
             <el-button type="primary" style="margin-top:15px" @click="addGoods">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览的效果 -->
    <el-dialog title="提示" :visible.sync="privewdialogVisible" width="50%">
      <img :src="prievewPath" class="preview-img" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash' //导入loadsh插件
export default {
  data() {
    return {
      activeIndex: "0",
      tabPosition: "left",
      //   添加商品的的表单对象
      addFrom: {
        goods_name: "",
        goods_price: null,
        goods_weight: null,
        goods_number: null,
        // 选中的分类
        goods_cat: [],
        pics: [],
        goods_introduce:'',
        // 参数和属性
        attrs:[]
      },
      // 规则
      addFromrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
      },
      //   分类数据的存储
      cateList: [],
      //   级联选择器的配置对象
      cascaderProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover",
      },
      //  动态参数数据
      manyData: [],
      // 静态属性数据
      onlyData: [],
      //   上传图片的地址
      uploadUrl: " http://www.tangxiaoyang.vip:8888/api/v2/upload",
      // 文件上传时请求头的信息
      headersObj: {
        Authorization: JSON.parse(sessionStorage.getItem("userInfo")).token,
      },
      privewdialogVisible: false,
      prievewPath: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //   获取分类列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.cateList = res.data;
    },
    // 监听选择器改变时候的方法
    handleChange() {
      if (this.addFrom.goods_cat.length !== 3) {
        this.addFrom.goods_cat = [];
      }
    },
    // tabs切换之前会触发
    beforeTabLeave(activeName, oldactiveName) {
      console.log(this.addFrom.goods_cat);
      if (this.addFrom.goods_cat.length !== 3) {
        this.$message.error("请先选择商品的分类");
        return false;
      }
    },
    // 当标签页切换时执行
    async tabClick() {
      // 判断是动态参数还是静态属性
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "many" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取动态参数失败");
        }

        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        });
        this.manyData = res.data;
        console.log(this.manyData);
      } else if (this.activeIndex === "2") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: "only" },
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("获取静态属性失败");
        }

        this.onlyData = res.data;
        console.log(this.onlyData);
      }
    },
    // 图片预览调用的方法
    handlePreview(file) {
      this.privewdialogVisible = true;
      this.prievewPath = file.url;
    },
    // 移除图片
    handleRemove(file) {
      // 1.获取将要删除的临时路劲
      const filePath = file.response.data.tmp_path;
      // 2.从pic中找到这个要删除路劲的索引值
      const i = this.addFrom.pics.findIndex((item) => {
        item.pic === filePath;
      });
      //根据索引将该图片冲pics上删除
      this.addFrom.pics.splice(i, 1);
      console.log(this.addFrom.pics);
    },
    // 图片上传成功以后
    handlesuccess(response) {
      console.log(response.data.tmp_path);
      this.addFrom.pics.push({
        pic: response.data.tmp_path,
      });
      // this.addFrom.pics.push({
      //     pic:response.data.tmp_path
      // })
      console.log(this.addFrom);
    },
    // 添加商品
    addGoods(){
        // 表单验证
        this.$refs.addFromRef.validate(async valid=>{
            if(!valid){
                return
            }
            // 准备请求前的数据
            // 1.处理商品所属分类的数组
            // this.addFrom.goods_cat = this.addFrom.goods_cat.join(',')
            // 问题出现,在改变分类的类型后，刚开始绑定的分类级联选择器，双向绑定时是为数组类型，变成字符串类型后，无法进行双向绑定，从而点击会前面的标签页会出现选择分类的提示信息，从而跳不过去
            // const form = addfrom        浅拷贝，二者为同一对象
            // 使用lodash进行深拷贝
           const form = _.cloneDeep(this.addFrom)
            form.goods_cat = form.goods_cat.join(',')


            // 动态参数和静态属性
            this.manyData.forEach(item=>{
                form.attrs.push({
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals.join(' ')
                })
            })

            // 静态属性
            this.onlyData.forEach(item=>{
                form.attrs.push({
                    attr_id:item.attr_id,
                    attr_value:item.attr_vals
                })
            })
             const{data:res} = await this.$http.post('goods',form)
               if (res.meta.status !== 201) {
                return this.$message.error("添加商品失败");

      }
        this.$message.success('添加商品成功')
        this.$router.push('/goods')
        })
    }
  },
  computed: {
    // 获取分类id
    cateId() {
      return this.addFrom.goods_cat.length === 3
        ? this.addFrom.goods_cat[2]
        : [];
    },
  },
};
</script>

<style lang="less" scoped>
.el-checkbox {
  margin-right: 10px;
}
.preview-img {
  width: 100%;
}
</style>