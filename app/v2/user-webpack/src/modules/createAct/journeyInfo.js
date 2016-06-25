/**
 * 填写觅趣信息
 */
var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  sel_pay_type = require('./my-create-act-pay.tpl.html'),
  act_setting_tpl = require('./my-create-act-info.tpl.html');


/**
 * 线的id
 * @type {Number}
 */
var line_id = 140;
/**
 * 出游日期
 * 上一个页面带过来
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

var is_organizer = '0';
//付款方式
var pay_type = 0;

var Line = {
  init: function() {
    appFunc.hideToolbar();
    Line.bindEvent();
  },
  /*加载付款方式选择页面*/
  selPayType: function() {

    tmmApp.getCurrentView().router.load({
      content: sel_pay_type
    });
    Line.init();
  },

  showCreateActView: function() {
    pay_type = $$(this).attr("data-type");
    var data = {
      'userInfo':JSON.parse(appFunc.getLocalUserInfo())
    };

    var output = appFunc.renderTpl(act_setting_tpl, data);
    tmmApp.getCurrentView().router.load({
      content: output
    });
    Line.init();
    Line.selectStartAndEndTime();
  },

  createAct: function() {
    var actData = {
      "actives_thrand": 0, //线路ID 点为0
      "is_insurance": 1, //保险1=确认0=取消
      "shops_info":'', //觅趣对应点的信息====多点
      "Actives": { //觅趣信息
        "actives_type": 0, //0=旅游觅趣1=农产品觅趣
        "tour_type": 1, //-1=农产品觅趣,0=多个点,1=一条线
        "number": 0, //觅趣数量
        "price": 0.00, //觅趣单价(农产品传值)
        "tour_price": 0.00, //服务费
        "remark": "请填写简介", //旅游觅趣备注
        "start_time": "", //报名开始日期
        "end_time": "", //报名截止时间
        "go_time": '', //出游日期     没填传 空值
        "is_organizer" : 1, //是否组织者 1=是 0=不是
        "is_open" : 1, //是否开放显示 1=开放 0=不开放
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
    var is_open = 0;
    var userInfo = JSON.parse(appFunc.getLocalUserInfo());
    is_organizer = userInfo.is_organizer;
    if (userInfo.is_organizer === '1' && userInfo.organizer_status !== '0') { //组织者
      tour_price = $$('#tour_price').val();
    }

    var name = $$('#name').val();
    var number = $$('#number').val();
    var isChecked = $$('#launch-open').prop('checked');
    if (isChecked == true) {
      is_open = 1;
    } else {
      is_open = 0;
    }

    if (name == '') {
      tmmApp.alert('觅趣名称不能为空');
      return;
    }
    if (line_start_time == '') {
      tmmApp.alert('请选择觅趣开始时间');
      return;
    }
    if (line_end_time == '') {
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
    

    actData.actives_thrand = line_id;
    actData.Actives.number = number;
    actData.Actives.tour_price = tour_price;
    actData.Actives.start_time = line_start_time;
    actData.Actives.end_time = line_end_time;
    actData.Actives.is_organizer = is_organizer;
    actData.Actives.is_open = is_open;
    actData.Actives.pay_type = pay_type;
    actData.Actives.go_time = line_go_time;

    actData.Shops.name = name;

    // 创建旅游觅趣（线）
    tmmApp.showPreloader('正在提交中...');
    httpService.actCreate(
      actData,
      function(dataRes, statusCode) {

        log.info('actCreate...', dataRes);
        if (dataRes.status == 1) {
          //lineViewModel.showSuccessView(actData.Shops.name);
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

  //选择报名开始和结束时间
  selectStartAndEndTime: function() {
    // 出游日期
    var goTimeDate = "2016-03-26";

    var _this = $$('.calendar-infotime');
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
      cssClass: 'tmm-hoteldate-picker-calendar',
      closeByOutsideClick: false,
      scrollToInput: false,
      onOpen: function() {
        calenderObj.setValue([]);
        appFunc.showToastBootom('请选择报名开始日期');

        if(goTimeDate != ""){
          dateStartArr.push(goTimeDate);
        }
      },
      onDayClick: function(p, dayContainer, year, month, day) {
        
        calenderObj.setValue([]);
        
        if(goTimeDate != ""){
          dateStartArr.push(appFunc.dateFormt(year, month, day));
          var difStart = appFunc.hotelDay(dateStartArr);
          if(difStart >= 0) {
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
    
  },

  clearData: function() {
    line_id = 0;
    line_go_time = '';
    line_start_time = '';
    line_end_time = '';
  },

  bindEvent: function() {
    var bindings = [{
      element: "#create-act-info",
      selector: '#line_create_act',
      event: 'click',
      handler: Line.createAct
    }, {
      element: '#myView',
      selector: '#create-act-pay-type .pay-type-pos',
      event: 'click',
      handler: Line.showCreateActView
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = Line;
