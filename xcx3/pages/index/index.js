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
    wx.getStorage({             //检查memberId是否存在
      key: 'openid',
      success: function (res) {
        console.log(res);
      },
      fail: function () {
        that.getcode();
        console.log('getcode');
      }
    })
  


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

  //getcode
  getcode() {
    let that = this;
    wx.login({
      success(res) {
        that.getuserstatus(res.code);
        
      }
    });
  },
//获取用户是不是会员,是否绑定
  getuserstatus(code) {
    Http.post('http://192.168.1.205:8800/user/judgeUserStatus', {
      code:code
    }).then(res => {
     
      if (res.code == 1000) {
        let openid = res.result.openid;
                  //缓存openid
                  var openid;
                  if (res.result.openid){
                    openid = res.result.openid;
                  }else{
                    openid = 0;
                  }
                wx.setStorage({         
                  key: 'openid',
                  data: openid,
                });
                //缓存是否绑定
                var status;
                if (res.result.status) {
                  status = res.result.status;
                } else {
                  status = 0;
                }
                wx.setStorage({    
                  key: 'status',
                  data: status,
                });
                //缓存是否是潜在会员  
                var potentialMember;
                if (res.result.potentialMember) {
                  potentialMember = res.result.potentialMember;
                } else {
                  potentialMember = 0;
                }
                wx.setStorage({    
                  key: 'potentialMember',
                  data: potentialMember,
                });
                //isMember缓存是否是会员
                var isMember;
                if (res.result.isMember) {
                  isMember = res.result.isMember;
                } else {
                  isMember = 0;
                }
                wx.setStorage({    
                  key: 'isMember',
                  data: isMember,
                });
                
                //缓存是否是通卡会员
                var tongMember;
                if (res.result.tongMember) {
                  tongMember = res.result.tongMember;
                } else {
                  tongMember = 0;
                }
                wx.setStorage({    
                  key: 'tongMember',
                  data: tongMember,
                });
                //memberId缓存会员id
                var memberId;
                if (res.result.memberId) {
                  memberId = res.result.memberId;
                } else {
                  memberId = 0;
                }
                wx.setStorage({    
                  key: 'memberId',
                  data: memberId,
                });
                //baseInfo缓存是否填写过信息
                var baseInfo;
                if (res.result.baseInfo) {
                  baseInfo = baseInfo;
                } else {
                  baseInfo = 0;
                }
                wx.setStorage({    
                  key: 'baseInfo',
                  data: baseInfo,
                });

                //storeId 缓存会员归属哪个门店
                var storeId;
                if (res.result.storeId) {
                  storeId = res.result.storeId;
                } else {
                  storeId = 0;
                }
                wx.setStorage({    
                  key: 'storeId',
                  data: storeId,
                });        
      }
    }, _ => {
      wx.hideLoading();
    });
  }





})