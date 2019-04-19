// pages/sell/remark/remark.js
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
    keywords: constants.Remark_Keywords,
    value: "",
    placeholder: "口味、要求等，100个字以内",
    maxlength: 100,
    focus: true,
    autoheight: false,
    adjustposition: true,
    inValue: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.setPageTitle(constants.PageTitle_remark);
    this.setData({
      value: app.globalData.remarkInfo
    })
  },
  bindWord: function(e){
    this.setData({
      inValue: e.detail.value
    })
  },
  toTextArea:function(e){
    var key = this.data.keywords[e.currentTarget.dataset.index];
    var newValue = this.data.inValue + key;
    this.setData({
      inValue: newValue,
      value: newValue,
      focus: true
    })
  },
  bindFormSubmit:function(e){
    console.log(e.detail.value.textarea)
    if(e.detail.value.textarea){
      app.globalData.remarkInfo = e.detail.value.textarea;
      wx.navigateTo({
        url: constants.PagePath_Account,
      })
    }else{
      wx.showToast({
        title: constants.Msg_RemarkInfo,
        icon: "none"
      })
    }
    
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