/**
 * @method joinAct
 * @description  活动报名相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-11-06T15:41:43+0800
 */
var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  activityViewModel = require('./activityView'),
  lineModule = require('./line'),
  dotModule  = require('./dot');

/**
 * 下一的页面链接
 * @type {String}
 */
var nextPageLink = '';
/**
 * 选择标签页的url
 * @type {String}
 */
var selectUrl = '';
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var loading = false;
var moreLoading = false;

var joinAct = {
  init: function() {
    //Activity.bindEvent();
  },

  /**
   * 显示活动列表页面
   * @return {[type]} [description]
   */
  loadJoinActList: function() {
    appFunc.hideToolbar();
    httpService.getOrderActList(function(){
      
    },function(){

    })
  },
  /**
   * @method loadActivity
   * @description 我发起的活动列表页
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T11:30:19+0800
   */
  loadActivity: function() {
    Activity.bindEvent();
    appFunc.hideToolbar();


    httpService.getOrderActivesList(
      '',
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          nextPageLink = dataRes.data.page.next;
          activityViewModel.getActList(dataRes.data);
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');
        tmmApp.pullToRefreshDone();
      }
    );

  },
  refreshActivityList: function()  {
    httpService.getOrderActivesList(
      '',
      function(dataRes, statusCode) {
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        activityViewModel.refreshActivityList(dataRes.data);
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
        tmmApp.pullToRefreshDone();
      }
    );
  },

  infiniteActivityList: function() {
    if (nextPageLink) {
      if (loading) return;
      loading = true;
      tmmApp.showIndicator();

      httpService.getOrderActivesList(
        nextPageLink,
        function(dataRes, statusCode) {
          nextPageLink = dataRes.data.page.next;
          activityViewModel.infiniteActivityList(dataRes.data);

          setTimeout(function() {
            tmmApp.hideIndicator();
            loading = false;
          }, 100);

        },
        function(dataRes, statusCode) {
          tmmApp.hideIndicator();
        }
      );
    } else {
      if (moreLoading) return;
      moreLoading = true;

      setTimeout(function() {
        tmmApp.hideIndicator();
        moreLoading = false;
        $$("#tmm-my-activity-page #no-more").css('display','block');
        $$("#tmm-my-activity-page #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 300);
      setTimeout(function(){
        $$("#tmm-my-activity-page #no-more").hide();
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      },2000);
    }
  },

  showSelect: function() {
    Activity.bindEvent();
    var clickedLink = this;
    var popoverHTML = '<div class="popover activity-popover">' +
      '<div class="popover-inner tmm-select-line-popover">' +
      '<div class="list-block">' +
      '<ul>' +
      '<li ><a href="javascript:;" id="tmm_select_line" class="item-link list-button"><i class="icon ticon-line"></i>选择路线</li>' +
      '<li ><a href="javascript:;" id="tmm_select_dot" class="item-link list-button"><i class="icon ticon-dot"></i>选择点</li>' +
      '</ul>' +
      '</div>' +
      '</div>' +
      '</div>';
    tmmApp.popover(popoverHTML, clickedLink);
  },
  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '#tmm_add_act',
      event: 'click',
      handler: Activity.showSelect
    }, {
      element: 'body',
      selector: '#tmm_select_line',
      event: 'click',
      handler: lineModule.selectLine
    }, {
      element: 'body',
      selector: '#tmm_select_dot',
      event: 'click',
      handler: dotModule.selectDot
    }, {
      element: '#myView',
      selector: '#tmm-my-activity-page .pull-to-refresh-content',
      event: 'refresh',
      handler: Activity.refreshActivityList
    }, {
      element: '#myView',
      selector: '#tmm-my-activity-page .pull-to-refresh-content',
      event: 'infinite',
      handler: Activity.infiniteActivityList
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = joinAct;
