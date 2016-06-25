/**
 * @name recommendView
 * @description 推荐视图模型模块
 * 
 * @author Moore Mo
 * @dateTime 2015-10-24T02:09:03+0800
 */
var log = require('../utils/log');
var appFunc = require('../utils/appFunc');
var template = require('./recommend.tpl.html');

var recommendView = {
  /**
   * @method getRecommendList
   * @description 获取推荐列表的数据后进行编译渲染
   * 
   * @param    {Array} dataRes 点，线，觅趣的数据
   * 
   * @author Moore Mo
   * @dateTime 2015-10-24T02:09:49+0800
   */
  getRecommendList: function(dataRes) {
    // 转成对象赋值给页面上
    var data = {
      recommend: dataRes.list_data
    };
    log.info('recommendView --getRecommendList--init...');


    var output = appFunc.renderTpl(template, data);

    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#recommendView').find('.tmm-recommend-ul-list').html(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  /**
   * @method refreshRecommendList
   * @description 下拉刷新获取推荐列表数据后进行编译渲染
   * 
   * @param    {Array} dataRes 点，线，觅趣的数据
   * 
   * @author Moore Mo
   * @dateTime 2015-10-24T02:13:26+0800
   */
  refreshRecommendList: function(dataRes) {
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
  /**
   * @method infiniteRecommendList
   * @description 无穷加载获取推荐列表后进行编译渲染
   * 
   * @param    {Array} dataRes 点，线，觅趣的数据
   * 
   * @author Moore Mo
   * @dateTime 2015-10-24T02:15:39+0800
   */
  infiniteRecommendList: function(dataRes) {
    var data = {
      recommend: dataRes.list_data
    };
    var output = appFunc.renderTpl(template, data);
    // 把后面获取的数据，追加到页面上
    $$('#recommendView').find('.tmm-recommend-ul-list').append(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  }
};

module.exports = recommendView;
