// pages/sell/account/account.js
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
    accountInfo: [],
    isNewUser: true,
    reducedMoney: 0,
    finalPrice: 0,
    user: {},
    img_rightnav: '../../../' + constants.img_rightnav,
    img_first: '../../../' + constants.img_first,
    img_mina: '../../../' + constants.img_mina
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this
    utils.setPageTitle(constants.PageTitle_Account);
    this.setData({
      accountInfo: app.globalData.accountInfo,
      isNewUser: app.globalData.isNewUser
    })
    app.globalData.accountInfo = [];
    console.log(this.data.accountInfo)
    this.accountPrice();
    wx.getStorage({
      key: 'userAddress',
      success: function(res) {
        that.setAddress(res.data);
      },
    })
  },
  accountPrice: function(){
    let reduced = 0;
    let final = 0;
    console.log(Number(this.data.accountInfo[2].totalMoney) + Number(this.data.accountInfo[1].deliveryFee))
  
    final = utils.roundFractional((Number(this.data.accountInfo[2].totalMoney) + Number(this.data.accountInfo[1].deliveryFee)), 1)
    if (this.data.isNewUser) {
      reduced = utils.roundFractional((Number(this.data.accountInfo[2].discountMoney) + Number(this.data.accountInfo[1].newUserReduction)),1)
    }else{
      reduced = this.data.accountInfo[2].discountMoney
    }
    this.setData({
      reducedMoney: reduced,
      finalPrice: final
    })
  },
  getAddress:function(){
    var that=this
    wx.chooseAddress({
      success(res) {
        that.setAddress(res);
        wx.setStorage({
          key: 'userAddress',
          data: that.data.user,
        })
      },
      fail(err){
        console.log(err)
        utils.showErrorToast(constants.Msg_WxAddrError);
      }
    })
  },
  setAddress:function(res){
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