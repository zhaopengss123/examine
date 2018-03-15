const Http = require('./../../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: null,
    sendFont:'发送验证码'
  },
  //设置手机号
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  //设置验证码
  codeInput(e) {
    this.setData({
      codeInput: e.detail.value
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取门店的id
  if(options.shopId){
    this.setData({
      shopId:options.shopId,
      page:options.page       //获取进入方式,1为店铺进入,2为我的进入
    })
  }else{
    this.setData({
      page: options.page       //获取进入方式,1为店铺进入,2为我的进入
    })
  }
   //获取门店的id结束
  wx.getStorage({             //检查openid是否存在
    key: 'openid',
    success: function (res) {
      that.setData({
        openid:res.data,
      });
      //console.log(that.data.openid);
    },
    fail: function () {
      that.getcode();
      console.log('getcode');
    }
  });

  //获取门店是否是通卡店
  wx.getStorage({             //检查openid是否存在
    key: 'countryCardStatus',
    success: function (res) {
      that.setData({
        countryCardStatus: res.data,
      });
      //console.log(that.data.openid);
    },
    fail: function () {
      that.getcode();
      console.log('getcode');
    }
  });

  },

  //获取验证码
  getCode() {
    let isMobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if (isMobile.test(this.data.phone) && this.data.phone.length == 11) {
      wx.showLoading({
        title: '正在获取验证码',
        mask: true
      });
      Http.post('http://192.168.1.205:8800/user/sendVerificationCode', { //接口地址http://192.168.1.205:8800/user/sendVerificationCode
        phoneNum: this.data.phone
      }).then(res => {
        wx.hideLoading();
        if (res.result) {
          this.Countdown();
          let verificationCode = res.result.verificationCode;
          let token = res.result.token;
          this.setData({
            verificationCode: verificationCode,
            token: token,
            
          })
         
        } else {
          wx.hideLoading();
          wx.showToast({
            icon: "none",
            title: '获取验证码失败',
          })
        }
      }).catch(err => {
        wx.hideLoading();
        wx.showToast({
          icon: "none",
          title: '获取验证码失败',
        })
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请输入正确手机号',
      })
    }
  },
  //获取验证码结束

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
  //设置获取时间
  Countdown (){
    let that = this;
    let count = 60;
    let set = setInterval(function(){
      count--;
      that.setData({
        sendFont:count+'s后重新获取'
      })
      if(count==0){
        that.setData({
          sendFont: "重新获取"
        })
        clearInterval(set);
      }
    },1000);
  },
  //校检手机和验证码--点击发送验证码按钮
  getphonesuccess (){
    var that = this;
    if (that.data.codeInput){
      
      if (that.data.codeInput == that.data.verificationCode){
        that.orbind();
      }else{
        wx.showToast({
          icon: "none",
          title: '验证码错误',
        })
      }

    }else{
      wx.showToast({
        icon: "none",
        title: '请输入验证码',
      })
    }

  },
 //校检手机和验证码结束
 



  
  //绑定用户
  orbind (){
  var that = this;
      Http.post('http://192.168.1.205:8800/user/saveBindingUser', {               //http://192.168.1.205:8800/user/judgeUserStatus
        paramJson: JSON.stringify({
          onlyId: this.data.openid,
          userPhone: this.data.phone,
        })
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        wx.setStorage({
          key: 'status',
          data: 1,
        });  
        that.UserPhone(); 
      } else {
        console.log(res);
      }
    }, _ => {
         wx.hideLoading();
    });
  },
  //根据电话号码判断是否为会员
  UserPhone (){
    let that= this;
    Http.post('http://192.168.1.205:8800/user/judgeUserPhone', {
      userPhone:that.data.phone
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {

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


        if(this.data.page==1){//判断用户从哪个页面进入
        //判断用户是不是会员是不是通卡会员,当前门店是不是用户的会员店,是不是通卡店 
        if (tongMember != 0) {       //判断用户是不是通卡会员
          if (memberId != 0) {     //判断用户是不是会员
            if (that.data.shopId != storeId) { //判断用户的门店id是不是和当前的门店id相同
              //弹出当前门店
              wx.showModal({
                title: '提示',
                content: '当前门店和不是您的会员店',
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../../index/index',//跳转首页
                    })
                  } else if (res.cancel) {
                    wx.redirectTo({
                      url: '../../index/index',//跳转首页
                    })
                  }
                }
              })

            } else {
            }
          } else {
            //如果用户不是通卡会员也不是会员
          
          }
        } else { //如果是通卡会员
          if (!that.data.countryCardStatus) {
            wx.showModal({
              title: '提示',
              content: '当前门店不是通卡店',
              success: function (res) {
                if (res.confirm) {
                  wx.redirectTo({
                    url: '../../index/index',//跳转首页
                  })
                } else if (res.cancel) {
                  wx.redirectTo({
                    url: '../../index/index',//跳转首页
                  })
                }
              }
            })
          }     
        }
        };
        console.log(baseInfo);
        if (baseInfo==0) {
          wx.navigateTo({
            url: '../bind-info/bind-info?shopId=' + this.data.shopId + '&page=' + this.data.page,
          })
        } else {
          wx.redirectTo({
            url: '../../index/detail/appointment/appointment/?shopId=' + this.data.shopId + '&page='+this.data.page,
          })
        }


      } else {
        console.log(res);
      }
    }, _ => {
      wx.hideLoading();
    });
  }
  
  //根据电话号码判断是否为会员结束

})