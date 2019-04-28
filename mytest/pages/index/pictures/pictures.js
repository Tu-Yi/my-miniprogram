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
    utils.getLocalStorage(constants.Storage_StoreInfo,
      res => {
        let sheight = utils.getImageScale();
        wx.hideLoading();
        that.setData({
          imgUrls: res.data.store_imgs || '',
          height: sheight
        })
      },
      err => {
        wx.hideLoading();
        that.setData({
          isShow: false
        })
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: constants.AppTitle,
      desc: constants.AppDesc,
      path: constants.AppHome
    }
  }
})