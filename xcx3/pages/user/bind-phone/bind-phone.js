const Http = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null
  },

  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  getCode() {
    let isMobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if (isMobile.test(this.data.phone)) {
      wx.showLoading({
        title: '正在获取验证码',
        mask: true
      });
      Http.post('/getCode', {
        phone: this.data.phone
      }).then(res => {
        wx.hideLoading();
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          title: '获取验证码失败',
        })
      })
    } else {
      wx.showToast({
        title: '请输入正确手机号',
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})