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
  ],
  order_status: [
    {
      value: 0,
      label: '商家未接单'
    },
    {
      value: 1,
      label: '开始配送'
    },
    {
      value: 2,
      label: '订单已送达'
    },
    {
      value: 3,
      label: '买家取消订单'
    },
    {
      value: 4,
      label: '商家接单超时'
    },
    {
      value: 5,
      label: '订单异常'
    }
  ],
  order_err_reason: [
    {
      value: 0,
      label: "顾客电话关机"
    },
    {
      value: 1,
      label: "顾客电话已停机"
    },
    {
      value: 2,
      label: "顾客电话无人接听"
    },
    {
      value: 3,
      label: "顾客电话为空号"
    },
    {
      value: 4,
      label: "顾客留错电话"
    },
    {
      value: 5,
      label: "联系不上顾客其他原因"
    },
    {
      value: 6,
      label: "顾客更改收货地址"
    },
    {
      value: 7,
      label: "送货地址超区"
    },
    {
      value: 8,
      label: "顾客拒收货品"
    }
  ]
}