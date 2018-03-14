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

  //获取验证码
  getCode() {
    let isMobile = /^1[3|4|5|7|8][0-9]\d{4,8}$/;
    if (isMobile.test(this.data.phone)&&this.data.phone.length==11) {
      wx.showLoading({
        title: '正在获取验证码',
        mask: true
      });
      Http.post('http://192.168.1.205:8800/user/sendVerificationCode', { //接口地址http://192.168.1.205:8800/user/sendVerificationCode
        phoneNum: this.data.phone
      }).then(res => {
        wx.hideLoading();
          if(res.result){
            this.Countdown();
            let verificationCode = res.result.verificationCode;
            let token = res.result.token;
            this.setData({
              verificationCode : verificationCode,
              token: token   
            })

          }else{
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.shopId)
    //获取门店的id
  if(options.shopId){
    this.setData({
      shopId:options.shopId,
      page:options.page       //获取进入方式,1为店铺进入,2为我的进入
    })
  }

   //获取门店的id结束
   //获取code


  //获取code结束
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
    var paramJson =  JSON.stringify({
      userPhone: this.data.phone,
      code: this.data.codeInput,
      token: this.data.token
    });
    console.log(paramJson)
    console.log(this.data.token);


    
    if (this.data.codeInput){

    wx.showLoading({
      title: '加载中...',
    })
    Http.post('http://192.168.1.205:8800/user/sendVerificationCode', { //http://192.168.1.205:8800/user/sendVerificationCode
      
      paramJson: JSON.stringify({ 
        userPhone: this.data.phone,
        code: this.data.codeInput,
        token: this.data.token
      })
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        console.log(res);
        if (res.info=="操作成功"){
          orbind();
          }else{

          wx.showToast({
            icon: "none",
            title: '验证码校检失败',
          })
          }
      } else {
          console.log(res);
      }
    }, _ => {
   //   wx.hideLoading();
    });
    }else{
      wx.showToast({
        icon: "none",
        title: '请输入验证码',
      })
    }

  },
 //校检手机和验证码结束
  //点击发送验证码



  
  //根据电话号码判断是否为会员
  orbind (){
  var that = this;
    Http.post('http://192.168.1.205:8800/user/judgeUserPhone', {               //http://192.168.1.205:8800/user/judgeUserStatus
      userPhone: that.data.phone
    }).then(res => {
      wx.hideLoading();
      if (res.code == 1000) {
        if (res.result.isMember==1){  //判断是不是会员,0是会员,1不是会员
              wx.navigateTo({
                url: '../../index/detail/appointment/appointment',
              })
        }else{
                wx.navigateTo({
                  url: '../bind-info/bind-info',
                }) 
        }
      } else {

      }
    }, _ => {
         wx.hideLoading();
    });
  }
  //根据电话号码判断是否为会员结束

})