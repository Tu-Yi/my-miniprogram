Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('index onload');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('index onready');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('index onshow');
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('index onhide');
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('index onunload');
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
    
  },
  clickone: function () {
    //具有tabbar的页面，必须用switchtab，hide，show
    //switchTab不能传参，只能使用全局变量或者缓存
    wx.setStorageSync("id", 1);
    wx.switchTab({
      url: '/pages/detail/detail',
    })
    //navigateTo-index的状态是hide和show  detail的状态是unload
    // wx.navigateTo({
    //   url: '/pages/detail/detail',
    // })
    //redirectTo-index会unload
    // wx.redirectTo({
    //   url: '/pages/detail/detail',
    // })
  }
})