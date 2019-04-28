var utils = require('../../utils/util.js');
var api = require('../../config/api.js');
var constants = require('../../config/constants.js');
var fail = require('../template/fail/fail.js');
var dictionaries = require('../../config/dictionaries.js');
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
    isShowReason: false,
    orderId: '',
    orderStatus: '',
    orderCancelReason: '',
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
    fail.default.onReflash(pages);
    this.setData({
      isShow: true
    })
  },
  /**获取店铺信息 */
  getStoreInfo:function(){
    var that = this
    utils.getLocalStorage(constants.Storage_StoreInfo,
      res => {
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
            width: 32,
            height: 32,
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
      err => {
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
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
        this.initOrder(res);
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
  initOrder:function(res){
    console.log(res)
    let isShowMap;
    let isShowRefund;
    let isShowReason;
    switch (+res.order_status){
      case 0:
        isShowMap=true;
        isShowRefund=false;
        isShowReason=false;
        break;
      case 1:
        isShowMap = true;
        isShowRefund = false;
        isShowReason = false;
        break;
      case 2:
        isShowMap = false;
        isShowRefund = false;
        isShowReason = false;
        break;
      case 3:
        isShowMap = false;
        isShowRefund = true;
        isShowReason = false;
        break;
      case 4:
        isShowMap = false;
        isShowRefund = true;
        isShowReason = false;
        break;
      case 5:
        isShowMap = false;
        isShowRefund = true;
        isShowReason = true;
        break;
    }
    this.setData({
      orderDetail: res,
      isShowMap: isShowMap,
      isShowRefund: isShowRefund,
      isShowReason: isShowReason,
      orderStatus: dictionaries.default.label('order_status', +res.order_status),
      orderCancelReason: dictionaries.default.label('order_err_reason', +res.order_cancel_reason),
      ["map.markers[0].callout.content"]: dictionaries.default.label('order_status', +res.order_status)
    })
  },
  /**复制订单号 */
  copyOrderId:function(){
    var that = this;
    wx.setClipboardData({
      data: that.data.orderDetail.order_id,
      success: function (res) {
        wx.showToast({
          title: constants.Msg_CopySuccess,
          icon: 'none'
        });
      }
    });
  }
})