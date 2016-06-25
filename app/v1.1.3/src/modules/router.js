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
  orderDetail = require('./order/orderDetail');

module.exports = {
  init: function() {
    var that = this;
    $$(document).on('pageBeforeInit', function(e) {
      var page = e.detail.page;
      that.pageBeforeInit(page);
    });

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

  },
  pageAfterAnimation: function(page) {
    log.info('pageAfterAnimation...', page);
    var name = page.name;
    var from = page.from;
    var fromPage = page.fromPage;
    if (name === 'myInfo' && fromPage.from == "right" && (fromPage.name == 'add-retinue' || fromPage.name == 'modify-phone')) {
      // alert()
      myInfoModule.refreshUserInfo();
    }
  },
  pageBeforeInit: function(page) {
    log.info('pageBeforeInit----');
    var name = page.name;
    var query = page.query;
  }
};
