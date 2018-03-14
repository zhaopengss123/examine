//const app = getApp();
const User = require('../../../utils/userInfo.js');
const Http = require('../../../utils/request.js');
Page({

  data: {
    lats: "39.94973",
    lngs: "116.29598",
    shopName: "加载中...",
    address: "加载中..."

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ids = options.shopId;
    var lon = options.lon;
    var lat = options.lat;
    var distance = options.distance/1000;
    //设置缓存
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        console.log(res.data)
      }
    })
    //设置缓存结束
    this.setData({
      lon: lat,
      lat: lon,
      distance: distance
    });

    this.getStoreItems(ids);
  },

  //获取店铺详细信息
  getStoreItems(param) {
   
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('http://192.168.1.205:8800/shop/getShopDetail', {
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
          
          //判断是否有店铺列表图
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
            swiperArray = storeItem.shopInfoImag.split(",");
            this.setData({
              swiperArray: swiperArray
            })

          }
          console.log(res);
          this.setData({
            shopImg: shopImg,
            shopName: storeItem.shopName, //店铺名称
            address: storeItem.address,    //店铺地址
            coverImag:"",//storeItem.coverImag,//小程序头图
            businessTime: storeItem.bussinessHour, //门店营业时间
            trafficInformation: trafficInformation,//storeItem.trafficInformation,//交通信息
            parkingInformation: parkingInformation, //storeItem.parkingInformation,//停车场信息
            facilitie: facilitie,
            facilitie1: facilitie1,//设施
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
        //console.log(storeItem);
      } else {

      }
    }, _ => {
      wx.hideLoading();
    });
  },
  //获取店铺详细信息结束
  //导航
  mapclick () {
    const _this = this.data;
    wx.getLocation({
      type: 'gcj02', //返回可以用于wx.openLocation的经纬度
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
  //导航结束
  //点击预约
  booking :function(){
    let shopId = this.data.shopId;
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        if(res.data==0){    //memberId为空
          
            wx.navigateTo({
              url: '../../user/bind-phone/bind-phone?shopId='+shopId+'&page=1', 
            })
        } else {     //memberId不为空
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
    })
  }

})