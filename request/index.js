let ajaxTimes = 0; //某些页面的某个方法中同时有多个请求，但是加载中效果只有一个，所以添加计数，
export const request = (params) => {
  ajaxTimes++;
  //显示加载中效果
  wx.showLoading({
    title: "加载中",
    mask: true
  });

  //定义公共的url
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err)
      },
      complete: () => {
        ajaxTimes--;
        if (ajaxTimes === 0) {
          //关闭正在等待的图标
          wx.hideLoading();
        }

      }
    })
  })
}