/**
 * @method Activity
 * @description  活动相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-11-06T15:41:43+0800
 */
var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  activityViewModel = require('./activityView'),
  lineModule = require('./line'),
  actStateDetail_template = require('./activity-state-detail.tpl.html'),
  actStateDetail_time_template = require('./activity-state-detail-time.tpl.html'),
  actDetail_template = require('./act-detail.tpl.html'),
  activityDetail = require('./activityDetail'),
  my_act_tpl = require('./my-create-act.tpl.html'),
  dotModule = require('./dot'),
  shop = require('../shop/shop'),
  roleModule = require('../role/role');

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

var actStateShopDetailLink = '';
var shopDetailCon = '';

var Activity = {
  init: function() {
    //Activity.bindEvent();
  },
  /**
   * @method loadActivity
   * @description 我发起的活动列表页
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T11:30:19+0800
   */
  loadActivity: function() {
    var userInfo = JSON.parse(appFunc.getLocalUserInfo());
    if (userInfo.phone == undefined || userInfo.phone == 'undefined' || userInfo.phone == '' || userInfo.phone == {}) {
      roleModule.redirectToLogin();
      return ;
    } else if ((userInfo.is_organizer == 1) && (userInfo.organizer_status != 1)) {
      tmmApp.alert('您的帐号已被禁用，请联系管理员');
      return ;
    }

    Activity.bindEvent();
    appFunc.hideToolbar();

    httpService.getOrderActivesList(
      '',
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          nextPageLink = dataRes.data.page.next;
          var renderData = {
            'actList': dataRes.data.list_data
          };

          var output = appFunc.renderTpl(my_act_tpl, renderData);

          tmmApp.getCurrentView().router.load({
            content: output
          });

          if($$('#tmm-my-activity-page .activityGoTimeSel') != null){
            $$.each($$('#tmm-my-activity-page .activityGoTimeSel'), function(index, value) {
              Activity.activityGoTime(value);
            });
          }

          tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
        } else {
          tmmApp.hideIndicator();
          if ('login' in dataRes.data) {
            roleModule.redirectToLogin();
          } else {
            tmmApp.alert('网络超时，请重试');
          }
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');
        tmmApp.pullToRefreshDone();
      }
    );
  },

  activityGoTime: function(ele) {
    var nowDate = new Date();
    var preDay = nowDate.setDate(nowDate.getDate() - 1);
    var id = $$(ele).attr('data-id');
    var goTimeLink = $$(ele).attr('data-link');

    tmmApp.calendar({
      input: ele,
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {
        goTime = appFunc.dateFormt(year, month, day);

        setTimeout(function() {
          tmmApp.confirm('出游日期确认为：'+goTime, '', function () {
          var data = {
            "Actives[go_time]=": goTime
          };
          httpService.setActityGoTime(
            goTimeLink,
            data,
            function(dataRes, statusCode) {
              if (dataRes.status == 1) {
                tmmApp.alert('出游日期确认成功!');
                if(actStateShopDetailLink != ''){
                  Activity.setActStateSucDetailTime();
                  Activity.refreshActivityList();
                } else {
                  Activity.refreshActivityList();
                }
              } else {
                if (dataRes.form) {
                  tmmApp.alert(dataRes.form.go_time[0]);
                } else {
                  tmmApp.alert('网络超时，请重试');
                }
              }
            },
            function(dataRes, statusCode) {
              tmmApp.alert('网络超时，请重试');
            });
          });
        }, 80);

      }
    });
  },

  refreshActivityList: function() {
    httpService.getOrderActivesList(
      '',
      function(dataRes, statusCode) {
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        activityViewModel.refreshActivityList(dataRes.data);
        if($$('#tmm-my-activity-page .activityGoTimeSel') != null){
          $$.each($$('#tmm-my-activity-page .activityGoTimeSel'), function(index, value) {
            Activity.activityGoTime(value);
          });
        }
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
          if($$('#tmm-my-activity-page .activityGoTimeSel') != null){
            $$.each($$('#tmm-my-activity-page .activityGoTimeSel'), function(index, value) {
              Activity.activityGoTime(value);
            });
          }
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
        $$("#tmm-my-activity-page #no-more").css('display', 'block');
        $$("#tmm-my-activity-page #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 300);
      setTimeout(function() {
        $$("#tmm-my-activity-page #no-more").hide();
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      }, 2000);
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

  initActDetail: function() {
    var _this = this;
    var type = $$(_this).attr('data-type');
    var link = $$(_this).attr('data-link');
    if (type == 'actSuccess') {
      actStateShopDetailLink = link;
      Activity.getActStateSucDetail(link);
    } else if (type == 'actFail') {
      Activity.getActStateFailDetail(link);
    } else {
      tmmApp.alert('请求的链接不存在');
    }
  },

  getActStateSucDetail: function(url) {
    tmmApp.showIndicator();

    httpService.getActStateDetail(
      url,
      function(dataRes, statusCode) {
        log.info("成功详情", dataRes.data);
        if (dataRes.status == 1) {
          var data = {
            editLink: url,
            actStateSucObj: dataRes.data,
          };
          var output = appFunc.renderTpl(actStateDetail_template, data);

          tmmApp.getCurrentView().router.load({
            content: output
          });
          tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);

          activityDetail.init(dataRes.data,url);

          if($$('#my-activity-detail-suc-page .activityGoTimeSel') != null){
            $$.each($$('#my-activity-detail-suc-page .activityGoTimeSel'), function (index, value) {
              Activity.activityGoTime(value);    
            });
          }
          appFunc.hideToolbar();
          tmmApp.hideIndicator();
        } else {
          tmmApp.hideIndicator();
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },

  setActStateSucDetailTime: function() {
    httpService.getOrderActivesList(
      actStateShopDetailLink,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          var data = {
            editLink: actStateShopDetailLink,
            actStateSucObj: dataRes.data,
          };
          var output = appFunc.renderTpl(actStateDetail_time_template, data);

          $$('#my-activity-detail-suc-page').html(output);
          tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);

          activityDetail.init(dataRes.data,url);
        } else {
          tmmApp.hideIndicator();
        }
      }
    );
  },

  getActStateFailDetail: function(url) {
    tmmApp.showIndicator();

    httpService.getActStateDetail(
      url,
      function(dataRes, statusCode) {
        log.info("失败详情", dataRes.data);
        if (dataRes.status == 1) {
          var data = {
            editLink: url,
            actStateFailObj: dataRes.data,
            actStateFailObjAudit: dataRes.data.audit_status.value,
            actStateFailObjActives: dataRes.data.actives_status.value,
          };
          var output = appFunc.renderTpl(actDetail_template, data);

          tmmApp.getCurrentView().router.load({
            content: output
          });

          if (dataRes.data.audit_status != null && dataRes.data.audit_status.value == "-1") {
            $$("#my-activity-detail-fail-page .act-fail-reason").show();
          } else {
            $$("#my-activity-detail-fail-page .act-fail-reason").hide();
          }
          if ($$('#my-activity-detail-fail-page .activityGoTimeSel') != null) {
            $$.each($$('#my-activity-detail-fail-page .activityGoTimeSel'), function(index, value) {
              Activity.activityGoTime(value);
            });
          }

          activityDetail.init(dataRes.data,url);
          appFunc.hideToolbar();
          tmmApp.hideIndicator();
        } else {
          tmmApp.hideIndicator();
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  showEditView: function() {
    var _this = this;
    var dataObj = $$(_this).dataset();
    log.info('showEditView....', dataObj);
    if (dataObj.type == 0) {
      // 0 多个点的旅游活动
      dotModule.showEditView(dataObj.link);
    } else if (dataObj.type == 1) {
      // 1 一条线的旅游活动
      lineModule.showEditView(dataObj.link);
    }
  },
  
  /*显示选择时间时的遮罩层*/
  showchuList: function() {
    $$('body').find(".modal-overlay").remove();
    if($$('body').find(".modal-overlay").hasClass('tmm-picker-calendar')){
      $$(".modal-overlay").addClass("modal-overlay-visible");
    } else {
      $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-picker-calendar"></div>');
    }
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
      element: 'body',
      selector: '.tmm-my-activity-cancel',
      event: 'click',
      handler: appFunc.activityRefund
    }, {
      element: '#myView',
      selector: '#tmm-my-activity-page .pull-to-refresh-content',
      event: 'infinite',
      handler: Activity.infiniteActivityList
    }, {
      element: '#myView',
      selector: '#tmm-my-activity-page .tmm-my-act-state-detail',
      event: 'click',
      handler: Activity.initActDetail
    }, {
      element: 'html',
      selector: '#my-activity-detail-fail-page .tmm-my-activity-fail-cancel',
      event: 'click',
      handler: appFunc.activityRefund
    }, {
      element: '#myView',
      selector: '#my-activity-detail-suc-page .tmm-my-activity-suc-cancel',
      event: 'click',
      handler: appFunc.activityRefund
    }, {
      element: '#myView',
      selector: '.activityGoTimeSel',
      event: 'click',
      handler: Activity.showchuList
    }, {
      element: '#myView',
      selector: '.tmm-act-edit',
      event: 'click',
      handler: Activity.showEditView
    }, {
      element: '.views',
      selector: '.goTop',
      event: 'click',
      handler: shop.gotoTop
    }];


    appFunc.bindEvents(bindings);
  }
};

module.exports = Activity;
