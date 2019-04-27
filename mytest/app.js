//app.js  openid后面放入缓存
App({
  onLaunch: function () {
  },
  globalData: {
    storeId: 'mjmf',
    isNewUser: true,
    accountInfo: [],
    orderStatus: '',
    remarkInfo: "",
    openid: ''
  }
})