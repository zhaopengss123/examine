const app = getApp();
const User = require('../../utils/userInfo.js');
const Http = require('../../utils/request.js');
Page({
  data: {
    currentTab: 0,
    arrays: []
  },
  onLoad: function (options) {
    this.onopenshow();
  },
  onReady: function () {
  },
  onShow: function (options) {
    /**********初始化选项卡**********/
    if (app.globalData.opentest) {
      this.setData({
        currentTab: 1
      });
      app.globalData.opentest = null;
    } else {
      this.setData({
        currentTab: 0
      });
    }
    this.onopenshow();
    wx.getStorage({  
      key: 'status',
      success: function (res) {
        if (res.data == 0) {
          setTimeout(function () {
            wx.navigateTo({
              url: '../user/bind-phone/bind-phone?page=2',
            })
          }, 1000);
          return false;
        } else {

          wx.getStorage({
            key: 'baseInfo',
            success: function (res) {
              if (res.data == 0 || !res.data) {  
                setTimeout(function () {
                  wx.navigateTo({
                    url: '../user/bind-info/bind-info?page=2',
                  })
                }, 1000)
                return false;
              }
            },
          });
        }
      },
    });
  },
     /**********判断缓存是否失效**********/
  onopenshow() { 
    var that = this;
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        wx.getStorage({
          key: 'isMember',
          success: function (res) {
            if (res.data == 0) {
              that.setData({
                isMember: ""
              })
            } else {
              that.setData({
                isMember: res.data
              })
            }
            that.postlistallfei();
          },
          fail: function () {
            that.getcode();
            wx.showToast({
              icon: "none",
              title: '登陆超时',
            })
            setTimeout(function () {
              wx.switchTab({
                url: '../index/index',
              })
            }, 1500);
          }
        });
      },
      fail: function () {
        that.getcode();
        wx.showToast({
          icon: "none",
          title: '登陆超时',
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1500);
      }
    });
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        if (res.data == 0) {
          that.setData({
            memberId: ""
          })

        } else {
          that.setData({
            memberId: res.data
          })
        }
      },
      fail: function () {
        that.getcode();
        wx.showToast({
          icon: "none",
          title: '登陆超时',
        })
        setTimeout(function () {
          wx.switchTab({
            url: '../index/index',
          })
        }, 1500);
      }
    });
  },
  swichNav(e) {
    let that = this;
    let index = e.target.dataset.current;
    if (index !== this.data.currentTab) {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  swichChange(e) {
    var that = this;
    this.setData({
      currentTab: e.detail.current
    });
    if (that.data.currentTab == 0) {
      that.postlistallfei();
    } else if (that.data.currentTab == 1) {
      that.postlistallfei1();
    } else if (that.data.currentTab == 2) {
      that.postlistallfei2();
    }

  },
  toDetails() {
  },
  updateTime() {
  },
     /**********全部**********/
  postlistallfei() { 
    var that = this;
    if (!that.data.isMember) { 
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveListFei', {
        paramJson: JSON.stringify({
          onlyId: that.data.openid,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000&&res.result.list) {
          let arrays = res.result.list;
          for (var i = 0; i < arrays.length; i++) {
            let arrayss = arrays[i].rHour + ':' + arrays[i].rMinute;
            arrays[i].reserveDate = arrays[i].reserveDate.replace('00:00:00', arrayss);
          }
          that.setData({
            arrays: arrays
          })
        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveList', {
        paramJson: JSON.stringify({
          memberId: that.data.memberId,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();

        if (res.code == 1000 && res.result.list) {
          let arrays = res.result.list;
          for (var i = 0; i < arrays.length; i++) {
            let arrayss = arrays[i].rHour + ':' + arrays[i].rMinute;
            arrays[i].reserveDate = arrays[i].reserveDate.replace('00:00:00', arrayss);
          }
          that.setData({
            arrays: arrays
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    }
  },
  /**********待服务**********/
  postlistallfei1() { 
    var that = this;

    if (!that.data.isMember) {  
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveListFei', {
        paramJson: JSON.stringify({
          onlyId: that.data.openid,
          reserveStatus: 0,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
          let arrays = res.result.list;
          for (var i = 0; i < arrays.length; i++) {
            let arrayss = arrays[i].rHour + ':' + arrays[i].rMinute;
            arrays[i].reserveDate = arrays[i].reserveDate.replace('00:00:00', arrayss);
          }
          that.setData({
            arrays1: arrays
          })
 

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveList', {
        paramJson: JSON.stringify({
          memberId: that.data.memberId,
          reserveStatus: 0,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();

        if (res.code == 1000) {
          let arrays = res.result.list;
          for (var i = 0; i < arrays.length; i++) {
            let arrayss = arrays[i].rHour + ':' + arrays[i].rMinute;
            arrays[i].reserveDate = arrays[i].reserveDate.replace('00:00:00', arrayss);
          }
          that.setData({
            arrays1: arrays
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    }
  },
  /**********已完成**********/
  postlistallfei2() {
    var that = this;
    if (!that.data.isMember) {
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveListFei', {
        paramJson: JSON.stringify({
          onlyId: that.data.openid,
          reserveStatus: 2,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
          let arrays = res.result.list;
          for (var i = 0; i < arrays.length; i++) {
            let arrayss = arrays[i].rHour + ':' + arrays[i].rMinute;
            arrays[i].reserveDate = arrays[i].reserveDate.replace('00:00:00', arrayss);
          }
          that.setData({
            arrays2: arrays
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    } else {
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('/reserve/reserveList', {
        paramJson: JSON.stringify({
          memberId: that.data.memberId,
          reserveStatus: 2,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();

        if (res.code == 1000) {

          let arrays = res.result.list;
          for (var i = 0; i < arrays.length; i++) {
            let arrayss = arrays[i].rHour + ':' + arrays[i].rMinute;
            arrays[i].reserveDate = arrays[i].reserveDate.replace('00:00:00', arrayss);
          }
          that.setData({
            arrays2: arrays
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    }
  },
  /**********非会员取消预约**********/
  reserveCancelFei(reserveId) {
    var that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/reserveCancelFei', {
      reserveId: reserveId,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
      setTimeout(function(){
        if (that.data.currentTab == 0) {
          that.postlistallfei();
        } else if (that.data.currentTab == 1) {
          that.postlistallfei1();
        } else if (that.data.currentTab == 2) {
          that.postlistallfei2();
        }
      }, 1500);
        var info = res.info;
        wx.showToast({
          title: info,
          icon: 'none',
          duration: 2000
          
        })
      } else {
        var info = res.info;
        setTimeout(function () {
        if (that.data.currentTab == 0) {
          that.postlistallfei();
        } else if (that.data.currentTab == 1) {
          that.postlistallfei1();
        } else if (that.data.currentTab == 2) {
          that.postlistallfei2();
        }
        }, 1500);
        wx.showModal({
          title: '提示',
          content: info,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    }, _ => {
      wx.hideLoading();
    });

  },
  /**********会员取消预约**********/
  reserveCancel(reserveId, memberId) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('/reserve/reserveCancel', {
      reserveId: reserveId,
      memberId: memberId
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        setTimeout(function(){
        if (that.data.currentTab == 0) {
          that.postlistallfei();
        } else if (that.data.currentTab == 1) {
          that.postlistallfei1();
        } else if (that.data.currentTab == 2) {
          that.postlistallfei2();
        }
        }, 1500);
        var info = res.info;
        wx.showToast({
          title: info,
          icon: 'none',
          duration: 2000
        })
      } else {
        var info = res.info;
        setTimeout(function () {
        if (that.data.currentTab == 0) {
          that.postlistallfei();
        } else if (that.data.currentTab == 1) {
          that.postlistallfei1();
        } else if (that.data.currentTab == 2) {
          that.postlistallfei2();
        }
        }, 1500);
        wx.showModal({
          title: '提示',
          content: info,
          showCancel: false,
          success: function (res) {
            if (res.confirm) {

            }
          }
        })
      }
    }, _ => {
      wx.hideLoading();
    });

  },
  cancel(e) {
    let that = this;
    let reserveId = e.currentTarget.dataset.id;
    if (that.data.isMember) {

      wx.showModal({
        title: '尊敬的会员',
        content: '您确定要取消预约吗?',
        success: function (res) {
          if (res.confirm) {
            that.reserveCancel(reserveId, that.data.isMember);
          } else if (res.cancel) {
          }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '您确定要取消预约吗?',
        success: function (res) {
          if (res.confirm) {
            that.reserveCancelFei(reserveId);
          } else if (res.cancel) {
          }
        }
      })

    }
  }
})