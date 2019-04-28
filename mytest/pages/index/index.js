var utils = require('../../utils/util.js');
var api = require('../../config/api.js');
var constants = require('../../config/constants.js');
var fail = require('../template/fail/fail.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // imgUrls: [],
    // indicatorDots: constants.IndicatorDots,
    // autoplay: constants.Autoplay,
    // interval: constants.Interval,
    // duration: constants.Duration,
    ico_zb: '../../' + constants.ico_zb,
    ico_phone: '../../' + constants.ico_phone,
    ico_time: '../../' + constants.ico_time,
    ico_picture: '../../' + constants.ico_picture,
    ico_notice: '../../' + constants.ico_notice,
    img_call: '../../' + constants.img_call,
    img_mina: '../../' + constants.img_mina,
    img_first: '../../' + constants.img_first,
    img_drop: '../../' + constants.img_drop,
    height: 0,
    storeImg: '',
    address: '',
    phone: '',
    delivery_time: '',
    new_user_reduction: '',
    minaDiscount: '',
    latitude: '',
    longitude: '',
    notice: '',
    cAdddress: '',
    cAddIsShow: true,
    isShow: true,
  },
  failOnclick: function(){
    var pages = getCurrentPages();
    fail.default.onReflash(pages);
    this.setData({
      isShow: true
    })
  },
  /**获取店铺数据 */
  getStoreDetail: function(){
    var that = this;
    utils.request(api.Store_Detail, { store_id: app.globalData.storeId}).then(
      res=>{
        wx.setNavigationBarTitle({
          title: res.store_name || constants.title_default
        })
        //设置图片高度
        let sheight = utils.getImageScale();
        that.setData({ 
          height: sheight,
          storeImg: res.store_img || '../../' + constants.img_default,
          address: res.address || constants.address_default,
          phone: res.phone || constants.phone_default,
          delivery_time: res.delivery_time || constants.time_default,
          new_user_reduction: res.new_user_reduction || 0,
          minaDiscount: 10 - (+(res.weixin_order_reduction || 0) * 10),
          notice: utils.cutstr((res.notice || constants.notice_default),80)
        })
        wx.setStorage({
          key: constants.Storage_StoreInfo,
          data: res,
        })
      },
      err=>{
        wx.hideLoading();
        that.setData({
          isShow: false
        })
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      }
    )
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    this.getStoreDetail();
    //this.getCustomLocation();
    utils.getUserLocationInfo(function (addr) {
      that.setData({
        cAddress: addr.formatted_addresses.recommend,
        cAddIsShow: true
      })
    })
  },
  /**打开商家地图位置 */
  openLocation:function(){
    if (this.data.address === constants.address_default) {
      utils.showErrorToast(constants.Msg_AddrError);
      return;
    }
    var that=this;
    utils.getLocalStorage(constants.Storage_StoreInfo,
      res=>{
        that.setData({
          latitude: res.data.latitude || '30.657420',
          longitude: res.data.longitude || '104.065840',
        })
        wx.openLocation({
          longitude: Number(that.data.longitude),
          latitude: Number(that.data.latitude),
          scale: 18
        })
      }, 
      err=>{
        utils.showErrorToast(constants.Msg_AddrError);
        console.log(err)
    })
  },
  /**打电话 */
  callPhone: function(){
    if (this.data.phone === constants.phone_default){
      utils.showErrorToast(constants.Msg_PhoneError);
      return;
    }
    utils.phone(this.data.phone, err => {
      utils.showErrorToast(constants.Msg_PhoneError);
      console.log(err)
    })
  },
  /**获取用户位置 */
  getCustomLocation: function(){
    var that = this
    wx.getSetting({
      success: function(res){
        console.log(1)
        if (res.authSetting[constants.Scope_UserLocation]) {
          console.log(2)
          utils.getUserLocationInfo(function(addr){
            console.log(3)
            that.setData({
              cAddress: addr.formatted_addresses.recommend,
              cAddIsShow: true
            })
          })
        }else{
          wx.showModal({
            title: '位置',
            content: '获取用户所在位置',
            success: function(res){
              if (res.confirm) {
                wx.openSetting({
                  success: function (res) {
                    console.log(4)
                    if (res.authSetting[constants.Scope_UserLocation]) {
                      console.log(5)
                      utils.getUserLocationInfo(function (addr) {
                        console.log(6)
                        that.setData({
                          cAddress: addr.formatted_addresses.recommend,
                          cAddIsShow: true
                        })
                      })
                    } else {
                      console.log(7)
                      that.setData({
                        cAddIsShow: false
                      })
                    }
                  },
                  fail: function (err) {
                    console.log(8)
                    console.log(err)
                  }
                })
              } else if (res.cancel) {
                  that.setData({
                    cAddIsShow: false
                  })
              }
            }
          })
        }
      },
      fail:function(err){
        console.log(err)
      }
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