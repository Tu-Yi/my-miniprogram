# 技巧汇总

## 重用样式文件

```css
/*out.wxss*/
.left{
  margin-left:350rpx;
}
/*index.wxss*/
@import "out.wxss";
```

## 调试js文件

```javascript
debugger;
预览-打开调试
真机调试-debugger；
```

## dataset

```html
<button bindtap='clickMe' data-id="1" data-title="001">点我</button>
```

```javascript
clickMe:(e)=>{
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.title)
}
```

## js模块化

```javascript
//common.js
var name = 'kangkang';
function sayHello(name){
  console.log(`hello ${name} !`);
}
module.exports = {
  name:name,
  sayHello: sayHello
}
//index.js
var common = require('../../utils/common.js'); //只能是相对路径
 console.log(common.name)
 common.sayHello('yuankun');
```

## wx:key

?

## wx:if vs hidden

```html
wx:if(display:none) vs hidden(visibility)
```

## 模板

```html
//temp.wxml
<template name="mytemp">
  <view>姓名{{name}}</view>
  <view>年龄{{age}}</view>
  <view>地址{{address}}</view>
  <view>备注{{remark}}</view>
  <view>消息{{msg}}</view>
</template>

<view>
  <template is="mytemp" data="{{...person,msg,name: 'imooc', age: '18'}}" />
</view>
```

```javascript
//temp.js
data: {
    person: {address:'1321',remark:'3fdsf'},
    msg: '123'
}
```

```html
//index.wxml
<import src="../../template/temp/temp.wxml" />
<view>
  <template is="mytemp" data="{{...person,msg,name: 'imooc', age: '18'}}" />
</view>
```

```javascript
//index.js
data: {
    txt:'',
    person: { address: '1321', remark: '3fdsf' },
    msg: '123'
},
```



## wxs

```javascript
//module.wxs
var num = require("module2.wxs"); //引入另一个脚本

var name ='niliv'
var age = 12
var method = function(obj){
  console.log(num.name)
  return obj
}
module.exports = {
  name: name,
  age: age,
  method: method
}
```

```html
//index.wxml
<wxs src='module.wxs' module='item'></wxs>
<view>{{item.name}}</view>
<view>{{item.age}}</view>
<view>{{item.method('hello')}}</view>
```

## include

```html
<include src="header.wxml" /> 导入页头
```

## scroll

![](https://niliv-technology-1252830662.cos.ap-chengdu.myqcloud.com/mina/Snipaste_2019-04-08_12-38-43.png)

## movable

![](https://niliv-technology-1252830662.cos.ap-chengdu.myqcloud.com/mina/Snipaste_2019-04-08_12-50-24.png)

## 接口请求

```javascript
doLogin: function (e) {
    var me = this;
    var formObject = e.detail.value;
    var username = formObject.username;
    var password = formObject.password;
    // 简单验证
    if (username.length == 0 || password.length == 0) {
      wx.showToast({
        title: '用户名或密码不能为空',
        icon: 'none',
        duration: 3000
      })
    } else {
      var serverUrl = app.serverUrl;
      wx.showLoading({
        title: '请等待...',
      });
      // 调用后端
      wx.request({
        url: serverUrl + '/login',
        method: "POST",
        data: {
          username: username,
          password: password
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          console.log(res.data);
          wx.hideLoading();
          if (res.data.status == 200) {
            // 登录成功跳转 
            wx.showToast({
              title: '登录成功',
              icon: 'success',
              duration: 2000
            });
            // app.userInfo = res.data.data;
            // fixme 修改原有的全局对象为本地缓存
            app.setGlobalUserInfo(res.data.data);
            // 页面跳转

            var redirectUrl = me.redirectUrl;
            if (redirectUrl != null && redirectUrl != undefined && redirectUrl != '') {
              wx.redirectTo({
                url: redirectUrl,
              })
            } else {
              wx.redirectTo({
                url: '../mine/mine',
              })
            }
            
          } else if (res.data.status == 500) {
            // 失败弹出框
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 3000
            })
          }
        }
      })
    }
  },
```



## 图片处理

[image图片自适应宽度比例显示](<http://www.wxapp-union.com/portal.php?mod=view&aid=1197>)

### swiper自适应

```html
<swiper indicator-dots="{{indicatorDots}}" autoplay="{{autoplay}}" interval="{{interval}}" duration="{{duration}}" 
style='height:{{swiperHeight}}px'>
    <block wx:for="{{imgUrls}}" wx:key="{{index}}">
        <swiper-item>
            <image class='swiper-img' bindload='setSwiperHeight' src='{{item}}' mode="widthFix"></image>
        </swiper-item>
    </block>
</swiper>
```

```css
/**轮播图图片宽高自适应**/
.swiper-img{
    width: 100%;
    height: auto;
    display: block;
}
```

```javascript
/**
 * 获取图片宽高比率
 */
function getImageScale(e){
  //图片的原始宽度
  var imgWidth = e.detail.width;
  //图片的原始高度
  var imgHeight = e.detail.height;
  //同步获取设备宽度
  var sysInfo = wx.getSystemInfoSync();
  //获取屏幕的宽度
  var screenWidth = sysInfo.screenWidth;
  //获取屏幕和原图的比例
  var scale = screenWidth / imgWidth;
  //设置容器的高度
  var height = imgHeight * scale;
  return height;
}
setSwiperHeight: function (e) {
    let sheight = utils.getImageScale(e);
    this.setData({
      swiperHeight: sheight
    })
    console.log(this.data.swiperHeight)
}
```





## 地理位置

[获取地理位置](<https://blog.csdn.net/UFO00001/article/details/72879360>)

## base64

tabbar里的图标只支持本地图片，不支持网络和base64

## 封装请求

```javascript
function request(url, data = {}, method='GET'){
  wx.showLoading({
    title: constants.LoadingTitle,
  });
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data,
      method: method,
      header: {
        'Content-Type': method == 'GET' ? 'application/json' : 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject(res.errMsg);
        }
      },
      fail: function (err) {
        reject(err)
      }
    })
  });
}
```

## 封装API

```javascript
const url = 'http://rest.apizza.net/';
const root = 'mock/86eb76c00ac2c0c85b99661b338be435';
module.exports = {
  Store_Detail: url + root + '/detail'
}
```

## 封装常量

```javascript
module.exports = {

  AppTitle: '喵姐米粉',

  AppDesc: '最正宗的南充米粉，小时候的味道!',

  AppHome: '/pages/index/index',

  IndicatorDots: true,

  Autoplay: true,

  Interval: 3000,

  Duration: 1000,

  LoadingTitle: '加载中...'

};
```

## 列表布局

```html
<view class="weui-cells weui-cells_after-title cells-show">
    <navigator url="" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <view class="weui-cell__hd">
            <image src="{{ico_picture}}" style="margin-right: 5px;vertical-align: middle;width:22px; height: 22px;"></image>
        </view>
        <view class="weui-cell__bd weui-cell_font">查看店铺所有图片</view>
        <view class="weui-cell__ft weui-cell__ft_in-access"></view>
    </navigator>
    <navigator url="" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <view class="weui-cell__hd">
            <image src="{{ico_zb}}" style="margin-right: 5px;vertical-align: middle;width:20px; height: 20px;"></image>
        </view>
        <view class="weui-cell__bd weui-cell_font" >{{address}}</view>
        <view class="weui-cell__ft weui-cell__ft_in-access"></view>
    </navigator>
    <navigator url="" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <view class="weui-cell__hd">
            <image src="{{ico_phone}}" style="margin-right: 5px;vertical-align: middle;width:18px; height: 18px;"></image>
        </view>
        <view class="weui-cell__bd weui-cell_font">{{phone}}</view>
        <view class="weui-cell__ft"> <image src='{{img_call}}' style="vertical-align: middle;width:23px; height: 23px;" /> </view>
    </navigator>
    <navigator url="" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <view class="weui-cell__hd">
            <image src="{{ico_time}}" style="margin-right: 5px;vertical-align: middle;width:18px; height: 18px;"></image>
        </view>
        <view class="weui-cell__bd weui-cell_font" >配送时间：{{delivery_time}}</view>
        <view class="weui-cell__ft"></view>
    </navigator>
    <navigator url="" class="weui-cell weui-cell_access" hover-class="weui-cell_active">
        <view class="weui-cell__bd weui-cell_font" ><image src="{{ico_notice}}" style="margin-right: 5px;vertical-align: middle;width:22px; height: 22px;"></image>公告：亲们小店可以开发票了哟，随时欢迎亲们下单哟亲们小店可以开发票了哟，随时欢迎亲们下</view>
        <view class="weui-cell__ft"></view>
    </navigator>
  </view>
```

## 单张图片自适应，设置成背景

```html
<view class="header" style='height:{{height}}px;background-image:url({{storeImg}})'>
.header {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
}
```

```javascript
function getImageScale(e){
  //同步获取设备宽度
  var sysInfo = wx.getSystemInfoSync();
  //获取屏幕的宽度
  var screenWidth = sysInfo.screenWidth;
  //设置容器的高度
  var height = screenWidth*9/16;  //自适应16:9
  return height;
}
```

