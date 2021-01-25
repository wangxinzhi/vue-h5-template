<template>
  <div class="index-container">
    <van-cell class="card">
      <div id="myChart" :style="{width: '100%', height: '300px'}"></div>
    </van-cell>
  </div>
</template>

<script>
export default {
  data() {
    return {
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
      // 最大值 后台
      const maxNumber = 10
      const option = {
        series: [{
          type: 'gauge',
          axisLine: {
            lineStyle: {
              width: 30,
              color: [
                [0.3, '#67e0e3'],
                [0.7, '#37a2da'],
                [1, '#fd666d']
              ]
            }
          },
          pointer: {
            itemStyle: {
              color: 'auto'
            }
          },
          axisTick: {
            distance: -30,
            length: 8,
            lineStyle: {
              color: '#fff',
              width: 2
            }
          },
          splitLine: {
            distance: -30,
            length: 30,
            lineStyle: {
              color: '#fff',
              width: 4
            }
          },
          splitNumber: maxNumber,
          axisLabel: {
            color: 'auto',
            distance: 40,
            fontSize: 10
          },
          detail: {
            valueAnimation: true,
            fontSize: 10,
            fontWeight: 'bolder',
            formatter: '{value} 亿元',
            color: 'auto'
          },
          data: [{
            value: 70
          }]
        }]
      }

      //   setInterval(function() {
      //     option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0
      //     myChart.setOption(option, true)
      //   }, 2000)
      // 绘制图表
      myChart.setOption(option)
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
