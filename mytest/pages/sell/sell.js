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
    /**图片数据 */
    img_first: '../../' + constants.img_first,
    img_mina: '../../' + constants.img_mina,
    ico_logo: '../../' + constants.ico_logo,
    img_wechat: '../../' + constants.img_wechat,
    img_cart: '../../' + constants.img_cart,
    ico_clear: '../../' + constants.ico_clear,
    /**店铺数据 */
    store_name: '',
    store_logo: '',
    notice: '',
    newUserReduction: 0,
    minaDiscount: 0,
    startSendPrice: 0,
    startSendPrice_poor: 0,
    deliveryFee: 0,
    deliveryDistance: 0,
    /**判断数据 */
    isShow: true, //是否显示错误页面
    isNewUser: true, //是否是新用户标志，先暂时放这个，后面从数据库获取
    isCart: false, //是否显示购物车
    /**商品数据 */
    list: [],
    curIndex: 0,
    toView: '',
    height: 0,
    foodAreaHeight: [],
    eleCateTitleHeight: 0,
    eleFoodHeight: 0,
    cateListActiveIndex: 0,
    /**数量、价格数据 */
    originalMoney: 0,
    goodsMoney: 0,
    wrapperMoney: 0,
    totalMoney: 0,
    totalNum: 0,
    discountMoney: 0,
    /**购物车 */
    cartArray: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: constants.Storage_StoreInfo,
      success: function (res) {
        console.log(res)
        that.setData({
          store_name: res.data.store_name || constants.title_default,
          store_logo: res.data.store_logo,
          newUserReduction: res.data.new_user_reduction || 0,
          minaDiscount: 10 - (+(res.data.weixin_order_reduction || 0)) * 10,
          notice: utils.cutstr((res.data.notice || constants.notice_default), 80),
          startSendPrice: res.data.start_send_price || 0,
          startSendPrice_poor: res.data.start_send_price || 0,
          deliveryFee: res.data.delivery_fee || 0,
          deliveryDistance: res.data.delivery_distance || 0
        })
      },
      fail: function (err) {
        that.setData({
          store_name: constants.title_default,
          notice: constants.notice_default
        })
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      }
    })
    this.getGoodsList();
    app.globalData.isNewUser = this.data.isNewUser
  },
  onNumChange: function (e) {
    this.numHandle(e);
    this.priceHandle(e);
    this.cartHandle(e);
  },
  /**处理购物车 */
  cartHandle: function (e) {
    var item = {
      name: e.detail.goodname,
      typeid: e.detail.goodtypeid,
      price: e.detail.goodprice,
      count: e.detail.val,
      img: e.detail.goodsimg
    }
    let carts = this.data.cartArray;
    let isIn = 0;
    let goodindex = -1
    if (carts.length > 0) {
      carts.forEach((good, index) => {
        if (good.name === item.name) {
          e.detail.type === 'add' ? (good.price += item.price) : (good.price -= item.price);
          good.count = item.count;
          if (good.count === 0) {
            goodindex = index;
          }
          isIn = true;
        }
      })
      if (goodindex >= 0) {
        carts.splice(goodindex, 1);
      }
      if (!isIn) {
        carts.push(item);
      }
    } else {
      carts.push(item);
    }
    this.setData({
      cartArray: carts
    })
  },
  /**
   * 起送计算：商品原总价+包装费
   * 价格计算：商品价格优惠后+包装价
   */
  priceHandle: function (e) {
    var price = e.detail.goodprice + e.detail.goodsWrapPrice;
    var gMoney = this.data.goodsMoney;
    var wMoney = this.data.wrapperMoney;
    var oMoney = this.data.originalMoney;
    var tMoney = this.data.totalMoney;
    var dMoney = this.data.discountMoney;

    if (e.detail.type === 'add') {
      oMoney = utils.roundFractional((oMoney + price), 2);
      gMoney = utils.roundFractional((gMoney + e.detail.goodprice), 2);
      wMoney = utils.roundFractional((wMoney + e.detail.goodsWrapPrice), 2);
    } else {
      oMoney = utils.roundFractional((oMoney - price), 2);
      gMoney = utils.roundFractional((gMoney - e.detail.goodprice), 2);
      wMoney = utils.roundFractional((wMoney - e.detail.goodsWrapPrice), 2);
    }
    this.setData({
      originalMoney: oMoney,
      goodsMoney: gMoney,
      wrapperMoney: wMoney
    })
    if (this.data.isNewUser) {
      if (this.data.goodsMoney > this.data.newUserReduction) {
        tMoney = utils.roundFractional((this.data.goodsMoney - this.data.newUserReduction) * (this.data.minaDiscount / 10), 2);
        dMoney = utils.roundFractional((this.data.goodsMoney - this.data.newUserReduction) * ((10 - this.data.minaDiscount) / 10), 2)
      } else {
        tMoney = 0;
        dMoney = 0;
      }
    } else {
      tMoney = utils.roundFractional(this.data.goodsMoney * (this.data.minaDiscount / 10), 2);
      dMoney = utils.roundFractional(this.data.goodsMoney * ((10 - this.data.minaDiscount) / 10), 2);
    }
    this.setData({
      totalMoney: (tMoney + wMoney)
    })
    this.setData({
      discountMoney: dMoney
    })
    var poor = utils.roundFractional((this.data.startSendPrice - this.data.originalMoney), 2);
    this.setData({
      startSendPrice_poor: poor
    })
  },
  /**处理商品数量 */
  numHandle: function (e) {
    var num = this.data.totalNum
    if (e.detail.type === 'add') {
      this.setData({
        totalNum: num + 1
      })
    } else {
      this.setData({
        totalNum: num - 1
      })
    }
    if (this.data.totalNum > 0) {
      this.setData({
        img_cart: '../../' + constants.img_cartt
      })
    } else {
      this.setData({
        img_cart: '../../' + constants.img_cart
      })
    }
    var goodList = this.data.list;
    goodList.forEach(types => {
      if (types.goods_type_id === e.detail.goodtypeid) {
        if (e.detail.type === 'add') {
          types.sell_num++;
        } else {
          types.sell_num--;
        }
      }
    })
    this.setData({
      list: goodList
    })
  },
  /**控制购物车 */
  showMain: function () {
    this.setData({
      isCart: false
    })
  },
  showCart: function () {
    this.setData({
      isCart: true
    })
  },
  /**清空购物车 */
  clearCart: function () {
    wx.reLaunch({
      url: constants.PagePath_Sell,
    })
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
  /**获取商品列表 */
  getGoodsList: function () {
    var that = this;
    utils.request(api.Goods_List, { shopId: app.globalData.storeId }).then(
      res => {
        that.setData({
          list: res
        })
        this.setGoodListHeight();
        this.setFoodListAreaHeight();
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**设置右侧高度 */
  setGoodListHeight: function () {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var h;
        var query = wx.createSelectorQuery();
        query.select('#categrays').boundingClientRect(function (rect) {
          h = res.windowHeight - rect.top
          that.setData({
            height: h - res.windowHeight * 0.08
          })
        }).exec();
      },
    })
  },
  /** 获取每类商品界面高度数组*/
  setFoodListAreaHeight() {
    let query = wx.createSelectorQuery();
    let that = this;
    //分类栏的高度
    query.select('.type_title').boundingClientRect(function (rect) {
      that.setData({
        eleCateTitleHeight: rect.height
      })
    }).exec();
    //商品item的高度
    query.select('.good').boundingClientRect(function (rect) {
      that.setData({
        eleFoodHeight: rect.height
      })
    }).exec();

    //把商品列表每个分类的区间高度计算，并放进数组
    //上面获取元素的高度可能不是同步的，所以把下面的放在setTimeout里面
    let fh = [0]
    let heightCount = 0
    setTimeout(() => {
      this.data.list.forEach((item, index) => {
        //console.log(item.items.length * this.data.eleFoodHeight);
        if (item.length > 0) {
          heightCount += item.length * this.data.eleFoodHeight + this.data.eleCateTitleHeight
          fh.push(heightCount)
        }
      })
      this.setData({
        foodAreaHeight: fh
      })
    }, 100)

  },
  /**
     * 滚动到右边的高度
     * @param {*} e 
     */
  scrollToCategory(e) {
    //let id = e.currentTarget.dataset.id
    let index = parseInt(e.currentTarget.dataset.index);
    //let itemid = e.currentTarget.dataset.itemid
    this.setData({
      //toView: id,
      curIndex: index
    })
    let idx = e.currentTarget.dataset.index
    var top;
    if (idx > 0) {
      top = idx * 10
    }
    this.setData({
      listViewScrollTop: (this.data.foodAreaHeight[idx] + idx * this.data.eleCateTitleHeight)
    })
  },
  /**商品滚动，分类高亮 */
  foodListScrolling(event) {
    let scrollTop = event.detail.scrollTop
    let foodAreaHeight = this.data.foodAreaHeight
    foodAreaHeight.forEach((item, index) => {
      if (scrollTop >= foodAreaHeight[index] && scrollTop < foodAreaHeight[index + 1]) {
        this.setData({ cateListActiveIndex: index })
      }
    })
  },
  toDetail: function (e) {
    var goodId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: constants.PagePath_GoodsDetail + "?goodId=" + goodId,
    })
  },
  toAccount: function () {
    var cart = this.data.cartArray
    let storeInfo = {
      storeName: this.data.store_name,
      deliveryFee: this.data.deliveryFee,
      newUserReduction: this.data.newUserReduction,
      minaDiscount: this.data.minaDiscount
    }
    let goodsInfo = {
      wrapperMoney: this.data.wrapperMoney,
      totalMoney: this.data.totalMoney,
      originalMoney: this.data.originalMoney,
      discountMoney: this.data.discountMoney
    }
    app.globalData.accountInfo.push(cart)
    app.globalData.accountInfo.push(storeInfo)
    app.globalData.accountInfo.push(goodsInfo)
    wx.navigateTo({
      url: constants.PagePath_Account
    })
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