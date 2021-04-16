/*
1.获取用户的收获地址

 1.调用小程序内置api 获取用户收获地址 wx.chooseAddress 新版本可以直接获取地址
    0 回到商品详情页面 第一次添加商品的时候 手动添加的了属性
      1 num =1
      2 checked = true
    1 获取本地存储中的收获地址数据
    2 把数据 设置给data中的一个变量
  

*/
import {
  request
} from "../../request/index.js";
import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from "../../utils/asyncWx.js";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice:0,
    totalNum:0
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
    const cart = wx.getStorageSync("cart") || [];
    this.setData({
      address
    })
    this.setCart(cart);
  },
  //点击 添加收获地址
  async handleChooseAddress() {
    try {
      // 1获取权限状态
      // const res1 = await getSetting();  
      // const scopeAddress = res1.authSetting["scope.address"]; 
      // 2.判断权限状态
      // if (scopeAddress === false) {
      //   await openSetting();
      // }
      // 3调用获取地址的api
      let address = await chooseAddress();
      address.allAddress = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      // 4把地址存到缓存中
      console.log(address);
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }

  },
  // 商品的选中
  handleItemChange(e) {
    // 1获取被选中的商品id
    const goods_id = e.currentTarget.dataset.id;
    // 2获取购物车数组
    let {
      cart
    } = this.data;
    // 3找到被修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    // 4把状态取反
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 设置购物车状态同时 重新计算底部工具栏的数据 全选 总价格 购买数量
  setCart(cart) {
    let allChecked = true;
    //总价格 总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    //判断数组是否为空
    allChecked = cart.length != 0 ? allChecked : false;
    // 2给data赋值
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync('cart', cart);
  },
  //商品全选
  handleItemAllCheck() {
    // 获取data中的数据
    let {
      cart,
      allChecked
    } = this.data;
    // 修改值
    allChecked = !allChecked;
    // 循环修改cart数组中的商品选中状态
    cart.forEach(v => {
      v.checked = allChecked
    });
    // 把修改后的值 填充回data或者缓存中
    this.setCart(cart);
  },
  // 商品数量编辑功能
  async handleItemNumEdit(e) {

    // 获取传递过来的参数
    const {
      operation,
      id
    } = e.currentTarget.dataset;
    console.log(operation, id);
    // 获取购物车数组
    let {
      cart
    } = this.data;
    // 找到需要修改的商品的索引
    const index = cart.findIndex(v => v.goods_id == id);
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({
        content: "您是否要删除?"
      });
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }

    } else {
      // 进行修改数量
      cart[index].num += operation;
      // 设置回缓存 和data中
      this.setCart(cart);
    }
  },
  // 点击 结算
  async handlePay() {
    //1 判断收获地址
    const {
      address,
      totalNum
    } = this.data;
    if (!address.userName) {
      await showToast({
        title: '您还没有选择收获地址!'
      });
      return;
    }
    //2 判断用户有没有选购商品
    if (totalNum === 0) {
      await showToast({
        title: '您还没有选购商品!'
      })
      return;
    }
    //3 跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  }
})