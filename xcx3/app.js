App({

  onLaunch() {

    // console.log(this.getOpenid())
    //User.getUserInfo();
    
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userInfo']) {
          wx.authorize({
            scope: 'scope.userInfo',
            success() {
              
            }
          })
        }
      }
    })

  },

  /* ------------- ------------- 全局数据存储 -------------------------- */
  globalData: {
    userOpenid: null,
    userLocation: null,
    userAddress: null
  }
})