// pages/login/login.js

const { $Toast } = require('../../dist/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    usermame: '',
    password: ''
  },

  username: function (e) {
    this.setData({
      username: e.detail.value,
    })
  },

  password: function (e) {
    this.setData({
      password: e.detail.value
    })
  },

  login: function () {
    console.log("点击按钮!" + "获取到的用户名:" + this.data.username + "获取到的密码:" + this.data.password)
    if (this.data.username == 0 || this.data.password == 0) {
      $Toast({
        content: '用户名和密码不能为空',
        type: 'warning'
      });
    } else {
      // 这里修改成跳转的页面
      var that = this;
      wx.request({
        url: 'http://localhost:8089/user/login',
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          'username': that.data.username,
          'password': that.data.password
        },
        success: function (res) {
          console.log("回调函数:" + res.data)
          var resData = res.data;
          if (resData == true) {
            $Toast({
              content: '登录成功',
              type: 'success',
              duration: 1000
            });
            setTimeout(function () {
              wx.reLaunch({
                url: './../bg_busline_list/list',
              })
            }, 1000)

          } else {
            $Toast({
              content: '用户名或密码错误',
              type: 'error',
            });
          }
        }
      })
    }
  },
  
  regist: function () {
    wx.navigateTo({
      url: './../regist/regist',
    })
  },
})