var appFunc = require('../utils/appFunc'),
    httpService = require('../services/httpService'),
    recommendModule = require('../recommend/recommend');

var device = {
  location: {
    "lng": '',
    "lat": '',
    "city": ''
  },
  flag: false,

  init: function() {
    window.device = device;
  },

  getAddress: function(str1, str2, str3) {

    if (!str1) {
      
      appFunc.hideToast();
      appFunc.showToast('定位失败...');
      setTimeout(function() {
        appFunc.hideToast();
      },500)
      recommendModule.init();
    } else { 
      device.location = {
        "lng": str1,
        "lat": str2,
        "city": str3
      }

      device.setLocationCity(str1, str2);
    }
  },

  // 设置gps定位城市
  setLocationCity: function(str1, str2) {
    var dataLoation = {
      "location": {
        "lng": str1, //维度 小数点后不超过6位
        "lat": str2 //经度 小数点后不超过6位
      }
    }
    httpService.setGPSCity(dataLoation, function(dataRes) {
      device.flag = true;
      appFunc.hideToast();
      recommendModule.init();
    }, function(dataRes) {

    });
  },

  // 获取设备经纬度回调函数
  getLocationCallBack: function(str1, str2, str3) {

    if (!str1) {
      tmmApp.alert('获取定位信息失败');
    } else {
      httpService.setGPSCity({
         "location": {
          "lng": str1,
          "lat": str2
        }
      }, function(dataRes) {

        tmmApp.getCurrentView().router.back();
      }, function(dataRes) {
       
      });
    }

  }

}
module.exports = device;
