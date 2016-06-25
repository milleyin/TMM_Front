var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  httpService = require('../services/httpService'),
  loginModule = require('../login/login');

var role = {
  init: function() {
    log.info('role init....');
    role.getUserInfo();
  },
  getUserInfo: function() {
    httpService.getUserInfo(
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          log.info('main getUserInfo....', dataRes);
          var userInfo = {
            'phone': dataRes.data.userInfo.phone,
            'gender': dataRes.data.userInfo.gender,
            'is_organizer': dataRes.data.userInfo.is_organizer,
            'organizer_status': dataRes.data.userInfo.organizer.status
          };
          appFunc.setLocalUserInfo(userInfo);
        } else {
          appFunc.clearLocalUserInfo();
        }
        tmmApp.hideIndicator();
      },
      function(dataRes, statusCode) {
        appFunc.clearLocalUserInfo();
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
      }
    );
  },
  goToLogin: function() {
    tmmApp.getCurrentView().router.back({animatePages:false});
    tmmApp.showTab('#myView');
    loginModule.loginView();
  },
  redirectToLogin: function() {
    loginModule.loginView();
  },
  isLogin: function(callback) {
    var phone = localStorage.getItem('TmmUserInfo');
    if (phone) {
      return true;
    } 
    return false;
  }
};

module.exports = role;
