const User = require('../../../../utils/userInfo.js');
const Http = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectTeachId: null,
    selectTime: null,
    weeks:1,
    weekItem:[],
    weekItemm:[],
    weeknum : 0,
    rq:"--",
    timess:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var shopid = options.shopid;
    this.getweeks(shopid);
    that.setData({
        shopid:shopid
    });

    wx.getStorage({
      key: 'openid',
      success: function (res) {
          that.setData({
            openid:res.data
          })
      },
      fail: function () {
        that.getcode()
      }
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

  //点击时段
    radioChanges(e) {
      let radiolist = e.detail.value;
      let selectTime = radiolist.slice(0,1);
      let hours = radiolist.slice(1, 3);
      let minutes = radiolist.slice(3, 5);
      this.setData({
        selectTime: selectTime,
        xhours: hours,
        xminutes: minutes,
        selectTeachId: ""
      });
      this.Teachers();
  
 
    },


    //选择老师
    teachertap(e) {
      let tid = e.currentTarget.dataset.tid;
      let selectTeachId = e.currentTarget.dataset.selectteachid;
      console.log(selectTeachId);
      this.setData({
        selectTeachId: selectTeachId
      })
    }, 
    //选择老师结束

    //获取门店的日期配置
    getweeks(shopId){
      var that = this;
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('http://192.168.1.205:8800/reserve/getStoreHoursConfig', {
        storeId: shopId
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
          let weekItem = res.result;
          that.setData({
            weekItems: res.result
          });
          //截取日期后五位
          for(var i=0; i<weekItem.length; i++){
            weekItem[i].date = weekItem[i].date.substring(5, 10); 
          }
          //循环获得一个sid.
          var weekItemm = [];
          for (var i = 0; i < weekItem.length; i++){
            weekItem[i].sid = i;
            weekItemm.push(weekItem[i]);
          }
          //截取四条数据
          var weekss = [];
          for (var i = that.data.weeknum; i < that.data.weeknum+4; i++) {
            weekss.push(weekItemm[i]);
          }
          var hours = that.data.weekItems[0].date;
          //console.log(hours);
          that.getlisthouseinit(hours);
          that.setData({
            weekItem: weekItem,
            weekItemm: weekItemm,
            weekss: weekss,
            rq: weekss[0].date
          });
        } else {

        }
      }, _ => {
        wx.hideLoading();
      });
    },
    //获取门店的日期配置结束
    //获取门店日期的时段
    getlisthouse(e){
      var that = this;
      this.setData({
        weeks: e.currentTarget.dataset.value
      })
      var hours = e.currentTarget.dataset.listhours;
      var rq = e.currentTarget.dataset.rq;
      var onlyId = "o8Zv20PNRRJFb0t2vu38k_v6ABiI";      //未注册的openid不能用
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('http://192.168.1.205:8800/reserve/listHours', {
        paramJson: JSON.stringify({
          storeId: that.data.shopid,
          onlyId: onlyId,
          date: hours
        })
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
         
          res.result.list.map(item => item.flag = item.flag === 'true');
        var listhours =  res.result.list; 
            that.setData({
              listhours: listhours,
              selectTime:null,  
              rq:rq,
              dates: hours
            })
        
          
        
        } else {
          console.log(res);
        }
      }, _ => {
        wx.hideLoading();
      });
    },
    //获取门店日期的时段结束
  //初始化获取门店日期的时段
  getlisthouseinit(hours){
    var that = this;
      var hours = hours;
    
    var onlyId = "o8Zv20PNRRJFb0t2vu38k_v6ABiI";      //未注册的openid不能用
    wx.showLoading({
      title: '加载中...',
    })
      Http.post('http://192.168.1.205:8800/reserve/listHours', {
      paramJson: JSON.stringify({
        storeId: that.data.shopid,
        onlyId: onlyId,
        date: hours
      })
    }).then(res => {
      wx.hideLoading();
      console.log(res);
      if (res.code == 1000) {
        res.result.list.map(item => item.flag = item.flag === 'true');
        var listhours = res.result.list;
        that.setData({
          listhours: listhours,
          selectTime: null,
        })
      } else {
        console.log(res);
      }
    }, _ => {
      wx.hideLoading();
    });
  },
  //初始化获取门店日期的时段结束

//获取门店日期某一时段的老师配置
    Teachers (){
      var that =this;
      wx.showLoading({
        title: '加载中...',
      })

      Http.post('http://192.168.1.205:8800/reserve/listTeachers', {
        paramJson: JSON.stringify({
          storeId: that.data.shopid,
          hour: that.data.xhours,
          date: that.data.dates,
          minute: that.data.xminutes,
          babyType:"0"
        })
      }).then(res => {
        wx.hideLoading();
        console.log(res);
        if (res.code == 1000) {
          var teachers = res.result.list;
          that.setData({
            teachers: teachers
          });

        } else {
          console.log(res);
        }
      }, _ => {
        wx.hideLoading();
      }); 

     
    },
//获取门店日期某一时段的老师配置结束

//点击日期右边的按钮
    tapright (){
      var that = this;
      var weeknum = this.data.weeknum;
      var weekItemm = this.data.weekItemm;
      if (weeknum < weekItemm.length-4){
        weeknum++;
        var weekss =[];
                  for (var i =weeknum; i < weeknum + 4; i++) {
                    weekss.push(weekItemm[i]);
                  };
      that.setData({
        weeknum: weeknum,
        weekss: weekss,
        
      })

      }
    },
 //点击日期左边的的按钮
    tapleft() {
      var that = this;
      var weeknum = this.data.weeknum;
      var weekItemm = this.data.weekItemm;
      if (weeknum > 0) {
        weeknum--;
        var weekss = [];
        for (var i = weeknum; i < weeknum + 4; i++) {
          weekss.push(weekItemm[i]);
        };
        that.setData({
          weeknum: weeknum,
          weekss: weekss
        })

      }
    },


  //获取code和openid
    getcode() {

      let that = this;
      //获取用户的code
      wx.login({
        success(res) {
          that.getuserstatus(res.code, Http);
        }
      });
    },

    getuserstatus(code) {

      Http.post('http://192.168.1.205:8800/user/judgeUserStatus', {
        //code: code
      }).then(res => {
        if (res.code == 1000) {
          let openid = res.result.openid;
          if (res.result) {
            //console.log(res);
            if (status == 1) {
              wx.setStorage({
                key: 'memberId',
                data: res.result.memberId,
              })
              wx.setStorage({
                key: 'openid',
                data: openid,
              })
            } else {
              wx.setStorage({
                key: 'memberId',
                data: '0',
              })

              wx.setStorage({
                key: 'openid',
                data: openid,
              })
            }
          }
        }
      }, _ => {
        wx.hideLoading();
      });
    },
    //预约 // 会员预约 //非会员预约
    yabout (){
      
    }








})