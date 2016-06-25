var appFunc = require('../utils/appFunc'),
  httpService = require('../services/httpService'),
  roleModule = require('../role/role');

var tmmSdk = {

  init: function() {
    window.tmmSdk = tmmSdk;
  },
  /**
   * @method JSLogin_Callback
   * @description IOS回调 
   * 
   * @author Moore Mo
   * @datetime 2015-12-15T17:04:12+0800
   */
  JSLogin_Callback: function() {
    roleModule.goToLogin();
  },
  setNumberKeyboardData: function(str) {
    var moneyEle = $$('body').find('#tmm-draw-money-page').find('#money');
    moneyEle.val(str);
  }
}
module.exports = tmmSdk;
