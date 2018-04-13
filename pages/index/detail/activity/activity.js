const User = require('../../../../utils/userInfo.js');
const Http = require('../../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showx:false,
    textshow1:'',
    textshow2:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that= this;
    let discountPrice = options.discountPrice;
    let price = options.price;
    let activityId = options.activityId;
    let shopId = options.shopId;
    let agio = ((discountPrice/price )*10).toFixed(1);
    let ym = 0;
    if (options.ym){
      ym = 1;
    }
    that.setData({
      discountPrice: discountPrice,//活动价格
      price: price,//原价
      activityId: activityId,//活动id
      shopId: shopId,//活动id
      agio:agio,
      ym:ym
    })

    /******获取缓存*****/
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        that.setData({
          memberId: res.data
        });
      }
    })
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        });
      }
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
  
  },
  reservation:function(){
    let that = this;
    if (that.data.memberId==0){
            wx.showLoading({
              title: '加载中...',
            })
            Http.post('/shop/isReservation', {

              onlyId: that.data.openid,
              activityId: that.data.activityId

            }).then(res => {
              wx.hideLoading();
                if(res.result==0){
                    wx.navigateTo({
                      url: '../appointment/appointment?shopId=' + that.data.shopId + '&discountPrice=' + that.data.discountPrice + '&price=' + that.data.price + '&activityId=' + that.data.activityId +'&activityType=1'
                    });
                  
                }else{

                  that.setData({
                    showx: true,
                    textshow1: '您已经参加过“鱼人游”的活动咯~',
                    textshow2: '您可以将活动分享给朋友，好东西给好朋友',
                  });
    
                };


             
            }, _ => {
              wx.hideLoading();
            });
    }else{
      that.setData({
        showx:true,
        textshow1: '该活动仅针对首次体验非会员用户',
        textshow2: '您可以将活动分享给朋友，好东西给好朋友',
      });
    };
  },
  hidefx(){
    let that =this;
    that.setData({
      showx: false,
    });
  },
  onclick(){
    this.setData({
      showx: false,
    });
  },
  onShareAppMessage: function (res) {
    let imageUrl = "https://ylbb-wxapp.oss-cn-beijing.aliyuncs.com/store/covercover.jpg";
    let shopId = this.data.shopId;
    if (res.from === 'button') {
      // 来自页面内转发按钮
      //console.log(res.target)
    }
    return {
      path: '/pages/index/detail/detail?shopId=' + shopId,
      imageUrl: imageUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }

})