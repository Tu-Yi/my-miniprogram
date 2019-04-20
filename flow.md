# 重要流程分析

## 微信登录鉴权

**说明**

- 用户唯一判断标志：微信用户标识openid

- 用户微信登录鉴权的入口做在外卖点餐界面，是因为商品购买的时候需要判断用户是否为新用户，所以需要到数据库查询，查询用到的条件就是openid，所以在商品购买界面就需要进行用户微信登录鉴权和二次登录检查登录鉴权有效性

- 微信登录鉴权过程如下：

   1. 前端调用wx.login接口获取code（临时登录凭证）传递给服务端

   2. 服务端调用code2session接口，传递code及app相关密钥信息，获取用户openid及session_key（用户登录有效性标志）

   3. 服务端通过哈希算法生成前后端交互token，token即为3rd_session或者自定义登录态，用作后面前后端接口交互验证，前端后面调用接口都会带上这个token，服务端需解密后验证

   4. 用户进入外卖页面，前端需调用微信接口检查用户session_key是否过期或是否存在，如果不存在，则发起微信登录鉴权流程，如果存在，但已过期，同样重新发起登录鉴权，服务端也需重新获取openid及session_key，重新生成token

      

  ​	*如下3图所示，1图为我制作，2，3图为微信官方图片*

  

  ![](https://niliv-technology-1252830662.cos.ap-chengdu.myqcloud.com/mina/%E7%99%BB%E5%BD%95%E6%B5%81%E7%A8%8B%E5%9B%BE.jpg)

  



![](https://niliv-technology-1252830662.cos.ap-chengdu.myqcloud.com/mina/api-login.jpg)





![](https://niliv-technology-1252830662.cos.ap-chengdu.myqcloud.com/mina/174428f91796fdx0479vdd.jpg)



## 微信支付及退款

**步骤**

1. 前端检查登录是否过期，如登录有效，则传递订单信息给服务端，发起下单请求，如登录过期则重新发起登录再发起下单
2. 服务端鉴权登录token，生成微信与支付api所需所有参数，发送预支付下单请求，获得返回的信息和prepay_id，对返回信息再次签名加密返回给前端
3. 前端收到服务端响应后调起用户支付，如果支付成功则提示用户成功
4. 支付成功或失败后，微信服务器会把支付接口发送到我们设置的回调api，服务端就可获取到支付的状态并将订单及用户信息写入数据库
5. 退款流程和支付类似，可以参照微信说明文档



![](https://niliv-technology-1252830662.cos.ap-chengdu.myqcloud.com/mina/1590818-777bbb4e74688be0.jpg)



## 外卖配送

如图，建议先做美团外卖，需要卖家填写店铺信息时就确定是否使用快递服务，从而签约拿到调用接口的凭据

![](https://niliv-technology-1252830662.cos.ap-chengdu.myqcloud.com/mina/%E5%A4%96%E5%8D%96%E9%85%8D%E9%80%81%E6%B5%81%E7%A8%8B%E5%9B%BE.jpg)

