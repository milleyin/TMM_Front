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
var index_banner_tpl = require('./index-banner.tpl.html');
var index_hot_tpl = require('./index-hot.tpl.html');
var index_act_tpl = require('./index-act.tpl.html');
var index_nearby_tpl = require('./index-nearby.tpl.html');

var recommendView = {
  indexAdsView: function(dataRes) {
    var data = {
      adList: dataRes.list_data
    };
    var output = appFunc.renderTpl(index_banner_tpl, data);
    $$('#recommendView').find('.tmm-top-banner').html(output);
    var mySwiper = tmmApp.swiper('.swiper-container', {
      speed: 800,
      autoplay: 2000,
      loop: true,
      effect: 'fade'
    });
  },
  indexHotView: function(dataRes) {
    var data = {
      hotList: dataRes.list_data.slice(0, 4)
    };
    var output = appFunc.renderTpl(index_hot_tpl, data);
    $$('#recommendView').find('.hot-img-wrapper').html(output);
  },
  indexHotActView: function(dataRes) {
    var data = {
      hotActList: dataRes.list_data.slice(0, 1)
    };
    var output = appFunc.renderTpl(index_act_tpl, data);
    $$('#recommendView').find('.act-ul').html(output);
  },
  indexNearbyView: function(dataRes) {
    var data = {
      nearbyList: dataRes.list_data
    };
    var output = appFunc.renderTpl(index_nearby_tpl, data);
    $$('#recommendView').find('.nearby-ul').html(output);
  },
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
