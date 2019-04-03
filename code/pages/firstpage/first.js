Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"这里是内容",
    btnText: "这是按钮",
    isShow: true,
    news: ['abc', 'bcd', 'gh']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    
  },
  //按钮事件，修改文本数据
  primary:function(){
    console.log("被点击了")
    this.setData({text:"我被按钮改变了"})
  },
  //修改显示
  warn:function(){
    var myShow = this.data.isShow;
    this.setData({ isShow: !this.data.isShow}) //先要获取data中数据，否则不能识别isShow
  },
   //修改数组数据
  default:function(){
    //var newsData = this.data.news;
    //newsData.shift();
    this.data.news.shift();
    this.setData({ news: this.data.news })
  }
})