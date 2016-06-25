/**
 * @name router
 * @description 路由模块
 *
 * @author Moore Mo
 */

var appFunc = require('./utils/appFunc'),
  log = require('./utils/log'),
  appModule = require('./app/app'),
  loginModule = require('./login/login'),
  accLoginModule = require('./accLogin/accLogin'),
  mobLoginModule = require('./mobLogin/mobLogin'),
  myModule = require('./my/my'),
  myInfoModule = require('./myInfo/myInfo'),
  recommendModule = require('./recommend/recommend'),
  createLineOrder = require('./shop/createLineOrder'),
  createDotOrder = require('./shop/createDotOrder'),
  createActOrder = require('./shop/createActOrder'),
  orderDetail = require('./order/orderDetail'),
  seekModule = require('./seek/seek'),
  shopModule = require('./shop/shop');

module.exports = {
  init: function() {
    var that = this;
    
    $$(document).on('pageBeforeAnimation', function(e) {
      var page = e.detail.page;
      that.pageBeforeAnimation(page);
    });

    $$(document).on('pageAfterAnimation', function(e) {
      var page = e.detail.page;
      that.pageAfterAnimation(page);
    });

  },
  pageBeforeAnimation: function(page) {
    var name = page.name;
    var from = page.from;
    var fromPage = page.fromPage;
    log.info('pageBeforeAnimation...', page);

    if (name === 'recommendView' || name === 'seekView' || name === 'seek' || name === 'myView' || name === 'my') {
      appFunc.showToolbar();
    }

    // 返回我的信息页面刷新
    if (name === 'myView' && (fromPage.name === 'login' || fromPage.name === 'acc-login' || fromPage.name === 'mob-login')) {
      myModule.relodeMyInfoView();
    }

    // 下单后从订单详情返回
    if (name === 'dot-order' && (fromPage.name === 'order-detail')) {
      // tmmApp.getCurrentView().router.back({
      //   reload: true,
      //   animatePages: false
      // });
      // tmmApp.showTab('#recommendView');
      // recommendModule.refreshRecommendView();
    }
    // 添加主要联系人返回订单页面触发
    if (name == 'dot-order' && fromPage.from == "right" && fromPage.name == "add-retinue") {
      
      createDotOrder.fillMainRetinue();
    }

    // 添加主要联系人返回订单页面触发
    if (name == 'line-order'  && fromPage.from == "right" && fromPage.name == "add-retinue") {
      
      createLineOrder.fillMainRetinue();
    }

    if (name == 'act-order' && fromPage.from == "right" && fromPage.name == "add-retinue") {
      
      createActOrder.fillMainRetinue();
    }

    

    // 关闭订单详情页面的定时器
    if (fromPage.name == "order-detail") {
      orderDetail.clearTime();
    }

    // 改变页面的状态栏的颜色（登录页面，我的钱包页面）
    if (name == 'login' || name == 'acc-login' || name == 'mob-login' || name == 'my-wallet') {
      $$('body').find('.statusbar-overlay').css('background', '#403A39');
    } else {
      $$('body').find('.statusbar-overlay').css('background', '#ffffff');
    }

    if (name == 'draw-money') {
      // 进入的是提现申请页面，调起原生数字键盘
      appFunc.showNumberKeyboard(1);
    } else {
      // 进入的不是提现申请页面，注销调起原生数字键盘
      appFunc.showNumberKeyboard(0);
    }
    
    // 改变页面的状态栏的颜色（登录页面，我的钱包页面）
    if (name == 'login' || name == 'acc-login' || name == 'mob-login' || name == 'my-wallet') {
      $$('body').find('.statusbar-overlay').css('background', '#403A39');
    } else {
      $$('body').find('.statusbar-overlay').css('background', '#ffffff');
    }

  },
  pageAfterAnimation: function(page) {
    log.info('pageAfterAnimation...', page);
    var name = page.name;
    var from = page.from;
    var fromPage = page.fromPage;
    if (name === 'myInfo' && fromPage.from == "right" && (fromPage.name == 'add-retinue' || fromPage.name == 'modify-phone')) {

      myInfoModule.refreshUserInfo();
    }

    // 觅镜页面选择城市后回到觅镜首页触发
    if (name == 'seek' && (fromPage.from == 'right' || fromPage.from == 'center') && (fromPage.name == 'select-distination' || fromPage.name == "select-search-distination")) {
      seekModule.getSeekList();
    }

    // 订单详情页面返回商品详情页面刷新
    if ((name == 'act-detail') && (fromPage.name == 'order-detail')) {

      shopModule.refreshDetail();
    }
   

    
  }
};
