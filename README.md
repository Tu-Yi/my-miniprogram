# 小程序学习笔记

`app.js` ：定义程序启动信息和相关执行，比如在缓存中定义日志，获取用户信息，用户登录，设置全局变量`globalData`  

```javascript
//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //全局变量
  globalData: {
    userInfo: null,
    host: 'http://localhost:8888'
  }
})
```



`app.json`：定义路由，窗体显示样式，菜单

```javascript
{
  "pages": [
    "pages/index/index",
    "pages/logs/logs",
    "pages/details/detail"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#2e5e86",
    "navigationBarTitleText": "老胡的包子铺",
    "navigationBarTextStyle": "white"
  },
  "tabBar": {
    "selectedColor": "#2e5e86",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "首页",
        "iconPath": "images/icon_first.png",
        "selectedIconPath": "images/icon_first1.png"
      },
      {
        "pagePath": "pages/logs/logs",
        "text": "日志",
        "iconPath": "images/icon_my.png",
        "selectedIconPath": "images/icon_my1.png"
      }
    ]
  }
}
```

`app.wxss`：定义全局样式

`util.js`：定义工具方法

判断和循环

```javascript
<!--判断-->
<view wx:if="{{isShow}}">{{text}} 1</view>
<view wx:else="{{isShow}}">{{text}} 2</view>
<!--循环-->
<view wx:for="{{news}}" wx:for-item="itemx" wx:for-index="ix">
{{ix}}{{itemx}}
</view>
```

修改变量

```javascript
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
```

模板

```javascript
<!--模板使用,这里参数默认使用子页面的参数-->
<text>this is header {{text}}</text>
<include src="../templates/header" data="{{text:'hahhaha'}}" />
<!--模板使用，这里参数必须自定义-->
<template name="footer1">
this is footer1- {{text}}
</template>
<template name="footer2">
this is footer2 - {{text}}
</template>
<import src="../templates/footer" />
<template is="footer1" data="{{text:'my father'}}" />
<template is="footer2" data="{{text:'my son'}}" />
```

滚动条

```javascript
<scroll-view scroll-y style="height:250px">
<!--循环显示数据-->
  <view wx:for="{{kdInfo.result.list}}" style='margin-top:20px;'>
    {{item.time}}
    -------
    {{item.status}}
  </view>
</scroll-view>
```

input输入获取值

```javascript
<input placeholder='请输入运单号' bindinput='input'></input>
```

轮播图

```javascript
<swiper
  indicator-dots="{{indicatorDots}}"
  autoplay="{{autoplay}}"
  interval="{{interval}}"
  duration="{{duration}}"
>
  <block wx:for="{{imgUrls}}">
    <swiper-item>
      <image src="{{item}}" class="slide-image" width="355" height="150" />
    </swiper-item>
  </block>
</swiper>
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
```

页面跳转传值

```javascript
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
  }
```

打电话

```javascript
  call:function(){
    wx.makePhoneCall({
      phoneNumber: '13980561803' 
    })
  },
```

请求数据

```javascript
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
```





