var appFunc = require('../utils/appFunc'),
  recommendModule = require('../recommend/recommend'),
  seekModule = require('../seek/seek'),
  myModule = require('../my/my'),
  seekFreshModule = require('../seekFresh/seekFresh'),
  roleModule = require('../role/role'),
  deviceModule = require('./device'),
  tmmSdkModule = require('./tmmSdk');

var AppModuel = {
  init: function() {

    deviceModule.init();
    tmmSdkModule.init();

    if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) {
      // ios不需要显示
    } else {
      appFunc.showToast('定位中...');
    }
    setTimeout(function(argument) {
      if (window.device.flag == false) {
        appFunc.hideToast();
        setTimeout(function() {
          appFunc.hideToast();
        }, 500)

        recommendModule.init();
      }

    }, 2000);

    // window.device.getAddress('113.949586', '22.549915', '深圳市');
    // window.device.setLocationCity('116.46','39.92')
    seekModule.init();
    myModule.init();
    roleModule.init();
    seekFreshModule.init();
    //AppModuel.getLocation();
  },
  getLocation: function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          // 成功时回调
          //tmmApp.alert(position.coords.latitude + '---' + position.coords.longitude);
          //console.log('position....', position);
        },
        function(position) {
          // 错误时回调
          //console.log('position....', position);
        }, {        
          // 指示浏览器获取高精度的位置，默认为false     
          enableHighAccuracy: true,
          // 指定获取地理位置的超时时间，默认不限时，单位为毫秒
          timeout: 5000,
          // 最长有效期，在重复获取地理位置时，此参数指定多久再次获取位置。
          maximumAge: 3000  
        });
    }
  }
};


module.exports = AppModuel;
