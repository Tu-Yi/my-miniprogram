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
    newUserReduction: '',
    minaDiscount: '',
    startSendPrice: '',
    startSendPrice_poor: '',
    deliveryFee: '',
    deliveryDistance: '',
    img_first: '../../' + constants.img_first,
    img_mina: '../../' + constants.img_mina,
    ico_logo: '../../' + constants.ico_logo,
    img_wechat: '../../' + constants.img_wechat,
    img_cart: '../../' + constants.img_cart,
    list: [],
    curIndex: 0,
    isShow: true,
    toView: '',
    height: '',
    foodAreaHeight: [],
    eleCateTitleHeight: '',
    eleFoodHeight: '',
    cateListActiveIndex: 0,
    isOrder: false,
    originalMoney: '',
    totalMoney: '',
    totalNum: 0,
    cartArray:[],
    isNewUser:true //是否是新用户标志，先暂时放这个，后面从数据库获取
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
          newUserReduction: res.data.new_user_reduction || "0",
          minaDiscount: 10 - (+(res.data.weixin_order_reduction || "0")) * 10 + '',
          notice: utils.cutstr((res.data.notice || constants.notice_default), 80),
          startSendPrice: res.data.start_send_price || "0",
          deliveryFee: res.data.delivery_fee || 0,
          deliveryDistance: res.data.delivery_distance || 0
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
    this.getGoodsList();
    
  },
  onNumChange:function(e){
    console.log(e)
    this.numHandle(e);
    this.priceHandle(e);
  },
  priceHandle:function(e){
    var price = e.detail.goodprice + e.detail.goodsWrapPrice;
    var oMoney = this.data.originalMoney;
    var tMoney = this.data.totalMoney;
    if (e.detail.type === 'add') {
      oMoney = oMoney + price;
    }else{
      oMoney = oMoney - price;
    }
    this.setData({
      originalMoney: oMoney
    })
    if (this.data.isNewUser){
      if (this.data.originalMoney > this.data.newUserReduction){
        tMoney = (this.data.originalMoney - this.data.newUserReduction) * (this.data.minaDiscount / 10)
      }else{
        tMoney = 0;
      }
    }else{
      tMoney = this.data.originalMoney * (this.data.minaDiscount/10);
    } 
    this.setData({
      totalMoney: tMoney
    })
    if(this.data.totalMoney>this.data.start_send_price){
      
    }else{
      var poor = 0;
      this.setData({
        startSendPrice_poor: poor
      })
    }
  },
  numHandle:function(e){
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
        console.log(res)
        that.setData({
          list: res
        })
        /**设置商品列表高度 */
        wx.getSystemInfo({
          success: function (res) {
            console.log("123 " + res.windowHeight)
            var h;
            var query = wx.createSelectorQuery();
            query.select('#categrays').boundingClientRect(function (rect) {
              h = res.windowHeight - rect.top
              that.setData({
                height: h - res.windowHeight*0.08
              })
            }).exec();
          },
        })
        /**获取每类商品界面高度数组 */
        this.setFoodListAreaHeight()
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
        if (item.length>0){
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
    console.log(e.currentTarget.dataset);
    let idx = e.currentTarget.dataset.index
    var top;
    if(idx>0){
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
  toDetail: function(e){
    var goodId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: constants.PagePath_GoodsDetail + "?goodId=" + goodId,
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