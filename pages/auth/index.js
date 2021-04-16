import {
  request
} from "../../request/index.js";

import {
  login
} from "../../utils/asyncWx.js";
Page({
  //获取用户信息
  async handleGetUserInfo(e) {
    try {
      //1 获取用户信息
      const {
        encryptedData,
        rawData,
        iv,
        signature
      } = e.detail;
      //2 获取登录成功后的code值
      const {
        code
      } = await login();
      const loginParams = {
        encryptedData,
        rawData,
        iv,
        signature,
        code
      }
      //3 发送请求获取用户的token
      // const {
      //   token
      // } = await request({
      //   url: '/users/wxlogin',
      //   data: loginParams,
      //   method: "post"
      // });
      const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
      console.log(token);
      //4 把token存入缓存中 同时跳回上一个页面
      wx.setStorageSync('token', token);
      // console.log(wx.getStorageSync('token'));
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.log(error);
    }
  }
})
// Page({
//   async handleGetUserInfo(e){
    
//     console.log(e);
//     // 1.获取用户信息
//     const {encryptedData,rawData,iv,signature }=e.detail; 
//     // 2.获取小程序登录成功之后的 code
//     wx.login({
//       timeout:10000,
//       success: (result) => {
//         const {code}=result;
//       }
//     });
//     const {code}=await login();
//     console.log("code:"+code);
//     const loginParams={encryptedData,rawData,iv,signature,code};
//     // 3.发送请求 获取用户的 token
//     const res=await request({url:"/users/wxlogin",data:loginParams,method:"post"});
//     console.log(res);

//     let token="Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo";
//     wx.setStorageSync("token", token);
//     wx.navigateBack({
//       delta: 1
//     });
     
// }
// })
