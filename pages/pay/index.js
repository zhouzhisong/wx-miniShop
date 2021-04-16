/*
哪些人 那些帐号 可以实现微信支付
1 企业帐号
2 企业帐号的小程序后台中 必须给开发者添加白名单
  1 一个appid可以绑定多个开发者
  2 这些开发者可以共用这个appid和它的开发权限
3 支付按钮
  1 先判断缓存中有没有token
  2 没有 跳转到授权页面获取token
  3 有token 创建订单
  

*/
import {
  request
} from "../../request/index.js";
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    // 1获取缓存中的收获地址信息
    const address = wx.getStorageSync('address');
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //过滤后的购物车
    cart = cart.filter(v => v.checked);

    this.setData({
      address
    })
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });

    // 2给data赋值
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });

  },
  // 点击 支付
  async handleOrderPay() {
    // 1判断缓存中有没有token
    const token = wx.getStorageSync('token');
    console.log(token);
    // 2判断
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 3创建订单 
    // 3.1 准备请求头参数
    const header = {
      Authorization: token
    }
    // 3.2 准备请求体参数
    const order_price = this.data.totalPrice;
    const consignee_addr = this.data.address.all;
    const cart = this.data.cart;
    let goods = [];
    cart.forEach(v => goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
    const orderParams = {
      order_price,
      consignee_addr,
      goods
    }
    // 4发送请求 创建订单 获取订单编号
    const {
      order_number
    } = await request({
      url: "/my/orders/create",
      method: "POST",
      data: orderParams,
      header
    });
    console.log(order_number);
    //  5 发起预支付接口
    // const {
    //   pay
    // } = await request({
    //   url: "/my/orders/req_unifiedorder",
    //   method: "POST",
    //   header,
    //   data: {
    //     order_number
    //   },
    //   header
    // })
    // console.log(res)
    // 6 发起微信支付
    // const res = await requestPayment(pay);
    // console.log(res);
  }
})