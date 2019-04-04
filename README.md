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

页面跳转

```javascript
  clickone: function(){
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
  <!--还是不能跳转tabbar页面-->
  <navigator url='/pages/logs/logs'>
    <view>
      <text class="user-motto">文章二</text>
    </view>
  </navigator>
```

登录

```javascript
  loginBtnClick:function(){
    app.appData.userinfo = {username:this.data.username,password:this.data.password};
    wx.switchTab({
      url: '/pages/user/user',
    })
  },
  usernameInput:function(e){
    this.setData({username: e.detail.value});
  },
  passwordInput: function (e){
    this.setData({ password: e.detail.value });
  }
```

布局

```javascript
/*flex*/
.container{
  /*容器属性*/
  display: flex;
  /* flex-flow: row; */
  /*flex-direction: column;*/
  /* flex-wrap:wrap nowrap wrap-reverse; */
  /* flex-flow: row wrap; */
  justify-content: /*flex-start flex-end*/ space-between /*space-around center*/;
  align-items:flex-start /*flex-end center stretch(如果没有高度占满高度) baseline(按文字对齐)*/;
  
  width: 100%;
  height: 300rpx;
  background: #eeeeee;
}
.item{
  width: 100rpx;
  height: 100rpx;
  background: #d3d3d3;
  border: 1px solid #fff;
  /* 元素属性 */
  /* flex-grow: 1; 有多余空间占据的比例 */
  /* flex-shrink: 1; 空间不足默认等比缩小 */
  flex: 1 0 auto; /*grow shrink basis*/ 
}
.i3{
  /* flex-grow: 2;  有多余空间占据的比例 */
  /* flex-shrink: 0;空间不足默认不要等比缩小 */
  /* flex-basis: 200rpx; 元素在主轴上占据的空间 */
  order:-1; /*顺序*/
  align-self: flex-end; /*自身在交叉轴*/
  
}
```

组件

轮播图

```javascript
<swiper
  indicator-dots="true"
  autoplay="true"
  interval="3000"
  duration="1000"
  style='width:100%;'
  bindchange='schange'
>
  <block wx:for="{{imgUrls}}">
    <swiper-item>
      <image src="{{item}}" class="slide-image" width="100%" height="150" />
    </swiper-item>
  </block>
</swiper>
转换事件，能得到当前
  schange:function(e){
    console.log(e)
  }
```

```css
swiper{
  width: 100%;
  height:340rpx;
}
swiper image {
  display: block;
  height: 100%;
  width: 100%;
}
```

滚动条

```javascript
<scroll-view scroll-y style="height:250px" 
bindscrolltoupper="toUpper" bindscrolltolower="tolower"   事件
bindscroll="scroll" 
upper-threshold="100px" scroll-top="{{scrolltop}}" scroll-into-view="red">  定位
    <view id="green" class="scroll-view-item_H bc_green"></view>
    <view id="red" class="scroll-view-item_H bc_red"></view>
    <view id="yellow" class="scroll-view-item_H bc_yellow"></view>
</scroll-view>
</view>
<button bindtap='toTop' style='margin-top:30rpx;'>滚动</button>
toTop:function(){
    this.setData({scrolltop:50})
}
```

基础内容

```javascript
<view wx:for="{{icons}}">
<icon type='{{item}}' color='red'></icon>
</view>
<text>{{text}}</text>
<progress percent="20" show-info />
<progress percent="40" stroke-width="12" />
<progress percent="60" color="pink" />
<progress percent="80" active />
```

form

```javascript
<form bindsubmit='formSubmit'>
<input name="input"></input>
<button form-type='submit'>提交</button>
</form>
formSubmit:(e)=>{
    console.log(e)
  }
```

pick

```html
<view class="section">
  <view class="section__title">普通选择器</view>
  <picker bindchange="bindPickerChange" value="{{index}}" range="{{array}}">
    <view class="picker">
      当前选择：{{array[index]}}
    </view>
  </picker>
</view>
<view class="section">
  <view class="section__title">多列选择器</view>
  <picker
    mode="multiSelector"
    bindchange="bindMultiPickerChange"
    bindcolumnchange="bindMultiPickerColumnChange"
    value="{{multiIndex}}"
    range="{{multiArray}}"
  >
    <view class="picker">
      当前选择：{{multiArray[0][multiIndex[0]]}}，{{multiArray[1][multiIndex[1]]}}，{{multiArray[2][multiIndex[2]]}}
    </view>
  </picker>
</view>
<view class="section">
  <view class="section__title">时间选择器</view>
  <picker
    mode="time"
    value="{{time}}"
    start="09:01"
    end="21:01"
    bindchange="bindTimeChange"
  >
    <view class="picker">
      当前选择: {{time}}
    </view>
  </picker>
</view>

<view class="section">
  <view class="section__title">日期选择器</view>
  <picker
    mode="date"
    value="{{date}}"
    start="2015-09-01"
    end="2017-09-01"
    bindchange="bindDateChange"
  >
    <view class="picker">
      当前选择: {{date}}
    </view>
  </picker>
</view>
<view class="section">
  <view class="section__title">省市区选择器</view>
  <picker
    mode="region"
    bindchange="bindRegionChange"
    value="{{region}}"
    custom-item="{{customItem}}"
  >
    <view class="picker">
      当前选择：{{region[0]}}，{{region[1]}}，{{region[2]}}
    </view>
  </picker>
</view>
Page({
  data: {
    array: ['美国', '中国', '巴西', '日本'],
    objectArray: [
      {
        id: 0,
        name: '美国'
      },
      {
        id: 1,
        name: '中国'
      },
      {
        id: 2,
        name: '巴西'
      },
      {
        id: 3,
        name: '日本'
      }
    ],
    index: 0,
    multiArray: [['无脊柱动物', '脊柱动物'], ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'], ['猪肉绦虫', '吸血虫']],
    objectMultiArray: [
      [
        {
          id: 0,
          name: '无脊柱动物'
        },
        {
          id: 1,
          name: '脊柱动物'
        }
      ], [
        {
          id: 0,
          name: '扁性动物'
        },
        {
          id: 1,
          name: '线形动物'
        },
        {
          id: 2,
          name: '环节动物'
        },
        {
          id: 3,
          name: '软体动物'
        },
        {
          id: 3,
          name: '节肢动物'
        }
      ], [
        {
          id: 0,
          name: '猪肉绦虫'
        },
        {
          id: 1,
          name: '吸血虫'
        }
      ]
    ],
    multiIndex: [0, 0, 0],
    date: '2016-09-01',
    time: '12:01',
    region: ['广东省', '广州市', '海珠区'],
    customItem: '全部'
  },
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  bindMultiPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange(e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value)
    const data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    }
    data.multiIndex[e.detail.column] = e.detail.value
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物']
            data.multiArray[2] = ['猪肉绦虫', '吸血虫']
            break
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物']
            data.multiArray[2] = ['鲫鱼', '带鱼']
            break
        }
        data.multiIndex[1] = 0
        data.multiIndex[2] = 0
        break
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫']
                break
              case 1:
                data.multiArray[2] = ['蛔虫']
                break
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥']
                break
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓']
                break
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物']
                break
            }
            break
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼']
                break
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼']
                break
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎']
                break
            }
            break
        }
        data.multiIndex[2] = 0
        break
    }
    console.log(data.multiIndex)
    this.setData(data)
  },
  bindDateChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
  },
  bindTimeChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      time: e.detail.value
    })
  },
  bindRegionChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
  },
  formSubmit:(e)=>{
    console.log(e)
  }
})
```

操作反馈

```javascript
showfoot:()=>{
    wx.showActionSheet({
      itemList: ['A', 'B', 'C'],
      success(res) {
        console.log(res.tapIndex)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  showtoast:()=>{
    wx.showToast({
      title: '成功',
      icon: 'success',
      duration: 2000
    })
  },
  showmodal:()=>{
    wx.showModal({
      title: '提示',
      content: '这是一个模态弹窗',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  showloading:()=>{
    wx.showLoading({
      title: '加载中',
    })

    setTimeout(function () {
      wx.hideLoading()
    }, 2000)
  },
```

地图

```html
<map
  id="map"
  longitude="113.324520"
  latitude="23.099994"
  scale="14"
  controls="{{controls}}"
  bindcontroltap="controltap"
  markers="{{markers}}"
  bindmarkertap="markertap"
  polyline="{{polyline}}"
  bindregionchange="regionchange"
  show-location
  style="width: 100%; height: 300px;"
></map>
```

富文本

```javascript
<rich-text nodes="{{nodes}}" bindtap="tap"></rich-text>
nodes: [{
      name: 'div',
      attrs: {
        class: 'div_class',
        style: 'line-height: 60px; color: red;'
      },
      children: [{
        type: 'text',
        text: 'Hello&nbsp;World!'
      }]
    }],
```





