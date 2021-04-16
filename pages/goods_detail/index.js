/*
1.发送数据请求
2.点击轮播图 预览大图
  1 给轮播图绑定点击事件
  2 调用小程序api previewImage
3 点击加入购物车
  1 先绑定点击事件
  2 获取缓存中的购物车数据 数组格式
  3 先判断当前商品是否存在于购物车
  4 已经存在 修改商品数据 执行购物车数量++ 重新把购物车数组填充至缓存中
  5 不存在于购物车数组中 直接给购物车添加新元素 新元素带上购买数量属性num 填充回缓存中
  6 弹出提示


*/
import {
  request
} from "../../request/index.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {
      goods_id
    } = options;
    console.log(goods_id);
    this.getGoodsDetails(goods_id)
  },
  // 获取商品详情数据
  async getGoodsDetails(goods_id) {
    console.log();
    const goodsObj = await request({
      url: '/goods/detail',
      data: {
        goods_id
      }
    })
    this.GoodsInfo = goodsObj.data.message;
    this.setData({
      goodsObj: {
        goods_price: goodsObj.data.message.goods_price,
        goods_name: goodsObj.data.message.goods_name,
        // iphone手机 不识别webp图片格式
        // 自己找后台修改
        // 临时自己改 确保后台存在webp => 1.jpg
        goods_introduce: goodsObj.data.message.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.data.message.pics
      }
    })
  },
  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    // 1先构造要预览的图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    // 接受传递过来的url参数
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      // current:current,
      // urls:urls 
      current, // 上边写法也可以，都是解构 所以下边写法更简单
      urls
    });
  },
  // 点击加入购物车
  handleCartAdd() {
    // 1获取缓存中的购物车数据 数组格式
    let cart = wx.getStorageSync('cart') || [];
    // 2 判断当前商品是否存在于购物车
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 3 不存在 第一次添加
      this.GoodsInfo.num = 1;
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo)
    } else {
      // 4 已经存在 购物车数据 执行num++
      cart[index].num++;
      console.log(cart[index].num);
    }
    // 5 把购物车重新添加回缓存中
    wx.setStorageSync('cart', cart);
    // 6 弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      // true 防止重复点击
      mask: true,
    });
  }
  // 

})