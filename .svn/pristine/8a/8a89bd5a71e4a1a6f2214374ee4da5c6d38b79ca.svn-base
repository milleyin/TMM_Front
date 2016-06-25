var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  httpService = require('../services/httpService'),
  loginModule = require('../login/login'),
  myViewModel = require('./myView'),
  myInfoModule = require('../myInfo/myInfo'),
  orderModule = require('../order/order'),
  myPraiseModule = require('../myPraise/myPraise'),
  myMsgTemplate = require('./my-msg.tpl.html');
/**
 * 下一的页面链接
 * @type {String}
 */
var nextPageLink = '';
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var loading = false;


var my = {
  init: function() {
    appFunc.showToolbar();
    my.bindEvent();
  },
  lodeMyInfoView: function() {
    appFunc.exitSeekFresh();
    my.init();
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getUserInfo(
      function(dataRes, statusCode) {
        // 调用视图模型的loadMyInfoView方法进行渲染视图
        myViewModel.loadMyInfoView(dataRes);
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
  relodeMyInfoView: function() {
    //$$("#myView").find('.navbar-inner.navbar-on-center.cached').removeClass('cached');
    //my.bindEvent();
    my.lodeMyInfoView();
  },
  /**
   * @method logout
   * @description 退出登录
   * 
   * @author Moore Mo
   * @datetime 2015-10-24T14:57:37+0800
   */
  logout: function() {
    tmmApp.confirm('', '是否要退出?', function() {
      httpService.logout(
        function(dataRes, status) {
          if (dataRes.status == 1) {
            // 成功退出后，回到登录页面
            //meView.router.loadPage('tpls/login.html');
            appFunc.clearLocalUserInfo();
            loginModule.loginView();
          } else {
            // 弹框提示
            tmmApp.alert('网络超时，请重试');
          }
        },
        function(dataRes, status) {
          tmmApp.alert('网络超时，请重试');
          log.error('dataRes', dataRes, 'status', status);
        }
      );
    });

  },

  /**
   * 显示我的消息页面
   * @return {[type]} [description]
   */
  loadMsg: function() {
    appFunc.hideToolbar();
    tmmApp.getCurrentView().router.load({
      content: myMsgTemplate
    });
  },
  /**
   * [bindEvent description]
   * @return {[type]} [description]
   */
  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      event: 'show',
      handler: my.lodeMyInfoView
    }, {
      element: '#myView',
      selector: '#tmm-my-login',
      event: 'click',
      handler: loginModule.loginView
    }, {
      element: '#myView',
      selector: '#tmm-my-info',
      event: 'click',
      handler: myInfoModule.getUserInfo
    }, {
      element: '#myView',
      selector: '.login-out',
      event: 'click',
      handler: my.logout
    }, {
      element: '#myView',
      selector: '#tmm-my-praise',
      event: 'click',
      handler: myPraiseModule.init
    }, {
      element: '#myView',
      selector: '#tmm-my-order',
      event: 'click',
      handler: orderModule.init
    }, {
      element: '#myView',
      selector: '#tmm-my-msg',
      event: 'click',
      handler: my.loadMsg
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = my;
