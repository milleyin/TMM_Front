/**
 * @name dotManageView
 * @description 点列表视图模型模块
 * 
 * @author Moore Mo
 * @datetime 2015-11-02T15:46:01+0800
 */
var log = require('../utils/log'),
  appFunc = require('../utils/appFunc'),
  select_dot_tpl = require('./select-dot.tpl.html'),
  dot_detail_tpl = require('./dot-detail.tpl.html');

var dotManageView = {
  getDotList: function(dataRes) {
    // 转成对象赋值给页面上
    var data = {
      dotList: dataRes.list_data
    };
    log.info('dotManageView --getDotList--init...');

    var output = appFunc.renderTpl(select_dot_tpl, data);

    tmmApp.getCurrentView().router.load({
      content: output,
      reload: true
    });
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  refreshDotList: function(dataRes) {
    var data = {
      recommend: dataRes.list_data
    };
    log.info('recommendView --refreshRecommendList--init...');

    var output = appFunc.renderTpl(template, data);
    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#recommendView').find('.tmm-recommend-ul-list').html(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
    // 通知下拉刷新完成
    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 1000);

  },
  infiniteDotList: function(dataRes) {
    var data = {
      recommend: dataRes.list_data
    };
    var output = appFunc.renderTpl(template, data);
    // 把后面获取的数据，追加到页面上
    $$('#recommendView').find('.tmm-recommend-ul-list').append(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  showDotDetail: function(dataRes) {
    var data = {
      dotObj: dataRes.data
    };

    var output = appFunc.renderTpl(dot_detail_tpl, data);
    tmmApp.getCurrentView().router.load({
      content: output,
      reload: true
    });
  }
};

module.exports = dotManageView;
