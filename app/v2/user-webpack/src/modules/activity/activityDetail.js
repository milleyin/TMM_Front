var httpService = require('../services/httpService'),
  appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  actMoreInfo_tpl = require('./more-activity-information.html'),
  activityEnrollInfoModule = require('./apply-info.tpl.html'),
  activityEnrollInfoModuleList = require('./apply-info-list.tpl.html'),
  orderModule = require('../order/orderDetail'),
  itemModule = require('../item/item');
  checkMoreActInfo_tpl = require('./check-more-act-info.tpl.html'),
  itemModule = require('../item/item'),
  orderDetail = require('../order/orderDetail');
  QRCodeActivity = require('../code');

// 觅趣详情数据信息
var info = {};
/**
 * 下一的页面链接
 * @type {String}
 */
var nextPageLink = '';

var enrollLink = '';
var enroltotal = 0;
var enrolTourCount = 0;

var loading = false;
var moreLoading = false;

var info = {};
var url = '';

var activityDetail = {
  init : function(data,link) {
    info = data;
    url = link;
    activityDetail.bindEvent();
  },

  /**
   * 查看项目详情
   * @return {[type]} [description]
   */
  moreInfo : function() {
    var output = appFunc.renderTpl(actMoreInfo_tpl, info);
    
    tmmApp.getCurrentView().router.load({
      content: output
    });

  },

  /** 查看觅趣消费信息 */
  checkInfo : function() {
    tmmApp.showIndicator();
    httpService.getActStateDetail(url, function(dataRes){

      if (dataRes.status == 1) {
        info = dataRes.data;
        var output = appFunc.renderTpl(checkMoreActInfo_tpl, info);

        tmmApp.getCurrentView().router.load({
          content: output
        });
        if($$('body').find("#tmm-popupQRcode-detail").hasClass('tmm-popupQRcode')){
            $$("#tmm-popupQRcode-detail").html("");
          }
      } else {
        tmm.alert('获取数据失败！')
      }
      tmmApp.hideIndicator();
    }, function(dataRes){
      tmmApp.hideIndicator();
    })

    // var output = appFunc.renderTpl(checkMoreActInfo_tpl, info);

    // tmmApp.getCurrentView().router.load({
    //   content: output
    // });
  },
  /** 查看觅趣报名信息 */
  ActivityEnrollInfoList : function() {
    appFunc.hideToolbar();
    tmmApp.hideIndicator();
    var _this = this;
    enrollLink = $$(_this).attr('data-link');
    enroltotal = $$(_this).attr('data-total');
    enrolTourCount = $$(_this).attr('data-tourCount');
    log.info("查看觅趣报名信息",enrollLink);
    httpService.ActivityEnrollInfoList(
      enrollLink,
      function(dataRes, statusCode) {
        if (dataRes.status == 1) {
          nextPageLink = dataRes.data.page.next;
          log.info("aaaaaa",dataRes.data);
          var renderData = {
            'enrollInfo' : dataRes.data,
            'enrollInfoList': dataRes.data.list_data,
            'enroltotal':enroltotal,
            'enrolTourCount':enrolTourCount
          };

          var output = appFunc.renderTpl(activityEnrollInfoModule, renderData);

          tmmApp.getCurrentView().router.load({
            content: output
          });

          tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
        }
      },
      function(dataRes, statusCode) {
        tmmApp.hideIndicator();
        tmmApp.alert('网络超时，请重试', '');
        tmmApp.pullToRefreshDone();
      }
    );
  },


  refreshActivityEnrollInfoList: function() {
    httpService.ActivityEnrollInfoList(
      enrollLink,
      function(dataRes, statusCode) {
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        var renderData = {
          'enrollInfo' : dataRes.data,
          'enrollInfoList': dataRes.data.list_data,
          'enroltotal':enroltotal,
          'enrolTourCount':enrolTourCount
        };

        var output = appFunc.renderTpl(activityEnrollInfoModuleList, renderData);

        $$('#activity-enroll-info-page').find('.activity-enroll-info-list').html(output);
        tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);

        setTimeout(function() {
          tmmApp.pullToRefreshDone();
        }, 1000);
      },
      function(dataRes, statusCode) {
        tmmApp.alert('网络超时，请重试');
        tmmApp.pullToRefreshDone();
      }
    );
  },

  infiniteActivityEnrollInfoList: function() {

    if (nextPageLink) {
      if (loading) return;
      loading = true;
      tmmApp.showIndicator();

      
      httpService.ActivityEnrollInfoList(
        nextPageLink,
        function(dataRes, statusCode) {
          nextPageLink = dataRes.data.page.next;
          var renderData = {
            'enrollInfo' : dataRes.data,
            'enrollInfoList': dataRes.data.list_data,
            'enroltotal':enroltotal,
            'enrolTourCount':enrolTourCount
          };

          var output = appFunc.renderTpl(activityEnrollInfoModuleList, renderData);

          $$('#activity-enroll-info-page').find('.tmm-activity-card-list').append(output);
          tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);

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
        $$("#activity-enroll-info-page #no-more").css('display', 'block');
        $$("#activity-enroll-info-page #no-more").text("没有更多了");
        tmmApp.detachInfiniteScroll($$('.infinite-scroll'));
      }, 300);
      setTimeout(function() {
        $$("#activity-enroll-info-page #no-more").hide();
        tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
      }, 2000);
    }
  },

  /** 查看觅趣报名信息 */
  ActivityEnrollDetailInfoList : function() {
    var enrolDetaillLink = $$(this).attr('data-link');
    orderModule.gotoOrderView(4, enrolDetaillLink);
  },

  getActivityEnrollInfoList : function() {
    $$(".tmm-enroll-sublist a").removeClass('active');
    var _this = this;
    $$(_this).addClass('active');
    enrollLink = $$(_this).attr('data-link');
    var clickNum = $$(_this).attr('date-type');
    if(clickNum == 3 || clickNum == 4){
      $$("#activity-enroll-info-page .tmm-apply-tit").hide();
    } else {
      $$("#activity-enroll-info-page .tmm-apply-tit").show();
    }
    httpService.ActivityEnrollInfoList(
      enrollLink,
      function(dataRes, statusCode) {
        nextPageLink = dataRes.data.page.next;
        if (nextPageLink) {
          tmmApp.attachInfiniteScroll($$('.infinite-scroll'));
        }
        var renderData = {
          'enrollInfo' : dataRes.data,
          'enrollInfoList': dataRes.data.list_data,
          'enroltotal':enroltotal,
          'enrolTourCount':enrolTourCount
        };
        log.info("测试数据",dataRes.data);
        var output = appFunc.renderTpl(activityEnrollInfoModuleList, renderData);

        $$('#activity-enroll-info-page').find('.activity-enroll-info-list').html(output);
        tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
      });
  },
  
//扫码
  showhdCode: function(){

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
        var qrcode = new QRCodeActivity(oDiv, {
          width : 150,//设置宽高
          height : 150,
        });

        qrcode.makeCode(dataRes.data.barcode.value);
        $$(".tmm-eject-juan").html("觅劵：" + dataRes.data.barcode.value);
        
      },function(){
        tmmApp.hideIndicator();
      });
    }
    
  },
  hidehdCode: function() {
    if($$('body').find(".modal").hasClass("modal-in")){
      $$('body').find(".modal").remove();
    }
    $$("#popupQRcodeImage").html("");
    $$(".tmm-eject-juan").html("");
    
    $$('body').find(".closeQrCodeDeleteModal").css('display', 'none');
    $$("#tmm-popupQRcode-detail").css('display', 'none');
    $$(".tmm-QrCode-detail-show").removeClass('modal-overlay-visible');
  },
  

  bindEvent: function() {
    var bindings = [{
      element: '#myView',
      selector: '.show-more-act',
      event: 'click',
      handler: activityDetail.moreInfo
    },{
      element: '#myView',
      selector: '.act-detail-item',
      event: 'click',
      handler: itemModule.loadItemView
    },{
      element: '#myView',
      selector: '.tmm-my-activity-check-info',
      event: 'click',
      handler: activityDetail.checkInfo
    },{
      element: '#myView',
      selector: '.show-act-enroll-info',
      event: 'click',
      handler: activityDetail.ActivityEnrollInfoList
    },{
      element: '#myView',
      selector: '.tmm-enroll-detail-info',
      event: 'click',
      handler: activityDetail.ActivityEnrollDetailInfoList
    }, {
      element: '#myView',
      selector: '#activity-enroll-info-page .pull-to-refresh-content',
      event: 'refresh',
      handler: activityDetail.refreshActivityEnrollInfoList
    }, {
      element: '#myView',
      selector: '#activity-enroll-info-page .pull-to-refresh-content',
      event: 'infinite',
      handler: activityDetail.infiniteActivityEnrollInfoList
    },{
      element: '#myView',
      selector: '.ticon-qr-code',
      event: 'click',
      handler: activityDetail.showhdCode
    }, {
      element: "#myView",
      selector: '.tmm-enroll-sublist a',
      event: 'click',
      handler: activityDetail.getActivityEnrollInfoList
    }, {
        element: "#myView",
        selector: ".ticon-qr-code",
        event: 'click',
        handler: activityDetail.showhdCode
    },{
      element: 'html',
      selector: '.closeQrCodeDeleteModal',
      event: 'click',
      handler: activityDetail.hidehdCode
    }, {
      element: 'body',
      selector: '.tmm-QrCode-detail-show',
      event: 'click',
      handler: activityDetail.hidehdCode
    }];

    appFunc.bindEvents(bindings);
  }
}

module.exports = activityDetail;