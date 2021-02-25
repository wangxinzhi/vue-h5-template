// axios
import request from '@/utils/request'

// 获取全年销售收入
export function getFullSalesIncome(params) {
  return request({
    url: '/api/admin/manage/getIncomeData',
    method: 'get',
    params
  })
}

// 按类型 获取销售数据
export function getSalesIncomeGroupByType(params) {
  return request({
    url: '/api/admin/manage/getIncomeDataGroupByType',
    method: 'get',
    params
  })
}

// 按地区 获取销售数据
export function getSalesIncomeGroupByArea(params) {
  return request({
    url: '/api/admin/manage/getIncomeDataGroupByArea',
    method: 'get',
    params
  })
}

// 按客户 获取销售数据
export function getSalesIncomeGroupByCustomer(params) {
  return request({
    url: '/api/admin/manage/getIncomeDataGroupByCustomer',
    method: 'get',
    params
  })
}
