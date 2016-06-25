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
      // 已经触发加载时注销点击事件，防止二次触发加载
      $$('#myView').off('click', '#tmm-my-order-page .tmm-my-order-detail-show', orderDetail.loadView);   
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
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getOrderDetail(
      url,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
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
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试');
      }
    );
  },
  getOrderDetail: function(template, type, url) {
    tpltype = type;
    // 显示正在加载的图标
    tmmApp.showIndicator();
    httpService.getOrderDetail(
      url,
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
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
          //alert($$('body').find("#tmm-popupQRcode-detail").hasClass('tmm-popupQRcode'));
          if($$('body').find("#tmm-popupQRcode-detail").hasClass('tmm-popupQRcode')){
            $$("#tmm-popupQRcode-detail").html("");
          }
          orderDetail.bindEvent();

          tmmApp.onPageAfterAnimation('order-detail', function(e) {
            $$('#myView').on('click', '#tmm-my-order-page .tmm-my-order-detail-show', orderDetail.loadView);
          });

        } else {
          tmmApp.alert('网络超时，请重试');
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        $$('#myView').on('click', '#tmm-my-order-page .tmm-my-order-detail-show', orderDetail.loadView);
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
  showQrCode: function(){
    if ($$(this).attr('data-sq') == 1) {
      var link = $$(this).attr('data-link');
      tmmApp.showIndicator();
      httpService.getQrCode(link,function(dataRes){

        tmmApp.hideIndicator();
        if($$('body').find(".delete").hasClass('closeQrCodeDeleteModal') == false){
          $$('body').append('<div class="delete closeQrCodeDeleteModal"></div>');
        } else { 
          $$('body').find(".closeQrCodeDeleteModal").css('display', 'block');
        }
        
        if($$('body').find("#tmm-popupQRcode-detail").hasClass('tmm-popupQRcode') == false){
          $$('body').append('<div id="tmm-popupQRcode-detail" class="tmm-popupQRcode"></div>');
        } else {
          $$("#tmm-popupQRcode-detail").css('display', 'block');
        }
        $$('body').find(".modal-overlay").remove();
        if($$('body').find(".modal-overlay").hasClass('tmm-QrCode-detail-show')){
          $$(".modal-overlay").addClass("modal-overlay-visible");
        } else {
          $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-QrCode-detail-show tmm-banner-detail-show-color"></div>');
        }
        $$(".spopupQRcode").appendTo($$("#tmm-popupQRcode-detail"));
        $$(".spopupQRcode").css("display", "block");
        $$("#popupQRcodeImage").html("");
        $$(".tmm-eject-juan").html("");
        var oDiv = document.getElementById('popupQRcodeImage');
        var qrcode = new QRCode(oDiv, {
          width : 150,//设置宽高
          height : 150,
        });
        var barcode = dataRes.data.barcode.value

        qrcode.makeCode(barcode);
        var formatBarcode = appFunc.toFormatNum(barcode);
        $$(".tmm-eject-juan").html("觅劵：" + formatBarcode);
        
      },function(){
        tmmApp.hideIndicator();
      });
    }
    
  },
  hideQrCode: function() {
    if($$('body').find(".modal").hasClass("modal-in")){
      $$('body').find(".modal").remove();
    }
    $$("#popupQRcodeImage").html("");
    $$(".tmm-eject-juan").html("");
    
    $$('body').find(".closeQrCodeDeleteModal").css('display', 'none');
    $$("#tmm-popupQRcode-detail").css('display', 'none');
    $$(".tmm-QrCode-detail-show").removeClass('modal-overlay-visible');
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
    if (timer) {
      clearInterval(timer);
    }
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
      }, {
      element: 'html',
      selector: '.closeQrCodeDeleteModal',
      event: 'click',
      handler: orderDetail.hideQrCode
    }, {
      element: 'body',
      selector: '.tmm-QrCode-detail-show',
      event: 'click',
      handler: orderDetail.hideQrCode
    }
    ];
    // 调用bindEvents方法进行事件绑定
    appFunc.bindEvents(bindings);
  }
};

module.exports = orderDetail;
