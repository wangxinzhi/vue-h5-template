<template>
  <div class="index-container">
    <van-cell class="card" style="height: 150px;">
      <van-cell>
        <div class="subheader">创源集团资金日报</div>
      </van-cell>
      <van-cell>总本月余额: {{ totalFunds }} 元</van-cell>
      <van-cell>总受限金额: {{ totalLimited }} 元</van-cell>
    </van-cell>
    <van-cell class="card">
      <van-tabs id="myChartP" v-model="activeName" @click="onClick" :style="{ height: this.cardHeight }">
        <van-tab name="chart" title="图表" :style="{ height: this.cardHeight }">
          <div class="pieChart" id="myChart"></div>
        </van-tab>
        <van-tab name="details" title="明细" :style="{ height: this.cardHeight }">
          <van-pull-refresh v-model="loading" @refresh="onRefresh" :style="{ height: this.scrollerHeight }">
            <VuePerfectScrollbar class="scroll-area" :settings="settings" :style="{ height: this.scrollerHeight }">
              <van-cell v-for="item in cashList" :key="item" :title="item.bank" @click="cellClick(item)">
                <template #label>
                  <div>本月余额：{{item.balanceOfMonth}} 元</div>
                  <div>受限金额：{{item.limitedAmount}} 元</div>
                  <div class="Progress mb-3">
                    <span v-for="i in item.currencyAccounts" :key="i.key" class="Progress-item" :style="{ backgroundColor: color[i.key], width: i.value + '%'}"></span>
                    <!-- <span itemprop="keywords" aria-label="JavaScript 71.9" style="background-color: #e34c26;width: 71.9%;" class="Progress-item"></span>
                    <span itemprop="keywords" aria-label="Vue 20.9" style="background-color: #4299e1;width: 20.9%;" class="Progress-item"><div></div></span>
                    <span itemprop="keywords" aria-label="HTML 3.8" style="background-color: #2fb344;width: 3.8%;" class="Progress-item"></span>
                    <span itemprop="keywords" aria-label="SCSS 3.4" style="background-color: #c6538c;width: 3.4%;" class="Progress-item"></span> -->
                  </div>
                  <div class="row">
                    <div v-for="i in item.currencyAccounts" :key="i.key" class="col-auto d-flex align-items-center pe-2">
                      <span class="legend me-2 bg-primary" :style="{ backgroundColor: color[i.key] }"></span>
                      <span>{{ i.key }}</span>
                      <span>{{ i.value}}%</span>
                    </div>
                  </div>
                </template>
              </van-cell>
            </VuePerfectScrollbar>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </van-cell>
  </div>
</template>

<script>
import { getTotalGroupFunds, getSubsidiaryFunds, getSubsidiaryFunds4Charts, getSingleCompanyFundsDetails } from '@/api/cashDashboard.js'
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
// import { mapGetters } from 'vuex'
export default {
  components: {
    VuePerfectScrollbar
  },

  data() {
    return {
      windowHeight: document.documentElement.clientHeight, // 实时屏幕高度
      activeName: 'chart',
      refreshing: false,
      loading: false,
      finished: false,
      totalFunds: '******',
      totalLimited: '******',
      cashList: [{ balanceOfMonth: 1, limitedAmount: 1, bank: '测试', currencyAccounts: [{ key: 'CNY', value: '39' }, { key: 'USD', value: '17.5' }] }, { balanceOfMonth: 1, limitedAmount: 1, bank: '测试1', currencyAccounts: [{ key: 'USD', value: '39' }] }],
      pieData: [],
      color: { CNY: '#FF0000', USD: '#3CB371', EUR: '#0000FF', VND: 'FFFF66', JPY: '#FFC0CB', GBP: '#FFA500' },
      settings: {
        maxScrollbarLength: 30
      },
      scrollerHeight: (document.documentElement.clientHeight - 300) + 'px',
      cardHeight: (document.documentElement.clientHeight - 250) + 'px'
    }
  },

  computed: {},

  watch: {},

  mounted() {
    this.initdata()
  },

  methods: {
    // 初始化数据
    initdata() {
      // 集团总资金数据
      const startTime = '2020-01-01'
      const endTime = new Date()
      const params = { startTime: startTime, endTime: endTime, summaryMark: 'X' }
      getTotalGroupFunds(params).then(res => {
        if (res) {
          this.totalFunds = res.balanceOfMonth
          this.totalLimited = res.limitedAmount
        }
      })
      // 子公司资金数据列表
      // getSubsidiaryFunds(params).then(res => {
      //   if (res) {
      //     this.cashList = res
      //   }
      // })
      // 子公司资金数据for echarts 初始化
      getSubsidiaryFunds4Charts(params).then(res => {
        if (res) {
          // 数据处理
          this.pieData.length = 0
          res.forEach(element => {
            this.pieData.push({ value: element.balanceOfMonth, name: element.bank })
          })
          this.drawLine()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    onClick(name, title) {
      if (name === 'details') {
        this.onRefresh()
      } else if (name === 'chart') {
        const startTime = '2020-01-01'
        const endTime = new Date()
        const params = { startTime: startTime, endTime: endTime, summaryMark: 'X' }
        getSubsidiaryFunds4Charts(params).then(res => {
          if (res) {
          // 数据处理
            this.pieData.length = 0
            res.forEach(element => {
              this.pieData.push({ value: element.dayBalance, name: element.bank })
            })
            this.drawLine()
          }
        }).catch(error => {
          console.log(error)
        })
      }
    },
    drawLine() {
      console.log('drawLine')
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      const option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} 元({d}%)',
          textStyle: {
            fontSize: 9
          },
          confine: true
        },
        legend: {
          type: 'scroll',
          orient: 'horizontal'
        },
        series: [
          {
            type: 'pie',
            radius: '75%',
            center: ['50%', '40%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false
            },
            emphasis: {
              label: {
                show: false,
                fontSize: '2',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: this.pieData
          }
        ]
      }
      // 绘制图表
      myChart.setOption(option)
      myChart.resize({ height: this.cardHeight })
    },
    onRefresh() {
      this.loading = true
      const startTime = '2020-01-01'
      const endTime = new Date()
      const params = { startTime: startTime, endTime: endTime, summaryMark: 'X' }
      getSubsidiaryFunds(params).then(res => {
        if (res) {
          this.cashList = res
        }
        this.loading = false
      }).catch(error => {
        console.log(error)
        this.loading = false
      })
    },
    cellClick(item) {
      console.log('console.log(item)')
      console.log(item)
      const params = { corpId: item.corpId, startTime: '2020-01-01', endTime: '2020-12-31' }
      getSingleCompanyFundsDetails(params).then(res => {
        if (res) {
          console.log(res)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.index-container {
  .card {
        margin: auto;
        margin-top:10px;
        margin-bottom: 10px;
        width: 93%;
        box-shadow: 0 1rpx 5rpx 0px rgba(0, 60, 100, 0.05);
        font-size: 30rpx;
        border-top: 1rpx solid #eee;
        border-radius: 5rpx;
        background: #fff;
        border-radius: 7px;
  }
  .pieChart {
    padding: 8px;
  }
  .scroll-area {
    position: relative;
    margin: auto;
  }
  .subheader {
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1.6;
    color: #656d77;
  }
  .Progress {
    display: flex;
    height: 8px;
    overflow: hidden;
    background-color: var(--color-auto-gray-2);
    border-radius: 6px;
    outline: 1px solid transparent;
    margin: 5px 0px 5px 0px;
  }
  .Progress-item {
    outline: 2px solid transparent;
    border-right: 1px solid #fff;
  }
  .row {
    display: flex;
    flex-wrap: wrap;
  }
  .col-auto {
    flex: 0 0 auto;
    width: auto;
  }
  .d-flex {
    display: flex !important;
  }
  .align-items-center {
    align-items: center !important;
  }
  .me-2 {
    margin-right: .1rem !important;
  }
  .legend {
    display: inline-block;
    width: .75em;
    height: .75em;
    border-radius: 4px;
  }
  .pe-2 {
    padding-right: .5rem !important;
}
}
</style>
