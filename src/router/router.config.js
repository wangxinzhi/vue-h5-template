/**
 * 基础路由
 * @type { *[] }
 */
export const constantRouterMap = [
  {
    path: '/',
    component: () => import('@/views/layouts/index'),
    redirect: '/home',
    meta: {
      title: '首页',
      keepAlive: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index'),
        meta: { title: '首页', keepAlive: false }
      },
      {
        path: '/about',
        name: 'About',
        component: () => import('@/views/home/about'),
        meta: { title: '关于我', keepAlive: false }
      },
      {
        path: '/admin/income',
        name: 'income',
        component: () => import('@/views/admin/income'),
        meta: { title: '收入', keepAlive: false }
      },
      {
        path: '/admin/salesAndBudget',
        name: 'salesAndBudget',
        component: () => import('@/views/admin/salesAndBudget'),
        meta: { title: '月订单以及预算', keepAlive: false }
      },
      {
        path: '/admin/salesDashboard',
        name: 'salesDashboard',
        component: () => import('@/views/admin/salesDashboard'),
        meta: { title: '年度销售额完成度', keepAlive: false }
      },
      {
        path: '/admin/cashDashboard',
        name: 'cashDashboard',
        component: () => import('@/views/admin/cashDashboard'),
        meta: { title: '资金', keepAlive: false }
      }
    ]
  }
]
