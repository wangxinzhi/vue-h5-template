<template>
  <div class="index-container">
    <van-cell class="card">
      <div id="myChart" :style="{width: '100%', height: '350px'}"></div>
    </van-cell>
    <div class="card" style="height: 105px">
      <div class="title-row">
        <div class="subheader">
          公司：{{ corpName }}
        </div>
        <div class="subheader">
          <svg class="icon iconfont" @click="click" style="font-size: 23px">
            <use xlink:href="#icon-gongsikehu"/>
          </svg>
          <van-action-sheet v-model="show" @click-overlay="overlay" @click="stopPro($event)">
            <van-picker title="公司" :show-toolbar="false" :columns="columns" @confirm="onConfirm" @change="onChange"/>
          </van-action-sheet>
        </div>
      </div>
      <div class="title-row">
        <div class="subheader">
          时间：{{ range.start }} 至 {{ range.end }}
        </div>
        <div class="subheader">
          <svg class="icon iconfont" @click="click1" style="font-size: 23px">
            <use xlink:href="#icon-_rili_"/>
          </svg>
          <van-action-sheet v-model="calendarShow" @click-overlay="overlay1" @click="stopPro($event)">
            <van-calendar type="range" :poppable="false" :show-confirm="false" :style="{ height: '500px' }" :min-date="minDate" :max-date="maxDate" :allow-same-day="true" @confirm="oncalendarConfirm"/>
          </van-action-sheet>
        </div>
      </div>
      <div class="title-row">
        <div class="subheader">
          合计：{{ sum | NumToUnitNum }} {{ sum | GetUnit }} ( {{ rangeStartTime }} 至 {{ rangeEndTime }} )
        </div>
      </div>
    </div>
    <van-cell class="card">
      <van-tabs v-model="activeName" @click="onClick">
        <van-tab name="all" title="全年"></van-tab>
        <van-tab name="type" title="按类型"></van-tab>
        <van-tab name="area" title="按地区"></van-tab>
        <van-tab name="customer" title="按客户"></van-tab>
      </van-tabs>
    </van-cell>
    <van-cell class="card">
      <div v-for="item in sumList" :key="item.key">
        {{ item.key }} : {{ item.value | NumToUnitNum }} {{ item.value | GetUnit }}
      </div>
    </van-cell>
  </div>
</template>

<script>
import { getFullSalesIncome, getSalesIncomeGroupByType, getSalesIncomeGroupByArea, getSalesIncomeGroupByCustomer } from '@/api/income.js'
export default {
  data() {
    return {
      activeName: 'all',
      show: false,
      calendarShow: false,
      columns: ['宁波创源文化发展股份有限公司',
        '安徽创源文化发展有限公司',
        '宁波睿特菲体育科技有限公司',
        '宁波快邦投资咨询有限公司',
        '宁波人之初文化发展有限公司',
        '宁波创源文创电子商务有限公司',
        '杭州创源文创文化发展有限公司',
        '杭州少女心选电子商务有限公司',
        '金华浮星电子商务有限公司',
        '杭州许愿文化创意有限公司',
        '杭州扭蛋文化创意有限公司',
        '滁州慧源进出口有限公司',
        '智源（宁波）供应链有限公司',
        '创源产业园管理有限公司',
        '宁波市禾源纺织品有限公司',
        '宁波浩加旅游用品有限公司',
        '宁波脱凡体育科技有限公司',
        '安徽安禧达建筑科技有限公司',
        '创源体育用品有限公司'
      ],
      columnsIndex: [
        '1000',
        '1010',
        '3000',
        '6000',
        '6010',
        '2000',
        '2010',
        '5000',
        '5010',
        '5020',
        '5030',
        '2030',
        '2040',
        '6030',
        '1060',
        '1070',
        '3020',
        '6050',
        '1080'
      ],
      corpId: '1000',
      corpName: '宁波创源文化发展股份有限公司',
      minDate: new Date(1969, 0, 1),
      maxDate: new Date(),
      range: {
        startTime: new Date(2020, 0, 1),
        endTime: new Date(),
        start: '2020/1/1',
        end: ''
      },
      allData: [], // 全年销售收入 金额
      allDateData: [], // 全年销售收入 日期
      sum: 0,
      incomeEcharts: undefined,
      rangeStartTime: '',
      rangeEndTime: '',
      typeData: {
        incomeTypes: ['时尚文具类', '手工益智类', '社交情感类', '健身运动类', '户外用品类'], // 类型
        date: [], // 日期 x轴
        data: [] // 收入数据 y轴
      },
      areaData: {
        incomeAreas: [], // 地区
        date: [], // 日期 x轴
        data: [] // 收入数据 y轴
      },
      customerData: {
        incomeCustomer: [], // 地区
        date: [], // 日期 x轴
        data: [] // 收入数据 y轴
      },
      sumList: []
    }
  },

  computed: {},

  mounted() {
    this.initData()
  },

  methods: {
    initData() {
      this.range.start = this.formatDate(new Date(2021, 0, 1))
      this.range.end = this.formatDate(new Date())
      this.corpId = '1000'
      this.corpName = '宁波创源文化发展股份有限公司'
      // this.drawLine1()
      this.getSalesIncome().then(isSuccess => {
        console.log('log')
        if (isSuccess) {
          if (this.allData && this.allDateData) {
            if (this.allData.length > 0 && this.allDateData.length > 0) {
              const length = this.allData.length
              this.sum = 0
              for (let i = 0; i < length; i++) {
                this.sum = this.sum + Number(this.allData[i])
              }
              this.rangeStartTime = this.allDateData[0]
              this.rangeEndTime = this.allDateData[length - 1]
            }
          }
        }
      })
    },
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // x轴坐标（可以从后台传值）
      let base = +new Date(2020, 0, 0)
      const oneDay = 24 * 3600 * 1000
      var date = []
      var data = [Math.random() * 300]
      for (var i = 1; i <= 30; i++) { // js的月是从0-11
        const now = new Date(base += oneDay)
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'))
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]))
      }
      const option = {
        tooltip: { // 提示框组件
          trigger: 'axis',
          position: function(pt) {
            return [pt[0], '10%']
          }
        },
        title: { // 标题组件
          left: 'left',
          text: '全年销售收入'
        },
        toolbox: { // 工具栏：内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            }
          }
        },
        xAxis: { // 直角坐标系 grid 中的 x 轴
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: { // 直角坐标系 grid 中的 y 轴
          type: 'value',
          boundaryGap: [0, '100%']
        },
        dataZoom: [
          { // dataZoom 组件 用于区域缩放，从而能自由关注细节的数据信息，或者概览数据整体，或者去除离群点的影响
            type: 'inside',
            start: 0,
            end: 10
          },
          {
            start: 0,
            end: 10
          }
        ],
        series: [ // 图表的类型
          {
            name: '销售收入',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0, color: 'red' // 0% 处的颜色
                  },
                  {
                    offset: 1, color: 'blue' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            },
            data: data
          }
        ]
      }
      myChart.clear()
      // 绘制图表
      myChart.setOption(option)
    },
    drawLine1() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      const option = {
        tooltip: { // 提示框组件
          trigger: 'axis',
          position: function(pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          }
        },
        title: { // 标题组件
          left: 'left',
          text: '全年销售收入'
        },
        toolbox: { // 工具栏：内置有导出图片，数据视图，动态类型切换，数据区域缩放，重置五个工具
          feature: {
            dataZoom: {
              yAxisIndex: 'none'
            }
          }
        },
        grid: {
          left: 'left',
          containLabel: true
        },
        xAxis: { // 直角坐标系 grid 中的 x 轴
          type: 'category',
          boundaryGap: false,
          data: this.allDateData
        },
        yAxis: { // 直角坐标系 grid 中的 y 轴
          type: 'value',
          boundaryGap: [0, '100%'],
          nameRotate: 90
        },
        dataZoom: [
          { // dataZoom 组件 用于区域缩放，从而能自由关注细节的数据信息，或者概览数据整体，或者去除离群点的影响
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            type: 'slider',
            start: 0,
            end: 100
          }
        ],
        series: [ // 图表的类型
          {
            name: '销售收入',
            type: 'line',
            symbol: 'none',
            sampling: 'lttb',
            itemStyle: {
              color: 'rgb(255, 70, 131)'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0, color: 'red' // 0% 处的颜色
                  },
                  {
                    offset: 1, color: 'blue' // 100% 处的颜色
                  }
                ],
                globalCoord: false // 缺省为 false
              }
            },
            data: this.allData
          }
        ]
      }
      myChart.clear()
      // 绘制图表
      myChart.setOption(option)
      myChart.on('dataZoom', () => {
        const startIndex = myChart.getOption().dataZoom[1].startValue
        const endIndex = myChart.getOption().dataZoom[1].endValue
        const startTime = this.allDateData[startIndex]
        const endTime = this.allDateData[endIndex]
        this.sum = 0
        for (let i = startIndex; i <= endIndex; i++) {
          this.sum = this.sum + Number(this.allData[i])
        }
        this.rangeStartTime = startTime
        this.rangeEndTime = endTime
        console.log('SUM = ' + this.sum)
        console.log(startIndex)
        console.log(endIndex)
        console.log(startTime)
        console.log(endTime)
      })
    },
    onClick(name, title) {
      if (name === 'all') { // 总收入
        this.getSalesIncome()
      } else if (name === 'type') { // 按类型
        this.getSalesIncomeByType()
      } else if (name === 'area') { // 按地区
        this.getSalesIncomeByArea()
      } else if (name === 'customer') { // 按客户
        this.getSalesIncomeByCustomer()
      }
    },
    drawType() {
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // let base = +new Date(2020, 0, 0)
      // const oneDay = 24 * 3600 * 1000
      // const date = []
      // const data = [Math.random() * 300]
      // for (var i = 1; i <= 365; i++) { // js的月是从0-11
      //   const now = new Date(base += oneDay)
      //   date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'))
      //   data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]))
      // }
      const option = {
        tooltip: {
          trigger: 'axis',
          position: function(pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          }
        },
        legend: {
          type: 'scroll',
          data: this.typeData.incomeTypes
        },
        grid: {
          left: 'left',
          // right: '4%',
          // bottom: '3%',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.typeData.date
        },
        yAxis: {
          type: 'value'
        },
        series: this.typeData.data
      }
      myChart.clear()
      option && myChart.setOption(option)
    },
    drawArea() {
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      const option = {
        tooltip: {
          trigger: 'axis',
          position: function(pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          }
        },
        legend: {
          type: 'scroll',
          data: this.areaData.incomeAreas
        },
        grid: {
          left: 'left',
          containLabel: true
        },
        // toolbox: {
        //   feature: {
        //     saveAsImage: {}
        //   }
        // },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.areaData.date
        },
        yAxis: {
          type: 'value'
        },
        series: this.areaData.data
      }
      myChart.clear()
      option && myChart.setOption(option)
    },
    drawCustomer() {
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      const option = {
        tooltip: {
          trigger: 'axis',
          position: function(pos, params, dom, rect, size) {
            // 鼠标在左侧时 tooltip 显示到右侧，鼠标在右侧时 tooltip 显示到左侧。
            var obj = { top: 60 }
            obj[['left', 'right'][+(pos[0] < size.viewSize[0] / 2)]] = 5
            return obj
          }
        },
        legend: {
          type: 'scroll',
          data: this.customerData.incomeAreas
        },
        grid: {
          left: 'left',
          // right: '4%',
          // bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.customerData.date
        },
        yAxis: {
          type: 'value'
        },
        series: this.customerData.data
      }
      myChart.clear()
      option && myChart.setOption(option)
    },
    click() {
      this.show = true
    },
    click1() {
      this.calendarShow = true
    },
    stopPro(e) {
      // e.stopPropraation() // 组织冒泡
      e.preventDefaut() // 组织默认事件
    },
    overlay() {
      console.log('overlay')
      setTimeout(() => {
        this.show = false
        this.getSalesIncome().then(isSuccess => {
          console.log('log')
          if (isSuccess) {
            if (this.allData && this.allDateData) {
              if (this.allData.length > 0 && this.allDateData.length > 0) {
                const length = this.allData.length
                this.sum = 0
                for (let i = 0; i < length; i++) {
                  this.sum = this.sum + Number(this.allData[i])
                }
                this.rangeStartTime = this.allDateData[0]
                this.rangeEndTime = this.allDateData[length - 1]
              }
            }
          }
        })
      }, 10)
    },
    overlay1() {
      console.log('overlay')
      setTimeout(() => {
        this.calendarShow = false
        this.getSalesIncome().then(isSuccess => {
          console.log('log')
          if (isSuccess) {
            if (this.allData && this.allDateData) {
              if (this.allData.length > 0 && this.allDateData.length > 0) {
                const length = this.allData.length
                this.sum = 0
                for (let i = 0; i < length; i++) {
                  this.sum = this.sum + Number(this.allData[i])
                }
                this.rangeStartTime = this.allDateData[0]
                this.rangeEndTime = this.allDateData[length - 1]
              }
            }
          }
        })
      }, 10)
    },
    onConfirm(value, index) {
      console.log(value)
      console.log(index)
    },
    oncalendarConfirm(date) {
      const [start, end] = date
      this.range.start = this.formatDate(start)
      this.range.end = this.formatDate(end)
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    },
    onChange(picker, value, index) {
      console.log(value)
      console.log(index)
      this.corpId = this.columnsIndex[index]
      this.corpName = value
    },
    async getSalesIncome() {
      let isSuccess = false
      const params = { 'corpId': this.corpId, 'startTime': this.range.start, 'endTime': this.range.end }
      await getFullSalesIncome(params).then(res => {
        if (res.length > 0) {
          // 清空数据
          this.allData.length = 0
          this.allDateData.length = 0
          // 处理数据
          res.forEach(element => {
            this.allData.push(element.amount)
            this.allDateData.push(element.postDateStr)
          })
          // 画图
          this.drawLine1()
          isSuccess = true
        } else {
          this.drawLine()
        }
        this.sumList = []
      }).catch(err => {
        console.log(err)
      })
      return isSuccess
    },
    async getSalesIncomeByType() {
      let isSuccess = false
      const params = { 'corpId': this.corpId, 'startTime': this.range.start, 'endTime': this.range.end }
      await getSalesIncomeGroupByType(params).then(res => {
        const details = res.details
        const sum = res.sum
        if (details) {
          // res: { '时尚': [{},{}], '文化': [{}] }
          // 清空数据
          this.typeData.incomeTypes.length = 0
          this.typeData.date.length = 0
          this.typeData.data.length = 0
          // 处理数据
          for (const key in details) {
            if (key) {
              const element = details[key]
              const elData = []
              const elDate = []
              this.typeData.incomeTypes.push(key)
              element.forEach(el => {
                elData.push(el.amount)
                elDate.push(el.postLocalDateStr)
              })
              this.typeData.date = elDate
              this.typeData.data.push({ name: key, type: 'line', stack: '销售额', data: elData })
            }
          }
          // 画图
          this.drawType()
          isSuccess = true
        } else {
          this.drawType()
        }
        if (sum) {
          this.putSumList(sum)
        }
      }).catch(err => {
        console.log(err)
      })
      return isSuccess
    },
    async getSalesIncomeByArea() {
      let isSuccess = false
      const params = { 'corpId': this.corpId, 'startTime': this.range.start, 'endTime': this.range.end }
      await getSalesIncomeGroupByArea(params).then(res => {
        const details = res.details
        const sum = res.sum
        if (details) {
          // res: { '美国': [{},{}], '中国': [{}] }
          // 清空数据
          this.areaData.incomeAreas.length = 0
          this.areaData.date.length = 0
          this.areaData.data.length = 0
          // 处理数据
          for (const key in details) {
            if (key) {
              const element = details[key]
              const elData = []
              const elDate = []
              this.areaData.incomeAreas.push(key)
              element.forEach(el => {
                elData.push(el.amount)
                elDate.push(el.postLocalDateStr)
              })
              this.areaData.date = elDate
              this.areaData.data.push({ name: key, type: 'line', stack: '销售额', data: elData })
            }
          }
          // 画图
          this.drawArea()
          isSuccess = true
        } else {
          this.drawArea()
        }
        if (sum) {
          this.putSumList(sum)
        }
      }).catch(err => {
        console.log(err)
      })
      return isSuccess
    },
    async getSalesIncomeByCustomer() {
      let isSuccess = false
      const params = { 'corpId': this.corpId, 'startTime': this.range.start, 'endTime': this.range.end }
      await getSalesIncomeGroupByCustomer(params).then(res => {
        const details = res.details
        const sum = res.sum
        if (details) {
          // res: { '美国': [{},{}], '中国': [{}] }
          // 清空数据
          this.customerData.incomeCustomer.length = 0
          this.customerData.date.length = 0
          this.customerData.data.length = 0
          // 处理数据
          for (const key in details) {
            if (key) {
              const element = details[key]
              const elData = []
              const elDate = []
              this.customerData.incomeCustomer.push(key)
              element.forEach(el => {
                elData.push(el.amount)
                elDate.push(el.postLocalDateStr)
              })
              this.customerData.date = elDate
              this.customerData.data.push({ name: key, type: 'line', stack: '销售额', data: elData })
            }
          }
          // 画图
          this.drawCustomer()
          isSuccess = true
        } else {
          this.drawCustomer()
        }
        if (sum) {
          this.putSumList(sum)
        }
      }).catch(err => {
        console.log(err)
      })
      return isSuccess
    },
    putSumList(sum) {
      this.sumList.length = 0
      for (const key in sum) {
        this.sumList.push({ 'key': key, 'value': sum[key] })
      }
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
    height: 85%;
    width: 93%;
    box-shadow: 0 1rpx 5rpx 0px rgba(0, 0, 0, 0.05);
    font-size: 30rpx;
    border-top: 1rpx solid #eee;
    border-radius: 5rpx;
    background: #fff;
    border-radius: 7px;
  }
  .title-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    padding: 5px;
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
  .subheader {
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1.6;
    color: #656d77;
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
