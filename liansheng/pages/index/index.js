//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    imgUrls: [
      '/images/111.png',
      'https://images.unsplash.com/photo-1551334787-21e6bd3ab135?w=640',
      'https://images.unsplash.com/photo-1551214012-84f95e060dee?w=640',
      'https://images.unsplash.com/photo-1551446591-142875a901a1?w=640'
    ],
    indicatorDots: true,
    autoplay: false,
    interval: 5000,
    duration: 1000,
    list: null
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    //绑定页面数据
    this.getData();
  },
  toDetail:function(e){
    console.log(e)
    //获取dataset中的id
    var index = e.currentTarget.dataset.index;
    //根据id获取title
    var title = this.data.list[index].title;
    //存入缓存 10M
    wx.setStorageSync("index", index);
    wx.setStorageSync("title", title);
    //跳转页面
    wx.navigateTo({
      //直接传值
      //url: '/pages/details/detail?index='+index+'&title='+title,
      url: '/pages/details/detail',
    })
  },
  //打电话
  call:function(){
    wx.makePhoneCall({
      phoneNumber: '13980561803' 
    })
  },
  //获取数据
  getData:function(){
    var self = this;
    wx.request({
      url: app.globalData.host+'/list', // 使用全局变量
      method: 'GET',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        console.log(res.data)
        self.setData({list: res.data})
      }
    })
  }
})
