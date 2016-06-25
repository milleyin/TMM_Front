/**
 * @method Activity
 * @description  觅趣相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-11-06T15:41:43+0800
 */
var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  activityViewModel = require('./activityView'),
  my_act_tpl = require('./my-create-act.tpl.html'),
  selectDayTpl = require('./select-day.tpl.html'),
  journeyListTpl = require('./journey-list.tpl.html'),
  journeyListItemTpl = require('./journey-list-item.tpl.html'),
  seekfunDetail = require('./seekfun-detail.tpl.html'),
  editActNameTpl = require('./edit-act-name.tpl.html'),
  editActNumTpl = require('./edit-act-num.tpl.html'),
  editActTourPriceTpl = require('./edit-act-tour-price.tpl.html'),
  roleModule = require('../role/role'),
  shopModule = require('../shop/shop'),
  selectDistination = require('../search/selectDistination'),
  paymentTpl = require('./my-create-act-pay.tpl.html'),
  bridge = require('../utils/pageBridge'),
  act_setting_tpl = require('./my-create-act-info.tpl.html'),
  activeOrder = require('./activeOrderCtrl');


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

// 数据模型
var model = {};
var orderListModel = null;

/* 需要提交的数据 */
var goOffTime = '';
var lineId = '';
var payType = '';

/* 是否已经更改了出游日期 */
var editGoTime = '';

/*需要更换线路的觅趣id*/
var activeId = "";

/*选择行程模块*/
var journeryListModule = JourneyList();
/* 支付页面模块 */
var paymentModel = Payment();
/* 提交觅趣觅趣表单模块 */
var seekfunFormModel = SeekfunForm();
/* 切换线路 */
var changeLineFromPage = '0';

function goActOrderCtrl() {
  $$(document).off('pageAfterBack', '.page[data-page="act-order-A-detail"]', autoRefreshIndexList);
  $$(document).off('pageAfterBack', '.page[data-page="order-detail"]', autoRefreshIndexList);
  $$(document).on('pageAfterBack', '.page[data-page="act-order-A-detail"]', autoRefreshIndexList);
  $$(document).on('pageAfterBack', '.page[data-page="order-detail"]', autoRefreshIndexList);
  activeOrder.call(this);
}

function autoRefreshIndexList() {
  $$(document).off('pageAfterBack', '.page[data-page="act-order-A-detail"]', autoRefreshIndexList);
  $$(document).off('pageAfterBack', '.page[data-page="order-detail"]', autoRefreshIndexList);
  tmmApp.pullToRefreshTrigger('.my-activity .pull-to-refresh-content');
}

/*显示日期选择页面*/
function addAct() {
  goOffTime = '';
  tmmApp.getCurrentView().router.load({
    content: selectDayTpl
  });

  showCalendar()
}


/* 跳过选择日期到选择行程页面 */
function skipGoOffTime() {
  goOffTime = '';
  var seekfunTitle = "";
  var seekfunChangeLine = 0;

  if ($$(this).attr('data-id')) {
    activeId = $$(this).attr('data-id');
    seekfunTitle = "更换行程";
    seekfunChangeLine = 1;
    changeLineFromPage = '1';
  } else {
    seekfunTitle = "选择行程";
    changeLineFromPage = '0';
  }
  $$('#calendar-inline-container .picker-calendar-day-selected').removeClass('picker-calendar-day-selected');
  journeryListModule.getList(seekfunTitle, seekfunChangeLine);
}

/* 选择日期到选择行程页面 */
function nextGoJourney() {
  if (goOffTime) {
    changeLineFromPage = '0';
    journeryListModule.getList("选择行程", "0");
  } else {
    tmmApp.alert('请选择出游日期！', '');
  }
}

/* 选择行程页面到支付页面 */
function nextGoPayment() {
  lineId = $$('.journey-list-page input[name="item-radio"]:checked').val();

  if (lineId) {

    paymentModel.goPage();

  } else {
    tmmApp.alert('请选择行程！', '');
  }
}

//更换行程
function changeLine() {
  lineId = $$('.journey-list-page input[name="item-radio"]:checked').val();
  if (lineId) {
    var editUrl = "/index.php?r=api/actives/UpdateThrand&id=";
    var data = {
      "actives_thrand": lineId
    }
    httpService.editActInfo(
      editUrl,
      data,
      activeId,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          tmmApp.alert('修改觅趣线路成功!');
          Activity.refreshActivityList();
          var oDiv = document.createElement('div');
          /*oDiv.setAttribute('data-link', dataRes.data.link);*/
          oDiv.setAttribute('data-link', seekfunDetailLink);
          oDiv.type = 2;
          goSeekfunDetail.call(oDiv);

          activeId = '';
          lineId = '';
        } else {
          if (dataRes.form) {
            for (var msgName in dataRes.form) {
              tmmApp.alert(dataRes.form[msgName][0]);
              break;
            }
          } else {
            tmmApp.alert('网络超时，请重试');
          }
        }
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  } else {
    tmmApp.alert('请选择需要更换的行程！', '');
  }
}


/*
  *觅趣提交审核
  *暂无接口，用修改觅趣信息替代
*/
function changeActExamine(model) {
  var actData = {
    "actives_thrand": 0, //线路ID 点为0
    "is_insurance": 1, //保险1=确认0=取消
    "shops_info": '', //觅趣对应点的信息====多点
    "Actives": { //觅趣信息
      "actives_type": 0, //0=旅游觅趣1=农产品觅趣
      "tour_type": 1, //-1=农产品觅趣,0=多个点,1=一条线
      "number": 0, //觅趣数量
      "price": 0.00, //觅趣单价(农产品传值)
      "tour_price": 0.00, //服务费
      "remark": "", //旅游觅趣备注
      "start_time": "", //报名开始日期
      "end_time": "", //报名截止时间
      "go_time": '', //出游日期     没填传 空值
      "is_organizer": 1, //是否组织者 1=是 0=不是
      "is_open": 1, //是否开放显示 1=开放 0=不开放
      "pay_type": 0 //付款方式 0=AA付款 1=全额付款
    },
    "Shops": {
      "name": "" //商品名称
    },
    "Pro": { //选中项目  线路ID不为0时，可传空
    },
    "ProFare": { //选中项目对应价格  线路ID不为0时，可传空
    }
  };
  
  actData.actives_thrand = model.thrand_id;
  actData.Actives.number = model.actives_info.number.value;
  actData.Actives.tour_price = model.actives_info.tour_price.value;
  actData.Actives.start_time = model.actives_time.start_time;
  actData.Actives.end_time = model.actives_time.end_time;
  actData.Actives.is_organizer = model.is_organizer.value;
  actData.Actives.is_open = model.actives_is_open.value;
  actData.Actives.pay_type = model.actives_pay_type.value;
  if(model.actives_time.go_time == "出游日期未定"){
    actData.Actives.go_time = "";
  } else {
    actData.Actives.go_time = model.actives_time.go_time;
  }
  actData.Actives.remark = model.actives_info.remark;
  actData.Shops.name = model.name;

  var activeId = model.actives_id;
  // 创建旅游觅趣（线）
  tmmApp.showPreloader('正在提交中...');
  httpService.actUpdate(
    activeId,
    actData,
    function(dataRes, statusCode) {
      
      if (dataRes.status == 1) {
        Activity.refreshActivityList();
        /*var oDiv = document.createElement('div');
        oDiv.setAttribute('data-link', dataRes.data.link);
        oDiv.type = 2;
        goSeekfunDetail.call(oDiv);*/
        if($$("body").find('.tmm-examine').hasClass("tmm-seekfun-btn")){
          $$('.tmm-seekfun-btn').css('display', 'none');
        }
        tmmApp.alert('觅趣提交审核成功!');
      } else {
        if (dataRes.form) {
          for (var msgName in dataRes.form) {
            tmmApp.alert(dataRes.form[msgName][0]);
            break;
          }
        } else {
          tmmApp.alert('觅趣提交审核失败!');
        }
      }
      tmmApp.hidePreloader();
    },
    function(dataRes, statusCode) {
      tmmApp.hidePreloader();
      tmmApp.alert('网络超时，请重试');

    }
  );
}

function changeActExamineDetail() {
  changeActExamine(model);
}

/* 选择行程模块 */
function JourneyList() {
  var model = [];
  var link = httpService.apiLineListIndex;
  var nextPage = '';
  var activeElment = null;
  var pageContent = null;
  var tabElement = null;
  var loading = false; // 加载flag
  var isSortForDistance = true;

  /**  绑定事件函数  **/

  /* 绑定二级导航栏目 */
  function bindEvent() {
    // 帮点下拉刷新，加载更多事件
    pageContent = $$('.journey-list-page .pull-to-refresh-content');
    pageContent.on('refresh', refreshList);
    pageContent.on('infinite', infiniteList);
    // Tab切换事件
    tabElement = $$('.tmm-journey-subnavbar .subnav-item');
    activeElment = $$(tabElement[0]);
    tabElement.on('click', changeTab);
  }

  /* 绑定下拉菜单 加载更多*/
  function bindSelectedEvent() {
    $$('#tmm-journey-popularity').on('click', journeyPopularitySelect);
    $$('#tmm-journey-distance').on('click', journeyDistanceSelect);

  }

  /** 触发事件函数 **/

  // 刷新页面
  function refreshList() {

    getPageDate(link, renderList);

  }

  // 加载更多
  function infiniteList() {
    // alert(nextPage)
    if (nextPage) {
      if (loading) return;
      loading = true;
      getPageDate(nextPage, function(data) {
        model.list_data = model.list_data.concat(data.list_data);
        nextPage = data.page.next;

        addMoreList(data)
        loading = false;
      });

    }
  }

  function backfromPage() {
    var address = bridge.fire('selectDistiantion');
    if (address) {
      link = httpService.apiLineList;
      isSortForDistance = true;
      $$(tabElement[0]).find('span').html(address);
      tmmApp.pullToRefreshTrigger(pageContent);
      $$(document).off('pageAfterBack', '.page[data-page="select-distination"]', backfromPage);
      $$(document).off('pageAfterBack', '.page[data-page="select-search-distination"]', backfromPage);
    }
  }

  // Tab切换
  function changeTab(ev) {
    var self = $$(this);

    if ($$(this).hasClass('distance')) {
      // bridge.add(refreshList);
      $$(document).on('pageAfterBack', '.page[data-page="select-distination"]', backfromPage);
      $$(document).on('pageAfterBack', '.page[data-page="select-search-distination"]', backfromPage);

      selectDistination.init();
    } else if ($$(this).hasClass('popularity')) {
      var popoverHTML = '<div class="popover journey-subnavbar-popover">' +
        '<div class="popover-inner">' +
        '<div class="list-block">' +
        '<ul>' +
        '<li><a href="#" id="tmm-journey-popularity" class="list-button item-link">按人气</a></li>' +
        '<li><a href="#" id="tmm-journey-distance" class="list-button item-link">按距离</a></li>' +
        '</ul>' +
        '</div>' +
        '</div>' +
        '</div>';
      tmmApp.popover(popoverHTML, self);
      bindSelectedEvent();
    }
    activeElment.removeClass('active');
    activeElment = self;
    activeElment.addClass('active');
  }

  // 点击距离排序触发函数
  function journeyDistanceSelect() {
    isSortForDistance = true;
    $$(tabElement[1]).find('span').html('按距离');
    link = httpService.apiLineList;
    tmmApp.pullToRefreshTrigger(pageContent);
  }

  // 点击按照人气排序
  function journeyPopularitySelect() {
    isSortForDistance = false;
    $$(tabElement[1]).find('span').html('按人气');
    link = httpService.apiPopularityList;
    tmmApp.pullToRefreshTrigger(pageContent);
  }


  /** 其他函数 **/

  /* 获取数据 */
  function getPageDate(url, successFn) {

    httpService.get(
      url,
      function(dataRes, statusCode) {

        tmmApp.hideIndicator();
        if (dataRes.status == 1) {
          
          successFn(dataRes.data);

        } else {
          tmmApp.alert('网络超时，请重试', '');
        }

        setTimeout(function() {
          tmmApp.pullToRefreshDone();

        }, 250);
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');

        setTimeout(function() {
          tmmApp.pullToRefreshDone();

        }, 250);
      }
    );
  }



  // 加载更多渲染页面
  function addMoreList(model) {
    for (var x in model.list_data) {
      model.list_data[x].isSortForDistance = isSortForDistance;
    }
    var output = appFunc.renderTpl(journeyListItemTpl, model);

    $$('.journey-list-page .journery-list').append(output);
  }

  // 重新渲染数据
  function renderList(data) {
    tmmApp.closeModal();

    model = data;
    nextPage = data.page.next;

    for (var x in model.list_data) {
      data.list_data[x].isSortForDistance = isSortForDistance;
    }
    var output = appFunc.renderTpl(journeyListItemTpl, data);

    $$('.journey-list-page .journery-list').html(output);
  }


  return {
    getList: function(seekfunTitle, seekfunChangeLine) {

      tmmApp.showIndicator();
      link = httpService.apiLineList;
      getPageDate(link, function(data) {
        model = data;
        nextPage = data.page.next;
        for (var x in model.list_data) {
          model.list_data[x].isSortForDistance = isSortForDistance;
        }
        model.seekfunTitle = seekfunTitle;
        model.seekfunChangeLine = seekfunChangeLine;
        var output = appFunc.renderTpl(journeyListTpl, model);
        tmmApp.getCurrentView().router.load({
          content: output
        });
        bindEvent();
      })

    },

  }

}

/* 支付选择页面模块 */
function Payment() {
  function bindEvent() {
    $$('#create-act-pay-type .pay-type-pos').on('click', selectPayment);
    $$('.create-act-pay-type-back').on('click', goJourneyPage);
  }

  function goJourneyPage() {
    tmmApp.getCurrentView().router.back({
      force: true,
      pageName: 'journey-list'
    })
  }

  function selectPayment() {
    payType = $$(this).attr('data-type');
    seekfunFormModel.goPage();
  }

  return {
    goPage: function() {
      tmmApp.getCurrentView().router.load({
        content: paymentTpl
      });

      bindEvent();
    }
  }
}

/* 提交觅趣觅趣表单模块 */
function SeekfunForm() {
  var line_start_time = '';
  var line_end_time = '';

  function clearData() {
    goOffTime = '';
    lineId = '';
    payType = '';
    line_start_time = '';
    line_end_time = '';
  }

  function bindEvent() {
    $$('#line_create_act').on('click', createAct);
  }

  function selectStartAndEndTime() {
    // 出游日期
    var goTimeDate = goOffTime;
    var nowDate = new Date();
    var preDay = nowDate.setDate(nowDate.getDate() - 1);
    var _this = $$('#create-act-info .calendar-infotime');
    // 记录多选日期的个数
    var num = 0;
    // 记录出游时间和设置的报名出游两个日期
    var dateStartArr = [];
    // 记录所选择的两个日期
    var dateArr = [];
    // 临时存入显示的字符串格式，如 "2015.12.05-12.07（共2晚）"
    var oldStr = '';
    var str = '';
    // 初始化日期控件
    var calenderObj = tmmApp.calendar({
      input: _this,
      monthNames: appFunc.monthNames(),
      dayNames: appFunc.dayNames(),
      dayNamesShort: appFunc.dayNamesShort(),
      dateFormat: 'yyyy.mm.dd',
      multiple: true,
      minDate: preDay,
      cssClass: 'tmm-hoteldate-picker-calendar',
      closeByOutsideClick: false,
      scrollToInput: false,
      onOpen: function() {
        calenderObj.setValue([]);
        appFunc.showToastBootom('请选择报名开始日期');

        if (goTimeDate !== "") {
          dateStartArr.push(goTimeDate);
        }
      },
      onDayClick: function(p, dayContainer, year, month, day) {

        calenderObj.setValue([]);

        if (goTimeDate !== "") {
          dateStartArr.push(appFunc.dateFormt(year, month, day));
          var difStart = appFunc.hotelDay(dateStartArr);
          
          if (difStart > 0) {
            setTimeout(function() {
              tmmApp.alert('报名开始日期必须小于出游日期');
              _this.val(oldStr);
            }, 0);
            dateStartArr = [];
            calenderObj.close();
          } else {
            num++;
          }
        } else {
          num++;
        }

        if (num == 1) {
          line_start_time = appFunc.dateFormt(year, month, day);
          appFunc.hideToast();
          appFunc.showToastBootom('请选择报名结束日期');
          dateArr.push(appFunc.dateFormt(year, month, day));
          str += appFunc.dateFormtDot(year, month, day, 1);
        }
        if (num == 2) {
          line_end_time = appFunc.dateFormt(year, month, day);
          setTimeout(function() {

            dateArr.push(appFunc.dateFormt(year, month, day));
            var dif = appFunc.hotelDay(dateArr);
            if (dif <= 0) {
              tmmApp.alert('结束日期必须晚于开始日期');
              _this.val(oldStr);
            } else {
              str += appFunc.dateFormtDot(year, month, day, 3);
              oldStr = str;
              _this.val(str);
              dateArr.push(dif);
            }
            num = 0;
            str = '';
            dateArr = [];
            dateStartArr = [];
          }, 0);
          calenderObj.close();
        }
      },
      onClose: function() {
        appFunc.hideToast();
      }
    });

  }

  function createAct() {
    var actData = {
      "actives_thrand": 0, //线路ID 点为0
      "is_insurance": 1, //保险1=确认0=取消
      "shops_info": '', //觅趣对应点的信息====多点
      "Actives": { //觅趣信息
        "actives_type": 0, //0=旅游觅趣1=农产品觅趣
        "tour_type": 1, //-1=农产品觅趣,0=多个点,1=一条线
        "number": 0, //觅趣数量
        "price": 0.00, //觅趣单价(农产品传值)
        "tour_price": 0.00, //服务费
        "remark": "", //旅游觅趣备注
        "start_time": "", //报名开始日期
        "end_time": "", //报名截止时间
        "go_time": '', //出游日期     没填传 空值
        "is_organizer": 1, //是否组织者 1=是 0=不是
        "is_open": 1, //是否开放显示 1=开放 0=不开放
        "pay_type": 0 //付款方式 0=AA付款 1=全额付款
      },
      "Shops": {
        "name": "" //商品名称
      },
      "Pro": { //选中项目  线路ID不为0时，可传空
      },
      "ProFare": { //选中项目对应价格  线路ID不为0时，可传空
      }
    };

    var tour_price = '0.00';
    var is_open = 1;
    var userInfo = JSON.parse(appFunc.getLocalUserInfo());
    var is_organizer = userInfo.is_organizer;
    if (userInfo.is_organizer === '1' && userInfo.organizer_status !== '0') { //组织者
      tour_price = $$('#tour_price').val();
    }

    var name = $$('#name').val();
    var number = $$('#number').val();
    var isChecked = $$('#launch-open').prop('checked');
    var remark = $$('.act-edit .act-edit-content').val();
    if (isChecked) {
      is_open = 0;
    } else {
      is_open = 1;
    }

    if (name === '') {
      tmmApp.alert('觅趣名称不能为空');
      return;
    }
    if (line_start_time === '') {
      tmmApp.alert('请选择觅趣开始时间');
      return;
    }
    if (line_end_time === '') {
      tmmApp.alert('请选择觅趣结束时间');
      return;
    }
    if (number === '') {
      tmmApp.alert('觅趣参与人数不能为空');
      return;
    }
    if (tour_price === '') {
      tmmApp.alert('服务费不能为空');
      return;
    }
    if (remark === '') {
      tmmApp.alert('觅趣简介不能为空');
      return;
    }


    actData.actives_thrand = lineId;
    actData.Actives.number = number;
    actData.Actives.tour_price = tour_price;
    actData.Actives.start_time = line_start_time;
    actData.Actives.end_time = line_end_time;
    actData.Actives.is_organizer = is_organizer;
    actData.Actives.is_open = is_open;
    actData.Actives.pay_type = payType;
    actData.Actives.go_time = goOffTime;
    actData.Actives.remark = remark;

    actData.Shops.name = name;
    
    // 创建旅游觅趣（线）
    tmmApp.showPreloader('正在提交中...');

    httpService.actCreate(
      actData,
      function(dataRes, statusCode) {

        if (dataRes.status == 1) {
          
          Activity.refreshActivityList();
          var oDiv = document.createElement('div');
          oDiv.setAttribute('data-link', dataRes.data.link);
          oDiv.type = 2;
          goSeekfunDetail.call(oDiv);

          clearData();
        } else {
          if (dataRes.form) {
            for (var msgName in dataRes.form) {
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

      }
    );
  }

  return {
    goPage: function() {
      var data = {
        'userInfo': JSON.parse(appFunc.getLocalUserInfo())
      };
      var output = appFunc.renderTpl(act_setting_tpl, data);
      tmmApp.getCurrentView().router.load({
        content: output
      });

      var createInfoTime = $$('#create-act-info .calendar-infotime');
      selectStartAndEndTime();
      bindEvent();
    }
  }
}

var seekfunDetailLink = '';

/* 觅镜详情页面 */
function goSeekfunDetail() {
  var link = $$(this).attr('data-link');
  var type = 1;
  type = this.type ? this.type : type;
  seekfunDetailLink = link;
  tmmApp.showIndicator();

  httpService.get(link, function(data) {

    tmmApp.hideIndicator();
    if (data.status == 1) {
      model = data.data;
      orderListModel = null;
      renderSeekfunDetail(type);
      
    } else {
      tmmApp.alert('没有相关数据', '');
    }

  }, function(data) {
    tmmApp.hideIndicator();
    tmmApp.alert('网络错误', '');
  })
}

//获取觅趣详情页的信息
function goSeekfunDetailModel() {
  httpService.get(seekfunDetailLink, function(data) {
    tmmApp.hideIndicator();
    if (data.status == 1) {
      model = data.data;
    } else {
      tmmApp.alert('没有相关数据', '');
    }

  }, function(data) {
    tmmApp.hideIndicator();
    tmmApp.alert('网络错误', '');
  })
}

//获取觅趣详情页的信息
function changeActExamineList(actId) {
  var actLink = $$(this).attr('data-link');
  httpService.get(actLink, function(data) {
    tmmApp.hideIndicator();
    if (data.status == 1) {
      changeActExamine(data.data);
    } else {
      tmmApp.alert('没有相关数据', '');
    }

  }, function(data) {
    tmmApp.hideIndicator();
    tmmApp.alert('网络错误', '');
  })
}

function getSeekfunData(link) {
  httpService.get(link, function(data) {
    tmmApp.hideIndicator();
    if (data.status == 1) {
      model = data.data;
      orderListModel = null;
    }
  }, function(data) {
    tmmApp.hideIndicator();
    tmmApp.alert('网络错误', '');
  })
}

/**
 * 返回我发起的觅趣模块
 * @return {[type]} [description]
 */
function goBackMyActivityPage() {
  var type = $$(this).attr('data-type');

  if (type == 1) {
    tmmApp.getCurrentView().router.back();
  } else if (type == 2) {
    tmmApp.getCurrentView().router.back({
      force: true,
      pageName: 'my-activity'
    })

  }

}

/*渲染觅镜详情页面*/
function renderSeekfunDetail(type) {
  /*pay_type = $$(this).attr("data-type");
  var data = {
    'userInfo':JSON.parse(appFunc.getLocalUserInfo())
  };*/
  model.userInfo = JSON.parse(appFunc.getLocalUserInfo());
  model.type = type;
  var output = appFunc.renderTpl(seekfunDetail, model);
  tmmApp.getCurrentView().router.load({
    content: output
  });
  //if(model.set_go_time.link !=''){
  if ((model.audit_status.value == '1' && model.actives_status.value == '0' && model.shops_status.value == '1' && model.set_go_time.link != '') || (model.audit_status.value == '1' && model.actives_status.value == '1' && model.shops_status.value == '1' && model.set_go_time.link != '') || (model.audit_status.value == '1' && model.actives_status.value == '2' && model.shops_status.value == '1' && model.set_go_time.link != '')) {
    $$('.tmm-set-act-date').addClass("tmm-add-act-date");
  }
  editActGotime(); //修改出游时间
  editEnrolldate(); //修改觅趣报名时间
  if ($$("div").find('.tmm-set-act-date').hasClass("tmm-add-act-date")) {
    addActgoDate(); //如果没有设置出游日期，设置 
  }
}


/*配置日历控件*/
function showCalendar() {
    
  var monthNames = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    dayNames = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort = ['日', '一', '二', '三', '四', '五', '六'];

  var nowDate = new Date();
  var preDay = nowDate.setDate(nowDate.getDate() - 1);
  var calendarInline = tmmApp.calendar({
    container: '#calendar-inline-container',
    dayNames: dayNames,
    minDate: preDay,
    dayNamesShort: dayNamesShort,
    toolbarTemplate: '<div class="calendar-custom-toolbar">' +
      '<div class="toolbar-inner">' +
      '<div class="left">' +
      '<a href="#" class="link icon-only"><i class="icon icon-back"></i></a>' +
      '</div>' +
      '<div class="center"></div>' +
      '<div class="right">' +
      '<a href="#" class="link icon-only"><i class="icon icon-forward"></i></a>' +
      '</div>' +
      '</div>' +
      '</div>',
    onOpen: function(p) {
      $$('.calendar-custom-toolbar .center').text(p.currentYear + '年' + monthNames[p.currentMonth]);
      $$('.calendar-custom-toolbar .left .link').on('click', function() {
        calendarInline.prevMonth();
      });
      $$('.calendar-custom-toolbar .right .link').on('click', function() {
        calendarInline.nextMonth();
      });
    },
    onMonthYearChangeStart: function(p) {
      $$('.calendar-custom-toolbar .center').text(p.currentYear + '年' + monthNames[p.currentMonth]);
    },
    onDayClick: function(p, dayContainer, year, month, day) {

      goOffTime = appFunc.dateFormt(year, month, day)

    }
  });

}

/* 选项卡切换 */
function showTabs(ev) {
  $$(this).find('span').removeClass('active');
  $$(ev.target).addClass('active');
  var link = '';

  if ($$(ev.target).hasClass('journery')) {
    $$('.seekfun-detail-page .join-block').css('display', 'none');
    $$('.seekfun-detail-page .intro-block').css('display', 'none');
    $$('.seekfun-detail-page .journery-block').css('display', 'block');
  } else if ($$(ev.target).hasClass('join')) {
    if (model.actives_pay_type.value === '1') {
      link = model.actives_info.attend_list;
    } else if (model.actives_pay_type.value === '0') {
      link = model.actives_info.order_list;
    }
    if (orderListModel === null && !!link) {

      httpService.get(link, function(data) {
        if (data.status == 1) {

          orderListModel = data.data;
          model.orderListModel = orderListModel;
          joinPeopleTpl();

        } else {

        }
        $$('.seekfun-detail-page .intro-block').css('display', 'none');
        $$('.seekfun-detail-page .journery-block').css('display', 'none');
        $$('.seekfun-detail-page .join-block').css('display', 'block');
      }, function(data) {
        $$('.seekfun-detail-page .intro-block').css('display', 'none');
        $$('.seekfun-detail-page .journery-block').css('display', 'none');
        $$('.seekfun-detail-page .join-block').css('display', 'block');
      })
    } else {
      $$('.seekfun-detail-page .intro-block').css('display', 'none');
      $$('.seekfun-detail-page .journery-block').css('display', 'none');
      $$('.seekfun-detail-page .join-block').css('display', 'block');
    }

  } else if ($$(ev.target).hasClass('intro')) {
    $$('.seekfun-detail-page .join-block').css('display', 'none');
    $$('.seekfun-detail-page .journery-block').css('display', 'none');
    $$('.seekfun-detail-page .intro-block').css('display', 'block');
  }
}

/* 加载更多的div */
var loadMoreDiv = null;
/** @type {String} 参与人数加载更多的连接 */
var loadMoreJoinLink = '';

/*参与人html页面*/
function joinPeopleTpl() {
  loadMoreDiv = document.createElement('div');
  loadMoreDiv.className = 'loadmore';
  loadMoreDiv.innerHTML = '点击加载更多';
  loadMoreDiv.removeEventListener('click', getMoreJoinData, false);
  loadMoreDiv.addEventListener('click', getMoreJoinData, false);
  var html = '<div class="join-first-item">' +
    '{{#js_compare "this.actives_pay_type.value === \'1\'"}}' +
    //代付 A
    '<p class="txt">已参与人数：<span>{{orderListModel.people}}成人  {{orderListModel.children}}儿童</span></p>' +
    '{{/js_compare}}' +
    //自费 AA
    '{{#js_compare "this.actives_pay_type.value === \'0\'"}}' +
    '<p class="txt">已参与人数：<span>{{js "this.actives_info.number.value - this.actives_info.order_number.value"}}/{{actives_info.number.value}}</span></p>' +
    '<p class="txt">费用总额：<span>{{actives_info.total.value}}元</span></p>' +
    '{{/js_compare}}' +

    '<span class="share-invite invite">邀请好友加入</span>' +

    '</div>' +
    //代付 A
    '{{#js_compare "this.actives_pay_type.value === \'1\'"}}' +
    '<div class="join-list">' +
    '{{#each orderListModel.list_data}}' +
    //主要联系人
    '{{#js_compare "this.is_main === 1"}}' +
    '<div class="join-item" style="margin:0px;">' +
    '<div class="item-top item-pepole">' +
    '<span class="time">主要联系人</span>' +
    '</div>' +
    '<div class="item-inner">' +
    '<p class="tit"><span class="name">{{this.name}}</span></p>' +
    '<p class="describe"><span class="join-num">手机：{{this.phone}}</p>' +
    '</div>' +
    '</div>' +
    '{{/js_compare}}' +
    //联系人列表
    '{{#js_compare "this.is_main === 0"}}' +
    '<div class="join-item" style="margin:0px;">' +
    '<div class="item-top item-pepole">' +
    '<span class="time">{{this.add_time}}</span><span data-link="{{this.deletelink}}" data-name="{{this.name}}" class="delete-join-people">删除</span>' +
    '</div>' +
    '<div class="item-inner">' +
    '<p class="tit"><span class="name">{{this.name}}</span><span class="phone">{{this.phone}}</span></p>' +
    '<p class="describe"><span class="join-num">参与人数：{{this.people}}成人</span>{{#js_compare "this.number - this.people > \'0\'"}}<span class="order-price">{{js "this.number - this.people"}}儿童</span>{{/js_compare}}</p>' +
    '</div>' +
    '</div>' +
    '{{/js_compare}}' +
    '{{/each}}' +
    '</div>'+
    '{{/js_compare}}'+
    //自费 AA
    '{{#js_compare "this.actives_pay_type.value === \'0\'"}}' +
    '<div class="join-list">' +
    '{{#each orderListModel.list_data}}' +
    '<div class="join-item">' +
    '<div class="item-top item-pepole">' +
    '<span class="time">{{this.add_time}}</span><span class="status green">{{this.status.order_status.name}}</span>' +
    '</div>' +
    '<div class="item-inner">' +
    '<p class="tit"><span class="name">{{this.main_retinue.name}}</span><span class="phone">{{this.main_retinue.phone}}</span></p>' +
    '<p class="describe"><span class="join-num">参与人数：{{this.user_go_count}}人</span><span class="order-price">订单金额：{{this.order_price}}元</span></p>' +
    '</div>' +
    '</div>' +
    '{{/each}}' +
    '</div>'+
    '{{/js_compare}}';


  var output = appFunc.renderTpl(html, model);
  console.log("活动加载出行人员", model);
  $$('.seekfun-detail-page .join-block').html(output).append(loadMoreDiv);

  loadMoreJoinLink = model.orderListModel.page.next;
  if (loadMoreJoinLink) {
    loadMoreDiv.style.display = 'block';
  } else {
    loadMoreDiv.style.display = 'none';
  }

  $$('.share-invite').off('click', shareMsg);
  $$('.share-invite').on('click', shareMsg);
  $$('.delete-join-people').on('click', deletePepole);
  $$('.delete-join-people').on('click', deletePepole);

  // myApp.detachInfiniteScroll(container)
  // tmmApp.detachInfiniteScroll('.seekfun-detail-page .join-block');
  // tmmApp.attachInfiniteScroll('.seekfun-detail-page .join-block');
}

// 分享
function shareMsg() {
  var link = httpService.apiUrl + '/index.php?r=site/share&share=' + model.shops.value;
  appFunc.shareMsg(model.name, '来自田觅觅的觅趣分享', model.image, link);
}

// 删除参与人
function deletePepole() {
  var self = this;
  var link = $$(self).attr('data-link');
  var name = $$(self).attr('data-name');
  tmmApp.confirm("确认删除参与人"+ name +"吗？", function() {
    httpService.get(link, function(data) {
      if (data.status == 1) {
        $$(self).parent().parent().remove();
      }
    }, function(data) {

    });
  })

}

/**
 * 参与人加载更多方法
 * @return {[type]} [description]
 */
function getMoreJoinData(link) {
  var itemHtml = '{{#each list_data}}' +
    '<div class="join-item">' +
    '<div class="item-top">' +
    '<span class="time">{{this.add_time}}</span><span class="status green">{{this.status.order_status.name}}</span>' +
    '</div>' +
    '<div class="item-inner">' +
    '<p class="tit"><span class="name">{{this.main_retinue.name}}</span><span class="phone">{{this.main_retinue.phone}}</span></p>' +
    '<p class="describe"><span class="join-num">参与人数：{{this.user_go_count}}人</span><span class="order-price">订单金额：{{this.order_price}}元</span></p>' +
    '</div>' +
    '</div>' +
    '{{/each}}';
    loadMoreDiv.innerHTML = '努力加载中...';
    // $$('.seekfun-detail-page .join-block .join-list').append();
    httpService.get(link, function(data) {
        if (data.status === 1) {
            var output = appFunc.renderTpl(itemHtml, data.data);
            $$('.seekfun-detail-page .join-block .join-list').append(output);
            loadMoreJoinLink = data.data.page.next;
        }
        loadMoreDiv.innerHTML = '点击加载更多';
    }, function(data) {
        loadMoreDiv.innerHTML = '点击加载更多';
    })
}


/*觅趣列表确定出游日期*/
function activityGoTime(ele) {
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

      var goTime = appFunc.dateFormt(year, month, day);
      setTimeout(function() {
        tmmApp.confirm('出游日期确认为：' + goTime, '', function() {
          var data = {
            "Actives[go_time]=": goTime
          };
          httpService.setActityGoTime(
            goTimeLink,
            data,
            function(dataRes, statusCode) {
              if (dataRes.status == 1) {
                tmmApp.alert('出游日期确认成功!');
                Activity.refreshActivityList();
                if ($$("div").find('.tmm-set-act-date').hasClass("tmm-add-act-date")) {
                  $$('.normal-group').find(".tmm-set-act-date").remove();
                  $$('.tmmGoTime').append('<div class="normal-cell">' + goTime + '</div>');
                }

              } else {
                if (dataRes.form) {
                  for (var msgName in dataRes.form) {
                    tmmApp.alert(dataRes.form[msgName][0]);
                    break;
                  }
                } else {
                  tmmApp.alert('网络超时，请重试');
                }
              }
            },
            function(dataRes, statusCode) {
              tmmApp.alert('网络超时，请重试');
            });
        });
        /*if($$('body').find(".modal-overlay")){
          $$('body').find(".modal-overlay").remove();
        }*/
      }, 80);
    }

  });
}

/*显示选择时间时的遮罩层*/
function showModalList() {
  $$('body').find(".modal-overlay").remove();
  if ($$('body').find(".modal-overlay").hasClass('tmm-picker-calendar')) {
    $$(".modal-overlay").addClass("modal-overlay-visible");
  } else {
    $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-picker-calendar"></div>');
  }
}

var self = null;

/*显示修改觅趣名称页面*/
function editActNamePage() {
  self = this;
  var data = {
    'name': model.name
  };
  var output = appFunc.renderTpl(editActNameTpl, data);
  tmmApp.getCurrentView().router.load({
    content: output
  });
}

function editActName() {
  var editActId = model.actives_id; //觅趣的id
  var name = $$('#name').val();
  if (name == '') {
    tmmApp.alert('觅趣名称不能为空');
    return;
  }
  var editUrl = "/index.php?r=api/actives/UpdateShopsName&id=";
  var data = {
    "Shops": {
      "name": name //商品名称
    }
  };
  httpService.editActInfo(
    editUrl,
    data,
    editActId,
    function(dataRes, statusCode) {
      if (dataRes.status == 1) {
        tmmApp.alert('修改觅趣名称成功!');
        Activity.refreshActivityList();
        getSeekfunData(seekfunDetailLink);
        tmmApp.getCurrentView().router.back();
        self.innerHTML = name;
        goSeekfunDetailModel();
      } else {
        if (dataRes.form) {
          for (var msgName in dataRes.form) {
            tmmApp.alert(dataRes.form[msgName][0]);
            break;
          }
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      }
    },
    function(dataRes, statusCode) {
      tmmApp.alert('网络超时，请重试');
    }
  );
}

/*显示修改觅趣参与人数页面*/

function editActNumPage() {
  self = this;
  var data = {
    'num': model.actives_info.number.value
  };
  var output = appFunc.renderTpl(editActNumTpl, data);
  tmmApp.getCurrentView().router.load({
    content: output
  });
}

function editActNum() {
  var editActId = model.actives_id; //觅趣的id
  var num = $$('#num').val();
  if (num == '') {
    tmmApp.alert('觅趣参与人数不能为空');
    return;
  }
  var editUrl = "/index.php?r=api/actives/UpdateNumber&id=";

  var data = {
    "Actives": {
      "number": num //觅趣数量
    }
  };
  httpService.editActInfo(
    editUrl,
    data,
    editActId,
    function(dataRes, statusCode) {
      if (dataRes.status == 1) {
        tmmApp.alert('修改觅趣参与人数成功!');
        Activity.refreshActivityList();
        getSeekfunData(seekfunDetailLink);
        tmmApp.getCurrentView().router.back();
        self.innerHTML = num + '人';
        goSeekfunDetailModel();
      } else {
        if (dataRes.form) {
          for (msgName in dataRes.form) {
            tmmApp.alert(dataRes.form[msgName][0]);
            break;
          }
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      }
    },
    function(dataRes, statusCode) {
      tmmApp.alert('网络超时，请重试');
    }
  );
}

/*显示修改服务费页面*/

function editActTourPricePage() {
  self = this;
  var data = {
    'tourPrice': model.actives_info.tour_price.value
  };
  var output = appFunc.renderTpl(editActTourPriceTpl, data);
  tmmApp.getCurrentView().router.load({
    content: output
  });
}

function editActTourPrice() {
  var editActId = model.actives_id; //觅趣的id
  var tour_price = $$('#tour-price').val();
  if (tour_price == '') {
    tmmApp.alert('服务费不能为空');
    return;
  }
  var editUrl = "/index.php?r=api/actives/UpdateTourPrice&id=";

  var data = {
    "Actives": {
      "tour_price": tour_price //服务费
    }
  };
  httpService.editActInfo(
    editUrl,
    data,
    editActId,
    function(dataRes, statusCode) {
      if (dataRes.status == 1) {
        tmmApp.alert('修改服务费成功!');
        Activity.refreshActivityList();
        getSeekfunData(seekfunDetailLink);
        tmmApp.getCurrentView().router.back();
        self.innerHTML = tour_price + '元/人';
        goSeekfunDetailModel();
      } else {
        if (dataRes.form) {
          for (msgName in dataRes.form) {
            tmmApp.alert(dataRes.form[msgName][0]);
            break;
          }
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      }
    },
    function(dataRes, statusCode) {
      tmmApp.alert('网络超时，请重试');
    }
  );
}
/*编辑付款方式*/
function editActPay() {
  var buttons = [{
    text: '选择付款方式',
    color: 'title',
  }, {
    text: '代付',
    color: 'payYellow',
    onClick: function() {
      editActPayType(1);
    }
  }, {
    text: '自费',
    color: 'payGreen',
    onClick: function() {
      editActPayType(0);
    }
  }];
  tmmApp.actions(buttons);

  $$(".actions-modal-group").addClass("tmmAPP-pay");
  var isRemove = $$(".actions-modal").hasClass('modal-out');
  if (isRemove) {
    $$(".actions-modal-group").removeClass('tmmAPP-pay');
  }
}

/*编辑付款方式提交数据*/
function editActPayType(payType) {
  var editActId = model.actives_id; //觅趣的id
  var editUrl = "/index.php?r=api/actives/UpdatePayType&id=";

  var data = {
    "Actives": {
      "pay_type": payType //付款方式 0=AA付款 1=全额付款
    }
  };
  httpService.editActInfo(
    editUrl,
    data,
    editActId,
    function(dataRes, statusCode) {
      if (dataRes.status == 1) {
        tmmApp.alert('修改付款方式成功!');
        Activity.refreshActivityList();
        getSeekfunData(seekfunDetailLink);
        if (payType == 1) {
          document.getElementById("tmm-edit-act-pay").innerHTML = "代付"
        } else if (payType == 0) {
          document.getElementById("tmm-edit-act-pay").innerHTML = "自费"
        }
        goSeekfunDetailModel();
      } else {
        if (dataRes.form) {
          for (msgName in dataRes.form) {
            tmmApp.alert(dataRes.form[msgName][0]);
            break;
          }
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      }
    },
    function(dataRes, statusCode) {
      tmmApp.alert('网络超时，请重试');
    }
  );
}

/*编辑觅趣公开性*/
function editActOpen() {
  var buttons = [{
    text: '选择觅趣公开性',
    color: 'title',
  }, {
    text: '私密',
    color: 'payYellow',
    onClick: function() {
      editActOpenType(0);
    }
  }, {
    text: '公开',
    color: 'payGreen',
    onClick: function() {
      editActOpenType(1);
    }
  }];
  tmmApp.actions(buttons);

  $$(".actions-modal-group").addClass("tmmAPP-pay");
  var isRemove = $$(".actions-modal").hasClass('modal-out');
  if (isRemove) {
    $$(".actions-modal-group").removeClass('tmmAPP-pay');
  }
}

/*编辑觅趣公开性提交数据*/
function editActOpenType(isOpen) {
  var editActId = model.actives_id; //觅趣的id
  var editUrl = "/index.php?r=api/actives/UpdateIsOpen&id=";

  var data = {
    "Actives": {
      "is_open" : isOpen   //是否开放显示 1=开放 0=不开放
    }
  };
  httpService.editActInfo(
    editUrl,
    data,
    editActId,
    function(dataRes, statusCode) {
      if (dataRes.status == 1) {
        tmmApp.alert('修改觅趣公开性成功!');
        Activity.refreshActivityList();
        getSeekfunData(seekfunDetailLink);
        if (isOpen == 0) {
          document.getElementById("tmm-edit-act-open").innerHTML = "私密";
        } else if (isOpen == 1) {
          document.getElementById("tmm-edit-act-open").innerHTML = "公开";
        }
        goSeekfunDetailModel();
      } else {
        if (dataRes.form) {
          for (msgName in dataRes.form) {
            tmmApp.alert(dataRes.form[msgName][0]);
            break;
          }
        } else {
          tmmApp.alert('网络超时，请重试');
        }
      }
    },
    function(dataRes, statusCode) {
      tmmApp.alert('网络超时，请重试');
    }
  );
}

//修改出游时间
function editActGotime() {
  var editActId = model.actives_id; //觅趣的id
  var goTime = "";
  var editUrl = "/index.php?r=api/actives/UpdateGoTime&id=";
  var nowDate = new Date();
  var preDay = nowDate.setDate(nowDate.getDate() - 1);

  tmmApp.calendar({
    input: '#tmm-edit-act-goDate',
    closeOnSelect: true,
    minDate: preDay,
    monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
    dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
    onDayClick: function(p, dayContainer, year, month, day) {
      var goTime = appFunc.dateFormt(year, month, day);
      setTimeout(function() {
        tmmApp.confirm('出游日期确认修改为：' + goTime, '', function() {
          var data = {
            "Actives": {
              "go_time": goTime //付款方式 0=AA付款 1=全额付款
            }
          };
          httpService.editActInfo(
            editUrl,
            data,
            editActId,
            function(dataRes, statusCode) {
              if (dataRes.status == 1) {
                editGoTime = goTime;
                tmmApp.alert('修改出游日期成功!');
                Activity.refreshActivityList();
                getSeekfunData(seekfunDetailLink);
                document.getElementById("tmm-edit-act-goDate").innerHTML = goTime;
                goSeekfunDetailModel();
              } else {
                if (dataRes.form) {
                  for (var msgName in dataRes.form) {
                    tmmApp.alert(dataRes.form[msgName][0]);
                    break;
                  }
                } else {
                  tmmApp.alert('网络超时，请重试');
                }
              }
            },
            function(dataRes, statusCode) {
              tmmApp.alert('网络超时，请重试');
            }
          );
        });
      }, 80);
    }

  });
}

//修改觅趣报名时间
function editEnrolldate() {
  var edit_line_start_time = '';
  var edit_line_end_time = '';
  // 出游日期
  var goTimeDate = '';
  if (editGoTime !== '') {
    goTimeDate = editGoTime;
  } else {
    goTimeDate = model.actives_time.go_time;
  }

  var nowDate = new Date();
  var preDay = nowDate.setDate(nowDate.getDate() - 1);
  var _this = $$('#seekfun-detail #tmm-edit-act-enroll');
  var num = 0;
  var dateStartArr = [];
  var dateArr = [];
  var oldStr = '';
  var str = '';
  var calenderObj = tmmApp.calendar({
    input: _this,
    monthNames: appFunc.monthNames(),
    dayNames: appFunc.dayNames(),
    dayNamesShort: appFunc.dayNamesShort(),
    dateFormat: 'yyyy.mm.dd',
    multiple: true,
    minDate: preDay,
    cssClass: 'tmm-hoteldate-picker-calendar',
    closeByOutsideClick: false,
    scrollToInput: false,
    onOpen: function() {
      calenderObj.setValue([]);
      appFunc.showToastBootom('请选择报名开始日期');

      if (goTimeDate !== "") {
        dateStartArr.push(goTimeDate);
      }
    },
    onDayClick: function(p, dayContainer, year, month, day) {

      calenderObj.setValue([]);

      if (goTimeDate !== "") {
        dateStartArr.push(appFunc.dateFormt(year, month, day));
        var difStart = appFunc.hotelDay(dateStartArr);

        if (difStart >= 0) {
          setTimeout(function() {
            tmmApp.alert('报名开始日期必须小于出游日期');
            _this.val(oldStr);
          }, 0);
          dateStartArr = [];
          calenderObj.close();
        } else {
          num++;
        }
      } else {
        num++;
      }

      if (num == 1) {
        edit_line_start_time = appFunc.dateFormt(year, month, day);
        appFunc.hideToast();
        appFunc.showToastBootom('请选择报名结束日期');
        dateArr.push(appFunc.dateFormt(year, month, day));
        str += appFunc.dateFormtDot(year, month, day, 1);
      }
      if (num == 2) {
        edit_line_end_time = appFunc.dateFormt(year, month, day);
        setTimeout(function() {

          dateArr.push(appFunc.dateFormt(year, month, day));
          var dif = appFunc.hotelDay(dateArr);
          if (dif <= 0) {
            tmmApp.alert('结束日期必须晚于开始日期');
            _this.val(oldStr);
          } else {
            str += appFunc.dateFormtDot(year, month, day, 3);
            oldStr = str;
            _this.val(str);
            dateArr.push(dif);
            //提交数据
            tmmApp.confirm('报名日期确认修改为：' + str, '', function() {
              var editActId = model.actives_id; //觅趣的id
              var editUrl = "/index.php?r=api/actives/UpdateStartEndTime&id=";
              var data = {
                "Actives": {
                  "start_time": edit_line_start_time, //报名开始时间
                  "end_time": edit_line_end_time, //报名截止时间
                }
              };
              httpService.editActInfo(
                editUrl,
                data,
                editActId,
                function(dataRes, statusCode) {
                  if (dataRes.status == 1) {
                    tmmApp.alert('修改报名日期成功!');
                    document.getElementById("tmm-edit-act-enroll").innerHTML = edit_line_start_time + " 至 " + edit_line_end_time;
                    edit_line_start_time = '';
                    edit_line_end_time = '';
                    Activity.refreshActivityList();
                    goSeekfunDetailModel();
                  } else {
                    if (dataRes.form) {
                      for (var msgName in dataRes.form) {
                        tmmApp.alert(dataRes.form[msgName][0]);
                        break;
                      }
                    } else {
                      tmmApp.alert('网络超时，请重试');
                    }
                  }
                },
                function(dataRes, statusCode) {
                  tmmApp.alert('网络超时，请重试');
                }
              );
            });
            //提交数据结束
          }
          num = 0;
          str = '';
          dateArr = [];
          dateStartArr = [];
        }, 0);
        calenderObj.close();
      }
    },
    onClose: function() {
      appFunc.hideToast();
    }
  });


}

//如果出游日期未设置，添加
function addActgoDate() {
  var goTimeLink = $$(".tmm-add-act-date");
  activityGoTime(goTimeLink);
}

/* 到达线路详情页面 */
function goLineDeitalPage() {
  var self = $$(this);
  bridge.add('goLineDeital', function() {
    lineId = self.attr('data-id');

    paymentModel.goPage();
  });
  self.attr('data-changeline', changeLineFromPage);
  shopModule.initDetail.call(this);
}

/**
 * 去代付页面
 * @return {[type]} [description]
 */
function payActivityForA() {
    var link = $$(this).attr('data-link') + '&id=' + $$(this).attr('data-id');

}


var Activity = {
  loadActivity: function() {

    if (!appFunc.getLocalUserInfo()) {
      roleModule.redirectToLogin();
      return;
    }

    var userInfo = JSON.parse(appFunc.getLocalUserInfo());
    if (userInfo.phone === undefined || userInfo.phone == 'undefined' || userInfo.phone === '' || userInfo.phone == {}) {
      roleModule.redirectToLogin();
      return;
    }

    Activity.bindEvent();


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

          appFunc.hideToolbar();
          if ($$('#tmm-my-activity-page .activityGoTimeSel') != null) {
            $$.each($$('#tmm-my-activity-page .activityGoTimeSel'), function(index, value) {
              activityGoTime(value);
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

  refreshActivityList: function() {

    httpService.getOrderActivesList(
      '',
      function(dataRes, statusCode) {
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        activityViewModel.refreshActivityList(dataRes.data);
        if ($$('#tmm-my-activity-page .activityGoTimeSel') != null) {
          $$.each($$('#tmm-my-activity-page .activityGoTimeSel'), function(index, value) {
            activityGoTime(value);
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
          if ($$('#tmm-my-activity-page .activityGoTimeSel') != null) {
            $$.each($$('#tmm-my-activity-page .activityGoTimeSel'), function(index, value) {
              activityGoTime(value);
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
      }, 500);
    }
  },


  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '#add-actfunning',
      event: 'click',
      handler: addAct
    }, {
      element: '#myView',
      selector: '.tmm-my-activity-cancel',
      event: 'click',
      handler: appFunc.activityRefund
    }, {
      element: '#myView',
      selector: '.go-seekfun-detail',
      event: 'click',
      handler: goSeekfunDetail
    }, {
      element: '#myView',
      selector: '.skip-day .skip-btn',
      event: 'click',
      handler: skipGoOffTime
    }, {
      element: 'body',
      selector: '.tmm-seekfun-changeLine',
      event: 'click',
      handler: skipGoOffTime
    }, {
      element: '#myView',
      selector: '.seekfun-detail-page .seekfun-tabs',
      event: 'click',
      handler: showTabs
    }, {
      element: '#myView',
      selector: '#next-go-journey',
      event: 'click',
      handler: nextGoJourney
    }, {
      element: '#myView',
      selector: '#sel-pay-type',
      event: 'click',
      handler: nextGoPayment
    }, {
      element: '#myView',
      selector: '.seekfun-detail-back',
      event: 'click',
      handler: goBackMyActivityPage
    }, {
      element: '#myView',
      selector: '.select-journery-item',
      event: 'click',
      handler: goLineDeitalPage
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
    }, {
      element: '#myView',
      selector: '.activityGoTimeSel',
      event: 'click',
      handler: showModalList
    }, {
      element: '#myView',
      selector: '.payActivityMoney',
      event: 'click',
      handler: goActOrderCtrl
    },{
      element: 'body',
      selector: '#myView .tmm-add-act-date',
      event: 'click',
      handler: showModalList
    }, {
      element: 'html',
      selector: '#tmm-edit-act-goDate',
      event: 'click',
      handler: showModalList
    }, {
      element: '#myView',
      selector: '#tmm-edit-act-name',
      event: 'click',
      handler: editActNamePage
    }, {
      element: '#myView',
      selector: '#edit-title',
      event: 'click',
      handler: editActName
    }, {
      element: '#myView',
      selector: '#tmm-edit-act-num',
      event: 'click',
      handler: editActNumPage
    }, {
      element: '#myView',
      selector: '#edit-num',
      event: 'click',
      handler: editActNum
    }, {
      element: '#myView',
      selector: '#tmm-edit-act-tour-price',
      event: 'click',
      handler: editActTourPricePage
    }, {
      element: '#myView',
      selector: '#edit-tour-price',
      event: 'click',
      handler: editActTourPrice
    }, {
      element: '#myView',
      selector: '#tmm-edit-act-pay',
      event: 'click',
      handler: editActPay
    }, { //编辑公开性
      element: '#myView',
      selector: '#tmm-edit-act-open',
      event: 'click',
      handler: editActOpen
    }, {
      element: '#myView',
      selector: '.tmm-journeylist-changeLine',
      event: 'click',
      handler: changeLine
    }, {
      element: 'body',
      selector: '.tmm-examine-status',
      event: 'click',
      handler: changeActExamineDetail
    }, {
      element: 'body',
      selector: '.tmm-examine-status-list',
      event: 'click',
      handler: changeActExamineList
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = Activity;
