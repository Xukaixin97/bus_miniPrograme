// pages/bg_busline_list/list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    busInfo:[]
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    that.getIndexList();
  },

   getIndexList: function () {
    var that = this;
  
    //获取分类文章列表
    var that = this;
    wx.request({
      url: "http://localhost:8089/bus/getInfo",
      method: 'GET',
      dataType: 'json',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
          console.log(res.data);
          that.setData({
            'busInfo':res.data
          })
          console.log(that.data.busInfo)
        } ,
      fail(res){
        console.log("error");
      }
    })
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