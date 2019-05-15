# 组件

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

```javascript
/**轮播图图片宽高自适应**/
.swiper-img{
    width: 100%;
    height: auto;
    display: block;
}
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



### 选择器

```html
<view class='info'>
    <text>餐具</text>
    <view>
        <picker bindchange="bindPickerChange" value="{{index}}" range="{{array}}">
            <view class="weui-cell__ft_in-access">
                {{array[index]}}
            </view>
        </picker>
    </view>
</view>
```

```javascript
/**选择餐具 */
  bindPickerChange:function(e){
    this.setData({
      index: e.detail.value
    })
  },
```

