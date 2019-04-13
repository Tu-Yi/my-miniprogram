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
    store_name: '',
    notice: '',
    new_user_reduction: '',
    minaDiscount: '',
    img_first: '../../' + constants.img_first,
    img_mina: '../../' + constants.img_mina,
    ico_logo: '../../' + constants.ico_logo,
    list: [],
    curIndex: 0,
    isShow: true,
    toView: '',
    height: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: constants.Storage_StoreInfo,
      success: function (res) {
        that.setData({
          store_name: res.data.store_name || '店铺名称',
          new_user_reduction: res.data.new_user_reduction || "0",
          minaDiscount: 10 - (+(res.data.weixin_order_reduction || "0")) * 10 + '',
          notice: utils.cutstr((res.data.notice || constants.notice_default), 80)

        })
      },
      fail: function (err) {
        that.setData({
          store_name: '店铺名称',
          new_user_reduction: "0",
          minaDiscount: '0',
          notice: constants.notice_default
        })
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)

      }
    })
    wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight)
        var h;
        if (res.windowHeight>700){
          h = res.windowHeight * 0.65
        } else if (res.windowHeight > 600){
          h = res.windowHeight * 1.25
        } else if (res.windowHeight > 500){
          h = res.windowHeight * 1.25
        } else if (res.windowHeight<500){
          h = res.windowHeight * 1.4
        }
        that.setData({
          height: h
        })
      },
    })
    this.getGoodsList();
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
  getGoodsList: function () {
    var that = this;
    utils.request(api.Goods_list, { shopId: app.globalData.storeId }).then(
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
  switchRightTab(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    let index = parseInt(e.currentTarget.dataset.index);
    let itemid = e.currentTarget.dataset.itemid
    this.setData({
      toView: id,
      curIndex: index
    })
  },
  // scroll:function(e){
  //   var scrolltop = e.detail.scrollTop 							//获取滚动的长度，单位为px，
  //   var h = 0   													//h为每个模块的长度 ，px
  //   var selectedid;												// 用来控制curId 
  //   var coefficient = this.data.widthcoefficient				//根据机型的不同 商品展示长度不同，我在这里用了rpx转换px系数
  //   this.data.list.forEach(function (item, i) {
  //     var list_height = (item.goods.length * 260) / coefficient	//这里list_height为每个分类的高度， 208 是rpx 单位商品展示长度
  //     // console.log('移动了'+scrolltop)
  //     // console.log('循环判断模块高度h为'+h)
  //     h += list_height;										//给每个分类计算距离顶部的高度，那这个对比滚动的长度
  //     if (scrolltop >= h) {	                                 // 判断滚动长度有没有超过分类的长度，
  //       selectedid = item.goods_type_id					//如果超过了就给左侧的控制高亮的flag 赋值
  //     }
  //   });
  //   this.setData({
  //     curIndex: selectedid
  //   })
  // },
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