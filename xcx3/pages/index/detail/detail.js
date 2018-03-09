//const app = getApp();
const Http = require('../../../utils/request.js');
Page({

  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.shopId;

    console.log(id);

  },

  // mapclick () {
  //   const _this = this.data;
  //   wx.getLocation({
  //     type: 'gcj02', //返回可以用于wx.openLocation的经纬度
  //     success: function (res) {
  //       var latitude = res.latitude
  //       var longitude = res.longitude
  //       wx.openLocation({
  //         latitude: Number(_this.storeInfo.lat),
  //         longitude: Number(_this.storeInfo.lng),
  //         name: _this.storeInfo.shopName,
  //         address: _this.storeInfo.address,
  //         scale: 28
  //       })
  //     }
  //   })
  // }
  
})