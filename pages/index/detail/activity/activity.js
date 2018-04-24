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
    let shopId = options.shopId;
    //查看门店活动
    that.getactivity(shopId);
    /******获取缓存*****/
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        });


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

      },
      fail: function () {
        that.getcode();
      }
    });
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
      path: '/pages/index/detail/detail?shopId=' + shopId +'&pagestatus=1',
      imageUrl: imageUrl,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getactivity(storeId) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/shop/getShopPrice', {

      storeId: storeId,

    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        let agio = ((res.result.discountPrice / res.result.price) * 10).toFixed(1);
        that.setData({
          discountPrice: res.result.discountPrice,//活动价格
          inActivity: res.result.inActivity, //门店是否有活动
          price: res.result.price, //活动原价
          activityId: res.result.activityId, //活动id
          agio: agio
        });
      }
    }, _ => {
      wx.hideLoading();
    });
  },
/*******************回到首页*************************/
  backindex:function(){
    wx.switchTab({
      url: '../../index',
    })
  },

/*******************获取用户状态*************************/
  getcode() {
    let that = this;
    wx.login({
      success(res) {
        that.getuserstatus(res.code);
      }
    });
  },
  getuserstatus(code) {
    Http.post('/user/judgeUserStatus', {
      code: code
    }).then(res => {

      if (res.code == 1000) {
        let openid = res.result.openid;

        var openid;
        if (res.result.openid) {
          openid = res.result.openid;
        } else {
          openid = 0;
        }
        wx.setStorage({
          key: 'openid',
          data: openid,
        });

        var status;
        if (res.result.status) {
          status = res.result.status;
        } else {
          status = 0;
        }
        wx.setStorage({
          key: 'status',
          data: status
        });

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

        if (res.result.memberId) {
          wx.setStorage({
            key: 'baseInfo',
            data: 1,
          });
        } else {
          var baseInfo;
          if (res.result.baseInfo) {
            baseInfo = res.result.baseInfo;
          } else {
            baseInfo = 0;
          }
          wx.setStorage({
            key: 'baseInfo',
            data: baseInfo,
          });
        }
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



        this.setData({
          memberId: memberId,
          storeId: storeId,
          tongMember: tongMember,
          openid: openid,
        });


      }
    }, _ => {
      wx.hideLoading();
    });
  }, 


})