var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  template = require('./dot-order.tpl.html'),
  addRetinueShop = require('./addRetinueShop'),
  selectRetinue_tpl = require('./selectRetinue.tpl.html'),
  orderDetailModule = require('../order/orderDetail'),
  roleModule = require('../role/role'),
  dotManageModule = require('./dotManage');

var info = {
  'orderInfo': {},
  'userInfo': {}
};
var retinueSelect = []; // 随行人员选择集合
//var retinueSelectDefault = [];//保存复选框选中的值

var oldFareDot = [];
// 出游时间
var goTime = '';
var trueGoTime = '';
// 订单总价DOM对象
var obj_total_price = '';
// 订单总价
var total_price = '';
// 验证酒店项目是否选择了入住和退店日期
var hotelFareFlag = true;

var createDotOrder = {

  init: function() {
    createDotOrder.bindEvent();
  },

  /**
   * 显示创建点订单视图
   * @param  {[type]} id 点订单id
   * @return {[type]}    [description]
   */
  showView: function(id) {
    retinueSelectDefault = [];
    createDotOrder.bindEvent();
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
          // 存取多个点的订单信息
          oldFareDot.push(dataRes.data);
          // 多个点的订单信息存取在本地
          createDotOrder.setFareDotLocal(dataRes.data.value, oldFareDot);
          // 赋值到模板
          info.orderInfo = dataRes.data;
          log.info("点的项目数据", info.orderInfo);
          // 获取主要联系人            
          httpService.getUserInfo(function(dataRes) {
            // 用户，主要联系人，随行人员的信息
            info.userInfo = dataRes.data;
            // 编译模版
            var output = appFunc.renderTpl(template, info);
            tmmApp.getCurrentView().router.load({
              content: output,
            });
            tmmApp.hideIndicator();
            // 保存订单信息
            createDotOrder.saveOrderInfoLocal(id, info);
            // 初始化日期控件
            createDotOrder.selectGoTime(id);
            //createDotOrder.selectHotelTime(id);
          }, function(dataRes) {
            tmmApp.hideIndicator();
          });
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');
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
  // 保存订单基本信息到本地
  saveOrderInfoLocal: function(dot_id, dataRes) {
    var localOrderInfo = {
      // 订单总价
      'order_price': '0.00',
      // 出游日期
      'go_time': '',
      // 随行人员人数
      'user_go_count': '1',
      "OrderRetinue": [],
    };
    // 保存订单基本信息
    createDotOrder.setOrderInfoLocal(dot_id, localOrderInfo);
  },
  // 获取本地保存的订单基本信息
  getOrderInfoLocal: function(dot_id) {
    var info = localStorage.getItem('dot_order_info_' + dot_id);
    if (appFunc.isObjectEmpty(info)) {
      return {};
    }
    return JSON.parse(info);
  },
  // 保存订单基本信息
  setOrderInfoLocal: function(dot_id, localOrderInfo) {
    // 保存订单基本信息
    localStorage.setItem('dot_order_info_' + dot_id, JSON.stringify(localOrderInfo));
  },
  // 保存订单项目信息
  setFareDotLocal: function(dot_id, localFareDot) {
    localStorage.setItem('dot_order_faredot_' + dot_id, JSON.stringify(localFareDot));
  },
  // 获取本地保存的订单项目信息
  getFareDotLocal: function(dot_id) {
    var info = localStorage.getItem('dot_order_faredot_' + dot_id);
    if (appFunc.isObjectEmpty(info)) {
      return [];
    }
    return JSON.parse(info);
  },
  /**
   * @method subNum
   * @description 价格相减
   * 
   * @author Moore Mo
   * @datetime 2015-10-30T10:26:59+0800
   */
  subNum: function() {
    var _this = this;
    createDotOrder.getTotalPrice(_this, '-');
    createDotOrder.updateDotFare(_this);
  },
  /**
   * @method addNum
   * @description 价格相加
   * 
   * @author Moore Mo
   * @datetime 2015-10-30T10:26:59+0800
   */
  addNum: function() {
    var _this = this;
    createDotOrder.getTotalPrice(_this, '+');
    createDotOrder.updateDotFare(_this);
  },
  /**
   * @method getTotalPrice
   * @description 统计数量和总价
   * 
   * @param    {Ojbect} obj 点击的DOM对象
   * @param    {String} perator +号 -号
   * 
   * @author Moore Mo
   * @datetime 2015-10-30T10:27:45+0800
   */
  getTotalPrice: function(obj, operator) {
    var obj_num = $$($$(obj).parent().find('.num')[0]);
    obj_total_price = $$('#tmm-order-total-price');
    var num = obj_num.html();
    var dot_id = $$(obj).attr('data-dotid');
    var hotel_number = $$(obj).attr('data-hotelnumber');
    var type = $$(obj).attr('data-type');
    var price = parseFloat($$(obj).attr('data-price'));

    total_price = parseFloat(obj_total_price.html());
    if (operator === '-') {
      if (num > 0) {
        num--;
        if (type == 1) {
          if (hotel_number > 0) {
            total_price -= (price * hotel_number);
          }
        } else {
          total_price -= price;
        }
      }
    } else if (operator === '+') {
      num++;
      if (type == 1) {
        if (hotel_number > 0) {
          total_price += (price * hotel_number);
        }
      } else {
        total_price += price;
      }
    }
    obj_num.html(num);
    obj_total_price.html(total_price.toFixed(2));
    $$(obj).attr('data-number', num);
    $$(obj).attr('data-count', (num * price * hotel_number).toFixed(2));

    // 更新价格总价
    createDotOrder.updateOrderPrice(dot_id, total_price);
  },
  /**
   * @method udpateRetinueInfo
   * 更新随行人员信息
   * 
   * @return   {[type]}                 [description]
   * @author Moore Mo
   * @datetime 2015-10-30T16:19:59+0800
   */
  udpateRetinueInfo: function(dot_id) {
    // 获取要发送订单的信息
    var dotOrderInfo = createDotOrder.getOrderInfoLocal(dot_id);
    // 订单随行人员信息
    var orderRetinue = dotOrderInfo['OrderRetinue'];

    orderRetinue.push({
      "is_main": "1", //是否是主要联系人
      "retinue_id": "1" //随行人员
    });
    // 更新缓存的点的订单数据
    createDotOrder.setOrderInfoLocal(dot_id, dotOrderInfo);
  },
  /**
   * @method updateOrderPrice
   * 更新订单总价
   * 
   * @param    {[type]}                 dot_id      [description]
   * @param    {[type]}                 total_price [description]
   * @return   {[type]}                             [description]
   * @author Moore Mo
   * @datetime 2015-10-30T16:14:28+0800
   */
  updateOrderPrice: function(dot_id, total_price) {
    // 获取要发送订单的信息
    var dotOrderInfo = createDotOrder.getOrderInfoLocal(dot_id);
    // 更改订单总价
    dotOrderInfo['order_price'] = total_price.toFixed(2);
    // 更新缓存的点的订单基本数据
    createDotOrder.setOrderInfoLocal(dot_id, dotOrderInfo);
  },
  /**
   * @method updateDotFare
   * @description 更新项目价格
   * 
   * @param    {[type]}                 obj [description]
   * @return   {[type]}                     [description]
   * @author Moore Mo
   * @datetime 2015-10-30T16:14:52+0800
   */
  updateDotFare: function(obj) {
    var itemFraeInfo = $$.dataset(obj);

    // 点的排序
    var dot_sort = itemFraeInfo.dotsort;
    // 点的id
    var dot_id = itemFraeInfo.dotid;
    // 项目的排序
    var dot_item_sort = $$($$(obj).parent().parent().parent().parent().find('.tmm-item-title')[0]).attr('data-itemsort');
    itemFraeInfo['itemsort'] = dot_item_sort;
    log.info('itemFraeInfo---', itemFraeInfo);
    // 项目的id
    var dot_item_id = itemFraeInfo.itemid;
    // 价格的排序
    var dot_fare_sort = itemFraeInfo.faresort;
    // 价格的id
    var dot_fare_id = itemFraeInfo.fareid;
    // 项目中的单个价格的购买数量
    var dot_fare_number = itemFraeInfo.number;
    // 项目中的单个价格的总价
    var dot_fare_count = itemFraeInfo.count;
    // 获取订单项目的信息
    var orderItems = createDotOrder.getFareDotLocal(dot_id);
    log.info('orderItems---updateDotFare---', orderItems);

    // shops_sort 商品（点）的排序
    for (shops_sort in orderItems) {
      // 商品id
      var shops_id = orderItems[shops_sort]['value'];
      // item_sort 商品（点）项目的排序
      for (item_sort in orderItems[shops_sort]['items_fare']) {
        // 项目id
        var item_id = orderItems[shops_sort]['items_fare'][item_sort]['value'];
        // fare_sort 商品（点）项目价格的排序
        for (fare_sort in orderItems[shops_sort]['items_fare'][item_sort]['fare']) {
          var fare_info = orderItems[shops_sort]['items_fare'][item_sort]['fare'][fare_sort];
          // 价格id
          var fare_id = orderItems[shops_sort]['items_fare'][item_sort]['fare'][fare_sort]['value'];
          if ((dot_sort == shops_sort) && (dot_id == shops_id) && (dot_item_sort == item_sort) && (dot_item_id == item_id) && (dot_fare_sort == fare_sort) && (dot_fare_id == fare_id)) {
            // 更改数量
            fare_info['number'] = dot_fare_number;
            // 更改价格
            fare_info['count'] = dot_fare_count.toFixed(2);
          }
        }

      }
    }
    // 更新缓存的点的订单数据
    createDotOrder.setFareDotLocal(dot_id, orderItems);
  },
  /**
   * @method   updateDotFareDate
   * @description 更新项目价格（住）中的入住和退房日期
   * 
   * @param    {Object} obj 所操作的input对象
   * @param    {Array} selectDate 选择的入住和退房日期
   * 
   * @author Moore Mo
   * @datetime 2015-12-05T17:52:35+0800
   */
  updateDotFareDate: function(obj, selectDate) {
    var itemFraeInfo = $$.dataset(obj);
    // 点的排序
    var dot_sort = itemFraeInfo.dotsort;
    // 点的id
    var dot_id = itemFraeInfo.dotid;
    // 项目的排序
    var dot_item_sort = $$(obj.parent().parent().parent().parent().parent().find('.tmm-item-title')[0]).attr('data-itemsort');
    itemFraeInfo['itemsort'] = dot_item_sort;
    log.info('itemFraeInfo---', itemFraeInfo);
    // 项目的id
    var dot_item_id = itemFraeInfo.itemid;
    // 价格的排序
    var dot_fare_sort = itemFraeInfo.faresort;
    // 价格的id
    var dot_fare_id = itemFraeInfo.fareid;
    // 日期类型（入住或退房日期）
    var type = itemFraeInfo.type;
    // 获取订单项目的信息
    var orderItems = createDotOrder.getFareDotLocal(dot_id);
    log.info('orderItems---updateDotFare---', orderItems);
    // 真实的订单总价
    var trueTotalPrice = 0.00;

    // shops_sort 商品（点）的排序
    for (shops_sort in orderItems) {
      // 商品id
      var shops_id = orderItems[shops_sort]['value'];
      // item_sort 商品（点）项目的排序
      for (item_sort in orderItems[shops_sort]['items_fare']) {
        // 项目id
        var item_id = orderItems[shops_sort]['items_fare'][item_sort]['value'];
        // fare_sort 商品（点）项目价格的排序
        for (fare_sort in orderItems[shops_sort]['items_fare'][item_sort]['fare']) {
          var fare_info = orderItems[shops_sort]['items_fare'][item_sort]['fare'][fare_sort];
          // 价格id
          var fare_id = orderItems[shops_sort]['items_fare'][item_sort]['fare'][fare_sort]['value'];
          if ((dot_sort == shops_sort) && (dot_id == shops_id) && (dot_item_sort == item_sort) && (dot_item_id == item_id) && (dot_fare_sort == fare_sort) && (dot_fare_id == fare_id)) {
            // 更改日期
            if ('start_date' in fare_info) {
              fare_info['start_date'] = selectDate[0];
            }
            if ('end_date' in fare_info) {
              fare_info['end_date'] = selectDate[1];
            }
            if ('hotel_number' in fare_info) {
              fare_info['hotel_number'] = selectDate[2];
            }
          }
          // 计算订单总价
          if (('hotel_number' in fare_info) && (fare_info['start_date'] != '0' && fare_info['end_date'] != '0')) {
            trueTotalPrice += fare_info['hotel_number'] * fare_info['price'] * fare_info['number'];
          } else if (!('hotel_number' in fare_info)) {
            trueTotalPrice += fare_info['price'] * fare_info['number'];
          }
        }

      }
    }
    // 更新订单总价
    obj_total_price.html(trueTotalPrice.toFixed(2));
    createDotOrder.updateOrderPrice(dot_id, trueTotalPrice);
    // 更新缓存的点的订单数据
    createDotOrder.setFareDotLocal(dot_id, orderItems);
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
        tmmApp.closeModal('.popup')
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
  // 商品项目过滤
  filterItem: function(fraeDot) {

    var item = {}
    item["0"] = [];

    for (var i = 0; i < fraeDot.length; i++) {
      // 点排序的对象
      item["0"][i] = {};
      // 点的数组
      item["0"][i][fraeDot[i].value] = [];
      for (var j = 0; j < fraeDot[i].items_fare.length; j++) {
        item["0"][i][fraeDot[i].value][j] = {};
        item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value] = [];

        // item["0"][i][fraeDot[i].value][j] = fraeDot[j].items_fare[j];
        for (var x = 0; x < fraeDot[i].items_fare[j].fare.length; x++) {
          if (fraeDot[i].items_fare[j].fare[x].number > 0) {
            item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value][x] = {};
            item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value][x][fraeDot[i].items_fare[j].fare[x].value] = {};

            item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value][x][fraeDot[i].items_fare[j].fare[x].value]['price'] = fraeDot[i].items_fare[j].fare[x].price;
            item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value][x][fraeDot[i].items_fare[j].fare[x].value]['number'] = fraeDot[i].items_fare[j].fare[x].number;
            item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value][x][fraeDot[i].items_fare[j].fare[x].value]['count'] = (fraeDot[i].items_fare[j].fare[x].number * fraeDot[i].items_fare[j].fare[x].price).toFixed(2);

            if ('start_date' in fraeDot[i].items_fare[j].fare[x]) {
              item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value][x][fraeDot[i].items_fare[j].fare[x].value]['start_date'] = fraeDot[i].items_fare[j].fare[x].start_date;
              if ((fraeDot[i].items_fare[j].fare[x].number != 0) && (fraeDot[i].items_fare[j].fare[x].start_date == 0)) {
                hotelFareFlag = false;
              } else {
                hotelFareFlag = true;
              }
            }
            if ('end_date' in fraeDot[i].items_fare[j].fare[x]) {
              item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value][x][fraeDot[i].items_fare[j].fare[x].value]['end_date'] = fraeDot[i].items_fare[j].fare[x].end_date;
              if ((fraeDot[i].items_fare[j].fare[x].number != 0) && (fraeDot[i].items_fare[j].fare[x].end_date == 0)) {
                hotelFareFlag = false;
              } else {
                hotelFareFlag = true;
              }
            }
            if ('hotel_number' in fraeDot[i].items_fare[j].fare[x]) {
              item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value][x][fraeDot[i].items_fare[j].fare[x].value]['hotel_number'] = fraeDot[i].items_fare[j].fare[x].hotel_number;
              item["0"][i][fraeDot[i].value][j][fraeDot[i].items_fare[j].value][x][fraeDot[i].items_fare[j].fare[x].value]['count'] = (fraeDot[i].items_fare[j].fare[x].number * fraeDot[i].items_fare[j].fare[x].price * fraeDot[i].items_fare[j].fare[x].hotel_number).toFixed(2);
            }

          }

        };
      };
    };

    // 过滤项目子项目
    for (var i = 0; i < item["0"].length; i++) {
      for (var attr1 in item["0"][i]) {
        for (var j = 0; j < item["0"][i][attr1].length; j++) {
          for (var attr2 in item["0"][i][attr1][j]) {
            for (var x = 0; x < item["0"][i][attr1][j][attr2].length; x++) {
              if (item["0"][i][attr1][j][attr2][x] == null) {

                item["0"][i][attr1][j][attr2].splice(x, 1);
                x--;
              }
            }
          }
        }

      }
    }

    // 过滤项目
    for (var i = 0; i < item["0"].length; i++) {
      for (var attr1 in item["0"][i]) {
        for (var j = 0; j < item["0"][i][attr1].length; j++) {
          for (var attr2 in item["0"][i][attr1][j]) {
            if (item["0"][i][attr1][j][attr2].length == 0) {
              item["0"][i][attr1].splice(j, 1);
              j--;
            }
          }
        }

      }
    }

    // 过滤点
    for (var i = 0; i < item["0"].length; i++) {
      for (var attr1 in item["0"][i]) {
        if (item["0"][i][attr1].length == 0) {
          item["0"].splice(i, 1);
          i--;
        }
      }
    }

    return item;
  },
  getSendOrderInfo: function(dot_id) {
    var sendOrderInfo = {
      "Order": {
        "user_price": "0", //服务费总计
        "order_type": "1", //点下单
        "pay_type": "1", //第三方支付接口 选择  默认 支付宝  1
        "order_price": "0.00", //订单总计
        "son_order_count": "0", //子订单 统计
        "go_time": "", //出游日期
        "user_go_count": "1" //随行人员 人数
      },
      "OrderRetinue": [],
      "OrderItems": []
    };

    // 获取要发送订单的信息
    var dotOrderInfo = createDotOrder.getOrderInfoLocal(dot_id);
    // 出游日期
    sendOrderInfo['Order']['go_time'] = dotOrderInfo['go_time'];

    if (dotOrderInfo['go_time'] == '') {
      tmmApp.alert('请先选择出游日期', '');
      return false;
    }


    var orderRetinue = [];
    log.info('getSendOrderInfo--orderRetinue----', info.userInfo);
    if (!info.userInfo.main_retinueInfo.list) {
      tmmApp.alert('请先添加主要联系人', '');
      return false;
    }

    orderRetinue.push({
      "is_main": "1",
      "retinue_id": info.userInfo.main_retinueInfo.list[0].value
    });

    for (var i = 0; i < retinueSelect.length; i++) {

      var temp = {
        "is_main": retinueSelect[i].is_main,
        "retinue_id": retinueSelect[i].retinue_id
      }
      orderRetinue.push(temp);
    };

    // 订单随行人员（包括主要联系人）
    sendOrderInfo['OrderRetinue'] = orderRetinue;
    // 订单随行人员总数（包括主要联系人）
    sendOrderInfo['Order']['user_go_count'] = orderRetinue.length;

    // 订单总价
    sendOrderInfo['Order']['order_price'] = dotOrderInfo['order_price'];

    var fareDotInfo = createDotOrder.getFareDotLocal(dot_id);
    // 过滤订单项目价格
    sendOrderInfo['OrderItems'] = createDotOrder.filterItem(fareDotInfo);

    log.info('sdfsdf', sendOrderInfo['OrderItems']);

    if (sendOrderInfo['OrderItems'][0].length == 0) {
      tmmApp.alert('请选择您要购买的项目', '');
      return false;
    }

    if (hotelFareFlag === false) {
      tmmApp.alert('您有未选择入住和退房日期的项目', '');
      return false;
    }

    return sendOrderInfo;
  },
  /**
   * @method   submitDotOrder
   * @description 提交订单
   *  
   * @author Moore Mo
   * @datetime 2015-12-05T12:03:43+0800
   */
  submitDotOrder: function() {
    var _this = this;
    var dot_id = $$(_this).attr('data-dotid');
    var postData = createDotOrder.getSendOrderInfo(dot_id);
    if (postData == false) {
      return;
    }
    log.info('postData---', postData);

    httpService.orderCreate(
      postData,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          tmmApp.alert('提交订单成功', '', function() {
            localStorage.removeItem('dot_order_info_' + dot_id);
            localStorage.removeItem('dot_order_faredot_' + dot_id);
            oldFareDot = [];
            retinueSelect = [];
            // 出游时间
            goTime = '';
            trueGoTime = '';
            // 订单总价DOM对象
            obj_total_price = '';
            // 订单总价
            total_price = '';
            hotelFareFlag = true;
            orderDetailModule.gotoOrderView(1, dataRes.data[0]);
          });
        } else {
          tmmApp.alert('提交订单失败,请重试', '');
        }
        log.info('orderCreate---', dataRes);
      },
      function(dataRes, statusCode) {
        tmmApp.alert('提交订单失败');
      }
    );
  },
  /**
   * @method   selectGoTime
   * @description 选择出游日期
   * 
   * @param    {int} dot_id 点id
   * 
   * @author Moore Mo
   * @datetime 2015-12-05T11:39:35+0800
   */
  selectGoTime: function(dot_id) {
    var nowDate = new Date();
    var preDay = nowDate.setDate(nowDate.getDate() - 1);

    tmmApp.calendar({
      input: '#calendar-gotime',
      closeOnSelect: true,
      minDate: preDay,
      monthNames: appFunc.monthNames(),
      dayNames: appFunc.dayNames(),
      dayNamesShort: appFunc.dayNamesShort(),
      scrollToInput: false,
      onDayClick: function(p, dayContainer, year, month, day) {
        var orderInfo = createDotOrder.getOrderInfoLocal(dot_id);
        goTime = appFunc.dateFormt(year, month, day);
        trueGoTime = year + '-' + (parseInt(month, 10) + 1) + '-' + day;
        orderInfo['go_time'] = appFunc.dateFormt(year, month, day);
        createDotOrder.setOrderInfoLocal(dot_id, orderInfo);
        createDotOrder.selectHotelTime(dot_id);
      }
    });

  },
  /**
   * @method   selectHotelTime
   * @description 选择酒店入住日期
   * 
   * @param    {int} dot_id 点id
   * 
   * @author Moore Mo
   * @datetime 2015-12-05T11:41:51+0800
   */
  selectHotelTime: function(dot_id) {
    // 订单总价
    obj_total_price = $$('#tmm-order-total-price');
    total_price = parseFloat(obj_total_price.html());
    // 得到每个酒店入住日期选择框
    var calendarList = $$('.tmm-create-dot-order').find('.calendar-hoteltime');
    // 出游日期的真实时间格式
    var goTimeDate = new Date(trueGoTime);
    // 住店的开始时间
    var firstDay = new Date().setDate(goTimeDate.getDate() - 1);
    // 退房的最后时间（最多只能选择10晚的入住时间）
    var lastDay = new Date().setDate(goTimeDate.getDate() + 10);
    // 分别进行初始化
    $$.each(calendarList, function(index, element) {
      var _this = $$(element);
      var subNumObj = _this.parent().parent().parent().find('.sub-num').eq(0);
      log.info('subNumObj...', subNumObj);
      var addNumObj = _this.parent().parent().parent().find('.add-num').eq(0);
      // 记录多选日期的个数
      var num = 0;
      // 记录所选择的两个日期
      var dateArr = [];
      // 临时存入显示的字符串格式，如 "2015.12.05-12.07（共2晚）"
      var oldStr = '';
      var str = '';
      // 初始化日期控件
      var calenderObj = tmmApp.calendar({
        input: _this,
        minDate: firstDay, // 所选开始日期必须为等于或大于出游日期
        maxDate: lastDay,
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
          appFunc.showToastBootom('请选择入住日期');
        },
        onDayClick: function(p, dayContainer, year, month, day) {
          calenderObj.setValue([]);
          num++;
          if (num == 1) {
            appFunc.hideToast();
            appFunc.showToastBootom('请选择退房日期');
            dateArr.push(appFunc.dateFormt(year, month, day));
            str += appFunc.dateFormtDot(year, month, day, 1);
          }
          if (num == 2) {
            setTimeout(function() {
              dateArr.push(appFunc.dateFormt(year, month, day));
              log.info('');
              var dif = appFunc.hotelDay(dateArr);
              if (dif <= 0) {
                tmmApp.alert('退房日期必须晚于入住日期');
                _this.val(oldStr);
              } else {
                str += appFunc.dateFormtDot('', month, day, 2) + '（共' + dif + '晚）';
                oldStr = str;
                _this.val(str);
                dateArr.push(dif);
                subNumObj.attr('data-hotelnumber', dif);
                addNumObj.attr('data-hotelnumber', dif);
                createDotOrder.updateDotFareDate(_this, dateArr);
              }
              num = 0;
              str = '';
              dateArr = [];
            }, 0);



            calenderObj.close();

          }


        },
        onClose: function() {
          appFunc.hideToast();
        }
      });



    });
  },

  /*显示选择出游时间时的遮罩层*/
  showdottList: function() {
    var _this = this;
    var id = $$(_this).attr('id');
    if (goTime == '' && (id != 'calendar-gotime')) {
      tmmApp.alert('请先选择出游日期');
      return;
    }
    $$('body').find(".modal-overlay").remove();
    if ($$('body').find(".modal-overlay").hasClass('tmm-picker-calendar')) {
      $$(".modal-overlay").addClass("modal-overlay-visible");
    } else {
      $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-picker-calendar"></div>');
    }
  },

  goBack: function() {
    var dot_id = $$(this).attr('data-dotid');
    localStorage.removeItem('dot_order_info_' + dot_id);
    localStorage.removeItem('dot_order_faredot_' + dot_id);
    oldFareDot = [];
    retinueSelect = [];
    // 出游时间
    goTime = '';
    trueGoTime = '';
    // 订单总价DOM对象
    obj_total_price = '';
    // 订单总价
    total_price = '';
    hotelFareFlag = true;
  },
  selectDot: function() {
    dotManageModule.showDotList();
    log.info('selectDot---');
  },
  bindEvent: function() {

    var bindings = [{
      element: '#recommendView',
      selector: '#orderAddMainRetinue',
      event: 'click',
      handler: addRetinueShop.init
    }, {
      element: '#recommendView',
      selector: '#orderDotAddRetinue',
      event: 'click',
      handler: createDotOrder.showList
    }, {
      element: '#recommendView',
      selector: '.tmm-create-dot-order .sub-num',
      event: 'click',
      handler: createDotOrder.subNum
    }, {
      element: '#recommendView',
      selector: '.tmm-create-dot-order .add-num',
      event: 'click',
      handler: createDotOrder.addNum
    }, {
      element: '#recommendView',
      selector: '#submitDotOrder',
      event: 'click',
      handler: createDotOrder.submitDotOrder
    }, {
      element: '#recommendView',
      selector: '#dot-order-back',
      event: 'click',
      handler: createDotOrder.goBack
    }, {
      element: '#recommendView',
      selector: '#tmm-select-dot',
      event: 'click',
      handler: createDotOrder.selectDot
    }, {
      element: '#seekView',
      selector: '#orderAddMainRetinue',
      event: 'click',
      handler: addRetinueShop.init
    }, {
      element: '#seekView',
      selector: '#orderDotAddRetinue',
      event: 'click',
      handler: createDotOrder.showList
    }, {
      element: '#seekView',
      selector: '.tmm-create-dot-order .sub-num',
      event: 'click',
      handler: createDotOrder.subNum
    }, {
      element: '#seekView',
      selector: '.tmm-create-dot-order .add-num',
      event: 'click',
      handler: createDotOrder.addNum
    }, {
      element: '#seekView',
      selector: '#submitDotOrder',
      event: 'click',
      handler: createDotOrder.submitDotOrder
    }, {
      element: '#seekView',
      selector: '#dot-order-back',
      event: 'click',
      handler: createDotOrder.goBack
    }, {
      element: '#seekView',
      selector: '#tmm-select-dot',
      event: 'click',
      handler: createDotOrder.selectDot
    }, {
      element: '#myView',
      selector: '#orderAddMainRetinue',
      event: 'click',
      handler: addRetinueShop.init
    }, {
      element: '#myView',
      selector: '#orderDotAddRetinue',
      event: 'click',
      handler: createDotOrder.showList
    }, {
      element: '#myView',
      selector: '.tmm-create-dot-order .sub-num',
      event: 'click',
      handler: createDotOrder.subNum
    }, {
      element: '#myView',
      selector: '.tmm-create-dot-order .add-num',
      event: 'click',
      handler: createDotOrder.addNum
    }, {
      element: '#myView',
      selector: '#submitDotOrder',
      event: 'click',
      handler: createDotOrder.submitDotOrder
    }, {
      element: '#myView',
      selector: '#dot-order-back',
      event: 'click',
      handler: createDotOrder.goBack
    }, {
      element: "#recommendView",
      selector: '.calendar-gotime-dott',
      event: 'click',
      handler: createDotOrder.showdottList
    }, {
      element: "#seekView",
      selector: '.calendar-gotime-dott',
      event: 'click',
      handler: createDotOrder.showdottList
    }, {
      element: '#myView',
      selector: '#tmm-select-dot',
      event: 'click',
      handler: createDotOrder.selectDot
    }];

    appFunc.bindEvents(bindings);
  }


}

module.exports = createDotOrder;
