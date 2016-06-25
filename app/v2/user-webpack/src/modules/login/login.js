var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  httpService = require('../services/httpService'),
  login_template = require('./login.tpl.html'),
  accLoginModule = require('../accLogin/accLogin'),
  mobLoginModule = require('../mobLogin/mobLogin');

var login = {
  init: function() {
    // appFunc.hideNavbar();
    appFunc.hideToolbar();
    log.info('login init....');
    //login.getUserInfo();
    login.bindEvent();
  },
  isLogin: function() {
    var isLogin = false;
    httpService.getUserInfo(
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          isLogin = true;
        }
        tmmApp.hideIndicator();
      },
      function(dataRes, statusCode) {
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );

    return isLogin;
  },
  getUserInfo: function() {
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getUserInfo(
      function(dataRes, statusCode) {

        if (dataRes.status == 1) {
          log.info('tmmApp.getCurrentView()...', tmmApp.getCurrentView());
          //homeF7View.router.loadPage('tpls/my.html');
          //tmmApp.getCurrentView().router.load({pageName: 'myView'});
          //tmmApp.getCurrentView().back();
          //tmmApp.showTab('#myView');
          //tmmApp.showTab('#myView');
          //tmmApp.getCurrentView().loadPage('tpls/my.html');


          setTimeout(function() {
            //tmmApp.getCurrentView().back();
            //$$('#myView').find(".page[data-page='login']").remove();
            //$$('#myView').find(".page[data-page='myView']").removeClass('page-on-left');
            //$$('#myView').find(".page[data-page='myView']").addClass('page-on-center');
            //appFunc.showToolbar();
            //tmmApp.showTab('#myView');
          }, 1000);

        }

        // 调用视图模型的getRecommendList方法进行渲染视图
        //VM.module('myView').getUserInfo(dataRes);
        // 已经登录
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
      },
      function(dataRes, statusCode) {
        // 隐藏正在加载的图标
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method loginView
   * @description 显示登录页面
   * 
   * @author Moore Mo
   * @datetime 2015-10-27T10:29:03+0800
   */
  loginView: function() {
    login.init();
    var output = appFunc.renderTpl(login_template, {});
    tmmApp.getCurrentView().router.load({
      content: output
    });
  },
  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '.tmm-acc-login',
      event: 'click',
      handler: accLoginModule.loginView
    }, {
      element: '#myView',
      selector: '.tmm-mob-login',
      event: 'click',
      handler: mobLoginModule.loginView
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = login;
