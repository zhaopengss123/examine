const User = require('./../../../utils/userInfo.js');
const Http = require('./../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
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
    wx.login({
      success(res) {
        //console.log(res, res.code.length)
      }
    })
    //console.log(options)
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
       //console.log(that.data.openid);
      },
      fail: function () {
        that.getcode()
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

    Http.post('http://192.168.1.205:8800/user/saveBindingUser', { 
      paramJson: JSON.stringify({
        userId: this.data.openid,
        nickName: this.data.babyname,
        relationship: relationship,
        birthday: birthday
       })
       }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        wx.redirectTo({
          url: '../../index/detail/appointment/appointment',
        })
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