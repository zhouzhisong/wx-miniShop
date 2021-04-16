import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧商品数据
    rightMenuList: [],
    // 被点击的左侧菜单
    currentIndex: 0,
    //右侧内容的滚动条距离顶部的距离
    scrollTop: 0
  },
  // 接口的返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    web 和 小程序 中本地存储的区别:
    web:localStorage.setItem("key","value") localStorage.getItem("key")
    小程序: wx.setStorageSync("key","value") wx.getStorageSync("key")
    web:不管存的是什么类型的数据 最终都会先调用一下toString() 把数据变成字符串 再存进去
    小程序中:不存在类型转换的这个操作,存什么类型进去 获取的就是什么类型
    1.先判断本地存储有没有旧数据
    2.没有旧数据 直接发送请求
    3.有旧数据 且旧数据也没有过期 就使用本地的旧数据
    */

    // 1. 先获取本地存储中的数据
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      // 不存在 发送请求获取数据
      this.getCates()
    } else {
      // 有旧的数据 定义过期时间
      if (Date.now() - Cates.time > 1000 * 10) {
        //重新发送请求
        this.getCates()
      } else {
        //可以使用旧的数据
        console.log('可以使用旧的数据');
        this.Cates = Cates.data;
        // 把左侧列表数据单独放在一个数组中 使用map映射方法拿到cat_name
        let leftMenuList = this.Cates.map(value => value.cat_name);
        // 构造右侧商品数据
        let rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
 async getCates() {
    const res = await request({ url: '/categories'})
    // 把请求到的数据放在Cates数组中
    this.Cates = res.data.message;
    // 把接口的数据存到本地存储中
    wx.setStorageSync("cates", {
      time: Date.now(),
      data: this.Cates
    });
    // 把左侧列表数据单独放在一个数组中 使用map映射方法拿到cat_name
    let leftMenuList = this.Cates.map(value => value.cat_name);
    // 构造右侧商品数据
    let rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  // 左侧菜单点击事件
  handleItemTap(e) {
    console.log(e);
    // 1.获取被点击的标题的索引
    // 2.给data中的currentIindex赋值
    // 3.根据不同索引来渲染右侧商品内容
    const {
      index
    } = e.currentTarget.dataset;
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      //重新设置  右侧内容scroll-view标签距离顶部的距离
      scrollTop:0
    })
  }
})