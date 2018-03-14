const app = getApp();
const User = require('./../../utils/userInfo.js');
const Http = require('./../../utils/request.js');
const cityAddress = require('./../../data/cityAddress.js');
var address = cityAddress.postList;
var provinces = [];
var citys = [];
var districts = [];
//把省市区放到数组里
for (var i = 0; i < address.length; i++) {
  var prov = [address[i].label];
  prov.push(address[i].value);
  provinces.push(prov);
  for (var j = 0; j < address[i].children.length; j++) {
    var cityy = [address[i].children[j].label];
    cityy.push(address[i].children[j].value );
    citys.push(cityy);
    for (var l = 0; l < address[i].children[j].children.length; l++){
      var dist = [address[i].children[j].children[l].label];
      dist.push(address[i].children[j].children[l].value);
      districts.push(dist);
    }
  }
}
//把省市区放到数组里结束
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
    address: ['', '定位中', '']
  },
  onLoad: function () {
    var that = this;
    User.getAddress(address => {

      this.setData({
        location: address.location,
        address: [address.address_component.province, address.address_component.city],
        lon: address.location.lat,
        lat: address.location.lng

      });

      this.getStoreItems();
      
    });

    


    //获取用户地址信息
      User.getAddress(function (c) {
        let province = c.address_component.province;
        let city = c.address_component.city;
        let district = c.address_component.district;
        let lon = c.location.lat;
        let lng = c.location.lng;
        
              });
      //获取用户地址信息结束
    
      wx.getStorage({
        key: 'memberId',
        success: function (res) {
            
        },
        fail: function () {
          that.getcode();
        }
      })
     
      wx.getStorage({
        key: 'openid',
        success: function (res) {
          console.log(res);
        },
        fail: function () {
          that.getcode();
        }
      }) 

  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getStoreItems();
  },
  bindRegionChange: function (e) {
    this.setData({
      address: e.detail.value
    });
   
    var province = this.data.address[0];
    var city = this.data.address[1];
    var district = this.data.address[2];
    var provincecode = '';
    var citycode = '';
    var districtcode ='';
  //获取城市列表代码
    for(var i =0; i<provinces.length; i++){
      if (provinces[i][0] == province){
        provincecode= provinces[i][1];
      }
    };
    for (var i = 0; i < citys.length; i++) {
      if (citys[i][0] == city) {
        citycode = citys[i][1];
      }
    };
    for (var i = 0; i < districts.length; i++) {
      if (districts[i][0] == district) {
        districtcode = districts[i][1];
      }
    };
   //获取城市代码结束 


    this.setData({
      province : provincecode,
      city : citycode,
      district : districtcode,
      pageNo: 1,
      storeItems:[]
    });
    this.getStoreItems();
  },
  getStoreItems(param) {
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('http://192.168.1.205:8800/shop/listShop', {
      paramJson: JSON.stringify({
        province: this.data.province,
        city:this.data.city,
        area: this.data.area,
        lon: this.data.location.lng,
        lat: this.data.location.lat,
        pageNo: this.data.pageNo,
        pageSize: this.data.pageSize
      })
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        let storeItem = res.result.shopList;
 
        if (storeItem){
        this.setData({
          storeItems: this.data.storeItems.concat(storeItem),
          pageNo: this.data.pageNo + 1
        })
  
          }
      
      } else {

      }
    }, _ => {
      wx.hideLoading();
    });
  },

  getcode() {
 
    let that = this;
    //获取用户的code
    wx.login({
      success(res) {
        that.getuserstatus(res.code, Http);
      }
    });
  },

  getuserstatus(code) {
    console.log(222);
    Http.post('http://192.168.1.205:8800/user/judgeUserStatus', {
      //code: code
    }).then(res => {
      if (res.code == 1000) {
        let openid = res.result.openid;
        if (res.result) {
          //console.log(res);
          if (status == 1) {
            wx.setStorage({
              key: 'memberId',
              data: res.result.memberId,
            })
            wx.setStorage({
              key: 'openid',
              data: openid,
            })
          } else {
            wx.setStorage({
              key: 'memberId',
              data: '0',
            })

            wx.setStorage({
              key: 'openid',
              data: openid,
            })
          }
        }
      }
    }, _ => {
      wx.hideLoading();
    });
  }





})