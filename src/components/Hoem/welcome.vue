<template>
  <div>
    <!-- 标签 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>欢迎页</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 数据的统计 -->
    <el-row :gutter="10">
      <el-col :span="6">
        <!-- 统计 -->
        <div class="tj" style="background: #409eff">
          <div class="tittle">
            <p>用户统计</p>
            <el-tag size="mini" type="success">实时</el-tag>
          </div>
          <div class="numbe">{{ total }}</div>
          <div class="tip">当前总用户数量</div>
        </div>
      </el-col>
      <el-col :span="6">
        <!-- 统计 -->
        <div
          class="tj"
          style="background: rgb(230, 162, 60) none repeat scroll 0% 0%"
        >
          <div class="tittle">
            <p>商品统计</p>
            <el-tag size="mini" type="success">实时</el-tag>
          </div>
          <div class="numbe">{{ goodstotal }}</div>
          <div class="tip">当前总商品数量</div>
        </div>
      </el-col>
      <el-col :span="6">
        <!-- 统计 -->
        <div
          class="tj"
          style="background: rgb(103, 194, 58) none repeat scroll 0% 0%"
        >
          <div class="tittle">
            <p>订单统计</p>
            <el-tag size="mini" type="success">实时</el-tag>
          </div>
          <div class="numbe">{{ ordertotal }}</div>
          <div class="tip">当前总订单数量</div>
        </div>
      </el-col>
      <el-col :span="6">
        <!-- 统计 -->
        <div
          class="tj"
          style="background: rgb(144, 147, 153) none repeat scroll 0% 0%"
        >
          <div class="tittle">
            <p>销售统计</p>
            <el-tag size="mini" type="success">实时</el-tag>
          </div>
          <div class="numbe">{{ ordersum }}</div>
          <div class="tip">当前总销售数量</div>
        </div>
      </el-col>
    </el-row>

    <!-- echarts -->
    <div class="echarts-container">
      <el-card id="charts1"></el-card>
      <el-card id="charts2"></el-card>
    </div>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {
      total: 0,
      goodstotal: 0,
      ordertotal: 0,
      orderList: [],
      ordersum: 0,
    };
  },
  created() {
    this.getUsersList();
    this.getGoodsList();
    this.getOrderList();
  },
  methods: {
    async getUsersList() {
      const { data: res } = await this.$http.get("users", {
        params: {
          pagenum: 1,
          pagesize: 1,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户失败");
      }
      // console.log(res.data)
      this.total = res.data.total;
    },
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: {
          pagenum: 1,
          pagesize: 1,
        },
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户失败");
      }
      // console.log(res.data)
      this.goodstotal = res.data.total;
    },
    async getOrderList() {
      const { data: res } = await this.$http.get("orders");
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户失败");
      }
      // console.log(res.data)
      this.ordertotal = res.data.total;
      // 计算销售额
      this.orderList = res.data.goods;
      this.orderList.forEach((item) => {
        item.pay_status == "1"
          ? (this.ordersum += item.order_price)
          : (this.ordersum += 0);
        // if(item.pay_status =='1'){
        //   this.ordersum += item.order_price
        // }
        // console.log(this.ordersum);

        // 展示图表
        this.initechart1();
        this.initechart2();
      });
    },
    initechart1() {
      // 创建echart实例
      var chart1 = echarts.init(document.getElementById("charts1"));

      var option = {
        title: {
          text: "订单趋势",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "line",
          },
        },
        xAxis: {
          type: "category",
          data: [], // ['03.20', '03.21'],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            type: "line",
            smooth: true,
            data: [], // [260, 406]
          },
        ],
      };

      //  对数据做处理
      // 1.对数据进行排序(升序)
      this.orderList.sort(function (a, b) {
        return a.create_time - b.create_time;
      });

      let data = [];
      this.orderList.forEach((item) => {
        if (item.pay_status === "1") {
          // 拿到格式完的时间啊
          let key = this.$untils.formatToDate(item.create_time);
          // console.log(key)
          // 判断data数组里面是否已有该事件的的订单价格，没有的话就添加，
          if (!data[key]) {
            data[key] = item.order_price;
          } else {
            // 有的话就在原来的基础上在添加价格
            data[key] += item.order_price;
          }
        }
      });

      // 将获取的时间和价格存入数据中
      for (var key in data) {
        option.xAxis.data.push(key);
        option.series[0].data.push(data[key]);
      }
      // console.log(data);
      // 使用刚指定的配置项和数据显示图表
      chart1.setOption(option);
    },
    initechart2() {
      var chart2 = echarts.init(document.getElementById("charts2"));

      // 订单状态
      var option = {
        title: {
          text: "订单状态",
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)",
        },
        legend: {
          orient: "vertical",
          left: "right",
          data: [],
        },
        series: [
          {
            name: "订单状态",
            type: "pie",
            radius: "55%",
            center: ["50%", "60%"],
            // data: [
            //     {value: 335, name: '直接访问'},
            //     {value: 310, name: '邮件营销'},
            //     {value: 234, name: '联盟广告'},
            //     {value: 135, name: '视频广告'},
            //     {value: 1548, name: '搜索引擎'}
            // ],
            data: [],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)",
              },
            },
          },
        ],
      };

      /**
       *  对数据进行处理
       */
      var data = [
          {
              name:'已付款',
              value:0
          },
          {
              name:'未付款',
              value:0
          }
      ]

      // 对订单进行循环的操作
      this.orderList.forEach(item=>{
        if(item.pay_status==='1'){
          data[0].value++
        }else{
          data[1].value++
        }
      })
        console.log(data)
      // 把数据放入里面
      for(var item of data){
        option.legend.data.push(item.name)
        option.series[0].data.push(item)
      }

      // 使用刚指定的配置项和数据显示图表
      chart2.setOption(option);
    },
  },
};
</script>

<style lang="less" scoped>
.el-row {
  padding: 0 9px;
  .tj {
    color: white;
    padding: 0 8px;
    border-radius: 4px;
    height: 100px;
    .tittle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 13px;
      }
    }
    .numbe {
      text-align: center;
      font-size: 20px;
      font-weight: 700px;
    }
    .tip {
      font-size: 12px;
    }
  }
}
.echarts-container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  .el-card {
    height: 400px;
    width: 50%;
    margin: 0 8px;
    padding: 20px;
  }
}
</style>