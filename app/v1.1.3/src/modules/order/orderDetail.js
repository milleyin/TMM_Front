/**
 * @method orderDetail
 * @description  订单详情相关模块
 * 
 * @author Moore Mo
 * @datetime 2015-10-27T16:33:48+0800
 */
var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  dot_template = require('./dot-order.tpl.html'),
  line_template = require('./line-order.tpl.html'),
  act_template = require('./act-order.tpl.html'),
  act_detail_template = require('./act-order-detail.tpl .html'),
  QRCode = require('../code');

var timer = null;// 定时器对象
var urlapi = ''; // 传过来的订单api
var orderInfo = {}; // 订单信息
var tpltype = 0; // 点或者线的订单


var orderDetail = {
  init: function() {
   
    appFunc.hideToolbar();
    orderDetail.bindEvent();
  },
  loadView: function() {

    orderDetail.init();
    var _this = this;
    // 类型，1=>'自助游(点)',2=>'自助游(线)',3=>'活动(旅游)',4=>'活动(农产品)',5=>'农产品')
    var type = $$(_this).attr('data-type');
    // 1=>'自助游(点)',2=>'自助游(线)',3=>'活动(旅游)',4=>'活动(农产品)',5=>'农产品')的链接
    var link = $$(_this).attr('data-link');

    urlapi = link;
    log.info('type--', type);

    var orderType = {
      1: dot_template,
      2: line_template,
      3: act_template,
      4: false,
      5: false
    };

    if (orderType[type]) {
      orderDetail.getOrderDetail(orderType[type], type, link);
    } else {
      //tmmApp.alert('请求的链接不存在');
    }


  },
  gotoOrderView: function(type, link) {
    tpltype = type;
    orderDetail.init();
    var orderType = {
      1: dot_template,
      2: line_template,
      3: act_template,
      4: act_detail_template,
      5: false
    };

    urlapi = link;
    if (orderType[type]) {
      orderDetail.gotoOrderDetail(orderType[type], type, link);
    } else {
      //tmmApp.alert('请求的链接不存在');
    }

  },
  gotoOrderDetail: function(template, type, url) {
    tpltype = type;
    httpService.getOrderDetail(
      url,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          orderInfo = dataRes.data;
          // 如果订单处于待处理状态，加载定时器
          if (orderInfo.status.order_status.value == 0) {
            orderDetail.setTime();
          } 
            
          var data = {
            orderObj: dataRes.data,
            orderOwn: {
              'type': type,
              'url': url
            }
          };


          var output = appFunc.renderTpl(template, data);

          tmmApp.getCurrentView().router.load({
            content: output,
            reload: true
          });

          orderDetail.bindEvent();

        } else {
          tmmApp.alert('网络超时，请重试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  getOrderDetail: function(template, type, url) {
    tpltype = type;
    httpService.getOrderDetail(
      url,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          orderInfo = dataRes.data;
          // 如果订单处于待处理状态，加载定时器
          if (orderInfo.status.order_status.value == 0) {
            orderDetail.setTime();
          } 
            
          var data = {
            orderObj: dataRes.data,
            orderOwn: {
              'type': type,
              'url': url
            }
          };


          var output = appFunc.renderTpl(template, data);
          
          tmmApp.getCurrentView().router.load({
            content: output
          });

          orderDetail.bindEvent();

        } else {
          tmmApp.alert('网络超时，请重试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  orderPay: function() {
    var _this = this;
    var order_id = $$(_this).attr('data-id');
    var order_type = $$(_this).attr('data-type');
    var order_link = $$(_this).attr('data-link');
    var data = {
      "id": order_id,
      "pay_type": "1"
    };
    httpService.orderPay(
      data,
      function(dataRes, status) {
        if (dataRes.status == 1) {
          if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad) { //ios
            connectWebViewJavascriptBridge(function(bridge) {
              bridge.callHandler('ObjcCallback', {
                'PayCode': dataRes.data.alipay
              }, function(response) {})
            });
          } else if (tmmApp.device.android) {
            window.jsObj.payMoney(dataRes.data.alipay);
          }

          tmmApp.confirm('您的订单是否支付成功',function(){
            orderDetail.refreshView(tpltype,urlapi);
          },function(){
            orderDetail.refreshView(tpltype,urlapi);
          });
          

        } else {
          tmmApp.hideIndicator();
          tmmApp.alert('支付失败，请重试');
        }
        tmmApp.hideIndicator();
        orderDetail.refreshView(order_type, order_link);
      },
      function(dataRes, status) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
    log.info('orderPay--', order_id);
  },
  refreshView: function(type, url) {
    orderDetail.bindEvent();
    var orderType = {
      1: dot_template,
      2: line_template,
      3: act_template,
      4: false,
      5: false
    };
    var template = orderType[type];
   
    if (template) {
      httpService.getOrderDetail(
        url,
        function(dataRes, statusCode) {
         
          if (dataRes.status == 1) {
            var data = {
              orderObj: dataRes.data,
              orderOwn: {
                'type': type,
                'url': url
              }
            };
            var output = appFunc.renderTpl(template, data);

            tmmApp.getCurrentView().router.load({
              content: output,
              reload: true,
              animatePages: false
            });
            orderDetail.init();
          } else {
            tmmApp.alert('网络超时，请重试');
          }
        },
        function(dataRes, statusCode) {
          tmmApp.alert('网络超时，请重试');
        }
      );
    } else {
      //tmmApp.alert('请求的链接不存在');
    }
  },
  /**
   * 显示二维码
   * @return {[type]} [description]
   */
  showQrCode: function(){

    if ($$(this).attr('data-sq') == 1) {
      var link = $$(this).attr('data-link');

      httpService.getQrCode(link,function(dataRes){
        console.log(dataRes);

        var html = '<div class="popup" id="popupQRcode"><div style="top: 75%;position: absolute;width: 100%; text-align: center;"><p><a href="#" class="close-popup button color-red active" style="margin: 30px auto;width: 200px;">关闭</a></p></div><i></i></div>'
        tmmApp.popup(html);

        var oDiv = document.getElementById('popupQRcode');
        var qrcode = new QRCode(oDiv, {
          width : 200,//设置宽高
          height : 200,
        });

        qrcode.makeCode(dataRes.data.barcode.value);
        // qrcode.makeCode('1111111111');
        

      },function(){

      });
    }
    
  },
  /**
   * 加载定时器
   * @return {[type]} [description]
   */
  setTime: function() {
    var num = 0;
    timer = setInterval(function(){
      num++;
      orderDetail.getOrderInfo(function(){
       log.info(orderInfo);
        // 订单状态变为待支付状态才能提交订单
        if (orderInfo.status.centre_status.value == 1) {

          orderDetail.clearTime();
          orderDetail.refreshView(tpltype,urlapi);
        }
        
      });

    }, 5000);
  },
  /**
   * 关闭定时器
   */
  clearTime: function() {
    clearInterval(timer);
  },
  /**
   * 获取订单信息
   * @return {[type]} [description]
   */
  getOrderInfo: function(fn) {
    httpService.getOrderDetail(
      urlapi,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          orderInfo = dataRes.data;

          fn && fn();
        }
      },
      function(dataRes, statusCode) {
        
      }
    );
  },
  bindEvent: function() {

    var bindings = [
      {
        element: '#myView',
        selector: '.tmm-my-order-detail-page .tmm-order-detail-confirm-pay',
        event: 'click',
        handler: orderDetail.orderPay
      },{
        element: "#recommendView",
        selector: ".tmm-my-order-detail-page .tmm-order-detail-confirm-pay",
        event: 'click',
        handler: orderDetail.orderPay
      },{
        element: "#seekView",
        selector: ".tmm-my-order-detail-page .tmm-order-detail-confirm-pay",
        event: 'click',
        handler: orderDetail.orderPay
      },{
        element: "#myView",
        selector: ".ticon-qr-code",
        event: 'click',
        handler: orderDetail.showQrCode
      },{
        element: "#recommendView",
        selector: ".ticon-qr-code",
        event: 'click',
        handler: orderDetail.showQrCode
      },{
        element: "#seekView",
        selector: ".ticon-qr-code",
        event: 'click',
        handler: orderDetail.showQrCode
      }
    ];
    // 调用bindEvents方法进行事件绑定
    appFunc.bindEvents(bindings);
  }
};

module.exports = orderDetail;
