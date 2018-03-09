const User = require('./../../../utils/userInfo.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userHeadImg: null,
    relationshipIndex: null,
    relationshipArray: ['父子', '母子', '其他'],
    birthday: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.login({
      success(res) {
        console.log(res, res.code.length)
      }
    })
    console.log(options)
    User.getUserInfo( res => {
      if (res.rawData) {
        let info = JSON.parse(res.rawData);
        if (info.avatarUrl) {
          this.setData({
            userHeadImg: info.avatarUrl
          })
        }
      }
    })
  },

  relationshipChange(e) {
    this.setData({
      relationshipIndex: Number(e.detail.value)
    })
  },
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
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