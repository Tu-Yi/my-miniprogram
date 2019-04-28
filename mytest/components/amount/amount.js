// components/amount/amount.js
var constants = require('../../config/constants.js');
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    goodname:{
      type:String,
      value:''
    },
    goodprice:{
      type:Number,
      value:0
    },
    goodsimg:{
      type:String,
      value:''
    },
    goodtypeid:{
      type:String,
      value:''
    },
    goodsWrapPrice: {
      type:Number,
      value:0
    },
    count:{
      type:Number,
      value:0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    opacity: 0,
    img_add: '../../' + constants.img_add,
    img_minus: '../../' + constants.img_minus
  },

  /**
   * 组件的方法列表
   */
  methods: {
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
    substract(){
      this.setData({
        count: this.data.count-1,
      })
      if (this.data.count===0){
        this.setData({
          opacity: 0
        })
      }
      var eventDetail = {
        val: this.data.count,
        type: 'sub',
        goodname: this.data.goodname,
        goodprice: this.data.goodprice,
        goodtypeid: this.data.goodtypeid,
        goodsWrapPrice: this.data.goodsWrapPrice,
        goodsimg: this.data.goodsimg
      }
      this.triggerEvent('numEvent', eventDetail)
    }
  }
})
