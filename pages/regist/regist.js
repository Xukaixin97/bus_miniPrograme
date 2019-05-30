// pages/regist/regist.js

import WxValidate from '../../utils/WxValidate.js'
const { $Toast } = require('../../dist/base/index');
const appData = getApp().globalData;
Page({

  data: {
    username: '',
    code: '',//输入的验证码
    telephone: '',//手机号
    res_code: '',//服务器返回的验证码
    isAgree: true, //统一协议
    checkUserIfEx: false,
    codeMessage:'获取验证码',
    disabled:'',
    seconds:60,
    // interval:0,

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
   */
    this.initValidate();
  },
  //是否同意协议
  bindAgreeChange(){
    this.setData({
      isAgree: !this.data.isAgree
    })
    if(this.data.isAgree == false){

    }
  },
  /**
   * 获取注册短信
   */
  getCode: function () {
    if (this.data.telephone == "") {
      $Toast({
        content: "请输入手机号",
        type: 'warning'
      })
    } else {
      var that = this
      wx.request({
        url: 'http://' + appData.host + ':8089/user/getSMS',
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        data: {
          'telephone': that.data.telephone
        },
        success: function (res) {
          that.data.res_code = res.data
          console.log(res.data)
        }
      })
      that.setData({
        disabled:true
      })
      var times = 60;
      var interval = setInterval(() => {
        
        // console.log(times)
        times--;
        if (times == 0) {
             that.setData({
                  disabled: false,
                  codeMessage: "获取验证码",
             })
             clearInterval(interval)
        } else {
             that.setData({
                  codeMessage:times + "s",
                  disabled: true
             })
        }
      }, 1000);

    }
  },

  //倒计时
  countdown(that) {
    // console.log('count down');
    var seconds = that.data.seconds;
    // console.log(seconds);
    // var captchaLabel = that.data.captchaLabel;
    if (seconds <= 1) {
        captchaLabel = '获取验证码';
        seconds = length;
        that.setData({
            captchaDisabled: false
        });
    } else {
        captchaLabel = --seconds + '秒后重新发送'
    }
    that.setData({
        seconds: seconds,
        captchaLabel: captchaLabel
    });
},

/**
 * 定义验证规则
 */
  initValidate() {
    const rules = {
      loginName: {
        required: true,
        rangelength: [6, 16],
        validatorName:true
      },
      loginPassword: {
        required: true,
        assistance:true
      },
      telephone: {
        required: true,
        tel: true
      },
      code: {
        required: true,
        validatorCode:true
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
      },
      code: {
        required: "请输入验证码",
      },
    }
    var that=this
    this.WxValidate = new WxValidate(rules, messages);
    this.WxValidate.addMethod('assistance', (value, param) => {
      return this.WxValidate.optional(value) || (/^[a-zA-Z0-9_]{6,18}$/.test(value))
    }, '密码由6-18位的英文大小、数字、下划线组成');
    this.WxValidate.addMethod('validatorCode', (value, param) => {
      return this.WxValidate.optional(value) || (that.data.res_code==that.data.code)
    }, "验证码错误");
    this.WxValidate.addMethod('validatorName', (value, param) => {
      return this.WxValidate.optional(value) || (!that.data.checkUserIfEx)
    }, "用户名存在啦");


  },
  /**
   * 失去焦点验证用户是否存在
   * @param {*} e 
   */
  checkUserIfEx(e) {
    var that = this
    wx.request({
      url: 'http://' + appData.host + ':8089/user/checkUsernameIfExist',
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      data: { 'username': e.detail.value },
      success: res => {
        console.log(res.data)
        if (res.data == true) {
          that.setData({
            checkUserIfEx:true
          })
          $Toast({
            content: '用户名存在',
            type: 'warning'
          });
        }else{
          that.setData({
            checkUserIfEx:false
          })
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

    wx.request({
      url: 'http://' + appData.host + ':8089/user/register',
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

          wx.navigateTo({ url: '../login/login' });
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