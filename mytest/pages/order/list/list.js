var constants = require('../../../config/constants.js');
var utils = require('../../../utils/util.js');
var fail = require('../../template/fail/fail.js');
var api = require('../../../config/api.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShow: true,
    list: [],
    storeInfo: {
      name: '',
      logo: ''
    },
  },
  failOnclick: function () {
    var pages = getCurrentPages();
    fail.default.onReflash(pages);
    this.setData({
      isShow: true
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.setPageTitle(constants.PageTitle_OrderList);
    var that = this;
    this.getStoreInfo();
    this.getOrderList();
  },
  getStoreInfo: function () {
    var that = this
    wx.getStorage({
      key: constants.Storage_StoreInfo,
      success: function (res) {
        console.log(res)
        that.setData({
          ["storeInfo.name"]: res.data.store_name,
          ["storeInfo.logo"]: res.data.store_logo
        })
      },
      fail: function (err) {
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      }
    })
  },
  getOrderList:function(){
    var that = this;
    utils.request(api.Order_List, { store_id: app.globalData.storeId, openid: '1' }).then(
      res => {
        console.log(res)
        that.setData({
          list: res
        })
      },
      err => {
        wx.hideLoading();
        that.setData({
          isShow: false
        })
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      }
    )
  },
  toOrder:function(e){
    let storeId = e.currentTarget.dataset.id
    console.log(constants.PagePath_Order + "?order_id=" + storeId)
    wx.navigateTo({
      url: constants.PagePath_Order + "?order_id=" + storeId,
    })
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