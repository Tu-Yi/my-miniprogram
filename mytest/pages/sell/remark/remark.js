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
    placeholder: constants.Remark_default,
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
    if(e.detail.value.textarea){
      app.globalData.remarkInfo = e.detail.value.textarea;
      wx.redirectTo({
        url: constants.PagePath_Account,
      })
    }else{
      wx.showToast({
        title: constants.Msg_RemarkInfo,
        icon: "none"
      })
    }
  }
})