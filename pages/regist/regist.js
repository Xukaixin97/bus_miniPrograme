// pages/regist/regist.js

import WxValidate from '../../utils/WxValidate.js'
const { $Toast } = require('../../dist/base/index');
const app = getApp();
Page({

  data: {
    username: '',
    code: '',//输入的验证码
    telephone: '',//手机号
    res_code: '',//服务器返回的验证码
    isAgree: true, //统一协议
    checkUserIfEx:true
  },
  //赋值
  username: function (e) {
    this.setData({
      username: e.detail.value,
    })
  },
  telephone: function (e) {
    this.setData({
      telephone: e.detail.value,
    })
  },
  code: function (e) {
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

  /**
   * 获取注册短信
   * @param {*} e 
   */
  getCode: function () {
    var that = this
    wx.request({
      url: "http://localhost:8089/user/getSMS",
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        'telephone': that.data.telephone
      },
      success: function (res) {
        that.data.res_code = res.data
      }
    })
  },

  initValidate() {
    const rules = {
      loginName: {
        required: true,
        rangelength: [6, 16],
      },
      loginPassword: {
        required: true,
      },
      telephone: {
        required: true,
        tel: true
      },

    }
    const messages = {
      loginName: {
        required: "请输入用户名",
        rangelength: "用户名长度为6-16个字符"
      },
      loginPassword: {
        required: "请输入密码",
      },
      telephone: {
        required: "请输入手机号",
        tel: "输入正确的手机号码"
      }

    }
    this.WxValidate = new WxValidate(rules, messages);
    this.WxValidate.addMethod('assistance', (value, param) => {
      return this.WxValidate.optional(value) || (/^[a-zA-Z0-9_]{6,18}$/.test(value))
    }, '密码由6-18位的英文大小、数字、下划线组成');
    
  },
  checkUserIfEx(e) {
    var that=this
    wx.request({
      url: 'http://localhost:8089/user/checkUsernameIfExist',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { 'username': e.detail.value },
      success: res => {
        console.log(res.data)
        if (res.data == true) {
          that.data.checkUserIfEx=false;
          $Toast({
            content: '用户名存在',
            type: 'warning'
          });
        }else{
          that.data.checkUserIfEx=true;
          
        }
      }
    })
  },
  formSubmit(e) {
    //4-3(表单提交校验)
    const params = e.detail.value
    console.log(params)
    if (!this.WxValidate.checkForm(params)) {
      const error = this.WxValidate.errorList[0]
      console.log(error)
      $Toast({
        content: error.msg,
        type: 'error'
      });
      return false
    }
    if(this.data.checkUserIfEx==false){
      $Toast({
        content: '用户名已存在',
        type: 'warning'
      });
      return false
      
    }
   
    wx.request({
      url: 'http://localhost:8089/user/register',
      method: 'POST',
      header: { 'content-type': 'application/json' },
      data: JSON.stringify(params),
      success: function (res) {
        console.log("回调函数:" + res.data)
        var resData = res.data;
        if (resData == true) {
          $Toast({
            content: '注册成功',
            type: 'success'
          });
        } else {
          $Toast({
            content: '注册失败 ',
            type: 'success'
          });
        }
      }
    })
  },
})