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
    array: constants.Array_Table,
    index: 0,
    img_rightnav: '../../../' + constants.img_rightnav,
    img_first: '../../../' + constants.img_first,
    img_mina: '../../../' + constants.img_mina,
    remarkInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('account')
    var that=this
    utils.setPageTitle(constants.PageTitle_Account);
    
    this.setData({
      accountInfo: app.globalData.accountInfo,
      isNewUser: app.globalData.isNewUser
    })
    //app.globalData.accountInfo = [];
    this.accountPrice();
    wx.getStorage({
      key: 'userAddress',
      success: function(res) {
        if (Object.keys(res.data).length > 0) {
          let addr = res.data;
          let address = res.data.provinceName + res.data.cityName + res.data.countyName + res.data.detailInfo;
          utils.getCoorByAddress(address, function (res) {
            let distance = utils.getDistance(res.location.lat, res.location.lng, that.data.accountInfo[1].lat, that.data.accountInfo[1].lng);
            if (distance > +that.data.accountInfo[1].deliveryDistance) {
              wx.showToast({
                title: constants.Msg_AddressOutOfRange,
                icon: 'none'
              })
            } else {
              that.setAddress(addr);
            }
          })
        }
      },
    })
  },
  /**计算价格 */
  accountPrice: function(){
    let reduced = 0;
    let final = 0;
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
  /**收货地址 */
  getAddress:function(){
    var that=this
    wx.chooseAddress({
      success(res) {
        let addr = res;
        let address = res.provinceName + res.cityName + res.countyName+ res.detailInfo;
        that.calAddress(addr,address);
      },
      fail(err){
        console.log(err)
        utils.showErrorToast(constants.Msg_WxAddrError);
      }
    })
  },
  calAddress: function (addr, address){
    var that=this;
    utils.getCoorByAddress(address, function (res) {
      let distance = utils.getDistance(res.location.lat, res.location.lng, that.data.accountInfo[1].lat, that.data.accountInfo[1].lng);
      if (distance > +that.data.accountInfo[1].deliveryDistance) {
        wx.showToast({
          title: constants.Msg_AddressOutOfRange,
          icon: 'none'
        })
      } else {
        that.setAddress(addr);
        wx.setStorage({
          key: 'userAddress',
          data: that.data.user,
        })
      }
    })
  },
  /**设置收货地址 */
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
  /**选择餐具 */
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
  /**填写备注 */
  toRemark:function(){
    wx.navigateTo({
      url: constants.PagePath_Remark
    })
  },
  onHide:function(){
    console.log(123)
  },
  onUnload:function(e){
    console.log(234)
    wx.navigateTo({
      url: constants.PagePath_Sell
    })
  },
  onShow:function(){
    var remark = constants.table_default;
    if (app.globalData.remarkInfo) {
      remark = app.globalData.remarkInfo
    }
    this.setData({
      remarkInfo: remark
    })
  }
})