<template>
  <div class="index-container">
    <van-cell class="card" style="height: 150px;">
      <van-cell>
        <div class="title-row">
          <div class="subheader">创源集团资金日报</div>
          <div class="calendar">
            <svg class="icon iconfont" @click="click" style="font-size: 23px">
              <use xlink:href="#icon-_rili_"/>
            </svg>
            <van-action-sheet v-model="show" @click-overlay="overlay" @click="stopPro($event)">
              <!-- <vc-date-picker ref="vcDatePicker" v-model="range" :model-config="modelConfig" :minDate="minDate" :maxDate="maxDate" is-range is-expanded /> -->
              <van-calendar type="range" :poppable="false" :show-confirm="false" :style="{ height: '500px' }" :min-date="minDate" :max-date="maxDate" :allow-same-day="true" @confirm="onConfirm"/>
            </van-action-sheet>
            <!-- <span class="icon iconfont icon-riqi" @click="click" style="font-size: 25px"> -->
            <!-- </span> -->
          </div>
        </div>
      </van-cell>
      <van-cell style="padding: 5px 5px 5px 16px">总余额: {{ totalFunds | NumToUnitNum }} {{ totalFunds | GetUnit }}</van-cell>
      <van-cell style="padding: 5px 5px 5px 16px">总受限金额: {{ totalLimited | NumToUnitNum }} {{ totalLimited | GetUnit }}</van-cell>
    </van-cell>
    <van-cell class="card">
      <van-tabs id="myChartP" v-model="activeName" @click="onClick" :style="{ height: this.cardHeight }">
        <van-tab name="chart" title="图表" :style="{ height: this.cardHeight }">
          <div class="pieChart" id="myChart"></div>
        </van-tab>
        <van-tab name="details" title="明细" :style="{ height: this.cardHeight }">
          <!-- <van-pull-refresh v-model="loading" @refresh="onRefresh" :style="{ height: this.scrollerHeight }"> -->
            <VuePerfectScrollbar class="scroll-area" :settings="settings" :style="{ height: this.scrollerHeight }">
              <van-cell v-for="item in cashList" :key="item" :title="item.bank" @click="cellClick(item)">
                <template #label>
                  <div>本日余额：{{ item.balanceOfMonth | NumToUnitNum }} {{ item.balanceOfMonth | GetUnit }}</div>
                  <div>受限金额：{{ item.limitedAmount | NumToUnitNum }} {{ item.limitedAmount | GetUnit }}</div>
                  <div v-if="item.corpId === '1000'">宁波创源余额：{{ item.balanceOfMonth - item.limitedAmount | NumToUnitNum }} {{ item.balanceOfMonth - item.limitedAmount | GetUnit }}</div>
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
                      <span>{{ i.value }}%</span>
                    </div>
                  </div>
                </template>
              </van-cell>
            </VuePerfectScrollbar>
          <!-- </van-pull-refresh> -->
        </van-tab>
      </van-tabs>
    </van-cell>
  </div>
</template>

<script>
import { getTotalGroupFunds, getSubsidiaryFunds, getSubsidiaryFunds4Charts } from '@/api/cashDashboard.js'
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
      cashList: [],
      // [{ balanceOfMonth: 1, limitedAmount: 1, bank: '测试', currencyAccounts: [{ key: 'CNY', value: '29' }, { key: 'USD', value: '17.5' }, { key: 'GBP', value: '7.5' }, { key: 'VND', value: '8.5' }, { key: 'JPY', value: '19.5' }, { key: 'EUR', value: '10.5' }] }, { balanceOfMonth: 1, limitedAmount: 1, bank: '测试1', currencyAccounts: [{ key: 'USD', value: '39' }] }]
      pieData: [],
      color: { CNY: '#FF0000', USD: '#3CB371', EUR: '#0000FF', VND: '#FFFF66', JPY: '#FFC0CB', GBP: '#FFA500', HKD: '#FA58F4' },
      settings: {
        maxScrollbarLength: 30
      },
      scrollerHeight: (document.documentElement.clientHeight - 300) + 'px',
      cardHeight: (document.documentElement.clientHeight - 250) + 'px',
      minDate: new Date(1969, 0, 1),
      maxDate: new Date(),
      range: {
        startTime: new Date(2020, 0, 1),
        endTime: new Date()
      },
      modelConfig: {
        type: 'string',
        mask: 'YYYY-MM-DD' // Uses 'iso' if missing
      },
      vanActionSheetShow: false,
      show: false
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
      const startTime = this.range.startTime
      const endTime = this.range.endTime
      const params = { startTime: startTime, endTime: endTime, summaryMark: 'X' }
      getTotalGroupFunds(params).then(res => {
        if (res) {
          this.totalFunds = res.balanceOfMonth
          this.totalLimited = res.limitedAmount
        }
      })
      // 子公司资金数据列表
      getSubsidiaryFunds(params).then(res => {
        if (res) {
          this.cashList = res
        }
      })
      // 子公司资金数据for echarts 初始化
      getSubsidiaryFunds4Charts(params).then(res => {
        if (res) {
          // 数据处理
          this.pieData.length = 0
          res.forEach(element => {
            // 处理数据
            const value = this.NumToUnitNum(element.balanceOfMonth)
            this.pieData.push({ value: value, name: element.bank })
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
        const startTime = this.range.start
        const endTime = this.range.end
        const params = { startTime: startTime, endTime: endTime, summaryMark: 'X' }
        getSubsidiaryFunds4Charts(params).then(res => {
          if (res) {
          // 数据处理
            this.pieData.length = 0
            res.forEach(element => {
              const value = this.NumToUnitNum(element.balanceOfMonth)
              this.pieData.push({ value: value, name: element.bank })
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
          formatter: '{b}: {c} 万元({d}%)',
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
      const startTime = this.range.start ? this.range.start : this.range.startTime
      const endTime = this.range.end ? this.range.end : this.range.endTime
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
      console.log(item)
      // const params = { corpId: item.corpId, startTime: '2020-01-01', endTime: '2020-12-31' }
      // getSingleCompanyFundsDetails(params).then(res => {
      //   if (res) {
      //     console.log(res)
      //   }
      // })
    },
    dateTimeClick() {
    },
    click() {
      this.show = true
    },
    stopPro(e) {
      e.stopPropraation() // 组织冒泡
      e.preventDefaut() // 组织默认事件
    },
    overlay() {
      console.log('overlay')
      console.log(this.range)
      setTimeout(() => {
        this.refresh()
        this.show = false
      }, 10)
    },
    refresh() {
      // 集团总资金数据
      const startTime = this.range.start ? this.range.start : this.range.startTime
      const endTime = this.range.end ? this.range.end : this.range.endTime
      const params = { startTime: startTime, endTime: endTime, summaryMark: 'X' }
      getTotalGroupFunds(params).then(res => {
        if (res) {
          this.totalFunds = res.balanceOfMonth
          this.totalLimited = res.limitedAmount
        }
      })
      // 子公司资金数据列表
      getSubsidiaryFunds(params).then(res => {
        if (res) {
          this.cashList = res
        }
      })
      // 子公司资金数据for echarts 初始化
      getSubsidiaryFunds4Charts(params).then(res => {
        if (res) {
          // 数据处理
          this.pieData.length = 0
          res.forEach(element => {
            const value = this.NumToUnitNum(element.balanceOfMonth)
            this.pieData.push({ value: value, name: element.bank })
          })
          this.drawLine()
        }
      }).catch(error => {
        console.log(error)
      })
    },
    NumToUnitNum(value) {
      if (!value) return '0.00 万元'
      return Number(value / 10000).toFixed(2)
    },
    GetUnit(value) {
      if (!value) ' '
      value = Math.abs(value)
      if (value > 100000000) {
        return '亿元'
      } else if (value > 10000) {
        return '万元'
      } else {
        return '元'
      }
    },
    onConfirm(date) {
      const [start, end] = date
      this.range.start = this.formatDate(start)
      this.range.end = this.formatDate(end)
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
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
  .title-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
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
  .lh-1 {
    line-height: 1 !important;
  }
  .ms-auto {
    margin-left: auto !important;
  }
  .dropdown, .dropend, .dropstart, .dropup {
    position: relative;
  }
  .calendar {
    color: rgba(62, 136, 247, 0.726);
  }
  .icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
  }
}
</style>
