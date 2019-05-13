
const amapFile = require('../../libs/amap-wx.js');
const appData = getApp().globalData;

Page({
  data: {
    city: '',
    citycode: '',
    ifHidden: true,
    msg: '',
    latitude: '',
    longitude: '',
    historyRoute: [],
    list: [],
    historyData: '',
    hasHistory: true,
    multiIndex: [0, 0],
    multiArray: [],
    objectMultiArray: [],
    getPromptInfo:''
  },
  bindMultiPickerChange: function (e) {
    // console.log("当前"+e.detail.value)
    var that = this
    that.setData({
      "multiIndex[0]": e.detail.value[0],
      "multiIndex[1]": e.detail.value[1]
    })
    this.setData({
      city:that.data.multiArray[1][e.detail.value[1]]
    })
    console.log(this.data.city)
  },
  bindMultiPickerColumnChange: function (e) {
    // console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var that = this
    var cityList=[]
    switch (e.detail.column) {
      case 0:
        var data = {
          multiArray: this.data.multiArray,
          multiIndex: this.data.multiIndex
        };
        var province = that.data.multiArray[e.detail.column][e.detail.value];
        // console.log(province);
        wx.request({
          url: 'http://' + appData.host + ':8089/bus/getCityInfo', //开发者服务器接口地址",
          data:{
            province:province
          },
          method: 'GET',
          // dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
          success: res => {
            // console.log(res.data)
            for(var i=0;i<res.data.length;i++){
              cityList.push(res.data[i].label)
            }
            data.multiArray[1]=cityList;
            data.multiIndex[0]=e.detail.value
            that.setData(data)
           
          },
          fail: () => {},
          complete: () => {}
        });

      
    }
  },
  getProvince() {
    var that = this;
    wx.request({
      url: 'http://' + appData.host + ':8089/bus/getProvince', //开发者服务器接口地址",
      method: 'GET',
      // dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
      success: res => {
        // that.setData({
        //   multiArray:res.data
        // })
        // console.log(res.data)
        // that.data.multiArray.push(res.data)
        // var arr = ["北京市"]
        // that.data.multiArray.push(arr)
        // that.data.multiArray.push(arr)//思考 为什么push娶不到值
        that.setData({
          multiArray: [res.data, ['北京市']]
        })
        // console.log(that.data.multiArray)
        // console.log(that.data.multiArray[1][that.data.multiIndex[1]])
      },
      fail: () => { },
      complete: () => { }
    });

  },

  storeHistory(e) {
    // console.log(e.data)
    // console.log(e.currentTarget.dataset.gid);
    appData.searchHistory.unshift(e.currentTarget.dataset.gid);
    // console.log(appData.searchHistory)
    this.setData({
      historyData: appData.searchHistory
    })
    console.log(this.data.historyData)
  },
  emptyHistory() {
    var that = this
    wx.showModal({
      title: '提示',
      content: '是否清空历史纪录',
      success(res) {
        if (res.confirm) {
          that.setData({
            historyData: '',
            hasHistory: false
          })
          appData.history = [];
        } else if (res.cancel) {

        }
      }
    })
  },
  getPromptInfo(e) {
    console.log(e.value);
    if(e.detail.value == ""  || e.detail.value == null){
      this.setData({
        hasHistory:true
      })
    }else{
      this.setData({
        hasHistory:false
      })
    }

    this.setData({
      list: []
    })
    console.log(e.detail.value)
    var that = this
    this.setData({
      msg: e.detail.value
    })
    var prompt = this.data.msg;
    console.log(prompt)
    if (prompt != null && prompt != "") {
      this.setData({
        ifHidden: false
      })
      wx.request({
        url: 'http://' + appData.host + ':8089/bus/getBusLineOrStationInfo', //开发者服务器接口地址",
        method: 'post',
        data: {
          'msg': prompt,
          'city':that.data.city
        }, //请求的参数",
        header: { 'content-type': 'application/x-www-form-urlencoded' },
        // dataType: 'json', //如果设为json，会尝试对返回的数据做一次 JSON.parse
        success: res => {
          console.log(res.data)
          var result = res.data
          // JSON.parse(JSON.stringify(res.data))
          // console.log(result)
          that.setData({
            list: result
          });
          
        },
        fail: () => { },
        complete: () => { }
      });
    } else {
      this.setData({
        ifHidden: true
      })
    }
  },
  onShow: function () {
    var that = this;
    let pages = getCurrentPages(); //页面栈
    let currPage = pages[pages.length - 1]; //当前页面
    that.setData({
      list: [] 
    })
    that.setData({
      ifHidden:true
    })
    that.setData({
      hasHistory:true
    })
  },

  onLoad: function () {
    this.getProvince();
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: 'eeef012afe4c956d0d38fd3a132fb267' });
    myAmapFun.getRegeo({
      success: function (data) {
        that.setData({
          city: data[0].regeocodeData.addressComponent.city,
        })
        console.log(that.data.city)
        that.setData({
          'multiArray[1][0]':that.data.city
        })
        // console.log(data[0].regeocodeData.addressComponent.district)
        getApp().globalData.mapInfo = data[0]
        that.setData({
          mapMsg: data[0]
        });
      },
      fail: function (info) {
        console.log(info)
      }
    });
  },

})