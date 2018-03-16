const User = require('./../../../utils/userInfo.js');
const Http = require('./../../../utils/request.js');
Page({

  data: {
    userHeadImg: null,
    relationshipIndex: null,
    relationshipArray: ['父子', '母子', '其他'],
    birthday: '',
    babyname:''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    if (options.shopId) {
      this.setData({
        shopId: options.shopId,
        page: options.page       //获取进入方式,1为店铺进入,2为我的进入
      })
    } else {
      this.setData({
        page: options.page       //获取进入方式,1为店铺进入,2为我的进入
      })
    }

    User.getUserInfo( res => {
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
          openid:res.data
        })
      },
      fail: function () {
        that.getcode();
        console.log('getcode');

      }
    }) 



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
  //录入用户信息
  setuser(){
    var that = this;
    if (this.data.babyname == "") {
      wx.showToast({
        icon: "none",
        title: '请输入宝宝的名字',
      })
      return false;
    }

    if (this.data.birthday == "") {
      wx.showToast({
        icon: "none",
        title: '请选择宝宝的生日',
      })
      return false;
    }

    if (!this.data.relationshipIndex && this.data.relationshipIndex != 0){
      wx.showToast({
        icon: "none",
        title: '请选择您与宝宝的关系',
      })
      return false;
    }
    wx.showLoading({
      title: '加载中...',
    })
    var relationship = this.data.relationshipArray[this.data.relationshipIndex];
    var birthday = this.data.birthday;

    Http.post('http://192.168.1.205:8800/user/saveUserBaseInfo', { 
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
                      //跳转到服务
        } else if (that.data.page == "3"){
                  //跳转到我的
          wx.switchTab({
            url: '../user',
          })   

        }

       

       } else {

       }
        }, _ => {
         wx.hideLoading();
       });

  },
  //录入用户信息结束
  babyname (e){
    this.setData({
      babyname: e.detail.value
      })
  }

})