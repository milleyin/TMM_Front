var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  template = require('./act-order.tpl.html'),
  addRetinueShop = require('./addRetinueShop'),
  selectRetinue_tpl = require('./selectRetinue.tpl.html'),
  orderDetail = require('../order/orderDetail'),
  roleModule = require('../role/role');

var info = {
  'orderInfo': {},
  'userInfo': {}
}

var retinueSelect = []; // 随行人员选择集合
var cNum = 0; // 成人数量
var eNum = 0; // 儿童数量
var totPrice = 0; //订单总价格
var servicePrice = 0; // 服务总价格
var datetime = '';

var createActOrder = {

  init: function() {
    cNum = 0;
    eNum = 0;
    // createActOrder.getUserInfo();
    createActOrder.bindEvent();
  },

  /**
   * 显示创建活动订单视图
   * @param  {[type]} id 线订单id
   * @return {[type]}    [description]
   */
  showView: function(id) {
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
            createActOrder.init();

          }, function(dataRes) {
            tmmApp.hideIndicator()
          });

        } else {
          tmmApp.hideIndicator()
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

      if(info.userInfo.retinueInfo.list != null){  
        $$("#noRetinue").css('display','none');
      } else {
        $$("#noRetinue").css('display','block');
      }


      $$('.retinueBackClose').on('click', function() {
        retinueBack = 1;
        tmmApp.closeModal('.popup')
      });

      //添加随行人员事件
      $$('.order-add-retinue').on('click', function() {
        // $$('.popup').
        tmmApp.closeModal('.popup')
        setTimeout(function() {
          addRetinueShop.init(2);

        }, 200)
      })


      //弹出层关闭事件
      $$('.popup').on('close', function() {
        var str = '';
        retinueSelect = [];

        $$.each($$('.select-retinue'), function(index, value) {

          if ($$(value).prop('checked')) {
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
    servicePrice = 0;
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

    // 计算服务费
    var num = cNum + eNum;
    servicePrice = num * info.orderInfo.price.value;

    totPrice = (parseFloat(totPrice) + servicePrice).toFixed(2);

    $$('.tmm-service-num').html(num);
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
        tmmApp.alert('儿童数量不能大于成人的两倍')
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

                  createActOrder.showNumInItem('成人', cNum);

                } else if (list[attr1][i][attr2][j]['fare'][k]['info'] == '儿童') {
                  list[attr1][i][attr2][j]['fare'][k]['number'] = eNum;
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createActOrder.showNumInItem('儿童', eNum);
                }

                if (list[attr1][i][attr2][j]['fare'][k]['room_number'] != '0') {
                  list[attr1][i][attr2][j]['fare'][k]['number'] = Math.ceil(cNum / list[attr1][i][attr2][j]['fare'][k]['room_number']);
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createActOrder.showNumInRoom(list[attr1][i][attr2][j]['fare'][k]['room_number'], list[attr1][i][attr2][j]['fare'][k]['number']);
                }

              }

            }
          }
        }
      }


    }
    createActOrder.countPrice();
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
      if (cNum * 2 <= eNum) {
        tmmApp.alert('儿童数量不能大于成人的两倍')
        return;
      }

      cNum--;
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

                  createActOrder.showNumInItem('成人', cNum);
                } else if (list[attr1][i][attr2][j]['fare'][k]['info'] == '儿童') {
                  list[attr1][i][attr2][j]['fare'][k]['number'] = eNum;
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createActOrder.showNumInItem('儿童', eNum);
                }

                if (list[attr1][i][attr2][j]['fare'][k]['room_number'] != '0') {
                  list[attr1][i][attr2][j]['fare'][k]['number'] = Math.ceil(cNum / list[attr1][i][attr2][j]['fare'][k]['room_number']);
                  list[attr1][i][attr2][j]['fare'][k]['count'] = (list[attr1][i][attr2][j]['fare'][k]['number'] * list[attr1][i][attr2][j]['fare'][k]['price']).toFixed(2);

                  createActOrder.showNumInRoom(list[attr1][i][attr2][j]['fare'][k]['room_number'], list[attr1][i][attr2][j]['fare'][k]['number']);

                }

              }

            }
          }
        }
      }


    }
    createActOrder.countPrice();
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
  /**
   * 提交订单
   * @return {[type]} [description]
   */
  submitActOrder: function() {
    var _this = this;

    // 判断成人选择是否为0
    if (cNum == 0) {
      tmmApp.alert('请选择人数');
      return;
    }
    // 判断是否存在主要成员
    if (!info.userInfo.main_retinueInfo.list) {
      tmmApp.alert('请添加主要成员');
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
      tmmApp.alert('选择人数与随行人员不匹配');
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
            "user_price": servicePrice,
            "order_type": "3",
            "order_price": totPrice,
            "son_order_count": "0",
            "user_go_count": OrderRetinue.length
        },
        "OrderRetinue": OrderRetinue,
        "OrderItems": createActOrder.spliceItem(),
        "OrderItemsFare": orderItemsFare
      };
      
      /**
       * 提交表单
       */
    httpService.orderCreate(token, function(dataRes) {
      
      if (dataRes.status == 1) {
        tmmApp.alert('提交订单成功', function() {

          orderDetail.gotoOrderView(3, dataRes.data["0"]);
        });
      } else {
        if (dataRes.form) {
          if (dataRes.form.Order_go_time) {
            tmmApp.alert(dataRes.form.Order_go_time[0]);
            return;
          } else if (dataRes.form.Order_order_price) {
            tmmApp.alert(dataRes.form.Order_order_price[0]);
            return;
          }
        }
        tmmApp.alert('提交订单失败');
      }

    }, function() {
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
      handler: createActOrder.showList
    }, {
      element: '#recommendView',
      selector: '.tmm-order-line-addsub .sub-num',
      event: 'click',
      handler: createActOrder.subNum
    }, {
      element: '#recommendView',
      selector: '.tmm-order-line-addsub .add-num',
      event: 'click',
      handler: createActOrder.addNum
    }, {
      element: '#recommendView',
      selector: '#submitActOrderBtn',
      event: 'click',
      handler: createActOrder.submitActOrder
    }, {
      element: '#seekView',
      selector: '#orderAddMainRetinue',
      event: 'click',
      handler: addRetinueShop.init
    }, {
      element: '#seekView',
      selector: '#orderAddRetinue',
      event: 'click',
      handler: createActOrder.showList
    }, {
      element: '#seekView',
      selector: '.tmm-order-line-addsub .sub-num',
      event: 'click',
      handler: createActOrder.subNum
    }, {
      element: '#seekView',
      selector: '.tmm-order-line-addsub .add-num',
      event: 'click',
      handler: createActOrder.addNum
    }, {
      element: '#seekView',
      selector: '#submitActOrderBtn',
      event: 'click',
      handler: createActOrder.submitActOrder
    }, {
      element: '#myView',
      selector: '#orderAddMainRetinue',
      event: 'click',
      handler: addRetinueShop.init
    }, {
      element: '#myView',
      selector: '#orderAddRetinue',
      event: 'click',
      handler: createActOrder.showList
    }, {
      element: '#myView',
      selector: '.tmm-order-line-addsub .sub-num',
      event: 'click',
      handler: createActOrder.subNum
    }, {
      element: '#myView',
      selector: '.tmm-order-line-addsub .add-num',
      event: 'click',
      handler: createActOrder.addNum
    }, {
      element: '#myView',
      selector: '#submitActOrderBtn',
      event: 'click',
      handler: createActOrder.submitActOrder
    }];
    appFunc.bindEvents(bindings);
  }


}

module.exports = createActOrder;
