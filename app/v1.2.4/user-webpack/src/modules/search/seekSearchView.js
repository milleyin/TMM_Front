/**
 * @name recommendView
 * @description 搜索模型模块
 */
var log = require('../utils/log');
var appFunc = require('../utils/appFunc');
var template = require('./seek-search.tpl.html');
var listTemplate = require('../recommend/recommend.tpl.html');
var listHistoryTemplate = require('../search/seek-search-history.tpl.html');

var seekSearchView = {
  /**
   * @method getSeekSearchList
   * @description 搜索列表的数据后进行编译渲染
   */
  getSeekSearchList: function() {

    // 转成对象赋值给页面上
    log.info('seekSearchHistory',JSON.parse(localStorage.getItem('keyword_arr')));
    var data = {
      seekSearchHistory:JSON.parse(localStorage.getItem('keyword_arr'))
    };

    var output = appFunc.renderTpl(template, data);
    
    tmmApp.getCurrentView().router.load({
      content: output
    });
    if(!localStorage.getItem('keyword_arr')){
      $$('#seekSearch .tmm-sou-list-block').hide();
    }
  },
  clearSeekSearchList: function() {
    var dataHistory = {
      seekSearchHistory:JSON.parse(localStorage.getItem('keyword_arr'))
    };
    var outputHistory = appFunc.renderTpl(listHistoryTemplate, dataHistory);
    $$('#seekSearch').find('.tmm-sou-list').html(outputHistory);
    
    // 转成对象赋值给页面上
    var data = {
      seekSearchHistory:JSON.parse(localStorage.getItem('keyword_arr')),
      recommend: ''
    };

    var output = appFunc.renderTpl(listTemplate, data);
    $$('#seekSearch').find('.tmm-seekSearch-ul-list').html(output);
    
    if(localStorage.getItem('keyword_arr')){
      $$('#seekSearch .tmm-sou-list-block').show();
    }
  },

  getSeekSearchInputList: function(dataRes) {
    var data = {
      recommend: dataRes.list_data
    };

    var output = appFunc.renderTpl(listTemplate, data);
    $$('#seekSearch').find('.tmm-seekSearch-ul-list').html(output);

   
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);    
  },
  /**
   * @method refreshSeekSearchList
   * @description 下拉刷新获取列表数据后进行编译渲染
   */
  refreshSeekSearchList: function(dataRes) {
    var data = {
      recommend: dataRes.list_data
    };
    log.info('seekSearchView --refreshSeekSearchList--init...');

    var output = appFunc.renderTpl(listTemplate, data);
    $$('#seekSearch').find('.tmm-seekSearch-ul-list').append(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 1000);  
  },
  /**
   * @method infiniteRecommendList
   * @description 滚动加载获取搜索的值
   */
  infiniteSeekSearchList: function(dataRes) {

    var data = {
      recommend: dataRes.list_data
    };
    var output = appFunc.renderTpl(listTemplate, data);
    $$('#seekSearch').find('.tmm-seekSearch-ul-list').append(output);
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  }
};

module.exports = seekSearchView;
