# 渲染

### wx:if vs hidden

```html
wx:if(display:none) vs hidden(visibility)
```



### 列表布局

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



### 常见错误处理方法

请求数据失败：显示错误图片 刷新页面 退出小程序

字段不存在或字段值为空：给予默认值

图片字段不存在或字段值为空：给予默认图片

图片url错误：设置背景色



### 控制元素显示

```html
wx:if='{{item.sell_num>0}}'
wx:if='{{isCart}}'
wx:if='{{startSendPrice_poor<=0 && originalMoney>0}}'
```

### 控制元素样式

```html
class="order {{startSendPrice_poor<=0 ? 'order-active' : 'order-normal'}}"
```

### 控制元素事件

```html
bindtap="{{totalNum>0?'showCart':''}}"
```



### 默认数据直接在html判断

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



### 图片默认背景色

```html
<image src='{{goods.img}}' style='width:80rpx;height:80rpx;background:#cdcdcf' />
```



### textarea

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
focus: false,
autoheight: false,
adjustposition: true,
inValue: ""

/**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    utils.setPageTitle(constants.PageTitle_remark);
    this.setData({
      value: app.globalData.remarkInfo,
      focus: true
    })
  },
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
      focus: false
    })
  },
  bindFormSubmit:function(e){
    if(e.detail.value.textarea){
      app.globalData.remarkInfo = e.detail.value.textarea;
      wx.navigateBack({
        delta:1
      })
    }else{
      wx.showToast({
        title: constants.Msg_RemarkInfo,
        icon: "none"
      })
    }
  }
```



### 清除按钮样式

```css
button::after {
  border: none;
}

input {
  outline: none;
  border: none;
  list-style: none;
}
```



### tab菜单

```html
<view class='menu'>
    <view wx:for='{{menu}}' data-idx="{{index}}" wx:key="{{index}}" bindtap='menuTap' 
    class="item {{currentMenu==index ? 'active' : ''}}">{{item}}</view>
  </view>
  <view id='eval' wx:if="{{currentMenu==1}}">
    评价
  </view>
  <view id="categrays" wx:if="{{currentMenu==0}}">
```

```css
.menu {
  box-sizing: border-box;
  display: flex;
  background: #fff;
  z-index: 50;
  padding-left: 100rpx;
  border-bottom: 1px solid #dbdbdb;
}

.menu .item {
  box-sizing: border-box;
  position: relative;
  text-align: center;
  line-height: 30px;
  font-size: 14px;
  color: #666;
  padding: 15rpx 0;
  margin-right: 100rpx;
}

.menu .item.active {
  font-size: 15px;
  font-weight: bold;
}

.menu .item.active:after {
  content: "";
  display: block;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background: #ff8557;
  font-size: 24rpx;
  color: #666;
}
```

```javascript
menuTap: function(e){
    var that = this;
    that.setData({
      currentMenu: e.currentTarget.dataset.idx
    })
  },
onShow: function () {
    this.setData({
      currentMenu: 0
    })
  },
```



### 上拉加载

```javascript
/**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var page = this.data.evalPage;
    page = page + 1
    that.setData({
      evalPage: page
    })
    this.getEvalList();
  },
      getEvalList: function () {
          var that=this;
          utils.request(api.Eval_List, { store_id: app.globalData.storeId, page: that.data.evalPage }).then(
              res => {
                  console.log(res)
                  var evalList = that.data.evalList;

                  for (var i = 0; i < res.length; i++) {
                      evalList.push(res[i]);
                  }
                  // 设置数据
                  that.setData({
                      evalList: evalList
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
```



### 获取元素异步

```javascript
setGoodListHeight: function () {
    var that = this;
    let h_screen, h_header, h_menu, h_footer;
    let query = wx.createSelectorQuery();
    query.select('.header').boundingClientRect(function (rect) {
      h_header = rect.height;
    }).exec();
    query.select('.menu').boundingClientRect(function (rect) {
      h_menu = rect.height;
    }).exec();
    query.select('.footer').boundingClientRect(function (rect) {
      h_screen = wx.getSystemInfoSync().windowHeight;
      h_footer = rect.height;
      that.setData({
        height: h_screen - h_header - h_menu - h_footer
      })
    }).exec();
  },
```



### 查找元素也是回调，执行代码记得写到里面

```javascript
var that=this
query.select('.good').boundingClientRect(function (rect) {
      eleFoodHeight=rect.height
      let fh = [0]
      let heightCount = 0
      console.log(eleFoodHeight)
      console.log(eleCateTitleHeight)
      setTimeout(() => {
        that.data.list.forEach((item, index) => {
          //console.log(item.items.length * this.data.eleFoodHeight);
          if (item.length > 0) {
            console.log(eleFoodHeight)
            console.log(eleCateTitleHeight)
            heightCount += item.length * eleFoodHeight + eleCateTitleHeight
            fh.push(heightCount)
          }
        })
        console.log(fh)
        that.setData({
          foodAreaHeight: fh
        })
      }, 100)
    }).exec();
```



### 背景图片一定要用网络图片



### 页面Unload里不要写navigateback，手机里会自动退出小程序



### 页面中跳转，点击完成或确定回来，尽量使用back，否则会造成返回错乱

```javascript
wx.navigateBack({
        delta:1
})
```



### 底部有fixed固定元素，上面内容要有padding-bottom，maring-bottom没用



### wx.preview会刷新页面处理方法

```javascript
//page外定义
var isPreView;
Page({
    
    onShow: function () {
        if (isPreView){
            isPreView=false;
            return;
        }
        this.setData({
            currentMenu: 0
        })
    },
    previewImage: function (e) {
        console.log(e)
        isPreView=true;
        wx.previewImage({
            current: e.currentTarget.id,
            urls: e.currentTarget.dataset.urls
        })
    },
```



