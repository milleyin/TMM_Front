var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  httpService = require('../services/httpService'),
  loginModule = require('../login/login'),
  myViewModel = require('./myView'),
  myInfoModule = require('../myInfo/myInfo'),
  orderModule = require('../order/order'),
  roleModule = require('../role/role'),
  myPraiseModule = require('../myPraise/myPraise'),
  actModule = require('../createAct/activity'),
  joinActModule = require('../order/joinAct'),
  bankModule = require('./bank'),
  cashModule = require('./cash'),
  my_wallet_tpl = require('./my-wallet.tpl.html'),
  draw_money_tpl = require('./draw-money.tpl.html');

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
/**
 * 保存已绑定的银行卡信息
 * @type {Object}
 */
var bankCardInfo = {};
/**
 * 保存钱包
 * @type {Object}
 */
var burserInfo = {};


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
            appFunc.exitRemoveAllCookie();
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
   * @method showWallet
   * @description  加载我的钱包
   * 
   * @author Moore Mo
   * @datetime 2015-12-15T14:30:13+0800
   */
  showWallet: function() {
    var noBank = true;
    // 查询钱包信息
    var getWalletinfo = function() {
      httpService.getBurseInfo(
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            appFunc.hideToolbar();
            tmmApp.hideIndicator();
            var data = {
              'walletObj': dataRes.data,
              'noBank': noBank
            };
            // 保存钱包信息
            burserInfo = dataRes.data;
            var output = appFunc.renderTpl(my_wallet_tpl, data);
            tmmApp.getCurrentView().router.load({
              content: output
            });
            // 初始化银行管理模块
            bankModule.init();
          } else {
            tmmApp.hideIndicator();
            if ('login' in dataRes.data) {
              roleModule.redirectToLogin();
            } else {
              tmmApp.alert('网络超时，请重试');
            }
          }
        },
        function(dataRes, statusCode) {
          tmmApp.hideIndicator();
          tmmApp.alert('网络超时，请重试', '');
        }
      );
    };
    // 查询绑定的银行卡信息
    tmmApp.showIndicator();
    httpService.bankCardList(
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          noBank = false;
          // 保存已绑定的银行卡信息
          bankCardInfo = dataRes.data[0];
        } else {
          bankCardInfo = {};
        }
        getWalletinfo();
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method drawMoney
   * @description 提现申请
   * 
   * @author Moore Mo
   * @datetime 2015-12-17T17:09:37+0800
   */
  drawMoney: function() {
    // 查询绑定的银行卡信息
    tmmApp.showIndicator();
    httpService.bankCardList(
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          var data = {
            'bankCardInfo': dataRes.data[0],
            'burserInfo': burserInfo
          };
          var output = appFunc.renderTpl(draw_money_tpl, data);
          tmmApp.getCurrentView().router.load({
            content: output
          });
          // 初始化提现模块
          cashModule.init();
        } else {
          tmmApp.alert('您还未绑定银行卡');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
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
      selector: '#tmm-my-activity',
      event: 'click',
      handler: actModule.loadActivity
    }, {
      element: '#myView',
      selector: '#tmm-my-join-act',
      event: 'click',
      handler: joinActModule.loadJoinActList
    }, {
      element: '#myView',
      selector: '#tmm-my-wallet',
      event: 'click',
      handler: my.showWallet
    }, {
      element: '#myView',
      selector: '#tmm-my-draw-menoy',
      event: 'click',
      handler: my.drawMoney
    }, {
      element: '#myView',
      selector: '#tmm-my-trade',
      event: 'click',
      handler: cashModule.tradeRecord
    }, {
      element: '#myView',
      selector: '#tmm-draw-money-record',
      event: 'click',
      handler: cashModule.drawMoneyRecord
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = my;
