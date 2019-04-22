// pages/detail/de tail.js
const appData = getApp().globalData;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    msg: '',
    detailInfo: {},
    stationInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    console.log(options.msg)
    this.setData({
      msg: options.msg
    })
    this.getDetailInfo(this.data.msg)
  },

  getDetailInfo(name) {
    // console.log(name)
    var that = this;
    wx.request({
      url: 'http://' + appData.host + ':8089/bus/getDetailInfo', //开发者服务器接口地址",
      data: {
        'name': name
      }, //请求的参数",
      method: 'GET',
      dataType: 'json',
      // header: { 'content-type': 'application/x-www-form-urlencoded' },
      //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        console.log(res.data)
        that.setData({
          detailInfo: res.data
        })
        // var stationinfo = res.data[0].viastops.split(",");
        // console.log(res.data[0].viastops);
        that.setData({
          stationInfo: res.data[0].viastops.split(",")
        })
      },
      fail: () => { },
      complete: () => { }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})