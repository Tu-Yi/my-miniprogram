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

## 地理位置

[获取地理位置](<https://blog.csdn.net/UFO00001/article/details/72879360>)

