
const amapFile = require('../../libs/amap-wx.js');

Page({

  
  data: {
    latitude: '',
    longitude: '',
    a1:'结果1',
    a2:'结果2',
    a3:'结果3',
  },
  onLoad: function () {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: 'eeef012afe4c956d0d38fd3a132fb267' });
    myAmapFun.getRegeo({
      success: function (data) {
        console.log(data[0])
        getApp().globalData.mapInfo = data[0]
        that.setData({
          mapMsg: data[0]
        });
      },
      fail: function (info) {
        console.log(info)
      }
    });
    myAmapFun.getWeather({
      success: function (data) {
        that.setData({
          weatherMsg: data.liveData
        });
      },
      fail: function (info) {
        console.log(info)
      }
    })

   },

})