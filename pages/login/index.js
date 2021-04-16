Page({

  /**
   * 页面的初始数据
   */
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  //登录按钮
  handleGetUserInfo(e) {
    console.log(e);
    const userinfo = e.detail.userInfo;
    console.log(userinfo);
    wx.setStorageSync("userinfo", userinfo);
    wx.navigateBack({
      delta: 1
    });

  }

})