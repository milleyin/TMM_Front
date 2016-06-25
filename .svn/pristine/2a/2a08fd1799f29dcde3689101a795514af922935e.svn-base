/**
 * @name router
 * @description 路由模块
 *
 * @author Moore Mo
 */
var appModule = require('./app/app'),
  appFunc = require('./utils/appFunc'),
  log = require('./utils/log'),
  myModule = require('./my/my'),
  loginModule = require('./login/login');


module.exports = {
  init: function() {
    var that = this;
    $$(document).on('pageBeforeInit', function(e) {
      var page = e.detail.page;
      that.pageBeforeInit(page);
    });

    $$(document).on('pageAfterAnimation', function(e) {
      var page = e.detail.page;
      that.pageAfterAnimation(page);
    });
  },
  pageAfterAnimation: function(page) {
    var name = page.name;
    var from = page.from;
    log.info('pageAfterAnimation...', page);
    if (name === 'myView') {
      if (from === 'left') {
        myModule.refreshMyView();
      } 
    }
    if (name === 'recommendView' || name === 'seekView' || name === 'myView') {
      if (from === 'left') {
        appFunc.showToolbar();
      }
    }
  },
  pageBeforeInit: function(page) {
    var name = page.name;
    var query = page.query;

    switch (name) {
      case 'login':
        loginModule.init();
        break;
    }
  },
  preprocess: function(content, url, next) {
    // log.info('options--', url);
    // var viewName = url.split('/')[1].split('.')[0];
    // if (viewName == 'login') {
    //   log.info('....isLogin', loginModule.isLogin())
    //   if (loginModule.isLogin()) {
    //       tmmApp.alert('您已经登录过了..');
    //       return false;
    //   }

    //   //tmmApp.getCurrentView().router.back();
    //   //return false;
    //   //return content;
    // }

    return content;
    
  }
};
