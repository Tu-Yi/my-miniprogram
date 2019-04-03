//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    kuaidnum:null,
    kdInfo:null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  //请求快递接口，
  getKuaidiInfo:function(nu,tp){
    wx.request({
      url: 'https://wuliu.market.alicloudapi.com/kdi',// 仅为示例，并非真实的接口地址
      data: {
        no: nu,
        type: 'zto'
      },
      header: {
        'content-type': 'application/json', // 默认值
        "Authorization": "APPCODE dc062a990b2d479ea53cdea719f62515"
      },
      success(res) {
        console.log(this) //this的值已变，所以要用传入的
        tp.setData({ kdInfo: res.data });
      }
    })
  },
  query:function(){
    console.log(this)
    var thispage = this; //需要传入this，否则回调函数中获取不到
    this.getKuaidiInfo(this.data.kuaidnum,thispage)
  },
  //获取输入的快递号
  input:function(e){
    this.setData({ kuaidnum: e.detail.value });
  }
})
