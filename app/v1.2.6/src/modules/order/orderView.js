/**
 * @name orderView
 * @description 我的订单视图模型模块
 * 
 * @author Moore Mo
 * @datetime 2015-10-28T11:21:24+0800
 */
var log = require('../utils/log');
var appFunc = require('../utils/appFunc');
var template = require('./my-order.tpl.html');
var card_template = require('./my-order-card.tpl.html');

var orderView = {
  getOrderList: function(dataRes) {
    // 转成对象赋值给页面上
    var data = {
      orderList: dataRes.list_data
    };
    var output = appFunc.renderTpl(template, data);

    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    //$$('#myView #tmm-my-order-page').find('.tmm-order-card-list').html(output);
    tmmApp.getCurrentView().router.load({
      content: output
    });
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  refreshOrderList: function(dataRes) {
    var data = {
      orderList: dataRes.list_data
    };
    log.info('orderView --refreshorderList--init...');

    var output = appFunc.renderTpl(card_template, data);
    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#myView #tmm-my-order-page').find('.tmm-order-card-list').html(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
    // 通知下拉刷新完成
    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 1000);
    
  },
  infiniteOrderList: function(dataRes) {
    var data = {
      orderList: dataRes.list_data
    };
    var output = appFunc.renderTpl(card_template, data);
    // 把后面获取的数据，追加到页面上
    $$('#myView #tmm-my-order-page').find('.tmm-order-card-list').append(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  }
};

module.exports = orderView;
