/**
 * @method Line
 * @description  活动（选择线）相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-11-06T15:41:43+0800
 */
var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  lineViewModel = require('./lineView'),
  act_setting_tpl = require('./act-setting.tpl.html'),
  crate_act_card_tpl = require('./create-act-card.tpl.html'),
  itemModule = require('../item/item');

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

/**
 * 线的id
 * @type {Number}
 */
var line_id = 0;
/**
 * 出游日期
 * @type {String}
 */
var line_go_time = '';
/**
 * 报名开始日期
 * @type {String}
 */
var line_start_time = '';
/**
 * 报名结束日期
 * @type {String}
 */
var line_end_time = '';

var Line = {
  init: function() {
    appFunc.hideToolbar();
    Line.bindEvent();
  },
  selectLine: function() {
    log.info('selectLine...');
    Line.init();
    tmmApp.closeModal();

    tmmApp.showIndicator();
    httpService.getLineList(
      '',
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          lineViewModel.selectLine(dataRes.data);
          log.info("选择线的数据", dataRes);
        } else {
          tmmApp.alert('网络超时，请重试', '');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');
      }
    );
  },
  getLineSelect: function() {
    var _this = this;
    $$(".tmm-sublist a").removeClass('tmm-seek-selected');
    $$(_this).addClass('tmm-seek-selected');
    // 隐藏展开的菜单 
    $$('#seekView .tmm-sublist').hide();
    selectUrl = $$(_this).attr('data-link');
    selectUrl = selectUrl == '' ? '' : selectUrl + '&select_dot_thrand=thrand&page=1';
    tmmApp.showIndicator();
    httpService.getLineList(
      selectUrl,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          lineViewModel.getLineSelect(dataRes.data);
        } else {
          tmmApp.alert('网络超时，请重试', '');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');
      });

  },
  refreshLineList: function() {
    // 发送获取推荐列表请求
    httpService.getLineList(
      selectUrl,
      function(dataRes, statusCode) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          // 如果还有下一页链接的话，把销毁掉的滚动加载的事件注册回去
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        // 进行渲染视图
        lineViewModel.refreshLineList(dataRes.data);
      },
      function(dataRes, statusCode) {
        setTimeout(function() {
          tmmApp.pullToRefreshDone();
        }, 100);
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  infiniteLineList: function() {
    // 如果还有下一页的数据的时候（即下一页的链接不为空时）才去请求获取数据
    if (nextPageLink) {
      // 如果正在获取数据，即滚动加载的事件还没处理完，直接返回
      // 防止重复请求，获取到重复的数据
      if (loading) return;
      // 正在获取数据，设置flag为true
      loading = true;
      tmmApp.showIndicator();

      httpService.getLineList(
        nextPageLink,
        function(dataRes, status) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          // 调用视图模型的infiniteSeekList方法进行渲染视图
          lineViewModel.infiniteLineList(dataRes.data);

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
        $$("#myView #no-more").css('display', 'block');
        $$("#myView #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 300);
      // 没有更多数据了，即销毁到滚动加载的事件
      // tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      setTimeout(function() {
        $$("#myView #no-more").hide();
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      }, 2000);
    }
  },
  showLineDetail: function() {
    var _this = this;
    var dataObj = $$.dataset(_this);
    log.info('dataObj--', dataObj);

    var link = dataObj.link;

    tmmApp.showIndicator();
    httpService.getLineDetail(
      link,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          // 给线id赋值
          line_id = dataRes.data.thrand_id;
          lineViewModel.getLineDetail(dataRes.data);
        } else {
          tmmApp.alert('此景点未开放，请稍后再试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  showCreateActView: function() {
    log.info('showCreateActView...');

    var data = {
      'flag': 'line',
    };

    var output = appFunc.renderTpl(act_setting_tpl, data);

    tmmApp.getCurrentView().router.load({
      content: output
    });
    Line.selectDate();
  },
  createAct: function() {
    var actData = {
      "actives_thrand": 0, //线路ID 点为0
      "is_insurance": 1, //保险1=确认0=取消
      "Actives": { //活动信息
        "actives_type": 0, //0=旅游活动1=农产品活动
        "tour_type": 1, //-1=农产品活动,0=多个点,1=一条线
        "number": 0, //活动数量
        "price": 0.00, //活动单价(农产品传值)
        "tour_price": 0.00, //服务费
        "remark": "", //旅游活动备注
        "start_time": "", //报名开始日期
        "end_time": "", //报名截止时间
        "go_time": '' //出游日期     没填传 空值
      },
      "Shops": {
        "name": "" //商品名称
      },
      "Pro": { //选中项目  线路ID不为0时，可传空
      },
      "ProFare": { //选中项目对应价格  线路ID不为0时，可传空
      }
    };
    log.info('line...createAct');
    var name = $$('#name').val();
    var number = $$('#number').val();
    var tour_price = $$('#tour_price').val();
    var remark = $$('#remark').val();


    if (name == '') {
      tmmApp.alert('活动名称不能为空');
      return;
    }
    if (line_start_time == '') {
      tmmApp.alert('请选择活动开始时间');
      return;
    }
    if (line_end_time == '') {
      tmmApp.alert('请选择活动结束时间');
      return;
    }
    if (number == '') {
      tmmApp.alert('活动参与人数不能为空');
      return;
    }
    if (tour_price == '') {
      tmmApp.alert('服务费不能为空');
      return;
    }
    if (remark == '') {
      tmmApp.alert('备注不能为空');
      return;
    }

    actData.actives_thrand = line_id;
    actData.Actives.number = number;
    actData.Actives.tour_price = tour_price;
    actData.Actives.remark = remark;
    actData.Actives.start_time = line_start_time;
    actData.Actives.end_time = line_end_time;
    actData.Actives.go_time = line_go_time;

    actData.Shops.name = name;
    // 创建旅游活动（线）
    tmmApp.showPreloader('正在提交中...');
    httpService.actCreate(
      actData,
      function(dataRes, statusCode) {
        log.info('actCreate...', dataRes);
        if (dataRes.status == 1) {
          lineViewModel.showSuccessView(actData.Shops.name);
          Line.clearData();
        } else {
          if (dataRes.form) {
            for (msgName in dataRes.form) {
              tmmApp.alert(dataRes.form[msgName][0]);
              break;
            }
          } else {
            tmmApp.alert('输入有误，请重试');
          }
        }
        tmmApp.hidePreloader();
      },
      function(dataRes, statusCode) {
        tmmApp.hidePreloader();
        tmmApp.alert('网络超时，请重试');
        log.error('actCreate...', dataRes);
      }
    );
  },
  updateAct: function() {
    var _this = this;
    var dataObj = $$(_this).dataset();
    var actData = {
      "actives_thrand": 0, //线路ID 点为0
      "is_insurance": 1, //保险1=确认0=取消
      "Actives": { //活动信息
        "actives_type": 0, //0=旅游活动1=农产品活动
        "tour_type": 1, //-1=农产品活动,0=多个点,1=一条线
        "number": 0, //活动数量
        "price": 0.00, //活动单价(农产品传值)
        "tour_price": 0.00, //服务费
        "remark": "", //旅游活动备注
        "start_time": "", //报名开始日期
        "end_time": "", //报名截止时间
        "go_time": '' //出游日期     没填传 空值
      },
      "Shops": {
        "name": "" //商品名称
      },
      "Pro": { //选中项目  线路ID不为0时，可传空
      },
      "ProFare": { //选中项目对应价格  线路ID不为0时，可传空
      }
    };

    var name = $$('#name').val();
    var number = $$('#number').val();
    var tour_price = $$('#tour_price').val();
    var remark = $$('#remark').val();


    if (name == '') {
      tmmApp.alert('活动名称不能为空');
      return;
    }
    if (line_start_time == '') {
      tmmApp.alert('请选择活动开始时间');
      return;
    }
    if (line_end_time == '') {
      tmmApp.alert('请选择活动结束时间');
      return;
    }
    if (number == '') {
      tmmApp.alert('活动参与人数不能为空');
      return;
    }
    if (tour_price == '') {
      tmmApp.alert('服务费不能为空');
      return;
    }
    if (remark == '') {
      tmmApp.alert('备注不能为空');
      return;
    }

    actData.actives_thrand = line_id;
    actData.Actives.number = number;
    actData.Actives.tour_price = tour_price;
    actData.Actives.remark = remark;
    actData.Actives.start_time = line_start_time;
    actData.Actives.end_time = line_end_time;
    actData.Actives.go_time = line_go_time;

    actData.Shops.name = name;
    // 创建旅游活动（线）
    tmmApp.showPreloader('正在提交中...');
    httpService.actUpdate(
      dataObj.id,
      actData,
      function(dataRes, statusCode) {
        log.info('updateAct...', dataRes);
        if (dataRes.status == 1) {
          lineViewModel.showSuccessView(actData.Shops.name);
          Line.clearData();
        } else {
          if (dataRes.form) {
            for (msgName in dataRes.form) {
              tmmApp.alert(dataRes.form[msgName][0]);
              break;
            }
          } else {
            tmmApp.alert('输入有误，请重试');
          }
        }
        tmmApp.hidePreloader();
      },
      function(dataRes, statusCode) {
        tmmApp.hidePreloader();
        tmmApp.alert('网络超时，请重试');
        log.error('actCreate...', dataRes);
      }
    );
  },
  selectDate: function() {
    var nowDate = new Date();
    var preDay = nowDate.setDate(nowDate.getDate() - 1);
    tmmApp.calendar({
      input: '#go_time',
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {
        line_go_time = appFunc.dateFormt(year, month, day);
      }
    });

    tmmApp.calendar({
      input: '#start_time',
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {
        line_start_time = appFunc.dateFormt(year, month, day);
      }
    });

    tmmApp.calendar({
      input: '#end_time',
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {
        line_end_time = appFunc.dateFormt(year, month, day);
      }
    });
  },


  /*显示选择时间时的遮罩层*/
  showStartList: function() {
    $$('body').find(".modal-overlay").remove();
    if ($$('body').find(".modal-overlay").hasClass('tmm-picker-calendar')) {
      $$(".modal-overlay").addClass("modal-overlay-visible");
    } else {
      $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-picker-calendar"></div>');
    }
  },
  showEndList: function() {
    $$('body').find(".modal-overlay").remove();
    if ($$('body').find(".modal-overlay").hasClass('tmm-picker-calendar')) {
      $$(".modal-overlay").addClass("modal-overlay-visible");
    } else {
      $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-picker-calendar"></div>');
    }
  },
  showTravelList: function() {
    $$('body').find(".modal-overlay").remove();
    if ($$('body').find(".modal-overlay").hasClass('tmm-picker-calendar')) {
      $$(".modal-overlay").addClass("modal-overlay-visible");
    } else {
      $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-picker-calendar"></div>');
    }
  },



  /**
   * @method actSettingBack
   * @description 回退的时候请空数据
   * 
   * @author Moore Mo
   * @datetime 2015-11-10T17:34:22+0800
   */
  actSettingBack: function() {
    Line.clearData();
    tmmApp.getCurrentView().router.back({
      'pageName': 'select-line',
      'force': true
    });
  },
  actEditSettingBack: function() {
    Line.clearData();
  },
  actSucessBack: function() {
    Line.clearData();
    tmmApp.getCurrentView().router.back({
      'pageName': 'my-activity',
      'force': true
    });

    // 刷新活动列表页
    tmmApp.pullToRefreshTrigger('#myView #tmm-my-activity-page .pull-to-refresh-content');
  },
  clearData: function() {
    line_id = 0;
    line_go_time = '';
    line_start_time = '';
    line_end_time = '';
  },
  showEditView: function(url) {
    Line.bindEvent();
    tmmApp.showIndicator();
    httpService.getActDetail(
      url,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          line_id = dataRes.data.thrand_id;
          line_start_time = dataRes.data.actives_time.start_time;
          line_end_time = dataRes.data.actives_time.end_time;
          if (dataRes.data.actives_time.go_time_value != 0) {
            line_go_time = dataRes.data.actives_time.go_time;
          }


          lineViewModel.showEditView(dataRes.data);
          Line.selectDate();
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  bindEvent: function() {
    var bindings = [{
      element: "#myView",
      selector: '.tmm-select-line-subber .buttons-row .button',
      event: 'click',
      handler: lineViewModel.showSubList
    }, {
      element: "#myView",
      selector: '#tmm-select-line-page .bg-mask-seek',
      event: 'click',
      handler: lineViewModel.hideSubList
    }, {
      element: "#myView",
      selector: '.tmm-select-line-subber .tmm-sublist a',
      event: 'click',
      handler: Line.getLineSelect
    }, {
      element: '#myView',
      selector: '#tmm-select-line-page .pull-to-refresh-content',
      event: 'refresh',
      handler: Line.refreshLineList
    }, {
      element: '#myView',
      selector: '#tmm-select-line-page .pull-to-refresh-content',
      event: 'infinite',
      handler: Line.infiniteLineList
    }, {
      element: "#myView",
      selector: '#tmm-select-line-page .tmm-select-line-card-list a',
      event: 'click',
      handler: Line.showLineDetail
    }, {
      element: "#myView",
      selector: '#submit-select-act',
      event: 'click',
      handler: Line.showCreateActView
    }, {
      element: "#myView",
      selector: 'button#line_create_act',
      event: 'click',
      handler: Line.createAct
    }, {
      element: "#myView",
      selector: 'button#line_edit_act',
      event: 'click',
      handler: Line.updateAct
    }, {
      element: "#myView",
      selector: '#act-setting-back',
      event: 'click',
      handler: Line.actSettingBack
    }, {
      element: "#myView",
      selector: '#edit-act-setting-back',
      event: 'click',
      handler: Line.actEditSettingBack
    }, {
      element: "#myView",
      selector: '#act-success-back',
      event: 'click',
      handler: Line.actSucessBack
    }, {
      element: "#myView",
      selector: '#end_time',
      event: 'click',
      handler: Line.showEndList
    }, {
      element: "#myView",
      selector: '#start_time',
      event: 'click',
      handler: Line.showStartList
    }, {
      element: "#myView",
      selector: '#go_time',
      event: 'click',
      handler: Line.showTravelList
    }, {
      element: "#myView",
      selector: '.item-tit.act-line-link',
      event: 'click',
      handler: itemModule.loadItemView

    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = Line;
