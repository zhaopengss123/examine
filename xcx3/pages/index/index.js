
const app = getApp();
const User = require('./../../utils/userInfo.js');
const Http = require('./../../utils/request.js');

var postsData = require('./../../data/cityAddress.js');
var cslist = postsData.postList;
const date = new Date()
const years = []
const months = []
const days = []

for (let i = 0; i < cslist.length; i++) {
  years.push(cslist[i].label);
}
var len = cslist[0].children;
for (let i = 0; i < len.length; i++) {
  months.push(len[i].label);
  //console.log(len[i].label);

}



Page({
  data: {
    swiperArray: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    pageNo: 1,
    pageSize: 10,
    storeItems: [],
    address: ['', '定位中', ''],
    years: years,
    year: '北京市',
    months: months,
    month: '北京市'

  },
  onLoad: function () {

    User.getAddress(address => {
      
      this.setData({
        location: address.location,
        address: [address.address_component.province, address.address_component.city]
      });
      
      this.getStoreItems();
      
    });

    User.getOpenid().then(res => {
      console.log(res)
    })
 
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  bindRegionChange: function (e) {
    this.setData({
      address: e.detail.value
    });
  },
  getStoreItems( param ) {
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/shop/listShop', {
      paramJson: JSON.stringify({
          city: this.data.address[1],
          lon: this.data.location.lng,
          lat: this.data.location.lat,
          pageNo: this.data.pageNo,
          pageSize: this.data.pageSize
        })
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        let storeItem = res.result.shopList;
        this.setData({
          storeItems: this.data.storeItems.concat(storeItem),
          pageNo: this.data.pageNo + 1
        })
      } else {

      }
    }, _ => {
      wx.hideLoading();
    });
  },
  bindChange: function (e) {
    const val = e.detail.value;

    var lennum = val[0];
    var lenn = cslist[lennum].children;
    console.log(lenn);
    var mon = [];
    for (let i = 0; i < lenn.length; i++) {
      mon.push(lenn[i].label);
      console.log(lenn[i].label);
    }

    this.setData({
      months: mon,
    });

    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]],
    })
  }



})
