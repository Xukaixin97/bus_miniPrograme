var app = getApp();

Page({
  data: {
    latitude: '',
    longitude: '',
  },

  onLoad: function() {
    var that=this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
        //弹框
      }
    })

  },

  getMyLocation: function() {
    var that=this
    wx.getLocation({
      type: 'wgs84',
      success: function(res) {
        // console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        //弹框
        that.setData({
          latitude: res.latitude,
          longitude: res.longitude
        })
      }
    })
  },


})