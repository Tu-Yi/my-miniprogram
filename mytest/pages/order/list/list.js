var constants = require('../../../config/constants.js');
var utils = require('../../../utils/util.js');
var fail = require('../../template/fail/fail.js');
var api = require('../../../config/api.js');
var dictionaries = require('../../../config/dictionaries.js');
var app = getApp();
const wxUploadFile = utils.promisify(wx.uploadFile)
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShow: true,
    list: [],
    storeInfo: {
      name: '',
      logo: ''
    },
    evalInfo: {
      order_id: '',
      taste_evaluate_level: '',
      pack_evaluate_level: '',
      dispatch_evaluate_level: '',
      evaluate_content: '',
      images: []
    },
    value: "",
    placeholder: "",
    maxlength: 100,
    focus: true,
    autoheight: false,
    adjustposition: true,
    inValue: "",
    dialogvisible: false,
    options: {
      showclose: true,
      showfooter: true,
      closeonclickmodal: true,
      fullscreen: false
    },
    title: '评价',
    opacity: '0.4',
    width: '85',
    position: 'center',
    ico_cha: '../../../' + constants.ico_cha,
    stars_taste: [{
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    }
    ],
    stars_wrapper: [{
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    }
    ],
    stars_rider: [{
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    },
    {
      flag: 1,
      bgImg: constants.img_star,
      bgfImg: constants.img_stars
    }
    ]
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
    utils.setPageTitle(constants.PageTitle_OrderList);
    var that = this;
    this.getStoreInfo();
    this.getOrderList();
  },
  /**获取店铺信息 */
  getStoreInfo: function () {
    var that = this
    utils.getLocalStorage(constants.Storage_StoreInfo,
      res => {
        that.setData({
          ["storeInfo.name"]: res.data.store_name,
          ["storeInfo.logo"]: res.data.store_logo
        })
      },
      err => {
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      })
  },
  /**获取订单信息 */
  getOrderList: function () {
    var that = this;
    utils.request(api.Order_List, {
      store_id: app.globalData.storeId,
      openid: app.globalData.openid
    }).then(
      res => {
        console.log(123)
        that.setData({
          list: res
        })
      },
      err => {
        console.log(isShow)
        wx.hideLoading();
        that.setData({
          isShow: false
        })
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      }
    )
  },
  /**跳转订单详情 */
  toOrder: function (e) {
    let orderId = e.currentTarget.dataset.id
    wx.navigateTo({
      url: constants.PagePath_Order + "?order_id=" + orderId,
    })
  },
  /**显示评价 */
  showDialog: function (e) {
    this.setData({
      dialogvisible: true,
      ["evalInfo.order_id"]: e.currentTarget.dataset.id
    })
  },
  /**关闭模态窗口 */
  handleClose: function () {
    let evalInfo = this.data.evalInfo;
    for (let key in evalInfo) {
      if (key === "images") {
        evalInfo[key] = []
      } else {
        evalInfo[key] = ''
      }
    }
    this.setData({
      evalInfo: evalInfo,
      value: ""
    })
    let stars_taste = this.data.stars_taste
    let stars_wrapper = this.data.stars_wrapper
    let stars_rider = this.data.stars_rider
    for (var i = 0; i < 5; i++) {
      stars_taste[i].flag = 1;
      stars_wrapper[i].flag = 1;
      stars_rider[i].flag = 1;
    }
    this.setData({
      stars_taste: stars_taste,
      stars_wrapper: stars_wrapper,
      stars_rider: stars_rider
    })
  },
  handleOpen: function () {
  },
  handleConfirm: function () {
    let orderId = this.data.evalInfo.order_id;
    let tastelevel = this.data.evalInfo.taste_evaluate_level;
    let packlevel = this.data.evalInfo.pack_evaluate_level;
    let dispatchlevel = this.data.evalInfo.dispatch_evaluate_level;
    let content = this.data.evalInfo.evaluate_content;
    let images = this.data.evalInfo.images;
    var that = this;
    if (orderId && tastelevel && packlevel && dispatchlevel && content) {
      if (images.length > 0) {
        const arr = []
        for (let path of images) {
          arr.push(wxUploadFile({
            url: constants.Upload_Images,
            filePath: path,
            name: constants.Image_key,
          }))
        }
        wx.showLoading({
          title: '正在上传...',
          mask: true
        })
        Promise.all(arr).then(res => {
          return res.map(item => JSON.parse(item.data).url)
        }).catch(err => {
          console.log(">>>> upload images error:", err)
        }).then(urls => {
          return utils.request(api.Post_Eval, {
            order_id: orderId,
            openid: app.globalData.openid,
            taste_evaluate_level: tastelevel,
            pack_evaluate_level: packlevel,
            dispatch_evaluate_level: dispatchlevel,
            evaluate_content: content,
            images: urls
          }, "POST")
        }).then(res => {
          wx.showToast({
            title: '保存成功',
          })
        }).catch(err => {
          console.log(">>>> save eval error:", err)
          utils.showErrorToast(constants.Msg_DataError);
          console.log(err)
        }).then(() => {
          wx.hideLoading()
        })
      } else {
        utils.request(api.Post_Eval, {
          order_id: orderId,
          openid: app.globalData.openid,
          taste_evaluate_level: tastelevel,
          pack_evaluate_level: packlevel,
          dispatch_evaluate_level: dispatchlevel,
          evaluate_content: content,
          images: []
        },"POST").then(
          res => {
            wx.showToast({
              title: '保存成功',
            })
          },
          err => {
            wx.hideLoading();
            utils.showErrorToast(constants.Msg_DataError);
            console.log(err)
          }
        )
      }
    } else {
      wx.showToast({
        title: '评价信息不完整',
        icon: 'none'
      })
    }
  },
  /**评价打分 */
  score: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    var id = e.currentTarget.dataset.id;
    let stars = that.data['stars_' + id];
    for (var i = 0; i < 5; i++) {
      stars[i].flag = 1;
    }
    that.setData({
      ['stars_' + id]: stars
    })
    var index = e.currentTarget.dataset.index;
    for (var i = 0; i <= index; i++) {
      stars[i].flag = 2;
    }
    that.setData({
      ['stars_' + id]: stars
    })
    if (id === 'taste') {
      that.setData({
        ["evalInfo.taste_evaluate_level"]: index + 1
      })
    } else if (id === 'wrapper') {
      that.setData({
        ["evalInfo.pack_evaluate_level"]: index + 1
      })
    } else if (id === "rider") {
      that.setData({
        ["evalInfo.dispatch_evaluate_level"]: index + 1
      })
    }
  },
  /**获取评价内容 */
  bindWord: function (e) {
    this.setData({
      ["evalInfo.evaluate_content"]: e.detail.value
    })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        const images = that.data.evalInfo.images.concat(res.tempFilePaths)
        that.setData({
          ["evalInfo.images"]: images.length <= 6 ? images : images.slice(0, 6)
        });
      }
    })
  },
  /**预览图片 */
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.evalInfo.images // 需要预览的图片http链接列表
    })
  },
  /**删除图片 */
  removeImage: function (e) {
    var images = this.data.evalInfo.images;
    const idx = e.target.dataset.idx
    images.splice(idx, 1);
    this.setData({
      ["evalInfo.images"]: images
    })
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
    return {
      title: constants.AppTitle,
      desc: constants.AppDesc,
      path: constants.AppHome
    }
  }
})