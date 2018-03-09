const App = getApp();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log()

    // user.getUserInfo(res => {
    //   console.log(res)
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },
  swichNav (e) {
    let index = e.target.dataset.current;
    if (index !== this.data.currentTab) {
      this.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  swichChange (e) {
    this.setData({ 
      currentTab: e.detail.current 
    });  
  },
  toDetails() {
    console.log(111)
  },
  updateTime() {
    console.log(222)
  }
})