// pages/ws/ws.js
Page({

  /**
   * Page initial data
   */
  data: {
    msgs:[]
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {
    //获取服务器消息
    wx.onSocketMessage(function(res){
      console.log(res)
    })
  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  },
  //建立连接
  open:function(){
    wx.connectSocket({
      url: 'ws://localhost:8080/'
    })
  },
  //发送消息
  send:function(){
    wx.sendSocketMessage({
      data: "你好，我是小程序"
    })
  },
  //关闭连接
  close:function(){
    wx.closeSocket();
  }
})