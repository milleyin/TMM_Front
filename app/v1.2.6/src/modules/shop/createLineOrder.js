var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  template = require('./line-order.tpl.html'),
  addRetinueShop = require('./addRetinueShop'),
  selectRetinue_tpl = require('./selectRetinue.tpl.html'),
  orderDetail = require('../order/orderDetail'),
  roleModule = require('../role/role');

var info = {
  'orderInfo': {},
  'userInfo': {}
}

window.retinueSelect = []; // 随行人员选择集合
//var retinueSelectDefault = []; //选中的随行人员默认选中
var cNum = 0; // 成人数量
var eNum = 0; // 儿童数量
var totPrice = 0; //订单总价格
var datetime = '';

var createLineOrder = {

  init: function() {
    cNum = 0;
    eNum = 0; 
    retinueSelect = [];
    totPrice = 0;
    datetime = '';
    createLineOrder.selectGoTime();
    // createLineOrder.getUserInfo();
    createLineOrder.bindEvent();
  },

  /**
   * 显示创建线订单视图
   * @param  {[type]} id 线订单id
   * @return {[type]}    [description]
   */
  showView: function(id) {
    log.info("linelinelinelinelinelinelinelineline");
    retinueSelectDefault = [];
    if (!appFunc.getLocalUserInfo()) {
      //tmmApp.alert('请先登录', '');
      roleModule.goToLogin();
      return;
    }


    tmmApp.showIndicator();
    // 获取订单数据
    httpService.getFareOrder(id,
      function(dataRes, statusCode) {

        if (dataRes.status == 1) {
          info.orderInfo = dataRes.data;

          // 获取个人信息
          httpService.getUserInfo(function(dataRes) {

            info.userInfo = dataRes.data;
            info.datetime = datetime;
            // retinueSelect = dataRes.data.retinueInfo.list;


            // 编译模版
            var output = appFunc.renderTpl(template, info);
            tmmApp.getCurrentView().router.load({
              content: output,
            });
            tmmApp.hideIndicator()
            createLineOrder.init();

          }, function(dataRes) {
            tmmApp.hideIndicator()
          });

        }

      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator()
      });
  },
  /**
   * 填充主要联系人信息
   */
  fillMainRetinue: function() {
    httpService.getUserInfo(function(dataRes) {
      info.userInfo = dataRes.data;

      if (info.userInfo.main_retinueInfo.list) {
        $$('#tmm-order-mainretinue-list').html('<div>' + info.userInfo.main_retinueInfo.list[0].name + '</div>')
      }

    }, function(dataRes) {

    });
  },

  /**
   * 获取用户信息
   * @return {[type]} [description]
   */
  getUserInfo: function(fn) {
    httpService.getUserInfo(function(dataRes) {

      info.userInfo = dataRes.data;

      // fn || fn();

    }, function(dataRes) {

    });
  },

  /**
   * 获取随行人员列表信息
   * @return {[type]} [description]
   */
  showList: function() {
    httpService.getUserInfo(function(dataRes) {
      info.userInfo = dataRes.data;
      var retinueBack = 0; //是否是返回按钮
      var popupHTML = appFunc.renderTpl(selectRetinue_tpl, info.userInfo);

      tmmApp.popup(popupHTML);

      if (info.userInfo.retinueInfo.list != null) {
        $$("#noRetinue").css('display', 'none');
      } else {
        $$("#noRetinue").css('display', 'block');
      }
      //随行人员的默认值
      $$.each($$('.select-retinue'), function(index, value) {
        for (var j = 0; j < retinueSelectDefault.length; j++) {
          if ($$(value).attr('data-id') == retinueSelectDefault[j]) {
            $$(value).attr('checked', 'checked');
          }
        }
      });

      $$('.retinueBackClose').on('click', function() {
        retinueBack = 1;
        tmmApp.closeModal('.popup');
      });

      //添加随行人员事件
      $$('.order-add-retinue').on('click', function() {
        retinueBack = 1;
        tmmApp.closeModal('.popup')
        setTimeout(function() {
          addRetinueShop.init(2);

        }, 200)
      })


      //弹出层关闭事件
      $$('.popup').on('close', function() {
        var str = '';
        retinueSelect = [];
        if (retinueBack != 1) {
          retinueSelectDefault = [];
        }
        $$.each($$('.select-retinue'), function(index, value) {

          if ($$(value).prop('checked')) {
            if (retinueBack != 1) {
              retinueSelectDefault.push($$(value).attr('data-id'));
            }
            retinueSelect.push({
              'retinue_id': $$(value).attr('data-id'),
              'name': $$(value).val(),
              'is_main': "0"
            });

            str += '<div class="w_33 retinue">' + $$(value).val() + '</div>';
          }
        });
        if (retinueBack != 1) {
          $$('#tmm-order-retinue-list .retinue').remove();
          $$('#tmm-order-retinue-list').prepend(str);
        }
      });

    }, function(dataRes) {

    });


  },

  /**
   * 计算总价格
   * @return {[type]} [description]
   */
  countPrice: function() {
    totPrice = 0;
    var list = info.orderInfo.dot_list;

    for (var attr1 in list) {

      for (var i = 0; i < list[attr1].length; i++) {

        for (var attr2 in list[attr1][i]) {
          if (attr2 != '$$hashKey') {
            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

              for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {
                list[attr1][i][attr2][j]['fare'][k]['count'] = list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']
                totPrice = (list[attr1][i][attr2][j]['fare'][k]['count'] + totPrice * 1).toFixed(2);
              }
            }

          }
        }
      }
    }
    $$('.tmm-total-price').html('￥' + totPrice);
  },
  /**
   * 拼接订单
   */
  spliceItem: function() {
    var item = {};
    var list = info.orderInfo.dot_list;

    for (var attr1 in list) {
      item[attr1] = [];
      for (var i = 0; i < list[attr1].length; i++) {
        item[attr1][i] = {};
        for (var attr2 in list[attr1][i]) {
          item[attr1][i][attr2] = [];
          if (attr2 != '$$hashKey') {

            for (var j = 0; j < list[attr1][i][attr2].length; j++) {
              item[attr1][i][attr2][j] = {};
              item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']] = [];

              for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {
                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k] = {};
                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k][list[attr1][i][attr2][j]['fare'][k]['value']] = {};
                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k][list[attr1][i][attr2][j]['fare'][k]['value']]['price'] = list[attr1][i][attr2][j]['fare'][k]['price'];
                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k][list[attr1][i][attr2][j]['fare'][k]['value']]['number'] = list[attr1][i][attr2][j]['fare'][k]['number'];
                item[attr1][i][attr2][j][list[attr1][i][attr2][j]['value']][k][list[attr1][i][attr2][j]['fare'][k]['value']]['count'] = list[attr1][i][attr2][j]['fare'][k]['count'];

              }
            }

          }
        }
      }
    }
    item['value'] = info.orderInfo.value;
    return item;
  },

  /**
   * 增加数量
   */
  addNum: function() {
    var type = $$(this).attr('data-info'); // 得到成人或者儿童
    var is_room = $$(this).attr('data-room'); // 成人或者儿童所需要的房间数量
    var list = info.orderInfo.dot_list;

    if (type == '成人') {

      cNum++;
      $$(this).parent().find('.num').html(cNum);

    } else if (type == '儿童') {
      if (cNum * 2 <= eNum) {
        tmmApp.alert('一个成人最多只能带两个儿童')
        return;
      }

      eNum++;
      $$(this).parent().find('.num').html(eNum);
    }

    for (var attr1 in list) {

      for (var i = 0; i < list[attr1].length; i++) {

        for (var attr2 in list[attr1][i]) {
          if (attr2 != '$$hashKey') {

            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

              for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {

                if (list[attr1][i][attr2][j]['fare'][k]['info'] == '成人') {

                  list[attr1][i][attr2][j]['fare'][k]['number'] = cNum;
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createLineOrder.showNumInItem('成人', cNum);

                } else if (list[attr1][i][attr2][j]['fare'][k]['info'] == '儿童') {
                  list[attr1][i][attr2][j]['fare'][k]['number'] = eNum;
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createLineOrder.showNumInItem('儿童', eNum);
                }

                if (list[attr1][i][attr2][j]['fare'][k]['room_number'] != '0') {
                  list[attr1][i][attr2][j]['fare'][k]['number'] = Math.ceil(cNum / list[attr1][i][attr2][j]['fare'][k]['room_number']);
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createLineOrder.showNumInRoom(list[attr1][i][attr2][j]['fare'][k]['room_number'], list[attr1][i][attr2][j]['fare'][k]['number']);
                }

              }

            }
          }
        }
      }


    }
    createLineOrder.countPrice();
  },

  /**
   * 减少数量
   * @return {[type]} [description]
   */
  subNum: function() {

    var type = $$(this).attr('data-info'); // 得到成人或者儿童
    var is_room = $$(this).attr('data-room'); // 成人或者儿童所需要的房间数量
    var list = info.orderInfo.dot_list;

    if (type == '成人') {
      if (cNum == 0) {
        return;
      }

      cNum--;
      if (cNum * 2 < eNum) {
        cNum ++;
        tmmApp.alert('一个成人最多只能带两个儿童')
        return;
      }

      
      $$(this).parent().find('.num').html(cNum);

    } else if (type == '儿童') {
      if (eNum == 0) {
        return;
      }
      eNum--;
      $$(this).parent().find('.num').html(eNum);
    }

    for (var attr1 in list) {

      for (var i = 0; i < list[attr1].length; i++) {

        for (var attr2 in list[attr1][i]) {
          if (attr2 != '$$hashKey') {

            for (var j = 0; j < list[attr1][i][attr2].length; j++) {

              for (var k = 0; k < list[attr1][i][attr2][j]['fare'].length; k++) {

                if (list[attr1][i][attr2][j]['fare'][k]['info'] == '成人') {
                  list[attr1][i][attr2][j]['fare'][k]['number'] = cNum;
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createLineOrder.showNumInItem('成人', cNum);
                } else if (list[attr1][i][attr2][j]['fare'][k]['info'] == '儿童') {
                  list[attr1][i][attr2][j]['fare'][k]['number'] = eNum;
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createLineOrder.showNumInItem('儿童', eNum);
                }

                if (list[attr1][i][attr2][j]['fare'][k]['room_number'] != '0') {
                  list[attr1][i][attr2][j]['fare'][k]['number'] = Math.ceil(cNum / list[attr1][i][attr2][j]['fare'][k]['room_number']);
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createLineOrder.showNumInRoom(list[attr1][i][attr2][j]['fare'][k]['room_number'], list[attr1][i][attr2][j]['fare'][k]['number']);

                }

              }

            }
          }
        }
      }


    }
    createLineOrder.countPrice();
  },
  /**
   * 成人儿童人数变化时显示到项目中去
   * @param  {[type]} type 成人，儿童
   * @param  {[type]} num 添加的数量
   * @return {[type]}      [description]
   */
  showNumInItem: function(type, num) {
    if (type == '成人') {
      $$(".fare-item-num[fare-item-type='成人']").html(num)
    } else if (type == '儿童') {
      $$(".fare-item-num[fare-item-type='儿童']").html(num)
    }
  },

  /**
   * 成人变化时添加人数到房间中去
   * @param  {[type]} type 添加房间的room_num
   * @param  {[type]} num  添加的数量
   * @return {[type]}      [description]
   */
  showNumInRoom: function(type, num) {

    $$(".fare-item-num[fare-item-room='" + type + "']").html(num)

  },
  selectGoTime: function() {
    var nowDate = new Date();
    var preDay = nowDate.setDate(nowDate.getDate() - 1);
    var calendarDefault = tmmApp.calendar({
      input: '#calendar-gotime',
      closeOnSelect: true,
      minDate: preDay,
      monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
      dayNames: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
      dayNamesShort: ['日', '一', '二', '三', '四', '五', '六'],
      onDayClick: function(p, dayContainer, year, month, day) {
        datetime = appFunc.dateFormt(year, month, day);
      }
    });
  },

  /*显示选择出游时间时的遮罩层*/
  showlineList: function() {
    $$('body').find(".modal-overlay").remove();
    if ($$('body').find(".modal-overlay").hasClass('tmm-picker-calendar')) {
      $$(".modal-overlay").addClass("modal-overlay-visible");
    } else {
      $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-picker-calendar"></div>');
    }
  },


  /**
   * 提交订单
   * @return {[type]} [description]
   */
  submitLineOrder: function() {
    var _this = this;

    // 判断出游日期
    if (!datetime) {
      tmmApp.alert('请选择出游日期');
      return;
    }

    // 判断成人选择是否为0
    if (cNum == 0) {
      tmmApp.alert('请选择出游人数');
      return;
    }
    
    // 判断是否存在主要成员
    if (!info.userInfo.main_retinueInfo.list) {
      tmmApp.alert('请添加主要联系人');
      return;
    }
    var token = {};
    var OrderRetinue = [];
    var OrderItemsFare = [];

    OrderRetinue.push({
      "is_main": "1",
      "retinue_id": info.userInfo.main_retinueInfo.list[0].value
    })

    for (var i = 0; i < retinueSelect.length; i++) {

      var temp = {
        "is_main": retinueSelect[i].is_main,
        "retinue_id": retinueSelect[i].retinue_id
      }

      OrderRetinue.push(temp);

    };

    // 判断选择人数与随行人员不匹配
    if (OrderRetinue.length != cNum + eNum) {
      tmmApp.alert('请确保主要联系人和随行人员总数与出游人数一致');
      return;
    }

    // 过滤成人与儿童
    var orderItemsFare = [];
    for (var i = 0; i < info.orderInfo.OrderItemsFare.length; i++) {
      orderItemsFare[i] = {};
      orderItemsFare[i]['info'] = info.orderInfo.OrderItemsFare[i]['info'];
      orderItemsFare[i]['is_room'] = info.orderInfo.OrderItemsFare[i]['is_room'];

      if (orderItemsFare[i]['info'] == '成人') {
        orderItemsFare[i]['number'] = cNum;
      } else if (orderItemsFare[i]['info'] == '儿童') {
        orderItemsFare[i]['number'] = eNum;
      }
    };

    /**
     * 提交的json数据
     * @type {Object}
     */
    token = {
        "Order": {
          "user_price": "0",
          "order_type": "2",
          "order_price": totPrice,
          "son_order_count": "0",
          "go_time": datetime,
          "user_go_count": OrderRetinue.length
        },
        "OrderRetinue": OrderRetinue,
        "OrderItems": createLineOrder.spliceItem(),
        "OrderItemsFare": orderItemsFare
      }
      /**
       * 提交表单
       */
      
    tmmApp.showIndicator();
    httpService.orderCreate(token, function(dataRes) {
      
      tmmApp.hideIndicator();
      if (dataRes.status == 1) {
        tmmApp.alert('提交订单成功', function() {

          orderDetail.gotoOrderView(2, dataRes.data["0"]);
        });
      } else {
        if (dataRes.form) {
          for (msgName in dataRes.form) {
            tmmApp.alert(dataRes.form[msgName][0]);
            break;
          }
        } else {
          tmmApp.alert('提交订单失败,请重试');
        }
      }

    }, function() {
      tmmApp.hideIndicator();
      tmmApp.alert('网络连接失败');

    });

  },
  bindEvent: function() {
    var bindings = [{
      element: '#recommendView',
      selector: '#orderAddMainRetinue',
      event: 'click',
      handler: addRetinueShop.init
    }, {
      element: '#recommendView',
      selector: '#orderAddRetinue',
      event: 'click',
      handler: createLineOrder.showList
    }, {
      element: '#recommendView',
      selector: '.tmm-order-line-addsub .sub-num',
      event: 'click',
      handler: createLineOrder.subNum
    }, {
      element: '#recommendView',
      selector: '.tmm-order-line-addsub .add-num',
      event: 'click',
      handler: createLineOrder.addNum
    }, {
      element: '#recommendView',
      selector: '#submitLineOrderBtn',
      event: 'click',
      handler: createLineOrder.submitLineOrder
    }, {
      element: '#seekView',
      selector: '#orderAddMainRetinue',
      event: 'click',
      handler: addRetinueShop.init
    }, {
      element: '#seekView',
      selector: '#orderAddRetinue',
      event: 'click',
      handler: createLineOrder.showList
    }, {
      element: '#seekView',
      selector: '.tmm-order-line-addsub .sub-num',
      event: 'click',
      handler: createLineOrder.subNum
    }, {
      element: '#seekView',
      selector: '.tmm-order-line-addsub .add-num',
      event: 'click',
      handler: createLineOrder.addNum
    }, {
      element: '#seekView',
      selector: '#submitLineOrderBtn',
      event: 'click',
      handler: createLineOrder.submitLineOrder
    }, {
      element: '#myView',
      selector: '#orderAddMainRetinue',
      event: 'click',
      handler: addRetinueShop.init
    }, {
      element: '#myView',
      selector: '#orderAddRetinue',
      event: 'click',
      handler: createLineOrder.showList
    }, {
      element: '#myView',
      selector: '.tmm-order-line-addsub .sub-num',
      event: 'click',
      handler: createLineOrder.subNum
    }, {
      element: '#myView',
      selector: '.tmm-order-line-addsub .add-num',
      event: 'click',
      handler: createLineOrder.addNum
    }, {
      element: "#recommendView",
      selector: '.calendar-gotime-line',
      event: 'click',
      handler: createLineOrder.showlineList
    }, {
      element: '#myView',
      selector: '#submitLineOrderBtn',
      event: 'click',
      handler: createLineOrder.submitLineOrder
    }];
    appFunc.bindEvents(bindings);
  }


}

module.exports = createLineOrder;
