const Http = require('./../../../utils/request.js');
Page({
  data: {
    phone: null,
    sendFont: '发送验证码',
    focus: false
  },
  phoneInput(e) {
    this.setData({
      phone: e.detail.value
    });
  },
  codeInput(e) {
    this.setData({
      codeInput: e.detail.value
    });
  },
  onLoad: function (options) {
    var that = this;
    if (options.shopId) {
      this.setData({
        shopId: options.shopId,
        page: options.page
      })
    } else {
      this.setData({
        page: options.page,
        shopId: ''
      })
    }
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data,
        });
      },
      fail: function () {
        wx.showToast({
          icon: "none",
          title: '登陆超时',
          duration: 2000
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../../index/index',
          })
        }, 2000);
      }
    });
    if (that.data.page == 1) {
      wx.getStorage({
        key: 'countryCardStatus',
        success: function (res) {
          that.setData({
            countryCardStatus: res.data,
          });

        },
        fail: function () {
          wx.showToast({
            icon: "none",
            title: '登陆超时',
            duration: 2000
          })
          setTimeout(function () {
            wx.switchTab({
              url: '../../index/index',
            })
          }, 2000);
        }
      });
    };
  },
 /*********获取code*************/
  getCode1() {
    if (this.data.cdown == 0) {
      wx.showToast({
        icon: "none",
        title: '倒计时完毕后重新获取',
        duration: 2000
      })
      return false;
    }
    let isMobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if (isMobile.test(this.data.phone) && this.data.phone.length == 11) {
      wx.showLoading({
        title: '正在获取验证码',
        mask: true
      });
      Http.post('/user/sendVerificationCode', {
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
            manphone: this.data.phone,
            focus: true
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

  onReady: function () {

  },

  onShow: function () {
    let that = this;0
    setTimeout(function () {
      that.setData({
        disabled:true
      });
      wx.showModal({
        showCancel: false,
        title: '温馨提示',
        content: '如果您是会员请绑定会员手机号',
        success: function (res) {
          if (res.confirm) {
            that.setData({
                disabled:false
            });
          }
        }
      });
    }, 1000)

  },

  onHide: function () {

  },

  onUnload: function () {

  },

  onPullDownRefresh: function () {

  },

  onReachBottom: function () {

  },

  onShareAppMessage: function () {

  },
 /*********倒计时*************/
  Countdown() {
    let that = this;
    let count = 60;
    let set = setInterval(function () {
      count--;
      that.setData({
        sendFont: count + 's后重新获取',
        cdown: 0,
      })
      if (count == 0) {
        that.setData({
          sendFont: "重新获取",
          cdown: 1,
          verificationCode: 786543289,
        })
        clearInterval(set);
      }
    }, 1000);
  },
   /*********点击发送验证码验证*************/
  getphonesuccess() {
    var that = this;
    if (that.data.codeInput) {

      if (that.data.codeInput == that.data.verificationCode) {
        that.orbind();
      } else {
        wx.showToast({
          icon: "none",
          title: '验证码错误',
        })
      }
    } else {
      wx.showToast({
        icon: "none",
        title: '请输入验证码',
      })
    }
  },
   /**********绑定手机************/
  orbind() {
    var that = this;
    if (that.data.manphone != that.data.phone) {
      wx.showToast({
        icon: "none",
        title: '手机号不一致',
      })
      return false;
    }
    Http.post('/user/saveBindingUser', {
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
        wx.showToast({
          icon: "none",
          title: res.info,
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../../index/index',
          });
        }, 1000);
      }
    }, _ => {
      wx.hideLoading();
    });
  },
   /**********判断手机号是不是会员，有没有绑定************/
  UserPhone() {
    let that = this;
    Http.post('/user/judgeUserPhone', {
      userPhone: that.data.phone
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        var potentialMember;
        if (res.result.potentialMember) {
          potentialMember = res.result.potentialMember;
        } else {
          potentialMember = 1;
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
        if (isMember != 0) {
          wx.setStorage({
            key: 'baseInfo',
            data: 1,
          });
          that.setData({
            baseInfo: 1
          })
        } else {
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
          that.setData({
            baseInfo: baseInfo
          })
        }
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
        if (this.data.page == 1) {

          if (tongMember != 0) {
            if (memberId != 0) {
              if (that.data.shopId != storeId) {

                wx.showModal({
                  title: '提示',
                  content: '当前门店不是您的会员店',
                  success: function (res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '../../index/index',
                      })
                    } else if (res.cancel) {
                      wx.redirectTo({
                        url: '../../index/index',
                      })
                    }
                  }
                })

              } else {
              }
            } else {
            }
          } else {
            if (!that.data.countryCardStatus) {
              wx.showModal({
                title: '提示',
                content: '当前门店不是通卡店',
                success: function (res) {
                  if (res.confirm) {
                    wx.redirectTo({
                      url: '../../index/index',
                    })
                  } else if (res.cancel) {
                    wx.redirectTo({
                      url: '../../index/index',
                    })
                  }
                }
              })
            }
          }
        };
        if (that.data.baseInfo == 0 || !that.data.baseInfo) {
          wx.navigateTo({
            url: '../bind-info/bind-info?shopId=' + this.data.shopId + '&page=' + this.data.page,
          })
        } else {
          if (that.data.page == 1) {
            wx.redirectTo({
              url: '../../index/detail/appointment/appointment?shopId=' + this.data.shopId + '&page=' + this.data.page,
            })
          } else if (that.data.page == 2) {
            wx.switchTab({
              url: '../../serve/serve',
            })

          } else if (that.data.page == 3) {
            wx.switchTab({
              url: '../user',
            })
          }
        }
      } else {
        console.log(res);
      }
    }, _ => {
      wx.hideLoading();
    });
  }



})