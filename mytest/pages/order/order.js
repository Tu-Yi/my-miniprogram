var utils = require('../../utils/util.js');
var api = require('../../config/api.js');
var constants = require('../../config/constants.js');
var fail = require('../template/fail/fail.js');
var app = getApp();
Page({
  data: {
    img_call: '../../' + constants.img_call,
    img_first: '../../' + constants.img_first,
    img_mina: '../../' + constants.img_mina,
    isShow: true,
    isNewUser: true,
    isShowMap: true,
    isShowRefund:false,
    orderId: '',
    orderStatus: '',
    orderDetail: {},
    storeInfo: {
      name: '',
      phone: ''
    },
    map: {
      latitude: 23.099994,
      longitude: 113.324520,
      markers: []
    }
  },
  onLoad: function (options) {
    utils.setPageTitle(constants.PageTitle_Order);
    console.log(options)
    this.setData({
      orderId: options.order_id
    })
    this.getStoreInfo();
    this.getOrderDetail();
  },
  onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },
  /**错误页面按钮 */
  failOnclick: function () {
    var pages = getCurrentPages();
    console.log(pages)
    console.log(fail)
    fail.default.onReflash(pages);
    this.setData({
      isShow: true
    })
  },
  /**获取店铺信息 */
  getStoreInfo:function(){
    var that = this
    wx.getStorage({
      key: constants.Storage_StoreInfo,
      success: function (res) {
        console.log(res)
        that.setData({
          ["storeInfo.name"]: res.data.store_name,
          ["storeInfo.phone"]: res.data.phone,
          ["map.latitude"]: res.data.latitude,
          ["map.longitude"]: res.data.longitude,
          ["map.markers"]: [{
            id: 1,
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            title: res.data.store_name,
            iconPath: res.data.store_logo,
            width:32,
            height:32,
            callout: {
              content: that.data.orderStatus,
              color: "#ff8557",
              fontSize: "14",
              borderRadius: "5",
              bgColor: "#ffffff",
              padding: "3",
              display: "ALWAYS"
            }
          }]
        })
      },
      fail: function (err) {
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      }
    })
  },
  /**打电话 */
  callSellerPhone:function(){
    utils.phone(this.data.storeInfo.phone, err => {
      utils.showErrorToast(constants.Msg_PhoneError);
      console.log(err)
    })
  },
  callRiderPhone: function(){
    utils.phone(this.data.orderDetail.delivery_rider_phone, err => {
      utils.showErrorToast(constants.Msg_PhoneError);
      console.log(err)
    })
  },
  /**获取订单信息 */
  getOrderDetail:function(){
    var that = this;
    utils.request(api.Order_Detail, { order_id: this.data.orderId }).then(
      res => {
        that.setData({
          orderDetail: res,
          orderStatus: res.order_status,
          ["map.markers[0].callout.content"]: res.order_status
        })
        this.initOrderStatus();
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
  /**根据状态显示 */
  initOrderStatus:function(){
    let isShowMap;
    let isShowRefund;
    switch(this.data.orderStatus){
      case constants.OrderStatus_Payed:
        isShowMap=true;
        isShowRefund=false;
        break;
      case constants.OrderStatus_WaitSeller:
        isShowMap = true;
        isShowRefund = false;
        break;
      case constants.OrderStatus_SellerReceive:
        isShowMap = true;
        isShowRefund = false;
        break;
      case constants.OrderStatus_WaitRider:
        isShowMap = true;
        isShowRefund = false;
        break;
      case constants.OrderStatus_RiderReceive:
        isShowMap = true;
        isShowRefund = false;
        break;
      case constants.OrderStatus_RiderPicked:
        isShowMap = true;
        isShowRefund = false;
        break;
      case constants.OrderStatus_Reached:
        isShowMap = false;
        isShowRefund = false;
        break;
      case constants.OrderStatus_UserCancel:
        isShowMap = false;
        isShowRefund = true;
        break;
      case constants.OrderStatus_SystemCancel:
        isShowMap = false;
        isShowRefund = true;
        break;
      case constants.OrderStatus_Exception:
        isShowMap = false;
        isShowRefund = true;
        break;
    }
    this.setData({
      isShowMap: isShowMap,
      isShowRefund: isShowRefund
    })
  },
  /**复制订单号 */
  copyOrderId:function(){
    var that = this;
    wx.setClipboardData({
      data: that.data.orderDetail.order_id,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        });
      }
    });
  },
  onShow: function () {

  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },
  onShareAppMessage: function () {

  }
})