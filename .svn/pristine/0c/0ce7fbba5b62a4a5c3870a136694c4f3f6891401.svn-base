var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  httpService = require('../services/httpService'),
  loginModule = require('../login/login'),
  myViewModel = require('./myView'),
  myInfoModule = require('../myInfo/myInfo'),
  orderModule = require('../order/order'),
  myPraiseModule = require('../myPraise/myPraise'),
  actModule = require('../activity/activity'),
  joinActModule = require('../order/joinAct'),
  appFunc = require('../utils/appFunc'),
  addsevs = require('../../pages/create-success.html'),
  myFinan = require('../../modules/finance/my-financing.html'),
  myMsgTemplate = require('./my-msg.tpl.html'),
  myWalletTemplate = require('../../pages/my-wallet.html');
  // myWalletTemplate = require('../../pages/add_bank.html');
  // myWalletTemplate = require('../../pages/verify_phone.html');
  // myWalletTemplate = require('../../pages/withdraw.html');
  // myWalletTemplate = require('../../pages/trade_record.html');
  

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
  
  /*增加活动设置*/
  addsett: function() {
  	var data = {};
  	var sevs = appFunc.renderTpl(addsevs, data);
  	
  	appFunc.hideToolbar();
    tmmApp.getCurrentView().router.load({
      content: sevs
    });
  },
  
  
  /*我的财务情况*/
  finance: function() {
  	var data = {};
  	var finan = appFunc.renderTpl(myFinan, data);
  	
  	appFunc.hideToolbar();
    tmmApp.getCurrentView().router.load({
      content: finan
    });
  },

  /**
   * 显示我的消息页面
   * @return {[type]} [description]
   */
  loadMsg: function() {
    appFunc.hideToolbar();
    var info = { title : '我的消息'};
    var output = appFunc.renderTpl(myMsgTemplate, info);
    tmmApp.getCurrentView().router.load({
      content: output
    });
  },
  /**
   * 显示我的定制游页面
   * @return {[type]} [description]
   */
  loadOrderTour: function() {
    appFunc.hideToolbar();
    var info = { title : '我的定制游'};
    var output = appFunc.renderTpl(myMsgTemplate, info);
    tmmApp.getCurrentView().router.load({
      content: output
    });
  },
  showWallet:function(){
    appFunc.hideToolbar();
    tmmApp.getCurrentView().router.load({
      content: myWalletTemplate
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
    	selector: '#add-setting',
    	event: 'click',
    	handler: my.addsett
    }, {
    	element: '#myView',
    	selector: '#my-finance',
    	event: 'click',
    	handler: my.finance
    },{
      element: '#myView',
      selector: '.tmm-my-msg',
      event: 'click',
      handler: my.loadMsg
    },{
      element: '#myView',
      selector: '.tmm-my-tour',
      event: 'click',
      handler: my.loadOrderTour
    },{
      element: '#myView',
      selector: '#tmm-my-activity',
      event: 'click',
      handler: actModule.loadActivity
    },{
      element: '#myView',
      selector: '#tmm-my-join-act',
      event: 'click',
      handler: joinActModule.loadJoinActList
    },{
      element: '#myView',
      selector: '#tmm-my-wallet',
      event: 'click',
      handler: my.showWallet
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = my;
