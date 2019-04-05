// pages/file/file.js
Page({

  /**
   * Page initial data
   */
  data: {

  },
  upload:function(){
    // wx.chooseImage({
    //   success(res) {
    //     const tempFilePaths = res.tempFilePaths
    //     wx.uploadFile({
    //       url: 'http://localhost:9999/upload', // 仅为示例，非真实的接口地址
    //       filePath: tempFilePaths[0],
    //       name: 'file',
    //       formData: {
    //         user: 'test'
    //       },
    //       success(res) {
    //         const data = res.data
    //         console.log(res)
    //       }
    //     })
    //   }
    // })
    wx.downloadFile({
      url: 'https://example.com/audio/123', // 仅为示例，并非真实的资源
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          wx.playVoice({
            filePath: res.tempFilePath
          })
        }
      }
    })
  },
  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function (options) {

  },

  /**
   * Lifecycle function--Called when page is initially rendered
   */
  onReady: function () {

  },

  /**
   * Lifecycle function--Called when page show
   */
  onShow: function () {

  },

  /**
   * Lifecycle function--Called when page hide
   */
  onHide: function () {

  },

  /**
   * Lifecycle function--Called when page unload
   */
  onUnload: function () {

  },

  /**
   * Page event handler function--Called when user drop down
   */
  onPullDownRefresh: function () {

  },

  /**
   * Called when page reach bottom
   */
  onReachBottom: function () {

  },

  /**
   * Called when user click on the top right corner to share
   */
  onShareAppMessage: function () {

  }
})