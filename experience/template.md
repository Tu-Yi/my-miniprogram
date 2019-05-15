# 模板

## css

### 引用外部css文件

```css
/*out.wxss*/
.left{
  margin-left:350rpx;
}
/*index.wxss*/
@import "out.wxss";
```



## template

```html
//fail.wxml
<template name="failPage">
  <view wx:if='{{!isShow}}' style='position:absolute;height:100%;width:100%;display:flex;align-items: center;justify-content: center;display:flex;flex-direction:column;'>
    <image src='/static/images/fail.png' style='width:96px;height:96px;' />
  <view>
    <button bindtap='onReflash'>刷新页面</button>
  </view>
  </view>
</template>
```

```javascript
//fail.js
var fail = {
  onReflash : function (pages) {
    if (pages.length != 0) {
      pages[pages.length - 1].onLoad()
    }
  }
}
export default fail
```

```html
//index.wxml
<import src="../template/fail/fail.wxml" />
<view bindtap='failOnclick'>
  <template is="failPage" data="{{isShow}}" />
</view>
```

```javascript
//index.js
failOnclick: function () {
    var pages = getCurrentPages();
    fail.default.onReflash(pages);
    this.setData({
        isShow: true
    })
},
var fail = require('../template/fail/fail.js');
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



### component

```html
<!--components/amount/amount.wxml-->
<view class='num_wrap'>
  <view class='btn sub' style='opacity: {{opacity}}' catchtap='substract'>
    <image src='{{img_minus}}' style='width:24px;height:24px;'/>
  </view>
  <view class='text' style='opacity: {{opacity}}'>{{count}}</view>
  <view class='btn add' catchtap='add'>
    <image src='{{img_add}}' style='width:24px;height:24px;'/>
  </view>
</view>
```

```javascript
add(){
    var count = this.data.count;
    this.setData({
        count: ++count,
        opacity: 1
    })
    var eventDetail = {
        val: this.data.count,
        type: 'add',
        goodname: this.data.goodname,
        goodprice: this.data.goodprice,
        goodtypeid: this.data.goodtypeid,
        goodsWrapPrice: this.data.goodsWrapPrice,
        goodsimg: this.data.goodsimg
    }
    this.triggerEvent('numEvent', eventDetail)
},
```

```javascript
//sell
 "usingComponents": {
    "amount": "/components/amount/amount"
  }
<amount goodname="{{goods.goods_name}}" goodprice="{{goods.goods_price}}" goodsimg="{{goods.goods_img}}" goodtypeid="{{item.goods_type_id}}" goodsWrapPrice="{{goods.goods_wrap_price}}" class="amount" bind:numEvent="onNumChange"></amount>
```









