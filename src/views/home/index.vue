<!-- home -->
<template>
  <div class="index-container">
    <div class="warpper">
      <h1 class="demo-home__title"><img src="https://www.sunniejs.cn/static/weapp/logo.png" /><span>创源管理驾驶舱</span></h1>
      <h2 class="demo-home__desc">
        Cre8direct Management Cockpit
      </h2>
    </div>
    <div class="card">
      <van-cell icon="success" v-for="item in list" :key="item.key" :title="item.title" is-link :to="item.route" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          key: '1',
          title: '收入',
          route: '/admin/income'
        },
        {
          key: '2',
          title: '月订单以及预算',
          route: '/admin/salesAndBudget'
        },
        {
          key: '3',
          title: '年度销售额完成度',
          route: '/admin/salesDashboard'
        },
        {
          key: '4',
          title: '资金',
          route: '/admin/cashDashboard'
        }
      ]
    }
  },

  computed: {},

  mounted() {

  },

  methods: {
  }
}
</script>
<style lang="scss" scoped>
.index-container {
  .warpper {
    padding: 12px;
    background: #fff;
    margin: auto;
    margin-top:10px;
    margin-bottom: 10px;
    margin-left:10px;
    margin-right: 10px;
    .demo-home__title {
      margin: 0 0 6px;
      font-size: 32px;
      .demo-home__title img,
      .demo-home__title span {
        display: inline-block;
        vertical-align: middle;
      }
      img {
        width: 32px;
      }
      span {
        margin-left: 16px;
        font-weight: 500;
      }
    }
    .demo-home__desc {
      margin: 0 0 20px;
      color: rgba(69, 90, 100, 0.6);
      font-size: 14px;
    }
  }
  .card {
    padding: 3px;
    margin: auto;
    margin-top:10px;
    margin-bottom: 10px;
    margin-left:10px;
    margin-right: 10px;
    height: 85%;
    width: 93%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    font-size: 30rpx;
    border-top: 1rpx solid #eee;
    border-radius: 5rpx;
    background: #fff;
    border-radius: 7px;
}
}
</style>
