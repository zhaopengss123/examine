// pages/serve/serve-details/serve-details.js
const User = require('../../../utils/userInfo.js');
const Http = require('../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
      lists:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var severid = options.severid;
    var status = options.status;
    that.setData({
      severid: severid,
      status:status
    });
    that.severmain();
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
  
  },
  severmain (){
    var that =this;
            wx.showLoading({
              title: '加载中...',
            })
            Http.post('http://192.168.1.205:8800/reserve/recordDetail', {
                recordId: that.data.severid,
            }).then(res => {
              wx.hideLoading();
              console.log(res);
              if (res.code == 1000) {
                that.setData({
                  lists: res.result
                })

              } else {

              }
            }, _ => {
              wx.hideLoading();
            });
  },
  mapclick() {
    const _this = this.data;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
      success: function (res) {

        var latitude = res.latitude
        var longitude = res.longitude;
        wx.openLocation({
          latitude: Number(_this.lists.lat),
          longitude: Number(_this.lists.lon),
          name: _this.lists.shopName,
          address: _this.lists.shopAddress,
          scale: 28
        })

      }
    })
  }
})