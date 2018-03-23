const User = require('../../../utils/userInfo.js');
const Http = require('../../../utils/request.js');
const app = getApp();
Page({
  data: {
    lats: "39.94973",
    lngs: "116.29598",
    shopName: "加载中...",
    address: "加载中..."

  },
  onLoad: function (options) {
    var that = this;
    var ids = options.shopId;
    var lon = options.lon;
    var lat = options.lat;
    var distance = options.distance;
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        that.setData({
          memberId: res.data
        });
      }
    })
    wx.getStorage({
      key: 'storeId',
      success: function (res) {
        that.setData({
          storeId: res.data
        });
      }
    })
    wx.getStorage({
      key: 'tongMember',
      success: function (res) {
        that.setData({
          tongMember: res.data
        });
      }
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        });
      }
    })
    this.setData({
      lon: lat,
      lat: lon,
      distance: distance
    });
    this.getStoreItems(ids);
  },
  getStoreItems(param) {
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/shop/getShopDetail', {
      paramJson: JSON.stringify({
        id: param,
        lon: this.data.lon,
        lat: this.data.lat,
      })
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        let storeItem = res.result;
        if (storeItem) {
          let distance = storeItem.distance / 1000;  
          let facilitie = "";
          let facilitie1 = "";
          let facilitie2 = "";
          let facilitie3 = "";
          let facilitie4 = "";
          let trafficInformation="";
          let parkingInformation ="";
          if (storeItem.facilitie){
          let facilitie = storeItem.facilitie;
          var facilitie = facilitie.split(",");
          var facilitie1 ="";
          var facilitie2 = "";
          var facilitie3 = "";
          var facilitie4 = "";
          for (let i = 0; i < facilitie.length; i++){
            if (facilitie[i]==1){
              facilitie1 = 1;
            }
          }
          for (let i = 0; i < facilitie.length; i++) {
            if (facilitie[i] == 2) {
              facilitie2 = 1;
            }
          }
          for (let i = 0; i < facilitie.length; i++) {
            if (facilitie[i] == 3) {
              facilitie3 = 1;
            }
          }
          for (let i = 0; i < facilitie.length; i++) {
            if (facilitie[i] == 4) {
              facilitie4 = 1;
            }
          }
          };

          if (storeItem.trafficInformation){
            trafficInformation = storeItem.trafficInformation;
          }
          if (storeItem.parkingInformation) {
            parkingInformation = storeItem.parkingInformation;
          }
          var shopImg = "http://image.beibeiyue.com/micro/shop/xiaochengxu.jpg";
          if (!storeItem.shopInfoImag){
          if (storeItem.coverImag){
            shopImg = storeItem.coverImag;
          }else{
          if (storeItem.shopImg){
            shopImg = storeItem.shopImg;
          }
          }
          }else{
            var swiperArray =[];
            var swiperArrays = [];
            swiperArray = storeItem.shopInfoImag.split(",");
            for(let i=0; i<swiperArray.length; i++){
              if(swiperArray[i]!=''){
                swiperArrays.push(swiperArray[i]);
              }
            }
            this.setData({
              swiperArray: swiperArrays
            })
          }
          this.setData({
            shopImg: shopImg,
            shopName: storeItem.shopName, 
            address: storeItem.address, 
            coverImag:"",
            businessTime: storeItem.bussinessHour,
            trafficInformation: trafficInformation,
            parkingInformation: parkingInformation,
            facilitie: facilitie,
            facilitie1: facilitie1,
            facilitie2: facilitie2,
            facilitie3: facilitie3,
            facilitie4: facilitie4,
            lats: storeItem.lat,
            lngs: storeItem.lng,
            countryCardStatus: storeItem.countryCardStatus,
            shopId: storeItem.id,
            shopTel: storeItem.shopTel
          })
        }
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  mapclick () {
    const _this = this.data;
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude
        var longitude = res.longitude;
        wx.openLocation({
          latitude: Number(_this.lats),
          longitude: Number(_this.lngs),
          name: _this.shopName,
          address: _this.address,
          scale: 28
        })
      }
    })
  },
  booking (){
    var that = this;
    if (that.data.tongMember==0){ 
    if (that.data.memberId != 0) {
      if (that.data.shopId != that.data.storeId){ 
        wx.showModal({
          title: '提示',
          content: '您的卡不支持跨店预约',
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index',
              })
            } else if (res.cancel) {
            }
          }
        })
      }else{
        that.bookings();
      }
    }else{          
      that.bookings();
    }
    }else{
      if (that.data.countryCardStatus){
        that.bookings();
      }else{
        wx.showModal({
          title: '提示',
          content: '当前门店不是通卡店',
          success: function (res) {
            if (res.confirm) {
              wx.switchTab({
                url: '../index',
              })
            } else if (res.cancel) {
            }
          }
        })
      }


    }

  },


  //点击预约
  bookings :function(){
  
    let shopId = this.data.shopId;
    let that = this;

    wx.setStorage({
      key: 'countryCardStatus',
      data: that.data.countryCardStatus,
    });
    wx.getStorage({
      key: 'countryCardStatus',
      success: function (res) {
        that.setData({
          countryCardStatus: res.data,
        });
      
      }
    })
    wx.getStorage({
      key: 'isMember',
      success: function (res) {
        if(res.data==0){    //监测用户是否是会员 //用户不是会员
          wx.getStorage({  //判断用户是否绑定手机
            key: 'status',
            success: function (res) {
                if(res.data==0){ //用户没有绑定手机
                
                  wx.navigateTo({
                    url: '../../user/bind-phone/bind-phone?shopId=' + shopId + '&page=1', //跳转到绑定手机页面
                  })     
                }else{  //用户绑定手机

                  wx.getStorage({             
                    key: 'baseInfo',
                    success: function (res) {
                      if (res.data == 0||!res.data) { //是否填写过信息
                          wx.navigateTo({
                            url: '../../user/bind-info/bind-info?shopId=' + shopId + '&page=1',//跳转到绑定信息页面
                          })
                        }else{
                          wx.redirectTo({
                            url: './appointment/appointment?shopId=' + shopId + '&page=1',//跳转预约页面
                          })
                        }
                    },
                    fail: function () {
                      that.getcode();
                      
                    }
                  })

                
               }
           
            }
          })
        } else {     //用户是会员直接跳转到预约老师页面
              wx.navigateTo({
                url: './appointment/appointment?shopId=' + shopId + '&page=1',
              })
        } 
      }
    })
  },
  //预约结束
  cellme(){
    
    wx.makePhoneCall({
      phoneNumber : this.data.shopTel
    });

    //保存用户点击电话
    var that = this;
    Http.post('/user/saveUserClick', {
      onlyId: that.data.openid,
    }).then(res => {
      if (res.code == 1000) {
      } else {
      }
    }, _ => {
    });



  },
  makePhone(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.num
    })
  },

})