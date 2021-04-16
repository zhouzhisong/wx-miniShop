/*
1 用户上滑页面 滚动条触底 开始加载下一页数据
  1.找到滚动条触底事件
  2.判断有没有下一页
    1 获取总页数 只有总条数 
      总页数 = Math.ceil(总条数 / 页容量)
    2 获取当前页码
    3 判断 当前页码是否大于等于总页数 没有下一页数据
  3.假如没有下一页， 弹出提示
  4.假如有下一页 加载下一页数据
    1 当前页码++
    2 重新发送请求
    3 数据请求之后 对data中的数组进行拼接 而不是全部替换
2 下拉刷新页面
  1 触发下拉刷新事件 需要在也买你的json文件中开启一个配置项
    找到触发下拉刷新的事件
  2 重置 数据 数组 
  3 重置页码 设置为1
  4 重新发送请求
  5 数据请求回来 需要手动关闭 等待效果
*/
import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口要的参数
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.QueryParams.cid = options.cid;
    this.getGoodsList()
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    // 获取总条数
    console.log(res);
    const total = res.data.message.total;
    console.log(total);
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    console.log(this.totalPages);
    this.setData({
      goodsList: [...this.data.goodsList, ...res.data.message.goods]
    })

    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },
  // 标题点击事件 从子组件传递过来
  handelTabsItemChange(e) {
    console.log(e);
    console.log(this.data);
    // 1.获取被点击的标题索引
    const {
      index
    } = e.detail;
    // 2.修改源数组
    let {
      tabs
    } = this.data;
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false);
    // 3.赋值到data中
    this.setData({
      tabs
    })
  },
  // 也面上滑 滚动条触底事件
  onReachBottom() {
    console.log(this.QueryParams.pagenum+"~~"+this.totalPages);
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页
      wx.showToast({
        title: '没有下一页数据'
      });
    } else {
      console.log('有下一页');
      // 有下一页
      this.QueryParams.pagenum++;
      this.getGoodsList();
    }
  },
  // 下拉刷新事件
  onPullDownRefresh(){
    console.log('刷新');
    // 1重置数组
    this.setData({
      goodsList:[]
    })
    // 2重置页码
    this.QueryParams.pagenum = 1;
    // 2发送请求
    this.getGoodsList();
  }
})