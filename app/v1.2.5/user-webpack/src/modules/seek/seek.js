var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  seekView = require('./seekView'),
  shopModule = require('../shop/shop'),
  seekSearchModule = require('../search/seekSearch'),
  selectDistinationModule = require('../search/selectDistination');
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

var seek = {
  init: function() {
    this.bindEvents();
    // this.getSeekList();
  },

  /**
   * 获取探索页面内容
   *
   * @author daixi
   */
  getSeekList: function() {
    appFunc.exitSeekFresh();
    // 显示加载图标
    tmmApp.showIndicator();

    // http请求
    httpService.getSeekList(
      '',
      function(dataSeek, status) {

        if (dataSeek.status == 1) {
          nextPageLink = dataSeek.data.page.next;

          seekView.getSeekList(dataSeek.data);
          tmmApp.hideIndicator();
        } else {
          tmmApp.hideIndicator();
          tmmApp.alert('网络超时，请重试', '');
          tmmApp.pullToRefreshDone();
        }

        // httpService.getLocationCity(function (dataRes) {
        //   if (dataRes.status == 1) {
        //     dataSeek.data.locationCity = dataRes.data.address_info.city.name;
        //   } else {
        //     dataSeek.data.locationCity = "选择";
        //   }

        //   nextPageLink = dataSeek.data.page.next;
        //   console.log('====',dataSeek.data)
        //   seekView.getSeekList(dataSeek.data);
        //   tmmApp.hideIndicator();
        // }, function (dataRes) {
        //   dataSeek.data.locationCity = "选择";
        //   nextPageLink = dataSeek.data.page.next;
        //   seekView.getSeekList(dataSeek.data);
        //   tmmApp.hideIndicator();
        // })     
        
      },
      function(dataSeek, status) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');
        tmmApp.pullToRefreshDone();
      });
  
  },

  /**
   * 下拉刷新请求
   * @return {[type]} [description]
   */
  refreshSeekList: function() {
    // 发送获取推荐列表请求
    httpService.getSeekList(
      selectUrl,
      function(dataSeek, status) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataSeek.data.page.next;
        if (nextPageLink) {
          // 如果还有下一页链接的话，把销毁掉的滚动加载的事件注册回去
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        // 进行渲染视图
        seekView.refreshSeekList(dataSeek.data);
      },
      function(dataSeek, status) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  },

  /**
   * 选择标签后请求数据
   * @return {[type]} [description]
   */
  getSeekSelect: function() {
    $$(".tmm-sublist a").removeClass('tmm-seek-selected');
    $$(this).addClass('tmm-seek-selected');
    // 隐藏展开的菜单 
    $$('#seekView .tmm-sublist').hide();
    selectUrl = $$(this).attr('data-link');
    /*if(localStorage.getItem('selectHistory') != null) {
      localStorage.removeItem("selectHistory");
      localStorage.setItem('selectHistory', $$(this).html());
    } else {
      localStorage.setItem('selectHistory', $$(this).html());
    }*/
    httpService.getSeekList(
      selectUrl,
      function(dataSeek) {
        nextPageLink = dataSeek.data.page.next;
        seekView.getSeekSelect(dataSeek.data);
        tmmApp.hideIndicator();
      },
      function(dataSeek) {
        tmmApp.hideIndicator();
      });

  },

  renderSeek: function(data, type) {
    var renderData = {
      seekList: data
    };
    var output = appFunc.renderTpl(template, renderData);
    if (type === 'prepend') {
      $$('#seekView').find('.tmm-seek-page-contnet ul').prepend(output);
    } else if (type === 'append') {
      $$('#seekView').find('.tmm-seek-page-contnet ul').append(output);
    } else {
      $$('#seekView').find('.tmm-seek-page-contnet ul').html(output);
    }
  },

  /**
   * 无限滚动请求
   * @return {[type]} [description]
   */
  infiniteSeekList: function() {
    // 如果还有下一页的数据的时候（即下一页的链接不为空时）才去请求获取数据
    if (nextPageLink) {
      // 如果正在获取数据，即滚动加载的事件还没处理完，直接返回
      // 防止重复请求，获取到重复的数据
      if (loading) return;
      // 正在获取数据，设置flag为true
      loading = true;
      tmmApp.showIndicator();

      httpService.getSeekList(
        nextPageLink,
        function(dataRes, status) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          // 调用视图模型的infiniteSeekList方法进行渲染视图
          seekView.infiniteSeekList(dataRes.data);

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
        $$("#seekView #no-more").css('display','inline-block');
        $$("#seekView #no-more").css('background', '#fff');
        $$("#seekView #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 300);
      // 没有更多数据了，即销毁到滚动加载的事件
      // tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      setTimeout(function(){
      	$$("#seekView #no-more").hide();
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      },2000);
    }
  },


  bindEvents: function() {
    var bindings = [{
      element: '#seekView',
      event: 'show',
      handler: seek.getSeekList
    }, {
      element: "#seekView",
      selector: '.buttons-row .button',
      event: 'click',
      handler: seekView.showSubList
    }, {
      element: "#seekView",
      selector: '.tmm-sublist a',
      event: 'click',
      handler: seek.getSeekSelect
    }, {
      element: '#seekView',
      selector: '.pull-to-refresh-content',
      event: 'refresh',
      handler: seek.refreshSeekList
    }, {
      element: '#seekView',
      selector: '.pull-to-refresh-content',
      event: 'infinite',
      handler: seek.infiniteSeekList
    }, {
      element: '#seekView',
      selector: '.tmm-recommend-detail',
      event: 'click',
      handler: shopModule.initDetail
    },{
      element: '#seekView',
      selector: '#tmm-seek-search .ticon-search',
      event: 'click',
      handler: seekSearchModule.init
    }, {
      element: "#seekView",
      selector: '.bg-mask-seek',
      event: 'click',
      handler: seekView.hideSubList
    }, {
      element: "#seekView",
      selector: '.bg-mask-seek',
      event: 'touchstart',
      handler: seekView.hideSubList
    }, {
      element: "#seekView",
      selector: '.tmm-seek-destination', // 切换目的地
      event: 'touchstart',
      handler: selectDistinationModule.init
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = seek;
