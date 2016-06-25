/**
 * @name recommendView
 * @description 我的赞模型模块
 */
var log = require('../utils/log');
var appFunc = require('../utils/appFunc');
var template = require('./my-praise.tpl.html');
var template_li = require('./my-praise-li.tpl.html');
var myPraiseView = {
  /**
   * @method getMyPraiseList
   * @description 获取我的赞的列表的数据后进行编译渲染
   */
  getMyPraiseList: function(dataRes) {
    // 转成对象赋值给页面上
    log.info('dataRes',dataRes);
    var data = {
      myPraiseList: dataRes.list_data
    };
    var output = appFunc.renderTpl(template, data);

    tmmApp.getCurrentView().router.load({
      content: output
    });
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  /**
   * @method refreshMyPraiseList
   * @description 下拉刷新获取我的赞列表数据后进行编译渲染
   */
  refreshMyPraiseList: function(dataRes) {
    var data = {
      myPraiseList: dataRes.list_data
    };
    log.info('myPraiseView --refreshMyPraiseList--init...');

    var output = appFunc.renderTpl(template_li, data);
    $$('#myPraise').find('.tmm-myPraise-ul-list').html(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 1000);
    
  },
  /**
   * @method infiniteRecommendList
   * @description 滚动加载获取我的赞
   */
  infiniteMyPraiseList: function(dataRes) {
    var data = {
      myPraiseList: dataRes.list_data
    };
    var output = appFunc.renderTpl(template_li, data);
    $$('#myPraise').find('.tmm-myPraise-ul-list').append(output);
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  }
};

module.exports = myPraiseView;
