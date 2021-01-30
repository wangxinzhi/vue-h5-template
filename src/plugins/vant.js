// 按需全局引入 vant组件
import Vue from 'vue'
import { Button, List, Cell, Tabbar, TabbarItem, Tab, Tabs, Grid, GridItem, PullRefresh, Row, Col, ActionSheet, DatetimePicker, Calendar, Dialog } from 'vant'
Vue.use(Button)
Vue.use(Cell)
Vue.use(List)
Vue.use(Tabbar).use(TabbarItem)
Vue.use(Tab)
Vue.use(Tabs)
Vue.use(Grid)
Vue.use(GridItem).use(PullRefresh).use(Row).use(Col).use(ActionSheet).use(DatetimePicker).use(Calendar)
Vue.use(Dialog)
