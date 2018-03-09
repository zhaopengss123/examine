var postsData = require('./../../data/cityAddress.js');
var postsData = require('./../../data/cityAddress.js');
const User = require('./../../utils/userInfo.js');
var cslist = postsData.postList;




Page({
  data: {

  },



  onLoad:function(){
    User.getAddress(function(h){
      console.log(h);
    });

  }

 
})