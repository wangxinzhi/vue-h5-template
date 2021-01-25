// axios
import request from '@/utils/request'

// 获取集团资金
export function getTotalGroupFunds(params) {
  return request({
    url: '/api/admin/manage/getTotalGroupFunds',
    method: 'get',
    params
  })
}

// 获取子公司资金列表
export function getSubsidiaryFunds(params) {
  return request({
    url: '/api/admin/manage/getSubsidiaryFunds',
    method: 'get',
    params
  })
}

// 获取子公司资金列表-用于图表
export function getSubsidiaryFunds4Charts(params) {
  return request({
    url: '/api/admin/manage/getSubsidiaryFunds4Charts',
    method: 'get',
    params
  })
}

// 获取单个公司的资金日报信息
export function getSingleCompanyFundsDetails(params) {
  return request({
    url: '/api/admin/manage/getSingleCompanyFundsDetails',
    method: 'get',
    params
  })
}
