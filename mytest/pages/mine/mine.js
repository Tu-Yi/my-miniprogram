var constants = require('../../config/constants.js');
var utils = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    img_mineorder: '../../' + constants.img_mineorder,
    img_mineweixin: '../../' + constants.img_mineweixin,
    img_mineaddress: '../../' + constants.img_mineaddress,
    user: {},
  },
  toOrderList:function(){
    wx.switchTab({
      url: constants.PagePath_OrderList,
    })
  },
  myAddress:function(){
    var that = this
    wx.chooseAddress({
      success(res) {
        that.setAddress(res);
        wx.setStorage({
          key: 'userAddress',
          data: that.data.user,
        })
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  setAddress: function (res) {
    var user = {
      userName: res.userName,
      postalCode: res.postalCode,
      provinceName: res.provinceName,
      cityName: res.cityName,
      countyName: res.countyName,
      detailInfo: res.detailInfo,
      nationalCode: res.nationalCode,
      telNumber: res.telNumber
    }
    this.setData({
      user: user
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  }
})