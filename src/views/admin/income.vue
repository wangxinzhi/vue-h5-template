<template>
  <div class="index-container">
    <van-cell class="card">
      <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
    </van-cell>
    <van-cell class="card">
      <van-tabs v-model="activeName" @click="onClick">
        <van-tab name="all" title="全年"></van-tab>
        <van-tab name="type" title="按类型"></van-tab>
        <van-tab name="area" title="按地区"></van-tab>
      </van-tabs>
    </van-cell>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: 'all'
    }
  },

  computed: {},

  mounted() {
    this.drawLine()
  },

  methods: {
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      // x轴坐标（可以从后台传值）
      let base = +new Date(2020, 0, 0)
      const oneDay = 24 * 3600 * 1000
      var date = []
      var data = [Math.random() * 300]
      for (var i = 1; i <= 365; i++) { // js的月是从0-11
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
            },
            restore: {},
            saveAsImage: {}
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
        dataZoom: [{ // dataZoom 组件 用于区域缩放，从而能自由关注细节的数据信息，或者概览数据整体，或者去除离群点的影响
          type: 'inside',
          start: 0,
          end: 10
        }, {
          start: 0,
          end: 10
        }],
        series: [ // 图表的类型
          {
            name: '汇总',
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
                colorStops: [{
                  offset: 0, color: 'red' // 0% 处的颜色
                }, {
                  offset: 1, color: 'blue' // 100% 处的颜色
                }],
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
    onClick(name, title) {
      console.log(name)
      console.log(title)
      if (name === 'all') {
        this.drawLine()
      } else if (name === 'type') {
        this.drawType()
      } else if (name === 'area') {
        this.drawArea()
      }
    },
    drawType() {
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      const incomeTypes = ['时尚文具类', '手工益智类', '社交情感类', '健身运动类', '户外用品类']
      // const date = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      let base = +new Date(2020, 0, 0)
      const oneDay = 24 * 3600 * 1000
      const date = []
      const data = [Math.random() * 300]
      for (var i = 1; i <= 365; i++) { // js的月是从0-11
        const now = new Date(base += oneDay)
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'))
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]))
      }
      const seriesData = [
        {
          name: '时尚文具类',
          type: 'line',
          stack: '总量',
          data: data
        },
        {
          name: '手工益智类',
          type: 'line',
          stack: '总量',
          data: data
        },
        {
          name: '社交情感类',
          type: 'line',
          stack: '总量',
          data: data
        },
        {
          name: '健身运动类',
          type: 'line',
          stack: '总量',
          data: data
        },
        {
          name: '户外用品类',
          type: 'line',
          stack: '总量',
          data: data
        }
      ]
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: incomeTypes
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value'
        },
        series: seriesData
      }
      myChart.clear()
      option && myChart.setOption(option)
    },
    drawArea() {
      const myChart = this.$echarts.init(document.getElementById('myChart'))
      const incomeTypes = ['美国', '中国', '英国', '澳大利亚', '德国']
      const date = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
      const data = [
        {
          name: '美国',
          type: 'line',
          stack: '总量',
          data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
          name: '中国',
          type: 'line',
          stack: '总量',
          data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
          name: '英国',
          type: 'line',
          stack: '总量',
          data: [150, 232, 201, 154, 190, 330, 410]
        },
        {
          name: '澳大利亚',
          type: 'line',
          stack: '总量',
          data: [320, 332, 301, 334, 390, 330, 320]
        },
        {
          name: '德国',
          type: 'line',
          stack: '总量',
          data: [820, 932, 901, 934, 1290, 1330, 1320]
        }
      ]
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: incomeTypes
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: date
        },
        yAxis: {
          type: 'value'
        },
        series: data
      }
      myChart.clear()
      option && myChart.setOption(option)
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
}
</style>
