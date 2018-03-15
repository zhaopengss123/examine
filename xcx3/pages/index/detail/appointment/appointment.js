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
    timess:'',
    xhours:'--',
    xminutes:'--'

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
   
    var that = this;
    //设置shopId
    var shopId = options.shopId;
    this.getweeks(shopId);
    that.setData({
      shopId: shopId
    });
    console.log(that.data.shopId);
    //设置shopId结束
    //判断是否是通卡会员
    wx.getStorage({
      key: 'tongMember',
      success: function (res) {
          if(res.data==0){
              that.setData({
                tongMember:""           
              })

          }else{
            that.setData({
              tongMember: 1
            })            
          }
      },
      fail: function () {
        that.getcode()
      }
    });
      ////判断是否是通卡会员 结束

       

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
    });

    //判读是不是会员
    wx.getStorage({
      key: 'memberId',
      success: function (res) {
        that.setData({
          memberId: res.data
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
      this.aboutbtn();
 
    },


    //选择老师
    teachertap(e) {
      let tid = e.currentTarget.dataset.tid;
      let selectTeachId = e.currentTarget.dataset.selectteachid;
      console.log(selectTeachId);
      this.setData({
        selectTeachId: selectTeachId
      })
      this.aboutbtn();

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
            rq: weekss[0].date,
            selectTeachId:'',

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
      var hours = e.currentTarget.dataset.listhours;
      this.setData({
        weeks: e.currentTarget.dataset.value,
        hours:hours
      })
      
      var rq = e.currentTarget.dataset.rq;
      var onlyId = that.data.openid;      //未注册的openid不能用
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('http://192.168.1.205:8800/reserve/listHours', {
        paramJson: JSON.stringify({
          storeId: that.data.shopId,
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
              xhours: '--',
              xminutes: '--',  
              rq:rq,
              dates: hours,
              selectTeachId:'',
              teachers:''
            })
        
            this.aboutbtn();
        
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
      that.setData({
          hours:hours,
          dates:hours
      });
      var onlyId = that.data.openid;      //未注册的openid不能用
    wx.showLoading({
      title: '加载中...',
    })
      Http.post('http://192.168.1.205:8800/reserve/listHours', {
      paramJson: JSON.stringify({
        storeId: that.data.shopId,
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
          storeId: that.data.shopId,
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

    //会员预约判断是否
    aboutbtn(){
      //判断非会员预约条件
    
        //判断会员预约条件
      if(this.data.rq!='--'){
       
        if(this.data.xhours!='--'){
           if (this.data.xminutes!='--'){
             if (this.data.selectTeachId){
               this.setData({
                 aboutbtn: 1
               })
             }else{
               this.setData({
                 aboutbtn: 0,
                 abouttit: '请选择老师'
               })
             }
            }
           
        }else{
          this.setData({
            aboutbtn: 0,
            abouttit:'请选择时间'
          })
        }
      }
     
    },
    //会员预约
    yabout (){
      var that = this;
      var yyurl = "";
      var showwar = "";
      if (that.data.aboutbtn==0){
        wx.showToast({
          icon: "none",
          title: that.data.abouttit,
        })
      }else{
        
        if (that.data.memberId==0){ //非会员预约
          yyurl = "http://192.168.1.205:8800/reserve/doReserveFei";
        }else{            //会员预约
          yyurl = "http://192.168.1.205:8800/reserve/doReserve";
        }
        wx.showLoading({
          title: '加载中...',
        })
        Http.post(yyurl, {
          paramJson: JSON.stringify({
            date: that.data.hours,
            hour: that.data.xhours,
            minute: that.data.xminutes,
            onlyId: that.data.openid,
            storeId: that.data.shopId,
            teacher: that.data.selectTeachId
          })
        }).then(res => {
          wx.hideLoading();
          if (res.code == 1000) {
            showwar = "预约成功"
          } else {
            showwar = "有未完成订单";
          }
            wx.showToast({
              title: showwar,
            })
           setTimeout(function(){
             wx.switchTab({
               url: '../../../serve/serve',
             })
           },1000)
            
       
        }, _ => {
          wx.hideLoading();
        });
        

      }
    },
    //获取会员卡信息
    getCardDetail (){
      var that = this;
      wx.showLoading({
        title: '加载中...',
      })
      Http.post('http://192.168.1.205:8800/reserve/getCardDetail', {
        memberId: that.data.memberId
      }).then(res => {
        wx.hideLoading();
        if (res.code == 1000) {
            that.setData({
              totalTimes: res.result.totalTimes,
              remainTimes: res.result.remainTimes,
              remainTong: res.result.remainTong
            })
        } else {
          console.log(res);
        }
      }, _ => {
        wx.hideLoading();
      });
    }










})