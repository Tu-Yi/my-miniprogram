var utils = require('../../utils/util.js');
var constants = require('../../config/constants.js');
var api = require('../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    indicatorDots: constants.IndicatorDots,
    autoplay: constants.Autoplay,
    interval: constants.Interval,
    duration: constants.Duration,
    swiperHeight: 0
  },
  onShareAppMessage: function () {
    debugger;
    return {
      title: constants.AppTitle,
      desc: constants.AppDesc,
      path: constants.AppHome
    }
  },
  setSwiperHeight: function (e) {
    let sheight = utils.getImageScale(e);
    this.setData({
      swiperHeight: sheight
    })
  },
  getStoreDetail: function(){
    var that = this;
    utils.request(api.Store_Detail, { shopId: app.globalData.storeId}).then(
      res=>{
        console.log(res)
        that.setData({ imgUrls: res.store_imgs})
      },
      err=>{
        console.log(err)
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '喵姐米粉'
    })
    this.getStoreDetail();
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