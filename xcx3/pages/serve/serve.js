const App = getApp();
const User = require('../../utils/userInfo.js');
const Http = require('../../utils/request.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,
    arrays:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onopenshow();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  onShow :function (){
    this.onopenshow();
  },
  onopenshow (){ //页面初始化函数
    var that = this;
    //从缓存中获取isMember
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
      },
      fail: function () {
        that.getcode()
      }
    });
    //获取会员id
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
        that.getcode()
      }
    });

    //从缓存中获取openid
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        //获取openid后获取列表
        that.postlistallfei();
        that.setData({
          currentTab: 0
        })
      },
      fail: function () {
        that.getcode()
      }
    });
    //从缓存中获取openid结束

    //从缓存中获取isMember结束
    wx.getStorage({  //判断用户是否绑定手机
      key: 'status',
      success: function (res) {
        console.log(res.data);
        if (res.data == 0) {
          wx.redirectTo({
            url: '../user/bind-phone/bind-phone?page=2',
          })
        } else {

          wx.getStorage({  //判断用户是否录入信息
            key: 'baseInfo',
            success: function (res) {
              if (res.data == 0) {    //如果没有录入信息
                wx.redirectTo({
                  url: '../user/bind-info/bind-info?page=2',
                })
              }
            },

          });
        }
      },

    });
  },

  swichNav (e) {
    let index = e.target.dataset.current;
    if (index !== this.data.currentTab) {
      this.setData({
        currentTab: e.target.dataset.current
      })

      if (that.data.currentTab == 0) {
        that.postlistallfei();
        console.log(0);
      } else if (that.data.currentTab == 1) {
        that.postlistallfei1();
        console.log(1);
      } else if (that.data.currentTab == 2) {
        that.postlistallfei2();
        console.log(2);
      }

    }
  },
  swichChange (e) {
    var that = this;
    this.setData({ 
      currentTab: e.detail.current 
    });
   
    if (that.data.currentTab == 0) {
      that.postlistallfei();
      console.log(0);
    } else if (that.data.currentTab == 1) {
      that.postlistallfei1();
      console.log(1);
    } else if (that.data.currentTab == 2) {
      that.postlistallfei2();
      console.log(2);
    }
      
  },
  toDetails() {
 
  },
  updateTime() {
  
  },

  postlistallfei (){    //获取全部数据
  var that= this;
  if(!that.data.isMember){     //非会员列表查询
              wx.showLoading({
                title: '加载中...',
              })
              Http.post('http://192.168.1.205:8800/reserve/reserveListFei', {
                paramJson: JSON.stringify({
                  onlyId: that.data.openid,
                  pageNo:1,
                  pageSize:99
                })
              }).then(res => {
                wx.hideLoading();
                console.log(res);
                if (res.code == 1000) {
                    that.setData({
                        arrays:res.result.list
                    })
           
                } else {

                }
              }, _ => {
                wx.hideLoading();
              });
            }else{ //会员列表查询
                      wx.showLoading({
                        title: '加载中...',
                      })
                      Http.post('http://192.168.1.205:8800/reserve/reserveList', {
                        paramJson: JSON.stringify({
                          memberId: that.data.openid,
                          pageNo: 1,
                          pageSize: 99
                        })
                      }).then(res => {
                        wx.hideLoading();
                      
                        if (res.code == 1000) {
                          that.setData({
                            arrays: res.result.list
                          })
                          
                        } else {

                        }
                      }, _ => {
                        wx.hideLoading();
                      });
            }
  },
  postlistallfei1() {    //获取待服务数据
    var that = this;
    if (!that.data.isMember) {     //非会员列表查询
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('http://192.168.1.205:8800/reserve/reserveListFei', {
        paramJson: JSON.stringify({
          onlyId: that.data.openid,
          reserveStatus:0,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();
        console.log(res);
        if (res.code == 1000) {
          that.setData({
            arrays1: res.result.list
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    } else { //会员列表查询
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('http://192.168.1.205:8800/reserve/reserveList', {
        paramJson: JSON.stringify({
          memberId: that.data.openid,
          reserveStatus: 0,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();

        if (res.code == 1000) {
          that.setData({
            arrays1: res.result.list
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    }
  },
  postlistallfei2() {    //获取已完成数据
    var that = this;
    if (!that.data.isMember) {     //非会员列表查询
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('http://192.168.1.205:8800/reserve/reserveListFei', {
        paramJson: JSON.stringify({
          onlyId: that.data.openid,
          reserveStatus: 2,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();
        console.log(res);
        if (res.code == 1000) {
          that.setData({
            arrays2: res.result.list
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    } else { //会员列表查询
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('http://192.168.1.205:8800/reserve/reserveList', {
        paramJson: JSON.stringify({
          memberId: that.data.openid,
          reserveStatus: 2,
          pageNo: 1,
          pageSize: 99
        })
      }).then(res => {
        wx.hideLoading();

        if (res.code == 1000) {
          that.setData({
            arrays2: res.result.list
          })

        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    }
  },


    //非会员取消预约
  reserveCancelFei(reserveId){
    var that =this;
        wx.showLoading({
          title: '加载中...',
        })
        Http.post('http://192.168.1.205:8800/reserve/reserveCancelFei', {
            reserveId: reserveId,
        }).then(res => {
          wx.hideLoading();
          if (res.code == 1000) {
            if (that.data.currentTab==0){
              that.postlistallfei();
            } else if (that.data.currentTab == 1){
              that.postlistallfei1();   
            } else if (that.data.currentTab == 2) {
              that.postlistallfei2();
            }
            
            var info = res.info;
            wx.showToast({
              title: '操作成功',
              icon: 'none'
            })
          } else {
            var info = res.info;
            if (that.data.currentTab == 0) {
              that.postlistallfei();
            } else if (that.data.currentTab == 1) {
              that.postlistallfei1();
            } else if (that.data.currentTab == 2) {
              that.postlistallfei2();
            }
            wx.showToast({
              title: '操作失败',
              icon: 'none'
            })
          }
        }, _ => {
          wx.hideLoading();
        });

  },


  //会员取消预约
  reserveCancel(reserveId, memberId) {
    wx.showLoading({
      title: '加载中...',
    })
    Http.post('http://192.168.1.205:8800/reserve/reserveCancel', {
      paramJson: JSON.stringify({
        reserveId: reserveId,
        memberId: memberId
      })
    }).then(res => {
      wx.hideLoading();
      console.log(res);
      if (res.code == 1000) {
        if (that.data.currentTab == 0) {
          that.postlistallfei();
        } else if (that.data.currentTab == 1) {
          that.postlistallfei1();
        } else if (that.data.currentTab == 2) {
          that.postlistallfei2();
        }
        var info = res.info;
        wx.showToast({
          title: '操作成功',
          icon: 'none'
        })
      } else {
        var info = res.info;
        if (that.data.currentTab == 0) {
          that.postlistallfei();
        } else if (that.data.currentTab == 1) {
          that.postlistallfei1();
        } else if (that.data.currentTab == 2) {
          that.postlistallfei2();
        }
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    }, _ => {
      wx.hideLoading();
    });

  },
  cancel (e){
    let that = this;
    let reserveId = e.currentTarget.dataset.id;
    if (that.data.isMember) {    //判断是不是会员,
      
                    wx.showModal({
                      title: '尊敬的会员',
                      content: '您确定要取消预约吗?',
                      success: function (res) {
                        if (res.confirm) {//用户点击确定
                        that.reserveCancel(reserveId, that.data.isMember);
                        } else if (res.cancel) {
                          console.log('用户点击取消')
                        }
                      }
                    })

    } else {
      

      wx.showModal({
        title: '提示',
        content: '您确定要取消预约吗?',
        success: function (res) {
          if (res.confirm) {//用户点击确定
            that.reserveCancelFei(reserveId);
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })

    }
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
      code: code
    }).then(res => {

      if (res.code == 1000) {
        let openid = res.result.openid;
        //缓存openid
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