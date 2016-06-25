var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  seekSearchView = require('./seekSearchView');
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
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var moreLoading = false;

var type = '';
var typeValue = '';

var seekSearch = {
  init: function() {

    appFunc.hideToolbar();
    seekSearch.getSeekSearchList();
    seekSearch.bindEvent();
  },

  getSeekSearchList: function() {
    // 显示正在加载的图标
    tmmApp.showIndicator();
    seekSearchView.getSeekSearchList();
    tmmApp.hideIndicator();
  },

  clearHistoryTagOrInput: function(typeValue) {
    var keyword_arr = [];
    if (localStorage.getItem('keyword_arr')) {
       keyword_arr = JSON.parse(localStorage.getItem('keyword_arr'));

       //判断是否已经存储过相同的数据
      var locArrayBoolean = true;
      var locArray = eval(JSON.parse(localStorage.getItem('keyword_arr')));
      for(var i = 0; i < locArray.length; i++){
        if(locArray[i] == typeValue){
          keyword_arr.splice(i,1);
          i--;
          //locArrayBoolean = false;
          break;
        }
      };
      if(locArrayBoolean){     //localStorage存储数据
        //keyword_arr.push(typeValue);
        keyword_arr.unshift(typeValue);
        localStorage.setItem('keyword_arr', JSON.stringify(keyword_arr));
      }    
    } else {  //存储第一次搜索记录
      keyword_arr.push(typeValue);
      localStorage.setItem('keyword_arr', JSON.stringify(keyword_arr));   
    }
  },

  /**
   * 输入搜索的值
   */
  getSeekSearchInputList: function() {
    
    // 显示正在加载的图标
    type = 'search_info';
    typeValue = ($$('.tmm-seek-searchbar-input').val()).replace(/(^\s*)|(\s*$)/g, "");

    if(typeValue != null && typeValue != ""){
      seekSearch.clearHistoryTagOrInput(typeValue);
      
      $$('.tmm-seek-searchbar-input').blur();

      httpService.getSeekSearchList(
        type,
        typeValue,
        '',
        function(dataRes, status) {
          if(dataRes.data.list_data.length == 0){
            seekSearchView.clearSeekSearchList();
            tmmApp.alert('没有搜索到相关的数据！');
            //return;
          } else {
            $$('#seekSearch .tmm-sou-list-block').hide();
            nextPageLink = dataRes.data.page.next;
            log.info("nextPageLink",nextPageLink);
            seekSearchView.getSeekSearchInputList(dataRes.data);
            tmmApp.hideIndicator();
          }
        },
        function(dataRes, status) {
          tmmApp.hideIndicator();
        }
      );
    } else {
      tmmApp.alert('请输入关键字！');
      return;
    }
  },

  getSeekSearchHistoryList: function() {
    // 显示正在加载的图标
    
    type = 'search_info';
    typeValue = $$(this).html();
    $$('.tmm-seek-searchbar-input').val(typeValue);
    $$('.tmm-seek-searchbar').addClass("searchbar-not-empty");
    httpService.getSeekSearchList(
      type,
      typeValue,
      '',
      function(dataRes, status) {
        if(dataRes.data.list_data.length == 0){
          seekSearchView.clearSeekSearchList();
          tmmApp.alert('没有搜索到相关的数据！');
          //return;
        } else {
          $$('#seekSearch .tmm-sou-list-block').hide();
          nextPageLink = dataRes.data.page.next;
          seekSearchView.getSeekSearchInputList(dataRes.data);
          tmmApp.hideIndicator();
        }
      },
      function(dataRes, status) {
        tmmApp.hideIndicator();
      }
    );
    seekSearch.clearHistoryTagOrInput(typeValue);
  },

 refreshSeekSearchList: function() {
    httpService.getSeekSearchList(
      function(dataRes, status) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          // 如果还有下一页链接的话，把销毁掉的滚动加载的事件注册回去
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        seekSearchView.refreshSeekSearchList(dataRes.data);
      },
      function(dataRes, status) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  }, 
  /**
   * 动画加载分页
   */
  infiniteSeekSearchList: function() {
    if (nextPageLink) {
      log.info("测试加载更多");
      if (loading) return;
      // 正在获取数据，设置flag为true
      loading = true;
      tmmApp.showIndicator();
      httpService.getSeekSearchList(
        '',
        '',
        nextPageLink,
        function(dataRes, status) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          log.info('new --infiniteSeekSearchList-- nextPageLink ----', nextPageLink);
          // 调用视图模型的infiniteRecommendList方法进行渲染视图
          seekSearchView.infiniteSeekSearchList(dataRes.data);

          // 获取数据完毕，重置加载flag为false
          setTimeout(function() {
            tmmApp.hideIndicator();
            loading = false;
          }, 100);

        },
        function(dataRes, status) {
          tmmApp.hideIndicator();
        }
      );
    } else {
      if (moreLoading) return;
      moreLoading = true;
      //tmmApp.showIndicator();
      setTimeout(function() {
        tmmApp.hideIndicator();
        moreLoading = false;
        // tmmApp.alert('没有更多的数据了');
        $$("#seekSearch #no-more").css('display','block');
        $$("#seekSearch #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 100);
      setTimeout(function() {
        $$("#seekSearch #no-more").hide();
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      },2000);      
    }
  },
  clearSeekSearchHistory: function() {
    log.info('清除历史记录');
    $$('#seekSearch .tmm-sou-list-block').hide();
    tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
    //localStorage.clear();
    localStorage.removeItem("keyword_arr");
  },

  bindEvent: function() {

    var bindings = [{
      element: '.views',
      selector: '#seekSearch .tmm-seek-search-page-content',
      event: 'refresh',
      handler: seekSearch.refreshSeekSearchList
    }, {
      element: '.views',
      selector: '#seekSearch .tmm-seek-search-page-content',
      event: 'infinite',
      handler: seekSearch.infiniteSeekSearchList
    }, /*{
      element: '#seekView',
      selector: '.tmm-seek-search-test',
      event: 'click',
      handler: seekSearch.getSeekSearchInputList
    }, */{
      element: '.views',
      selector: '.tmm-sou-item-title',
      event: 'click',
      handler: seekSearch.getSeekSearchHistoryList
    }, {
      element: '.views',
      selector: '.tmm-sou-clear',
      event: 'click',
      handler: seekSearch.clearSeekSearchHistory
    }, {
      element: '.views',
      selector: '.tmm-seek-searchbar',
      event: 'submit',
      handler: seekSearch.getSeekSearchInputList
    }, {
      element: '.views',
      selector: '.searchbar-clear',
      event: 'click',
      handler: seekSearchView.clearSeekSearchList
    }];
    appFunc.bindEvents(bindings);
  }
};

module.exports = seekSearch;
