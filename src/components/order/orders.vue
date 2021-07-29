<template>
  <div>
    <!-- 标签 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrederList"
            ></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table
        :data="orderList"
        border
        stripe
        @expand-change="chaxundingdangxinxi"
      >
        <el-table-column type="expand" label="明细">
          <!-- 订单下商品展示的明细详情 -->
          <template slot-scope="scope">
            <el-table :data="scope.row.detail">
              <el-table-column
                label="封面"
                width="100px"
                header-align="center"
                align="center"
              >
                <!-- 自定义模板 -->
                <template slot-scope="sc">
                  <!-- 实现图片的放大效果 -->
                  <el-popover placement="top-start" trigger="hover">
                    <img
                      :src="sc.row.url"
                      alt=""
                      style="width: 150px; height: 150px"
                    />
                    <img
                      :src="sc.row.url"
                      alt=""
                      slot="reference"
                      style="width: 50px; height: 50px"
                    />
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="goods_name" label="商品名称">
              </el-table-column>
              <el-table-column
                prop="goods_weight"
                label="商品重量"
                width="100px"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="goods_number"
                label="商品数量"
                width="100px"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="goods_price"
                label="商品价格"
                width="100px"
                header-align="center"
                align="center"
              >
              </el-table-column>
              <el-table-column
                prop="goods_total_price"
                label="商品总价"
                width="100px"
                header-align="center"
                align="center"
              >
              </el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column
          type="index"
          label="序号"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column
          prop="order_price"
          label="订单价格(元)"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag
              effect="dark"
              type="danger"
              size="mini"
              v-if="scope.row.pay_status === '0'"
            >
              未付款
            </el-tag>
            <el-tag effect="dark" type="success" size="mini" v-else>
              已付款
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="is_send"
          label="是否发货"
          header-align="center"
          align="center"
        >
        </el-table-column>
        <el-table-column prop="create_time" label="下单时间"> </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑订单"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="editres(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip
              class="item"
              effect="dark"
              content="物流信息"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-location-outline"
                size="mini"
                @click="openprogress(scope.row.order_id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[1, 5, 10, 15]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 修改收获地址的对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="addresdialogVisible"
      width="50%"
      @close="clearFrom"
    >
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader
            v-model="addForm.address1"
            :options="cityDate"
            @change="handleChange"
            width="100%"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addresdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setadress">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 查看物流进度对话框 -->
    <el-dialog title="提示" :visible.sync="progresssdialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import cityDate from "./citydata";
export default {
  data() {
    return {
      queryinfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      total: 0,
      orderList: [],
      addresdialogVisible: false,
      cityDate,
      addForm: {
        address1: [],
        address2: "",
      },
      addrules: {
        address1: [{ required: true, message: "请输入城市", trigger: "blur" }],
        address2: [{ required: true, message: "请输入地址", trigger: "blur" }],
      },
      order_id: null,
      progresssdialogVisible: false,
    //   存储物流信息
      activities:{}
    };
  },
  created() {
    this.getOrederList();
  },
  methods: {
    //   获取到订单列表的数据
    async getOrederList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryinfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单列表失败");
      }
      for (let item of res.data.goods) {
        item.create_time = this.$untils.formatToTime(item.create_time);
        // 为每个订单添加字段
        item.detail = [];
      }
      console.log(res.data);
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听页面大小
    handleSizeChange(pageszie) {
      this.queryinfo.pageszie = pageszie;
      this.getOrederList();
    },
    // 监听页的数量
    handleCurrentChange(pagenum) {
      this.queryinfo.pagenum = pagenum;
      this.getOrederList();
    },
    // 清楚搜索框时候
    getGoodsList() {
      this.getOrederList();
    },
    // 获取订单详情
    async chaxundingdangxinxi(row) {
      const { data: res } = await this.$http.get(`orders/${row.order_id}`);
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单明细失败");
      }
      console.log(res.data);
      row.detail = res.data.goods;

      // 获取商品详细的信息
      row.detail.forEach(async (item) => {
        const { data: res } = await this.$http.get(`goods/${item.goods_id}`);
        if (res.meta.status !== 200) {
          return this.$message.error("获取商品详细信息失败");
        }

        this.$set(item, "goods_name", res.data.goods_name); //为商品对象响应式添加属性，
        this.$set(item, "goods_weight", res.data.goods_weight); //为商品对象响应式添加属性，
        this.$set(item, "url", res.data.pics[0].pics_big_url); //为商品对象响应式添加属性，
      });
      console.log(row);
    },
    editres(order_id) {
      this.order_id = order_id;
      this.addresdialogVisible = true;
    },
    handleChange() {},
    // 确定修改地址
    setadress() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return;
        }
        const { data: res } = await this.$http.put(
          `orders/${this.order_id}/address`,
          {
            consignee_addr:
              this.addForm.address1.join(",") + "," + this.addForm.address2,
          }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改详细信息失败");
        }
        this.addresdialogVisible = false;
        this.getOrederList();
        this.$message.success("修改收货地址成功");
      });
    },
    // 修改收获地址表单的重置
    clearFrom() {
      this.$refs.addFormRef.resetFields();
    },

    // 查看物流进度
    async openprogress() {
      const { data: res } = await this.$http.get("/kuaidi/815294206237577");
      if (res.meta.status !== 200) {
        return this.$message.error("获取物流明细失败");
      }
      this.activities = res.data
      this.progresssdialogVisible = true;
    },
  },
};
</script>

<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>