 /**
  * @method Item
  * @description  项目相关模块
  * 
  * @author Moore Mo
  * @datetime 2015-10-27T16:33:48+0800
  */
 var httpService = require('../services/httpService'),
   appFunc = require('../utils/appFunc'),
   log = require('../utils/log'),
   item_template = require('./item-detail.tpl.html'),
   hotel_template = require('./item-hotel-detail.tpl.html');



 var item = {
   init: function() {
     item.bindEvent();
   },
   loadItemView: function() {
     //appFunc.hideNavbar();
     var _this = this;
     // 类型，点，线，活动
     var type = $$(_this).attr('data-type');
     // 点，线，活动的链接
     var link = $$(_this).attr('data-link');

     var item_obj = {
       'eat': item_template,
       'play': item_template,
       'hotel': hotel_template,
       'farm': false,
       'farmOuter': false
     };

     if (item_obj[type]) {
       item.getItemDetail(item_obj[type], link);
     } else {
        // log.info('请求的链接不存在');
        if (type == 'farmOuter') {
          appFunc.goSeekFreshDetail(link);
        }
       // tmmApp.alert('请求的链接不存在');
     }
   },
   loadItemViewForImg: function() {
     var _this = this;
     // 类型，点，线，活动
     var type = $$(_this).attr('data-type');
     // 点，线，活动的链接
     var link = $$(_this).attr('data-link');

     var item_obj = {
       'eat': item_template,
       'play': item_template,
       'hotel': hotel_template,
       'farm': false,
       'farmOuter': false
     };

    if (item_obj[type]) {
       item.getItemDetail(item_obj[type], link);
     } else {
        // log.info('请求的链接不存在');
        if (type == 'farmOuter') {
          appFunc.goSeekFreshDetail(link);
        }
       // tmmApp.alert('请求的链接不存在');
     }
   },
   getItemDetail: function(template, url) {
    tmmApp.showIndicator();
     item.bindEvent();
     httpService.getItemDetail(
       url,
       function(dataRes, statusCode) {
         log.info("项目详情",dataRes);
         if (dataRes.status == 1) {
           var data = {
             itemObj: dataRes.data
           };
           var output = appFunc.renderTpl(template, data);

           tmmApp.getCurrentView().router.load({
             content: output
           });
         } else {
           tmmApp.alert('网络超时，请重试');
         }
          tmmApp.hideIndicator();
       },
       function(dataRes, statusCode) {
         tmmApp.alert('网络超时，请重试');
          tmmApp.hideIndicator();
       }
     );
   },
   showMapItemView: function() {
     $$(".navbar").css('display','none');
     $$("#tmm-hotel-map").css('display','block');
     $$("#tmm-hotel-mask").css('display','block');
   },
   hideMapItemView: function() {
    $$(".navbar").css('display','block');
     $$("#tmm-hotel-map").css('display','none');
     $$("#tmm-hotel-mask").css('display','none');
    },
   bindEvent: function() {
    log.info("隐藏显示地图");
    var bindings = [{
        element: '.views',
        selector: '#tmm-hotel-mask',
        event: 'click',
        handler: item.hideMapItemView
      }, {
        element: '.views',
        selector: '#showmoreMap',
        event: 'click',
        handler: item.showMapItemView
      }];

      appFunc.bindEvents(bindings);
   }
 };

 module.exports = item;
