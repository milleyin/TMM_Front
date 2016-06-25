/**
 * @name Dot
 * @description 旅游觅趣（多个点）相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-11-16T10:28:38+0800
 */
var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  dotViewModel = require('./dotView'),
  dot_day_tpl = require('./day.tpl.html'),
  edit_dot_day_tpl = require('./edit-day.tpl.html'),
  day_item_tpl = require('./day-item.tpl.html'),
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
 * 多个点的觅趣临时数据列表
 * @type {Array}
 */
var dotActTempList = {};
/**
 * 当前所编辑的天排序
 * @type {Number}
 */
var current_day_sort = 1;
/**
 * 出游日期
 * @type {String}
 */
var dot_go_time = '';
/**
 * 报名开始日期
 * @type {String}
 */
var dot_start_time = '';
/**
 * 报名结束日期
 * @type {String}
 */
var dot_end_time = '';

/**
 * 操作标志 add添加觅趣 edit编辑觅趣
 * @type {String}
 */
var operationFlag = 'add';

/**
 * 觅趣id
 * @type {String}
 */
var actId = '';

/**
 * 觅趣详情信息（编辑时）
 * @type {String}
 */
var actInfo = '';

var is_organizer = '0';



var Dot = {
  init: function() {
    appFunc.hideToolbar();
    Dot.bindEvent();
  },
  /**
   * @method selectDot
   * @description 点的信息列表（选择点的操作时）
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T10:30:53+0800
   */
  selectDot: function() {
    log.info('selectDot...');
    Dot.init();
    // 关闭选择点，线的弹出框
    tmmApp.closeModal();

    tmmApp.showIndicator();
    // 获取点的详情信息
    httpService.getDotList(
      '',
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          dotViewModel.selectDot(dataRes.data);
          log.info("选择点的数据", dataRes);
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
  /**
   * @method getDotSelect
   * @description 获取点的详情
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T10:32:40+0800
   */
  getDotSelect: function() {
    var _this = this;
    $$(".tmm-sublist a").removeClass('tmm-seek-selected');
    $$(_this).addClass('tmm-seek-selected');
    // 隐藏展开的菜单 
    $$('#seekView .tmm-sublist').hide();
    // 获取选中的点的详情链接
    selectUrl = $$(_this).attr('data-link');
    selectUrl = selectUrl == '' ? '' : selectUrl + '&select_dot_thrand=dot&page=1';
    tmmApp.showIndicator();
    // 请求获取点的详情
    httpService.getDotList(
      selectUrl,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          dotViewModel.getDotSelect(dataRes.data);
        } else {
          tmmApp.alert('网络超时，请重试', '');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');
      });

  },
  /**
   * @method refreshDotList
   * @description 刷新点列表
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T10:36:17+0800
   */
  refreshDotList: function() {
    // 发送获取点列表请求
    httpService.getDotList(
      selectUrl,
      function(dataRes, statusCode) {
        // 成功后把下一页链接赋值给nextPageLink
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          // 如果还有下一页链接的话，把销毁掉的滚动加载的事件注册回去
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        // 进行渲染视图
        dotViewModel.refreshDotList(dataRes.data);
      },
      function(dataRes, statusCode) {
        setTimeout(function() {
          tmmApp.pullToRefreshDone();
        }, 1000);
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method infiniteDotList
   * @description 滚动请求下一页点列表信息
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T10:37:57+0800
   */
  infiniteDotList: function() {
    // 如果还有下一页的数据的时候（即下一页的链接不为空时）才去请求获取数据
    if (nextPageLink) {
      // 如果正在获取数据，即滚动加载的事件还没处理完，直接返回
      // 防止重复请求，获取到重复的数据
      if (loading) return;
      // 正在获取数据，设置flag为true
      loading = true;
      tmmApp.showIndicator();
      // 获取下一页点列表
      httpService.getDotList(
        nextPageLink,
        function(dataRes, status) {
          // 成功后把下一页链接赋值给nextPageLink
          nextPageLink = dataRes.data.page.next;
          // 调用视图模型的infiniteSeekList方法进行渲染视图
          dotViewModel.infiniteDotList(dataRes.data);

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
  /**
   * @method selectDotBack
   * @description 监听选择点列表页中的回退按钮
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T10:39:23+0800
   */
  selectDotBack: function() {
    // 清空临时保存的数据和重置初始数据
    if (operationFlag == 'add') {
      Dot.clearData();
    }
  },
  /**
   * @method showDotDetail
   * @description 显示点详情
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T10:41:25+0800
   */
  showDotDetail: function() {
    var _this = this;
    var dataObj = $$.dataset(_this);
    // 获取点详情的请求链接
    var link = dataObj.link;

    tmmApp.showIndicator();
    // 获取点详情
    httpService.getDotDetail(
      link,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          // 临时保存此点的数据到每一天的对象数组中
          if (dotActTempList[current_day_sort]) {
            // 临时对象里已存在某天的日程
            var flag = false;
            // 过滤此点是否已经添加到临时对象中
            for (dot_sort in dotActTempList[current_day_sort]) {
              // 如果是则不再加入
              if (dataRes.data.dot_id == dotActTempList[current_day_sort][dot_sort]['dot_id']) {
                if (operationFlag == 'edit') {
                  //Dot.updateEditActDotItemFareInfo(dataRes.data);
                }
                flag = true;
              }
            }
            if (flag == false) {
              // 如果没添加过，则加入到临时对象中
              dotActTempList[current_day_sort].push(dataRes.data);
            }
          } else {
            // 如果是新加的一天，保存新一天的日程
            dotActTempList[current_day_sort] = [];
            dotActTempList[current_day_sort].push(dataRes.data);
          }
          dotViewModel.getDotDetail(dataRes.data);
          log.info("点的详情", dataRes.data);
          log.info('dotActTempList...', dotActTempList);
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
  updateEditActDotItemFareInfo: function(dotInfo) {
    var actItems = dotActTempList;
    var act_day_sort = current_day_sort;
    var act_dot_id = dotInfo['dot_id'];
    var itemList = dotInfo['list'];

    for (day_sort in actItems) {
      // dot_sort 点的排序
      for (dot_sort in actItems[day_sort]) {
        // 点id
        var dot_id = actItems[day_sort][dot_sort]['dot_id'];
        // item_sort 点项目的排序

        if (dot_id == act_dot_id) {
          actItems[day_sort][dot_sort]['list'] = dotInfo['list'];
        }

      }
    }
  },
  /**
   * @method actDotDetailBack
   * @description 监听点详情页中的回退按钮
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T10:48:04+0800
   */
  actDotDetailBack: function() {
    // 回退的时候移除当前操作天的最后操作的点的数据
    dotActTempList[current_day_sort].pop();
  },
  /**
   * @method showItineraryView
   * @description 日程添加页
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T10:49:19+0800
   */
  showItineraryView: function() {
    // 获取选中的价格的数据
    var inputArr = $$('#act-dot-detail-page').find('input[type="checkbox"]');
    var flag = false;
    $$.each(inputArr, function(index, value) {
      var isChecked = $$(value).is(":checked");
      if (isChecked) {
        // 如果项目中有用户选中的价格
        log.info('showItineraryView...dotActTempList...', dotActTempList);
        flag = true;
        var dataObj = $$.dataset($$(value));
        // 更新临时保存点数据中的项目中的价格的选中状态
        Dot.updateActDotItemFareInfo(dataObj);
      }
    });
    // 必须选中一个价格，才能提交
    if (flag === false) {
      tmmApp.alert('请至少选择一个项目');
      return;
    }
    // 渲染编辑和添加觅趣的页面
    dotViewModel.getItinerary(operationFlag, dotActTempList);
  },
  /**
   * @method updateActDotItemFareInfo
   * @description 更新点中项目价格的选中状态
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T11:05:09+0800
   */
  updateActDotItemFareInfo: function(dataObj) {

    // 当前操作的天的排序
    var act_day_sort = current_day_sort;
    log.info('updateActDotItemFareInfo---act_day_sort', act_day_sort);
    // 当前操作的点id
    var act_dot_id = dataObj['dotid'];
    // 当前操作的项目id
    var act_item_id = dataObj['itemid'];
    // 当前操作的价格id
    var act_fare_id = dataObj['fareid'];

    var actItems = dotActTempList;

    for (day_sort in actItems) {
      // dot_sort 点的排序
      for (dot_sort in actItems[day_sort]) {
        // 点id
        var dot_id = actItems[day_sort][dot_sort]['dot_id'];
        // item_sort 点项目的排序
        for (item_sort in actItems[day_sort][dot_sort]['list']) {
          // 项目id
          var item_id = actItems[day_sort][dot_sort]['list'][item_sort]['item_id'];
          if (actItems[day_sort][dot_sort]['list'][item_sort]['fare']) {
            actItems[day_sort][dot_sort]['list'][item_sort]['fare_count'] = actItems[day_sort][dot_sort]['list'][item_sort]['fare'].length;
          }
          // fare_sort 点项目价格的排序
          for (fare_sort in actItems[day_sort][dot_sort]['list'][item_sort]['fare']) {
            var fare_info = actItems[day_sort][dot_sort]['list'][item_sort]['fare'][fare_sort];
            // 价格id
            var fare_id = fare_info['id'];
            if ((act_day_sort == day_sort) && (act_dot_id == dot_id) && (act_item_id == item_id) && (act_fare_id == fare_id)) {
              // 选中项目
              if (fare_info['is_select']) {
                // 如果重复选中，则不做处理
              } else {
                // 如果是新选中的
                if (actItems[day_sort][dot_sort]['list'][item_sort]['select_fare_count']) {
                  // 统计某一项目下的所有选中价格的数目，如果之前此项目下有选过的价格，则累加
                  actItems[day_sort][dot_sort]['list'][item_sort]['select_fare_count']++;
                } else {
                  // 如果是新选中的项目下的，则设为1
                  actItems[day_sort][dot_sort]['list'][item_sort]['select_fare_count'] = 1;
                }
                // 设置，选择项目价格的状态
                fare_info['is_select'] = true;
              }
            }
          }
        }
      }
    }
  },
  /**
   * @method itineraryBack
   * @description 监听觅趣日程页面的回退按钮
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T11:08:25+0800
   */
  itineraryBack: function() {
    // 重置初始数据
    Dot.clearData();
    // 回退到创建的觅趣列表页
    tmmApp.getCurrentView().router.back({
      'pageName': 'my-activity',
      'force': true
    });
  },
  /**
   * @method showAddItemView
   * @description 显示项目价格选择页
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T13:47:11+0800
   */
  showAddItemView: function() {
    var _this = this;
    // 设置当前给添加项目的天数
    current_day_sort = $$(_this).attr('data-key');
    // 回退到选择点的页面
    tmmApp.getCurrentView().router.back({
      'pageName': 'select-dot',
      'force': true
    });
  },
  /**
   * @method showEditItemView
   * @description 显示项目价格选择页（编辑时）
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T13:49:23+0800
   */
  showEditItemView: function() {
    var _this = this;
    // 设置当前给添加项目的天数
    current_day_sort = $$(_this).attr('data-key');
    // 回退到选择点的页面
    Dot.selectDot();
  },
  /**
   * @method addDotDay
   * @description 添加天的日程
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T13:50:53+0800
   */
  addDotDay: function() {
    // 统计已添加到几天
    var len = $$('#myView').find('#itinerary-page-content .item-day').length;
    // 最多只能添加10天
    if (len >= 20) {
      tmmApp.alert('只能添加10天日程');
      return;
    }

    var data = {
      'day': len + 1
    };
    // 添加下一天
    dotActTempList[len + 1] = [];
    log.info('addDotDay...', dotActTempList);
    // 编辑和添加时，渲染不同的页面
    if (operationFlag == 'edit') {
      var output = appFunc.renderTpl(edit_dot_day_tpl, data);
    } else {
      var output = appFunc.renderTpl(dot_day_tpl, data);
    }
    // 更新页面数据
    $$('#myView').find('#itinerary-page-content').append(output);
  },
  /**
   * @method actFareMinus
   * @description 移某一个价格
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T13:53:15+0800
   */
  actFareMinus: function() {
    var _this = this;
    var dataObj = $$.dataset($$(_this));
    // 编辑和添加操作不同的class，获取当前天
    if (operationFlag == 'edit') {
      var parentInfo = $$(_this).parent().parent().parent().find('.edit-item').eq(0);
    } else {
      var parentInfo = $$(_this).parent().parent().parent().find('.add-item').eq(0);
    }
    // 当天操作的天
    current_day_sort = parentInfo.attr('data-key');
    // 移除某个价格后，更新缓存数据中某个价格的选中状态
    Dot.minusActDotItemFareInfo(dataObj);
    // 更新页面数据
    dotViewModel.refreshItinerary(operationFlag, dotActTempList);
  },
  /**
   * @method minusActDotItemFareInfo
   * @description 移除某个价格后，更新缓存数据中某个价格的选中状态
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T13:55:51+0800
   */
  minusActDotItemFareInfo: function(dataObj) {
    // 当前操作的天的排序
    var act_day_sort = current_day_sort;
    // 当前操作的点id
    var act_dot_id = dataObj['dotid'];
    // 当前操作的项目id
    var act_item_id = dataObj['itemid'];
    // 当前操作的价格id
    var act_fare_id = dataObj['fareid'];

    var actItems = dotActTempList;

    for (day_sort in actItems) {
      // dot_sort 点的排序
      for (dot_sort in actItems[day_sort]) {
        // 点id
        var dot_id = actItems[day_sort][dot_sort]['dot_id'];
        // item_sort 点项目的排序
        for (item_sort in actItems[day_sort][dot_sort]['list']) {
          // 项目id
          var item_id = actItems[day_sort][dot_sort]['list'][item_sort]['item_id'];
          // fare_sort 点项目价格的排序
          for (fare_sort in actItems[day_sort][dot_sort]['list'][item_sort]['fare']) {
            var fare_info = actItems[day_sort][dot_sort]['list'][item_sort]['fare'][fare_sort];
            // 价格id
            var fare_id = fare_info['id'];
            if ((act_day_sort == day_sort) && (act_dot_id == dot_id) && (act_item_id == item_id) && (act_fare_id == fare_id)) {
              // 把选中状态设为未选中状态
              if (fare_info['is_select'] == true) {
                if (actItems[day_sort][dot_sort]['list'][item_sort]['select_fare_count'] > 0) {
                  // 选中的个数减去
                  actItems[day_sort][dot_sort]['list'][item_sort]['select_fare_count']--;
                } else {
                  // 如果某项目下没有选中的价格了，就设为0
                  actItems[day_sort][dot_sort]['list'][item_sort]['select_fare_count'] = 0;
                }
                // 移除选中价格
                fare_info['is_select'] = false;
              }

            }
          }
        }
      }
    }
    log.info('updateActDotItemFareInfo....', dotActTempList);
  },
  /**
   * @method actFareAdd
   * @description 添加某个价格
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T13:58:16+0800
   */
  actFareAdd: function() {
    var _this = this;
    var dataObj = $$.dataset($$(_this));
    // 项目的链接
    var item_link = dataObj['itemlink'];
    // 编辑和添加时操作不同的class
    if (operationFlag == 'edit') {
      var parentInfo = $$(_this).parent().parent().parent().find('.edit-item').eq(0);
    } else {
      var parentInfo = $$(_this).parent().parent().parent().find('.add-item').eq(0);
    }
    // 获取当前操作的天
    current_day_sort = parentInfo.attr('data-key');
    // 选中已经添加了几个价格
    var fareEleArr = $$(_this).parent().prevAll().find('.tmm-act-fare-minus');
    var fareKeyObj = {};
    $$.each(fareEleArr, function(index, value) {
      var dataObj = $$(value).dataset();
      // 如果某项目下的某个价格已添加，则为ture
      fareKeyObj[dataObj.fareid] = true;

    });
    // 获取项目详情
    httpService.getItemDetail(
      item_link,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          // 给弹框填充数据
          Dot.selectFareToActions(dataObj, dataRes.data.fare, fareKeyObj);
        }
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  /**
   * @method selectFareToActions
   * @description 弹框价格的列表
   * 
   * @param    {[type]}                 dataObj    [description]
   * @param    {[type]}                 dataRes    [description]
   * @param    {[type]}                 fareKeyObj [description]
   * @return   {[type]}                            [description]
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T14:01:05+0800
   */
  selectFareToActions: function(dataObj, dataRes, fareKeyObj) {
    var fareArr = [];
    // 某个项目下的全部价格信息
    var fareInfo = dataRes;
    for (var key in fareInfo) {
      var fareId = fareInfo[key]['value'];
      // 过滤选过的，不再显示
      if (fareKeyObj[fareId] != true) {
        fareInfo[key]['text'] = fareInfo[key]['name'] + '&nbsp;&nbsp;' + fareInfo[key]['info'] + '&nbsp;&nbsp;￥' + fareInfo[key]['price'];
        // 绑定点击选择的事件
        var callback = function(key) {
          return function() {
            // （注）要转类型，否则类型不对应判断会有误
            dataObj['fareid'] = parseInt(fareInfo[key]['value'], 10);
            Dot.updateActDotItemFareInfo(dataObj);
            dotViewModel.refreshItinerary(operationFlag, dotActTempList);
          }
        }
        fareInfo[key]['onClick'] = callback(key);
        // 把未选中的加入价格数组中
        fareArr.push(fareInfo[key]);
      }

    };
    var groups = [fareArr, [{
      text: '取消',
      color: 'red'
    }]];
    tmmApp.actions(groups);
  },
  /**
   * @method showCreateActView
   * @description 显示创建页面
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T14:03:11+0800
   */
  showCreateActView: function() {
    if (operationFlag == 'edit') {
      // 编辑时，获取报名开始日期和结束时间
      dot_start_time = actInfo.actives_time.start_time;
      dot_end_time = actInfo.actives_time.end_time;
      if (actInfo.actives_time.go_time_value != 0) {
        // 出游日期
        dot_go_time = actInfo.actives_time.go_time;
      }
      dotViewModel.showSettingView(actInfo);
    } else {
      var data = {
        'flag': 'dot',
        'userInfo':JSON.parse(appFunc.getLocalUserInfo())
      };

      var output = appFunc.renderTpl(act_setting_tpl, data);

      tmmApp.getCurrentView().router.load({
        content: output
      });
    }
    // 绑定时间控件
    Dot.selectDate();
  },
  /**
   * @method selectDate
   * @description 时间绑定控件
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T14:04:48+0800
   */
  selectDate: function() {
    var nowDate = new Date();
    var preDay = nowDate.setDate(nowDate.getDate() - 1);
    // 出游日期
    tmmApp.calendar({
      input: '#go_time',
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {
        dot_go_time = appFunc.dateFormt(year, month, day);
      }
    });
    // 报名开始日期
    tmmApp.calendar({
      input: '#start_time',
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {
        dot_start_time = appFunc.dateFormt(year, month, day);
      }
    });
    // 报名结束日期
    tmmApp.calendar({
      input: '#end_time',
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {
        dot_end_time = appFunc.dateFormt(year, month, day);
      }
    });
  },
  /**
   * @method createAct
   * @description 创建觅趣
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T14:06:12+0800
   */
  createAct: function() {
    var actData = {
      "actives_thrand": 0, //线路ID 点为0
      "is_insurance": 1, //保险1=确认0=取消
      "shops_info": '',
      "Actives": { //觅趣信息
        "actives_type": 0, //0=旅游觅趣1=农产品觅趣
        "tour_type": 0, //-1=农产品觅趣,0=多个点,1=一条线
        "number": 0, //觅趣数量
        "price": 0.00, //觅趣单价(农产品传值)
        "tour_price": 0.00, //服务费
        "remark": "", //旅游觅趣备注
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
    log.info('dot...createAct...');
    var name = $$('#name').val();
    var number = $$('#number').val();
    var tour_price = '0.00';
    var userInfo = JSON.parse(appFunc.getLocalUserInfo());
    if (userInfo.is_organizer === '1' && userInfo.organizer_status !== '0') {
      tour_price = $$('#tour_price').val();
    }
    var remark = $$('#remark').val();


    if (name == '') {
      tmmApp.alert('觅趣名称不能为空');
      return;
    }
    // if (name.length > 15) {
    //   tmmApp.alert('觅趣名称最多15个字符');
    //   return;
    // }
    if (dot_start_time == '') {
      tmmApp.alert('请选择觅趣开始时间');
      return;
    }
    if (dot_end_time == '') {
      tmmApp.alert('请选择觅趣结束时间');
      return;
    }
    if (number == '') {
      tmmApp.alert('觅趣参与人数不能为空');
      return;
    }
    // if (!(/^\d{1,11}$/.test(number))) {
    //   tmmApp.alert('觅趣参与人数是小于11位的数字');
    //   return;
    // }
    if (tour_price == '') {
      tmmApp.alert('服务费不能为空');
      return;
    }
    // if (!(/^\d{1,13}$/.test(tour_price))) {
    //   tmmApp.alert('服务费是小于13位的数字');
    //   return;
    // }
    if (remark == '') {
      tmmApp.alert('备注不能为空');
      return;
    }
    // 觅趣参与人数
    actData.Actives.number = number;
    // 服务费
    actData.Actives.tour_price = tour_price;
    // 备注
    actData.Actives.remark = remark;
    // 报名开始日期
    actData.Actives.start_time = dot_start_time;
    // 报名结束日期
    actData.Actives.end_time = dot_end_time;
    // 出游日期
    actData.Actives.go_time = dot_go_time;
    // 觅趣名称
    actData.Shops.name = name;
    // 创建旅游觅趣（多个点）的数据格式，要发给后端保存起来，方便编辑觅趣时使用
    actData.shops_info = encodeURIComponent(JSON.stringify(dotActTempList));
    // 点项目参数格式
    actData.Pro = Dot.filterPro(dotActTempList);
    // 点项目价格参数格式
    actData.ProFare = Dot.filterProFare(dotActTempList);

    if (operationFlag == 'add') {
      // 创建旅游觅趣（多个点）
      tmmApp.showPreloader('正在提交中...');
      httpService.actCreate(
        actData,
        function(dataRes, statusCode) {
          if (dataRes.status == 1) {
            // 创建成功后，跳到成功界面
            dotViewModel.showSuccessView(actData.Shops.name);
            // 重置初始数据
            Dot.clearData();
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
    }
  },
  /**
   * @method updateAct
   * @description 更新觅趣
   * 
   * @author Moore Mo
   * @datetime 2015-11-16T14:11:16+0800
   */
  updateAct: function() {
    var actData = {
      "actives_thrand": 0, //线路ID 点为0
      "is_insurance": 1, //保险1=确认0=取消
      "shops_info": '',
      "Actives": { //觅趣信息
        "actives_type": 0, //0=旅游觅趣1=农产品觅趣
        "tour_type": 0, //-1=农产品觅趣,0=多个点,1=一条线
        "number": 0, //觅趣数量
        "price": 0.00, //觅趣单价(农产品传值)
        "tour_price": 0.00, //服务费
        "remark": "", //旅游觅趣备注
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
    var remark = $$('#remark').val();

    var tour_price = '';

    

    if (is_organizer == 0) {
      tour_price = '0.00';
    } else {
      tour_price = $$('#tour_price').val();
    }

    if (name == '') {
      tmmApp.alert('觅趣名称不能为空');
      return;
    }
    if (dot_start_time == '') {
      tmmApp.alert('请选择觅趣开始时间');
      return;
    }
    if (dot_end_time == '') {
      tmmApp.alert('请选择觅趣结束时间');
      return;
    }
    if (number == '') {
      tmmApp.alert('觅趣参与人数不能为空');
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

    actData.Actives.number = number;
    actData.Actives.tour_price = tour_price;
    actData.Actives.remark = remark;
    actData.Actives.start_time = dot_start_time;
    actData.Actives.end_time = dot_end_time;
    actData.Actives.go_time = dot_go_time;

    actData.Shops.name = name;

    actData.shops_info = encodeURIComponent(JSON.stringify(dotActTempList));

    log.info('updateAct....dotActTempList...', dotActTempList);

    actData.Pro = Dot.filterPro(dotActTempList);
    actData.ProFare = Dot.filterProFare(dotActTempList);

    localStorage.setItem('updateAct', JSON.stringify(actData));
    log.info('updateAct....', actData);

    if (operationFlag == 'edit') {
      // 编辑旅游觅趣（多个点）
      tmmApp.showPreloader('正在提交中...');
      httpService.actUpdate(
        actId,
        actData,
        function(dataRes, statusCode) {
          log.info('actUpdate....', dataRes);
          if (dataRes.status == 1) {
            dotViewModel.showSuccessView(actData.Shops.name);
            Dot.clearData();
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
    }
  },
  // 商品项目过滤
  filterPro: function(fareDot) {
    // 天的排序对象
    var pro = {}
      // 天
    for (var day_sort in fareDot) {

      if (fareDot[day_sort].length > 0) {
        // 天的数组
        pro[day_sort] = [];
        // 点
        for (var i = 0; i < fareDot[day_sort].length; i++) {
          // 点排序的对象
          pro[day_sort][i] = {};
          // 点的数组
          pro[day_sort][i][fareDot[day_sort][i].dot_id] = [];
          // 项目
          for (var j = 0; j < fareDot[day_sort][i].list.length; j++) {
            if (fareDot[day_sort][i].list[j].fare) {
              // 价格
              for (var x = 0; x < fareDot[day_sort][i].list[j].fare.length; x++) {

                if (fareDot[day_sort][i].list[j].fare[x].is_select) {
                  pro[day_sort][i][fareDot[day_sort][i].dot_id].push(fareDot[day_sort][i].list[j].item_id);
                  pro[day_sort][i][fareDot[day_sort][i].dot_id] = $$.unique(pro[day_sort][i][fareDot[day_sort][i].dot_id]);
                }

              };
            }

          };
        };
      }
    };


    // 过滤点
    for (var day_sort in pro) {
      // 点数组
      for (var i = 0; i < pro[day_sort].length; i++) {
        // 点对象
        for (var dotid in pro[day_sort][i]) {
          if (pro[day_sort][i][dotid].length == 0) {
            pro[day_sort].splice(i, 1);
            i--;
          }
        }
      }
    }

    // 过滤天
    for (var day_sort in pro) {
      if (pro[day_sort].length == 0) {
        delete pro[day_sort];
      }
    }


    return pro;
  },
  // 商品项目价格过滤
  filterProFare: function(fareDot) {
    // 天的排序对象
    var proFare = {}
      // 天
    for (var day_sort in fareDot) {
      if (fareDot[day_sort].length > 0) {
        // 天的数组
        proFare[day_sort] = [];
        // 点
        for (var i = 0; i < fareDot[day_sort].length; i++) {
          // 点排序的对象
          proFare[day_sort][i] = {};
          // 点的数组
          proFare[day_sort][i][fareDot[day_sort][i].dot_id] = [];
          // 项目
          for (var j = 0; j < fareDot[day_sort][i].list.length; j++) {

            if (fareDot[day_sort][i].list[j].select_fare_count > 0) {
              // 项目的排序对象
              proFare[day_sort][i][fareDot[day_sort][i].dot_id][j] = {};
              // 项目的数组
              proFare[day_sort][i][fareDot[day_sort][i].dot_id][j][fareDot[day_sort][i].list[j].item_id] = [];
              // 价格
              for (var x = 0; x < fareDot[day_sort][i].list[j].fare.length; x++) {

                if (fareDot[day_sort][i].list[j].fare[x].is_select) {
                  proFare[day_sort][i][fareDot[day_sort][i].dot_id][j][fareDot[day_sort][i].list[j].item_id].push(fareDot[day_sort][i].list[j].fare[x].id);
                }

              };
            }
          };
        };
      }
    };
    // // 过滤子项目中的null
    for (var day_sort in proFare) {
      for (var i = 0; i < proFare[day_sort].length; i++) {
        for (var attr1 in proFare[day_sort][i]) {
          for (var j = 0; j < proFare[day_sort][i][attr1].length; j++) {
            if (proFare[day_sort][i][attr1][j] == null) {
              proFare[day_sort][i][attr1].splice(j, 1);
              j--;
            }
          }
        }
      }
    }

    // 过滤点
    for (var day_sort in proFare) {
      // 点数组
      for (var i = 0; i < proFare[day_sort].length; i++) {
        // 点对象
        for (var dotid in proFare[day_sort][i]) {
          if (proFare[day_sort][i][dotid].length == 0) {
            proFare[day_sort].splice(i, 1);
            i--;
          }
        }
      }
    }

    // 过滤天
    for (var day_sort in proFare) {
      if (proFare[day_sort].length == 0) {
        delete proFare[day_sort];
      }
    }

    return proFare;
  },
  actSucessBack: function() {
    Dot.clearData();
    tmmApp.getCurrentView().router.back({
      'pageName': 'my-activity',
      'force': true
    });
    // 刷新觅趣列表页
    tmmApp.pullToRefreshTrigger('#myView #tmm-my-activity-page .pull-to-refresh-content');
  },
  showEditView: function(url) {
    //Dot.selectDot();
    Dot.bindEvent();
    tmmApp.showIndicator();
    httpService.getActDetail(
      url,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          operationFlag = 'edit';
          actId = dataRes.data.shops.value;
          actInfo = dataRes.data;
          is_organizer = dataRes.data.is_organizer.value;
          dotActTempList = JSON.parse(decodeURIComponent(dataRes.data.shops_info));
          log.info('showEditView...', dotActTempList);
          dotViewModel.showEditView(dotActTempList);
          Dot.selectDate();
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
  clearData: function() {
    dot_go_time = '';
    dot_start_time = '';
    dot_end_time = '';
    dotActTempList = {};
    current_day_sort = 1;
    operationFlag = 'add';
    actId = '';
    actInfo = '';
  },
  bindEvent: function() {
    var bindings = [{
      element: "#myView",
      selector: '.tmm-select-dot-subber .buttons-row .button',
      event: 'click',
      handler: dotViewModel.showSubList
    }, {
      element: "#myView",
      selector: '#tmm-select-dot-page .bg-mask-seek',
      event: 'click',
      handler: dotViewModel.hideSubList
    }, {
      element: "#myView",
      selector: '.tmm-select-dot-subber .tmm-sublist a',
      event: 'click',
      handler: Dot.getDotSelect
    }, {
      element: '#myView',
      selector: '#tmm-select-dot-page .pull-to-refresh-content',
      event: 'refresh',
      handler: Dot.refreshDotList
    }, {
      element: '#myView',
      selector: '#tmm-select-dot-page .pull-to-refresh-content',
      event: 'infinite',
      handler: Dot.infiniteDotList
    }, {
      element: "#myView",
      selector: '#select-dot-back',
      event: 'click',
      handler: Dot.selectDotBack
    }, {
      element: "#myView",
      selector: '#tmm-select-dot-page .tmm-select-dot-card-list a',
      event: 'click',
      handler: Dot.showDotDetail
    }, {
      element: "#myView",
      selector: '#act-dot-detail-back',
      event: 'click',
      handler: Dot.actDotDetailBack
    }, {
      element: "#myView",
      selector: '#submit-select-item',
      event: 'click',
      handler: Dot.showItineraryView
    }, {
      element: "#myView",
      selector: '#itinerary-back',
      event: 'click',
      handler: Dot.itineraryBack
    }, {
      element: "#myView",
      selector: '#itinerary-page .add-item',
      event: 'click',
      handler: Dot.showAddItemView
    }, {
      element: "#myView",
      selector: '#itinerary-page .edit-item',
      event: 'click',
      handler: Dot.showEditItemView
    }, {
      element: "#myView",
      selector: '#add-dot-day',
      event: 'click',
      handler: Dot.addDotDay
    }, {
      element: "#myView",
      selector: '#itinerary-page .tmm-act-fare-minus',
      event: 'click',
      handler: Dot.actFareMinus
    }, {
      element: "#myView",
      selector: '#itinerary-page .tmm-act-fare-add',
      event: 'click',
      handler: Dot.actFareAdd
    }, {
      element: "#myView",
      selector: '#submit-select-dot-act',
      event: 'click',
      handler: Dot.showCreateActView
    }, {
      element: "#myView",
      selector: 'button#dot_create_act',
      event: 'click',
      handler: Dot.createAct
    }, {
      element: "#myView",
      selector: 'button#dot_edit_act',
      event: 'click',
      handler: Dot.updateAct
    }, {
      element: "#myView",
      selector: '#act-success-back',
      event: 'click',
      handler: Dot.actSucessBack
    }, {
      element: "#myView",
      selector: '.item-title.pro-nono',
      event: 'click',
      handler: itemModule.loadItemView
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = Dot;
