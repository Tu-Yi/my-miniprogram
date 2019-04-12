var constants = require('../config/constants.js');
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/**
 * 获取图片宽高比率 
*/
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
/**
 * 设置页面标题
 */
function setPageTitle(title){
  wx.setNavigationBarTitle({
    title: title
  })
}
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
/**
 * 显示错误提示
 */
function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/error.png'
  })
}
/**
 * 显示成功提示
 */
function showSuccessToast(msg) {
  wx.showToast({
    title: msg,
  })
}
/**
 * 获取缓存
 */
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
/**
 * 打电话
 */
function phone(num,fail){
  wx.makePhoneCall({
    phoneNumber: num,
    fail:function(err){
      fail(err)
    }
  })
}
module.exports = {
  formatTime: formatTime,
  getImageScale: getImageScale,
  request: request,
  setPageTitle: setPageTitle,
  showErrorToast: showErrorToast,
  showSuccessToast: showSuccessToast,
  getLocalStorage: getLocalStorage,
  phone: phone
}
