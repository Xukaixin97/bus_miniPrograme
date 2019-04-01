// pages/regist/regist.js

import WxValidate from '../../utils/WxValidate.js'
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
  
    //输入的验证码
    code: '',
    telephone:'',
    //服务器返回的验证码
    res_code: '',
    isAgree: true
  },

  telephone: function(e) {
    this.setData({
      telephone: e.detail.value,
    })
  },

  code: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  onLoad: function (options) {
    /**
   * 初始化表单
   * @param {*} error 
   */
    this.initValidate();
  },

  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },

  /**
   * 获取注册短信
   * @param {*} e 
   */
  getCode: function () {
    console.log(this.data.code+"    "+this.data.telephone)
    var that=this

    wx.request({
      url:"http://localhost:8080/user/getSMS",
      method:"POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'telephone': that.data.telephone
      },
      success:function(res){
        console.log(res.data)
      }
    })
  },

  initValidate() {
    const rules = {
      login_name: {
        required: true,
        rangelength: [2,6]
      },
      login_password: {
        required: true,
        login_password: true
      },
      telephone: {
        required: true,
        tel: true
      }
    }
    const messages = {
      login_name: {
        required: "输入用户名",
        rangelength: "输入2-4个汉子"
      },
      login_password: {
        required: "输入密码",
        rangelength: "输入2-4个汉子"
      },
      telephone: {
        required: "输入11手机号",
        tel: "输入正确的手机号码"
      }
    }
    this.WxValidate = new WxValidate(rules, messages);
  },

  formSubmit(e) {
    /**
      * 4-3(表单提交校验)
      */
    const params = e.detail.value
    
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      this.showModal(error)
      return false
    }
    /**
    * 这里添写验证成功以后的逻辑
    * 
      */
     wx.request({
      url: 'http://localhost:8080/user/register',
      method: 'POST',
      header: { 'content-type': 'application/json'},
      data: JSON.stringify(params),
      success: function (res) {
        console.log("回调函数:" + res.data)
        var resData = res.data;
        if (resData == true) {
          wx.showToast({
            title: '登录成功',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '登录失败',
            duration: 2000
          })
        }
      }
    })

    //验证通过以后->
    this.submitInfo(params);
  },
  submitInfo(params) {
    // form提交
    let form = params;
    console.log('将要提交的表单信息：', form);
    wx.showToast({
      title: '提交成功！！！！',
    })
  },
  // // 注册函数
  // formSubmit:function(e){
  //   console.log(e.detail.value)
  //   var that = this;
  //   var formData = e.detail.value;
    // wx.request({
    //   url: 'http://localhost:8080/user/register',
    //   method: 'POST',
    //   header: { 'content-type': 'application/json'},
    //   data: JSON.stringify(formData),
    //   success: function (res) {
    //     console.log("回调函数:" + res.data)
    //     var resData = res.data;
    //     if (resData == true) {
    //       wx.showToast({
    //         title: '登录成功',
    //         duration: 2000
    //       })
    //     } else {
    //       wx.showToast({
    //         title: '登录失败',
    //         duration: 2000
    //       })
    //     }
    //   }
    // })
  // },


})