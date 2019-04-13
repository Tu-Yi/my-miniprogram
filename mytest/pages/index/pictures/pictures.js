var constants = require('../../../config/constants.js');
var utils = require('../../../utils/util.js');
var fail = require('../../template/fail/fail.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [],
    height: '',
    img_default: '../../../' + constants.img_default,
    isShow: true
  },
  failOnclick: function () {
    var pages = getCurrentPages();
    console.log(pages)
    console.log(fail)
    fail.default.onReflash(pages);
    this.setData({
      isShow: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.setPageTitle(constants.PageTitle_Pictures);
    wx.showLoading({
      title: constants.LoadingTitle,
    });
    var that = this;
    wx.getStorage({
      key: constants.Storage_StoreInfo,
      success: function(res) {
        wx.hideLoading();
        that.setData({
          imgUrls: res.data.store_imgs || ''
        })
      },
      fail: function(err){
        wx.hideLoading();
        that.setData({
          isShow: false
        })
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)

      }
    }),
    this.setHeight();
  },
  setHeight: function (e) {
    let sheight = utils.getImageScale(e);
    console.log(sheight)
    this.setData({
      height: sheight
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