const App = getApp();
const User = require('./../../../utils/userInfo.js');
const Http = require('./../../../utils/request.js');
Page({
  data: {
    userHeadImg: null,
    relationshipIndex: null,
    relationshipArray: ['爸爸', '妈妈', '爷爷', '奶奶', '外公', '外婆', '其他'],
    birthday: '',
    babyname: ''
  },
  onLoad: function (options) {
    let that = this;
    App.getUserInfo(function (userInfo) {
      that.setData({
        userInfo: userInfo
      })
    });


    if (options.shopId) {
      this.setData({
        shopId: options.shopId,
        page: options.page
      })
    } else {
      this.setData({
        page: options.page
      })
    }
    User.getUserInfo(res => {
      if (res.rawData) {
        let info = JSON.parse(res.rawData); 
        if (info.avatarUrl) {
          this.setData({
            userHeadImg: info.avatarUrl
          })
        }
      }
    });
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
      },
      fail: function () {
        wx.showToast({
          icon: "none",
          title: '登陆超时',
          duration: 2000
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../../index/index',
          })
        }, 1000);
      }
    });
    wx.getStorage({
      key: 'isMember',
      success: function (res) {
        that.setData({
          isMember: res.data
        })
      },
      fail: function () {
        wx.showToast({
          icon: "none",
          title: '登陆超时',
          duration: 2000
        });
        setTimeout(function () {
          wx.switchTab({
            url: '../../index/index',
          })
        }, 1000);
      }
    });


  },
  relationshipChange(e) {
    this.setData({
      relationshipIndex: Number(e.detail.value)
    })
  },
  birthdayChange(e) {
    this.setData({
      birthday: e.detail.value
    })
  },
  onReady: function () {

  },

  onShow: function () {

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
  /**********验证宝宝姓名生日关系----提交*************/
  setuser() {
    var that = this;
    if (this.data.babyname == "") {
      wx.showToast({
        icon: "none",
        title: '请输入宝宝的名字',
        duration: 2000
      })
      return false;
    }

    if (this.data.birthday == "") {
      wx.showToast({
        icon: "none",
        title: '请选择宝宝的生日',
        duration: 2000
      })
      return false;
    }

    if (!this.data.relationshipIndex && this.data.relationshipIndex != 0) {
      wx.showToast({
        icon: "none",
        title: '请选择您与宝宝的关系',
        duration: 2000
      })
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    })
    var relationship = this.data.relationshipArray[this.data.relationshipIndex];
    var birthday = this.data.birthday;
    Http.post('/user/saveUserBaseInfo', { 
      paramJson: JSON.stringify({
        onlyId: this.data.openid,
        nickName: this.data.babyname,
        relationship: relationship,
        birthday: birthday
       })
       }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        wx.setStorage({
          key: 'baseInfo',
          data: 1,
        });

        if (that.data.shopId && that.data.page=="1"){
          wx.redirectTo({
            url: '../../index/detail/appointment/appointment?shopId=' + that.data.shopId+'&page'+that.data.page,
          })
        } else if (that.data.page == "2"){

          wx.switchTab({
            url: '../../serve/serve',
          })
        } else if (that.data.page == "3"){
          wx.switchTab({
            url: '../user',
          })   
        }
       } else {
       }
        }, _ => {
         wx.hideLoading();
       });
    that.branchpost();
  },
  babyname(e) {
    this.setData({
      babyname: e.detail.value
    })
  },
  branchpost() {
    let that = this;
    Http.post('/user/getUserInfo', {
      onlyId: that.data.openid,
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        var userphone = res.result.userPhone;
        Http.post('/user/judgeUserPhone', {
          userPhone: userphone,
        }).then(res => {
          let birthday = that.data.birthday+'';

          if (res.result.potentialMember == 0) {
            Http.post('http://192.168.1.123:8090/manager/register', {
              typeStyle: 1,
              phone: userphone,
              spreadId: '10000002',
                birthday: birthday,
              babyName: that.data.babyname,
            }).then(res => {
            }, _ => {
            });
          }
        }, _ => {
        });
      } else {
      }
    }, _ => {
      wx.hideLoading();
    });
  },


})