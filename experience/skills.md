# 技巧

### 动画库

animate.wxss

### 渲染数组中某一项

在前面我们就已经接触过数组，比如**pages配置项**就是小程序里所有页面的一个列表。数组Array是值的**有序**集合，每个值叫做一个元素，而每个元素在数组中有一个位置，以数字表示，称为**索引**。这个索引是从0开始的非负整数，也就是0，1，2，3，4，5…..

在home.wxml里输入以下代码：

```xml
<view>互联网快讯</view>
<view>{{newstitle[0]}}</view>
```



### 点击事件获取参数

```html
<button bindtap='clickMe' data-id="1" data-title="001">点我</button>
```

```javascript
clickMe:(e)=>{
    console.log(e.currentTarget.dataset.id)
    console.log(e.currentTarget.dataset.title)
}
```

### 模块化

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
exports = {
    age:age
}
//index.js
var common = require('../../utils/common.js'); //只能是相对路径
console.log(common.name)
common.sayHello('yuankun');
console.log(common.age)
```

### 图片定宽，高度自适应

[image图片自适应宽度比例显示](<http://www.wxapp-union.com/portal.php?mod=view&aid=1197>)

```javascript
//16:9
function getImageScale(e){
  // //图片的原始宽度
  // var imgWidth = e.detail.width;
  // //图片的原始高度
  // var imgHeight = e.detail.height;
  //同步获取设备宽度
  var sysInfo = wx.getSystemInfoSync();
  //获取屏幕的宽度
  var screenWidth = sysInfo.screenWidth;
  //获取屏幕和原图的比例
  //var scale = screenWidth / imgWidth;

  //设置容器的高度
  var height = screenWidth*9/16;
  return height;
}
```

```javascript
//自适应
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
  var height = screenWidth * (imgHeight/imgWidth);
  return height;
}
```

### 背景图自适应

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

### 背景图设置背景色防止图片错误

```css
.header {
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
  background-color: #cdcdcf;
}
```



### 获取用户地理位置

```javascript
//json
"permission": {
    "scope.userLocation": {
      "desc": "小程序将获取您的用餐位置"
    }
  }

//index
utils.getUserLocationInfo(function (addr) {
    that.setData({
        cAddress: addr.formatted_addresses.recommend,
        cAddIsShow: true
    })
})
//utils
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
      that.getAddress(res.latitude, res.longitude,function(addr){
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
      cal(res.result);
    }
  })
}
```



### 地图打开坐标位置

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





### 封装请求

```javascript
/**
 * 封装wx请求
 */
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
        //wx.hideLoading();
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

### 请求数据

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



### 封装获取缓存

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



### 分享

```html
<view class='share' bindtap='share' open-type='share'>
    <button open-type='share'>
        <image src='{{ico_share}}' style='width:24px;height:24px;' />
        <text>分享</text>
    </button>
</view>  
```

```javascript
/**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: constants.AppTitle,
      desc: constants.AppDesc,
      path: constants.AppHome
    }
  }
```



### 收货地址

```javascript
/**收货地址 */
  getAddress:function(){
    var that=this
    wx.chooseAddress({
      success(res) {
        let addr = res;
        let address = res.provinceName + res.cityName + res.countyName+ res.detailInfo;
        that.calAddress(addr,address);
      },
      fail(err){
        console.log(err)
        utils.showErrorToast(constants.Msg_WxAddrError);
      }
    })
  },
  calAddress: function (addr, address){
    var that=this;
    utils.getCoorByAddress(address, function (res) {
      let distance = utils.getDistance(res.location.lat, res.location.lng, that.data.accountInfo[1].lat, that.data.accountInfo[1].lng);
      if (distance > +that.data.accountInfo[1].deliveryDistance) {
        wx.showToast({
          title: constants.Msg_AddressOutOfRange,
          icon: 'none'
        })
      } else {
        that.setAddress(addr);
        wx.setStorage({
          key: 'userAddress',
          data: that.data.user,
        })
      }
    })
  },
```

```javascript
/**通过地址获取坐标 */
function getCoorByAddress(addr,cal){
  let qqmapsdk = new QQMapWX({
    key: constants.Map_Key
  })
  qqmapsdk.geocoder({
    address: addr,
    success(res) {
      cal(res.result)
    },
    fail(error) {
      console.error(error);
      wx.showToast({
        title: constants.Msg_AddressFail,
        icon: 'none'
      })
    }
  })
}
/**获取坐标直线距离 */
function getDistance(lat1, lng1, lat2, lng2) {
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
    Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;// EARTH_RADIUS;
  s = Math.round(s * 10000) / 10000;
  return s;
}
```



### setData 对象和数组

```javascript
["map.markers[0].callout.content"]: res.order_status
```



### 复制

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
}
```



### 客服

```html
<button open-type='contact'>
    <image src='{{img_mineweixin}}' style='width:48px;height:48px;' />
    <view>
        联系客服
    </view>
</button>
```





### 字典类

```javascript
export default {
  label(constMap = {}, value) {
    if (typeof constMap === 'string') {
      constMap = this[constMap]
    }
    for (var key in constMap) {
      if (constMap[key].value === value) {
        return constMap[key].label
      }
    }
    return null
  },
  value(constMap = {}, label) {
    if (typeof constMap === 'string') {
      constMap = this[constMap]
    }
    for (var key in constMap) {
      if (constMap[key].label === label) {
        return constMap[key].value
      }
    }
    return null
  },
  list(constMap = {}) {
    let list = []
    if (typeof constMap === 'string') {
      constMap = this[constMap]
    }
    for (var key in constMap) {
      list.push(constMap[key])
    }
    return list
  },
  evaluate_status: [
    {
      value: 0,
      label: '未评价'
    },
    {
      value: 1,
      label: '已评价'
    }
  ]
}
```



### 确定取消

```javascript
wx.showModal({
    title: '确认关闭评价',
    content: '关闭后当前信息不会保留',
    confirmText: "继续",
    cancelText: "关闭",
    success: function (res) {
        console.log(res);
        if (res.confirm) {
            console.log('继续评价')
        } else {
            that.closedialog();
            that.triggerEvent('close');
        }
    }
});
```



### 清空对象

```javascript
let evalInfo = this.data.evalInfo;
    for (let key in evalInfo) {
      if (key === "images") {
        evalInfo[key] = []
      } else {
        evalInfo[key] = ''
      }
    }
    this.setData({
      evalInfo: evalInfo,
      value: ""
    })
```

