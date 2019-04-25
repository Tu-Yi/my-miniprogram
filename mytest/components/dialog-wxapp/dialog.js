/*
 * Author: simsir-lin
 * Github: https://github.com/simsir-lin
 * Email: 15986907592@163.com
 */

Component({
  properties: {
    visible: {
      type: Boolean,
      value: false,
      observer: function (newVal) {
        if (newVal) {
          this.triggerEvent('open');
          wx.pageScrollTo({
            scrollTop: 0,
            duration: 100
          })
        }
      }
    },
    animation: {
      type: Boolean,
      value: true
    },
    opacity: {
      type: Number,
      value: 0.4
    },
    title: {
      type: String,
      value: ''
    },
    showClose: {
      type: Boolean,
      value: true
    },
    showFooter: {
      type: Boolean,
      value: true
    },
    closeOnClickModal: {
      type: Boolean,
      value: true
    },
    fullscreen: {
      type: Boolean,
      value: false
    },
    isClose: {
      type: Boolean,
      value: true
    },
    width: {
      type: Number,
      value: 85
    },
    position: {
      type: String,
      value: 'center',
      observer: function (newVal) {
        this.setData({
          _posttion: this.checkPosition(newVal) ? newVal : 'center'
        })
      }
    }
  },
  data: {
    positions: ['center', 'top', 'bottom'],
    _posttion: 'center'
  },
  attached: function () {
    this.setData({
      _posttion: this.checkPosition(this.data.position) ? this.data.position : 'center'
    })
    if (!this.dataset.model) {
      console.warn("dialog-wxapp: dataset 'model' undefined")
    }
  },
  moved: function () {
  },
  detached: function () {
  },

  methods: {
    checkPosition: function (val) {
      return this.data.positions.indexOf(val) >= 0;
    },
    touchstart: function () {
      if (this.data.closeOnClickModal) {
        this.close();
      }
    },
    closedialog: function () {
      if (this.dataset.model) {
        let currentPage = getCurrentPages().pop();
        let data = {};
        data[this.dataset.model] = false;
        currentPage.setData(data);
      }
    },
    close: function () {
      var that = this;
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
      
    },
    confirm: function () {
      this.closedialog();
      this.triggerEvent('confirm');
    }
  }
})