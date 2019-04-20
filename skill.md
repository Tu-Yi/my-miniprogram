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

## 请求错误显示默认图片

```html
<view wx:if='{{!isShow}}' style='position:absolute;height:100%;width:100%;display:flex;align-items: center;justify-content: center;'>
  <image src='{{img_fail}}' style='width:128px;height:128px;' />
</view>
```

## 请求数据

```javascript
getStoreDetail: function(){
    var that = this;
    utils.request(api.Store_Detail, { shopId: app.globalData.storeId}).then(
      res=>{
        console.log(res)
        wx.setNavigationBarTitle({
          title: res.store_name || constants.title_default
        }),
        that.setData({ 
          storeImg: res.store_img || '../../' + constants.img_default,
          address: res.address || constants.address_default,
          phone: res.phone || constants.phone_default,
          delivery_time: res.delivery_time || constants.time_default,
          new_user_reduction: res.new_user_reduction || "0",
          minaDiscount: 10 - (+(res.weixin_order_reduction || "0"))*10 + ''
        })
        wx.setStorage({
          key: 'storeInfo',
          data: res,
        })
      },
      err=>{
        wx.hideLoading();
        that.setData({
          isShow: false
        })
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      }
    )
  },
```

## 背景图设置背景色防止图片错误

```css
.header {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #cdcdcf;
}
```

## 常见错误处理方法

请求数据失败：显示错误图片 刷新页面 退出小程序

字段不存在或字段值为空：给予默认值

图片字段不存在或字段值为空：给予默认图片

图片url错误：设置背景色

## 模板

```html
<template name="failPage">
  <view wx:if='{{!isShow}}' style='position:absolute;height:100%;width:100%;display:flex;align-items: center;justify-content: center;'>
    <image src='{{img_fail}}' style='width:96px;height:96px;' />
  </view>
</template>
<import src="../template/fail/fail.wxml" />
<template is="failPage" data="{{...item}}" />
```

## 错误模板

```html
<template name="failPage">
  <view wx:if='{{!isShow}}' style='position:absolute;height:100%;width:100%;display:flex;align-items: center;justify-content: center;display:flex;flex-direction:column;'>
    <image src='../../static/images/fail.png' style='width:96px;height:96px;' />
  <view>
    <button bindtap='onReflash'>刷新页面</button>
  </view>
  </view>
</template>
<import src="../template/fail/fail.wxml" />
<view bindtap='failOnclick'>
<template is="failPage" data="{{isShow}}" />
</view>
```

```javascript
fail.js
var fail = {
  onReflash : function (pages) {
    if (pages.length != 0) {
      pages[pages.length - 1].onLoad()
    }
  }
}
export default fail

index.js
failOnclick: function(){
    var pages = getCurrentPages();
    console.log(pages)
    console.log(fail)
    fail.default.onReflash(pages);
    this.setData({
      isShow: true
    })
  }
```

## 封装获取缓存

```javascript
function getLocalStorage(key,cal,fail){
  wx.getStorage({
    key: 'storeInfo',
    success: function (res) {
      cal(res)
    },
    fail: function (err) {
      fail(err)
    }
  })
}
```

## 打开坐标位置

```javascript
openLocation:function(){
    var that=this;
    utils.getLocalStorage(constants.Storage_StoreInfo,
      res=>{
        that.setData({
          latitude: res.data.latitude || '30.657420',
          longitude: res.data.longitude || '104.065840',
        })
        wx.openLocation({
          longitude: Number(that.data.longitude),
          latitude: Number(that.data.latitude),
          scale: 18
        })
      }, 
      err=>{
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
    })
  },
```

## navigator报错

<navigator/> should have url attribute when using navigateTo, redirectTo or switchTab

```html
url="本页面名称"
```

## 获取地理位置

```javascript
"permission": {
    "scope.userLocation": {
      "desc": "小程序将获取您的用餐位置"
    }
  }
function getUserLocationInfo(cal){
  this.getLocation(function (addr) {
    cal(addr);
    wx.setStorage({
      key: constants.Storage_UserLocation,
      data: addr,
    })
  });
}
function getLocation(cal){
  var that=this
  wx.getLocation({
    success(res) {
      console.log(res)
      // 1.3 将获取到的 经纬度传值给 getAddress 解析出 具体的地址
      that.getAddress(res.latitude, res.longitude,function(addr){
        console.log("getLocation"+addr)
        cal(addr);
      })
    }
  })
}
function getAddress(latitude, longitude,cal){
  let qqmapsdk = new QQMapWX({
    key: constants.Map_Key
  })
  qqmapsdk.reverseGeocoder({
    location: { latitude, longitude },
    success(res) {
      console.log('success', res)
      cal(res.result);
    }
  })
}

getCustomLocation: function(){
    var that = this
    wx.getSetting({
      success: function(res){
        if (res.authSetting[constants.Scope_UserLocation]) {
          utils.getUserLocationInfo(function(addr){
            that.setData({
              cAddress: addr.formatted_addresses.recommend,
              cAddIsShow: true
            })
          })
        }else{
          wx.openSetting({
            success: function(res){
              if (res.authSetting[constants.Scope_UserLocation]) {
                utils.getUserLocationInfo(function (addr) {
                  that.setData({
                    cAddress: addr.formatted_addresses.recommend,
                    cAddIsShow: true
                  })
                })
              }else{
                that.setData({
                  cAddIsShow: false
                })
              }
            }
          })
        }
      }
    })
  },
```

## 商品分类列表，左右联动

```html
<view style='display:flex;margin-top:10rpx;'>
    <view>
      <scroll-view class="nav_left" scroll-y='true' style='height:{{height}}rpx'>
        <block wx:for="{{list}}" wx:key='{{index}}'>
          <view wx-if='{{item.goods.length}}' class="nav_left_items {{curIndex == index ? 'nav_left_item-active' : ''}}" data-id='b{{index}}' data-index="{{index}}" bindtap="switchRightTab" data-itemid='{{item.goods_type_id}}'>
            {{item.goods_type}}
          </view>
        </block>
      </scroll-view>
    </view>
    <view>
      <scroll-view style='height:{{height}}rpx' class='nav_right' scroll-y='true' scroll-into-view='{{toView}}' bindscroll="scroll" scroll-with-animation='true'>
        <block wx:for='{{list}}' wx:for-item="item" wx:key='{{index}}'>
          <view wx:if='{{item.goods.length}}' id='b{{index}}' class='type_title'>
            {{item.goods_type}}
          </view>
          <view class="good" wx:for='{{item.goods}}' wx:for-item="goods" wx:key='{{index}}'>
            <view class='good_img'>
              <image src='{{goods.goods_img}}' style='width:180rpx;height:180rpx;' />
            </view>
            <view class='good_content'>
              <text class='good_content_title'>{{goods.goods_name}}</text>
              <view class='good_content_detail'>{{goods.goods_detail}}</view>
              <view class='good_content_count'>月售{{goods.goods_month_sellcount}}</view>
              <view class='good_content_price'>
                <text>￥</text>{{goods.goods_price}}</view>
            </view>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
```

```css
.caregory{
  margin-top:10rpx;
}
.nav_left{
  background: #f8f8f8;
  width: 150rpx;
  white-space: nowrap;
}
.nav_right{
  background: #fff;
  padding:20rpx;
}
::-webkit-scrollbar {
  width: 0;
  height: 0;
  color: transparent;
}
.nav_left_items{
  font-size: 28rpx;
  color: #333;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
}
.nav_left_item-active{
  background-color: #fff;
  color: #ff8557;
}
.type_title {
  margin-bottom: 20rpx;
  margin-top:40rpx;
  font-size: 14px;
  color: #888888;
}
.type_title:first-child {
  margin-top:0;
}
.good {
  display: flex;
  flex-direction: row;
  margin-bottom: 20rpx;
}
.good .good_img {
  margin-right: 15rpx;
}
.good .good_content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
.good_content_title {
  vertical-align: top;
  line-height: 1;
  margin-bottom: 5rpx;
  font-weight: bold;
  font-size: 17px;
  overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
.good_content_detail {
  color: #888888;
    text-align: left;
    font-size: 14px;
   overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
    margin-bottom: 10rpx;
}
.good_content_count {
  color: #888888;
    text-align: left;
    font-size: 14px;
}
.good_content_price {
  color: #ff8557;
  font-weight: bold;
  align-self: flex-end;
  text-align: left;
}
.good_content_price text {
  font-size: 13px;
}
```

```javascript
wx.getSystemInfo({
      success: function(res) {
        console.log(res.windowHeight)
        var h;
        if (res.windowHeight>700){
          h = res.windowHeight * 0.65
        } else if (res.windowHeight > 600){
          h = res.windowHeight * 1.25
        } else if (res.windowHeight > 500){
          h = res.windowHeight * 1.25
        } else if (res.windowHeight<500){
          h = res.windowHeight * 1.4
        }
        that.setData({
          height: h
        })
      },
    })
    this.getGoodsList();
getGoodsList: function () {
    var that = this;
    utils.request(api.Goods_list, { shopId: app.globalData.storeId }).then(
      res => {
        console.log(res)
          that.setData({
            list: res
          })
      },
      err => {
        wx.hideLoading();
        that.setData({
          isShow: false
        })
        utils.showErrorToast(constants.Msg_DataError);
        console.log(err)
      }
    )
  },
  switchRightTab(e) {
    console.log(e)
    let id = e.currentTarget.dataset.id
    let index = parseInt(e.currentTarget.dataset.index);
    let itemid = e.currentTarget.dataset.itemid
    this.setData({
      toView: id,
      curIndex: index
    })
  },
```

### 自己控制

```html
<view style='display:flex;margin-top:10rpx;' id="categrays">
    <view>
      <scroll-view class="nav_left" scroll-y style='height:{{height}}px'>
        <block wx:for="{{list}}" wx:key='{{index}}'>
          <view wx-if='{{item.goods.length}}' class="nav_left_items item {{index==cateListActiveIndex && 'nav_left_item-active'}}" data-id='b{{index}}' data-index="{{index}}" bindtap="scrollToCategory" data-itemid='{{item.goods_type_id}}'>
            {{item.goods_type}}
          </view>
        </block>
      </scroll-view>
    </view>
    <view>
      <scroll-view style='height:{{height}}px' class='nav_right' scroll-y scroll-top="{{listViewScrollTop}}"  bindscroll="foodListScrolling" scroll-with-animation='true'>
        <block wx:for='{{list}}' wx:for-item="item" wx:key='{{index}}'>
          <view wx:if='{{item.goods.length}}' id='b{{index}}' class='type_title'>
            {{item.goods_type}}
          </view>
          <view class="good" wx:for='{{item.goods}}' wx:for-item="goods" wx:key='{{index}}'>
            <view class='good_img'>
              <image src='{{goods.goods_img}}' style='width:180rpx;height:180rpx;' />
            </view>
            <view class='good_content'>
              <text class='good_content_title'>{{goods.goods_name}}</text>
              <view class='good_content_detail'>{{goods.goods_detail}}</view>
              <view class='good_content_count'>月售{{goods.goods_month_sellcount}}</view>
              <view class='good_content_price'>
                <text>￥</text>{{goods.goods_price}}</view>
            </view>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
```

```javascript
 setFoodListAreaHeight() {
    let query = wx.createSelectorQuery();
    let that = this;
    //分类栏的高度
    query.select('.type_title').boundingClientRect(function (rect) {
      that.setData({
        eleCateTitleHeight: rect.height
      })
    }).exec();
    //商品item的高度
    query.select('.good').boundingClientRect(function (rect) {
      that.setData({
        eleFoodHeight: rect.height
      })
    }).exec();

    //把商品列表每个分类的区间高度计算，并放进数组
    //上面获取元素的高度可能不是同步的，所以把下面的放在setTimeout里面
    let fh = [0]
    let heightCount = 0
    setTimeout(() => {
      this.data.list.forEach((item, index) => {
        //console.log(item.items.length * this.data.eleFoodHeight);
        if (item.length>0){
          heightCount += item.length * this.data.eleFoodHeight + this.data.eleCateTitleHeight
          fh.push(heightCount)
        }
      })
      this.setData({
        foodAreaHeight: fh
      })
    }, 100)

  },
  /**
     * 滚动到右边的高度
     * @param {*} e 
     */
  scrollToCategory(e) {
    //let id = e.currentTarget.dataset.id
    let index = parseInt(e.currentTarget.dataset.index);
    //let itemid = e.currentTarget.dataset.itemid
    this.setData({
      //toView: id,
      curIndex: index
    })
    console.log(e.currentTarget.dataset);
    let idx = e.currentTarget.dataset.index
    this.setData({
      listViewScrollTop: (this.data.foodAreaHeight[idx] + idx * this.data.eleCateTitleHeight)
    })
  },
  foodListScrolling(event) {
    let scrollTop = event.detail.scrollTop
    let foodAreaHeight = this.data.foodAreaHeight
    foodAreaHeight.forEach((item, index) => {
      if (scrollTop >= foodAreaHeight[index] && scrollTop < foodAreaHeight[index + 1]) {
        this.setData({ cateListActiveIndex: index })
      }
    })
  },
```

## 分享

```html
<view class='share' bindtap='share' open-type='share'>
      <button open-type='share'>
        <image src='{{ico_share}}' style='width:24px;height:24px;' />
        <text>分享</text>
    </button>
    </view>  
```

## 页面遮罩

```html
<view class='shade' wx:if='{{isCart}}' bindtap='showMain'></view>
```

```css
.shade {
  width: 100%;
  height: 100%;
  position: fixed;
  background-color: #999;
  z-index: 9998;
  top: 0;
  left: 0;
  opacity: 0.5;
}
```

## 滚动区域高度计算

```javascript
setGoodListHeight:function(){
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        var h;
        var query = wx.createSelectorQuery();
        query.select('#categrays').boundingClientRect(function (rect) {
          h = res.windowHeight - rect.top
          that.setData({
            height: h - res.windowHeight * 0.08
          })
        }).exec();
      },
    })
  },
```

## 菜单商品左右联动

```html
<view style='display:flex;margin-top:10rpx;' id="categrays">
    <view>
      <scroll-view class="nav_left" scroll-y style='height:{{height}}px'>
        <block wx:for="{{list}}" wx:key='{{index}}'>
          <view wx-if='{{item.goods.length}}' class="nav_left_items item {{index==cateListActiveIndex && 'nav_left_item-active'}}" data-id='b{{index}}' data-index="{{index}}" bindtap="scrollToCategory" data-itemid='{{item.goods_type_id}}'>
            {{item.goods_type}}
             <view class='shownum' wx:if='{{item.sell_num>0}}'>
                  {{item.sell_num}}
              </view>
          </view>
        </block>
      </scroll-view>
    </view>
    <view style='flex:1;'>
      <scroll-view style='height:{{height}}px' class='nav_right' scroll-y scroll-top="{{listViewScrollTop}}"  bindscroll="foodListScrolling" scroll-with-animation='true'>
        <block wx:for='{{list}}' wx:for-item="item" wx:key='{{index}}'>
          <view wx:if='{{item.goods.length}}' id='b{{index}}' class='type_title'>
            {{item.goods_type}}
          </view>
          <view class="good" wx:for='{{item.goods}}' wx:for-item="goods" wx:key='{{index}}' data-id="{{goods.goods_id}}" bindtap='toDetail'>
            <view class='good_img'>
              <image src='{{goods.goods_img}}' style='width:180rpx;height:180rpx;' />
            </view>
            <view class='good_content'>
              <text class='good_content_title'>{{goods.goods_name}}</text>
              <view class='good_content_detail'>{{goods.goods_detail}}</view>
              <view class='good_content_count'>月售{{goods.goods_month_sellcount}}</view>
              <view class='good_content_price'>
                  <text>￥</text>{{goods.goods_price}}
                </view>
              <amount goodname="{{goods.goods_name}}" goodprice="{{goods.goods_price}}" 
              goodtypeid="{{item.goods_type_id}}"  goodsWrapPrice="{{goods.goods_wrap_price}}"
              class="amount" 
              bind:numEvent="onNumChange"></amount>
            </view>
          </view>
        </block>
      </scroll-view>
    </view>
  </view>
```

```javascript
/** 获取每类商品界面高度数组*/
  setFoodListAreaHeight() {
    let query = wx.createSelectorQuery();
    let that = this;
    //分类栏的高度
    query.select('.type_title').boundingClientRect(function (rect) {
      that.setData({
        eleCateTitleHeight: rect.height
      })
    }).exec();
    //商品item的高度
    query.select('.good').boundingClientRect(function (rect) {
      that.setData({
        eleFoodHeight: rect.height
      })
    }).exec();

    //把商品列表每个分类的区间高度计算，并放进数组
    //上面获取元素的高度可能不是同步的，所以把下面的放在setTimeout里面
    let fh = [0]
    let heightCount = 0
    setTimeout(() => {
      this.data.list.forEach((item, index) => {
        //console.log(item.items.length * this.data.eleFoodHeight);
        if (item.length>0){
          heightCount += item.length * this.data.eleFoodHeight + this.data.eleCateTitleHeight
          fh.push(heightCount)
        }
      })
      this.setData({
        foodAreaHeight: fh
      })
    }, 100)

  },
  /**
     * 滚动到右边的高度
     * @param {*} e 
     */
  scrollToCategory(e) {
    //let id = e.currentTarget.dataset.id
    let index = parseInt(e.currentTarget.dataset.index);
    //let itemid = e.currentTarget.dataset.itemid
    this.setData({
      //toView: id,
      curIndex: index
    })
    let idx = e.currentTarget.dataset.index
    var top;
    if(idx>0){
      top = idx * 10
    }
    this.setData({
      listViewScrollTop: (this.data.foodAreaHeight[idx] + idx * this.data.eleCateTitleHeight)
    })
  },
  /**商品滚动，分类高亮 */
  foodListScrolling(event) {
    let scrollTop = event.detail.scrollTop
    let foodAreaHeight = this.data.foodAreaHeight
    foodAreaHeight.forEach((item, index) => {
      if (scrollTop >= foodAreaHeight[index] && scrollTop < foodAreaHeight[index + 1]) {
        this.setData({ cateListActiveIndex: index })
      }
    })
  },
```

## 控制元素显示

```html
wx:if='{{item.sell_num>0}}'
wx:if='{{isCart}}'
wx:if='{{startSendPrice_poor<=0 && originalMoney>0}}'
```

## 控制元素样式

```html
class="order {{startSendPrice_poor<=0 ? 'order-active' : 'order-normal'}}"
```

## 控制元素事件

```html
bindtap="{{totalNum>0?'showCart':''}}"
```

## 组件

```html
{
  "usingComponents": {
    "amount": "/components/amount/amount"
  }
}

<amount goodname="{{goods.goods_name}}" goodprice="{{goods.goods_price}}" 
              goodtypeid="{{item.goods_type_id}}"  goodsWrapPrice="{{goods.goods_wrap_price}}"
              class="amount" 
              bind:numEvent="onNumChange"></amount>
```

## 组件传递事件

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
        goodsWrapPrice: this.data.goodsWrapPrice
      }
      this.triggerEvent('numEvent', eventDetail)
    },
```

## 控制元素向左显示

```html
<view class='num_wrap'>
  <view class='btn sub' style='opacity: {{opacity}}' catchtap='substract'>-</view>
  <view class='text' style='opacity: {{opacity}}'>{{count}}</view>
  <view class='btn add' catchtap='add'>+</view>
</view>
```

## 阴影样式

```css
box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.1);
```

## 处理购物车

```javascript
/**处理购物车 */
  cartHandle:function(e){
    var name = utils.cutstr(e.detail.goodname,12)
    var item = {
      name: name,
      typeid: e.detail.goodtypeid,
      price: e.detail.goodprice,
      count: e.detail.val
    }
    let carts = this.data.cartArray;
    let isIn=0;
    let goodindex=-1
    if (carts){
      carts.forEach((good,index)=>{
        if(good.name === item.name){
          e.detail.type === 'add' ? (good.price += item.price) : (good.price -= item.price);
          good.count = item.count;
          if(good.count===0){
            goodindex = index;
          }
          isIn=true;
        }
      })
      if(goodindex>=0){
        carts.splice(goodindex,1);
      }
      if(!isIn){
        carts.push(item);
      }
    }else{
      carts.push(item);
    }
    this.setData({
      cartArray: carts
    })
  },
```

## 页面数据

页面相同类型的业务变量最好放入对象或数组中，方便管理和传值

## 行文本溢出显示省略号

单行

```css
overflow: hidden;
text-overflow:ellipsis;
white-space: nowrap;
```

多行

```css
display: -webkit-box;
-webkit-box-orient: vertical;
-webkit-line-clamp: 3;
overflow: hidden;
```

## 数据默认显示直接在页面判断

```html
<view class='address'>
    <text>{{user.detailInfo?user.detailInfo:'选择收货地址'}}</text>
    <image src='{{img_rightnav}}' style='width:12px;height:12px;' />
  </view>
  <view class='user'>
    <text>{{user.userName || ''}}</text>
    <text>{{user.telNumber || ''}}</text>
  </view>
```

##  图片默认背景

```css
<image src='{{goods.img}}' style='width:80rpx;height:80rpx;background:#cdcdcf' />
```

## 使用微信收货地址

```javascript
wx.getStorage({
      key: 'userAddress',
      success: function(res) {
        that.setAddress(res.data);
      },
    })
getAddress:function(){
    var that=this
    wx.chooseAddress({
      success(res) {
        that.setAddress(res);
        wx.setStorage({
          key: 'userAddress',
          data: that.data.user,
        })
      },
      fail(err){
        console.log(err)
        utils.showErrorToast(constants.Msg_WxAddrError);
      }
    })
  },
  setAddress:function(res){
    var user = {
      userName: res.userName,
      postalCode: res.postalCode,
      provinceName: res.provinceName,
      cityName: res.cityName,
      countyName: res.countyName,
      detailInfo: res.detailInfo,
      nationalCode: res.nationalCode,
      telNumber: res.telNumber
    }
    this.setData({
      user: user
    })
  },
```

## 数值计算不要忘了Number

```javascript
accountPrice: function(){
    let reduced = 0;
    let final = 0;
    console.log(Number(this.data.accountInfo[2].totalMoney) + Number(this.data.accountInfo[1].deliveryFee))
  
    final = utils.roundFractional((Number(this.data.accountInfo[2].totalMoney) + Number(this.data.accountInfo[1].deliveryFee)), 1)
    if (this.data.isNewUser) {
      reduced = utils.roundFractional((Number(this.data.accountInfo[2].discountMoney) + Number(this.data.accountInfo[1].newUserReduction)),1)
    }else{
      reduced = this.data.accountInfo[2].discountMoney
    }
    this.setData({
      reducedMoney: reduced,
      finalPrice: final
    })
  },
```

## 普通选择器

```html
<picker bindchange="bindPickerChange" value="{{index}}" range="{{array}}">
      <view class="weui-cell__ft_in-access">
        {{array[index]}}
      </view>
    </picker>
```

```javascript
bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
```

## 右侧箭头样式

```html
weui-cell__ft_in-access
```

## textarea

```html
<form bindsubmit="bindFormSubmit">
        <view class="header">
            <textarea name="textarea" bindinput='bindWord' class="textarea" value="{{value}}" placeholder="{{placeholder}}" placeholder-class="placeholder" maxlength="{{maxlength}}" focus="{{focus}}" auto-height="{{autoheight}}" adjust-position="{{adjustposition}}" show-confirm-bar="{{show-confirm-bar}}" />
            <view class="info">
                <view class="keywords" wx:for='{{keywords}}' wx:key='{{index}}' data-index='{{index}}' bindtap="toTextArea">{{item}}</view>
            </view>
        </view>
        <button form-type="submit">完成</button>
    </form>
```

```javascript
keywords: constants.Remark_Keywords,
    value: "",
    placeholder: "口味、要求等，100个字以内",
    maxlength: 100,
    focus: true,
    autoheight: false,
    adjustposition: true,
    inValue: ""

bindWord: function(e){
    this.setData({
      inValue: e.detail.value
    })
  },
  toTextArea:function(e){
    var key = this.data.keywords[e.currentTarget.dataset.index];
    var newValue = this.data.inValue + key;
    this.setData({
      inValue: newValue,
      value: newValue,
      focus: true
    })
  },
  bindFormSubmit:function(e){
    console.log(e.detail.value.textarea)
    if(e.detail.value.textarea){
      app.globalData.remarkInfo = e.detail.value.textarea;
      wx.navigateTo({
        url: constants.PagePath_Account,
      })
    }else{
      wx.showToast({
        title: constants.Msg_RemarkInfo,
        icon: "none"
      })
    }
    
  },
```

```css
.main {
    padding:0 20rpx;
    padding-top: 10rpx;
}
.header {
    background: #fff;
    margin-bottom: 30rpx;
    padding:0 20rpx 0 0;   //textarea宽度100%会溢出
}
.textarea {
    font-size: 15px;
    background-color: #eeeeee;
    height: 100px;
    padding:10rpx;
    margin-bottom: 20rpx;
    height: 350rpx;
    width:100%;
}
.placeholder {
    font-size: 15px;
    color: gray;
}
```

## 横向排列，左右上下有间距

```css
.keywords {
    padding:10rpx;
    line-height: 1.2;
    border: 1px solid #eeeeee;
    margin-right: 20rpx;
    font-size: 12px;
    color: #888888;
    margin-bottom: 20rpx;
}
.keywords:last-child {
    margin-right: 0;
}
```

## 地图

```html
<map id="myMap" style="width: 100%; height: 600rpx;" 
      latitude="{{map.latitude}}" longitude="{{map.longitude}}" markers="{{map.markers}}" show-location></map>
```

```javascript
map: {
      latitude: 23.099994,
      longitude: 113.324520,
      markers: []
    }
 that.setData({
          ["storeInfo.name"]: res.data.store_name,
          ["storeInfo.phone"]: res.data.phone,
          ["map.latitude"]: res.data.latitude,
          ["map.longitude"]: res.data.longitude,
          ["map.markers"]: [{
            id: 1,
            latitude: res.data.latitude,
            longitude: res.data.longitude,
            title: res.data.store_name,
            iconPath: res.data.store_logo,
            width:32,
            height:32,
            callout: {
              content: that.data.orderStatus,
              color: "#ff8557",
              fontSize: "14",
              borderRadius: "5",
              bgColor: "#ffffff",
              padding: "3",
              display: "ALWAYS"
            }
          }]
        })
onReady: function () {
    this.mapCtx = wx.createMapContext('myMap')
  },
```

## setData 对象和数组

```javascript
["map.markers[0].callout.content"]: res.order_status
```

## 复制到剪贴板

```javascript
copyOrderId:function(){
    var that = this;
    wx.setClipboardData({
      data: that.data.orderDetail.order_id,
      success: function (res) {
        wx.showToast({
          title: '复制成功',
          icon: 'none'
        });
      }
    });
  },
```

