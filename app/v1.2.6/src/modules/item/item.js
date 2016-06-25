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
    // 类型，点，线，觅趣
    var type = $$(_this).attr('data-type');
    log.info("进入初始化页面", type);
    // 点，线，觅趣的链接
    var link = $$(_this).attr('data-link');

    type = type == '1' ? 'eat' : type == '2' ? 'hotel' : type == '3' ? 'play' : type == '4' ? 'farm' : type;

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
    // 类型，点，线，觅趣
    var type = $$(_this).attr('data-type');
    // 点，线，觅趣的链接
    var link = $$(_this).attr('data-link');

    var item_obj = {
      'eat': item_template,
      'play': item_template,
      'hotel': hotel_template,
      '1': item_template,
      '2': item_template,
      '3': hotel_template,
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
        log.info("项目详情", dataRes);
        if (dataRes.status == 1) {
          var data = {
            itemObj: dataRes.data
          };
          var output = appFunc.renderTpl(template, data);

          tmmApp.getCurrentView().router.load({
            content: output
          });
          if($$('body').find("#tmm-banner-detail-head").hasClass('tmm-banner-detail')){
            $$("#tmm-banner-detail-head").html("");
          }
          item.hideTheShare();
        } else {
          tmmApp.alert('项目已下线');
        }
        tmmApp.hideIndicator();
      },
      function(dataRes, statusCode) {
        tmmApp.alert('项目已下线');
        tmmApp.hideIndicator();
      }
    );
  },
  hideTheShare: function() {
  	var itemShare = $$('#tmm-item-share');
  	var scrollPage = $$('body').find('.tmm-item-on-scroll');
  	var p = 0;
  	var t = 0;
  	
  	var handleScroll = function(e) {
  		//itemShare.hide();
  		p = scrollPage[0].scrollTop;

//		log.info('p...', p);
  		
  		// 如果是下滚，就隐藏
  		if (p > t) {
  			itemShare.hide();
//			$$('.tmm-hide-ite').css('display', 'block');
  		}
  		
  		// 如果是上滚，就显示
  		if (p < t) {
  			itemShare.show();
//			$$('.tmm-show-ite').css('display', 'block');
//			setTimeout(function() {
//				$$('.tmm-show-ite').css('display', 'block');
//			}, 1000);
  		}
  		
  		setTimeout(function() {
  			t = p;
  		}, 0);

  	};
  	
  	scrollPage.on('scroll', handleScroll);
//	log.info('ssd...', scrollPage, 'share,,', itemShare);
  },
  showMapItemView: function() {
    // 如果是ios或android
    if (tmmApp.device.iphone || tmmApp.device.ios || tmmApp.device.ipad || tmmApp.device.android) {
      var dataObj = $$(this).dataset();
      // 显示导航地图
      appFunc.showMap(dataObj.city, dataObj.address, dataObj.lng, dataObj.lat);
    } else {
      // 或者显示地图图片
      $$(".navbar").css('display', 'none');
      $$("#tmm-hotel-map").css('display', 'block');
      $$("#tmm-hotel-mask").css('display', 'block');
    }

  },
  hideMapItemView: function() {
    $$(".navbar").css('display', 'block');
    $$("#tmm-hotel-map").css('display', 'none');
    $$("#tmm-hotel-mask").css('display', 'none');
  },

  showModalOverlay: function(){
    
    if($$('body').find(".delete").hasClass('closeDeleteModal') == false){
      $$('body').append('<div class="delete closeDeleteModal"></div>');
    } else { 
      $$('body').find(".delete").css('display', 'block');
    }

    if($$('body').find("#tmm-banner-detail-head").hasClass('tmm-banner-detail') == false){
      $$('body').append('<div id="tmm-banner-detail-head" class="tmm-banner-detail"></div>');
    }

    $$('body').find(".modal-overlay").remove();
    if($$('body').find(".modal-overlay").hasClass('tmm-banner-detail-show')){
      $$(".modal-overlay").addClass("modal-overlay-visible");
    } else {
      $$('body').append('<div class="modal-overlay modal-overlay-visible tmm-banner-detail-show tmm-banner-detail-show-color"></div>');
    }
  },

  clickSwiperDetail: function(){
     tmmApp.swiper('.swiper-container', {
      pagination:'.swiper-pagination',
      loop : true,
      slidesPerView : 'auto',
      loopedSlides :8,
    });
    if($$('body').find(".tmm-swiper-pagination").hasClass('swiper-pagination') == false){
      $$(".tmm-swiper-pagination span:first-child").addClass("swiper-pagination-bullet-active");
      $$(".tmm-swiper-pagination").addClass('swiper-pagination');
    }
  },
  /*显示吃和玩的详情*/
  showBannerItemView: function() {
    item.showModalOverlay();

    $$("#tmm-banner-detail-content").appendTo($$("#tmm-banner-detail-head"));
    $$("#tmm-banner-detail-content").css('display', 'block');
    
    item.clickSwiperDetail();
  },

  /*显示住的详情*/
  showBannerHotelItemView: function() {
    item.showModalOverlay();
    
    $$("#tmm-banner-hotel-detail-content").appendTo($$("#tmm-banner-detail-head"));
    $$("#tmm-banner-hotel-detail-content").css('display', 'block');
    
    item.clickSwiperDetail();
  },

  hideBannerItemView: function() {
    if($$('body').find(".modal").hasClass("modal-in")){
      $$('body').find(".modal").remove();
      $$(".tmm-banner-detail").css("z-index", '11000');
      $$(".closeDeleteModal").css("z-index", '13000');
    }
    
    $$('body').find(".delete").css('display', 'none');
    $$("#tmm-banner-hotel-detail-content").css('display', 'none');
    $$("#tmm-banner-detail-content").css('display', 'none');
    $$(".tmm-banner-detail-show").removeClass('modal-overlay-visible');
    $$(".tmm-banner-detail-show").remove();
    $$(".tmm-swiper-pagination").removeClass('swiper-pagination');
    $$(".swiper-pagination-bullet").removeClass('swiper-pagination-bullet-active');
  },
  callContentPhone: function(){
    
    $$(".tmm-banner-detail").css("z-index", '10009');
    $$(".closeDeleteModal").css("z-index", '10010');  
    if($$('body').find(".modal-overlay").hasClass('tmm-banner-detail-show')){
      $$('body').find(".modal-overlay").removeClass('tmm-banner-detail-show')
    }

    var phone = $$(this).attr("data-phone");
    var callphone = phone.replace(/-/g, "");
    appFunc.detailCallService(phone,callphone);
  },

  shareMsg : function() {
    var title = $$(this).attr("data-title");
    var description = $$(this).attr("data-desc");
    var thumb_url = $$(this).attr("data-img");
    var type = $$(this).attr("data-type");
    var id = $$(this).attr("data-id");
    var webpageUrl = httpService.apiUrl + '/index.php?r=site/share&share='+id+'&type='+2;
    appFunc.shareMsg(title, description, thumb_url, webpageUrl);

  },

  bindEvent: function() {
    var bindings = [{
      element: '.views',
      selector: '#tmm-hotel-mask',
      event: 'click',
      handler: item.hideMapItemView
    }, {
      element: 'body',
      selector: '#showmoreMap',
      event: 'click',
      handler: item.showMapItemView
    }, {
      element: '.views',
      selector: '#tmm-hotel-infor-top',
      event: 'click',
      handler: item.showBannerHotelItemView
    }, {
      element: '.views',
      selector: '#tmm-infor-top',
      event: 'click',
      handler: item.showBannerItemView
    }, {
      element: 'body',
      selector: '.tmm-div-content-phone',
      event: 'click',
      handler: item.callContentPhone
    }, {
      element: 'body',
      selector: '.tmm-banner-detail-show',
      event: 'click',
      handler: item.hideBannerItemView
    }, {
      element: 'html',
      selector: '.closeDeleteModal',
      event: 'click',
      handler: item.hideBannerItemView
    }, { //分享
      element: 'html',
      selector: '.tmm-deta-share',
      event: 'click',
      handler: item.shareMsg
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = item;
