var log = require('../utils/log'),
  appFunc = require('../utils/appFunc'),
  select_dot_tpl = require('./select-dot.tpl.html'),
  dot_li_tpl = require('./dot-li.tpl.html'),
  dot_detail_tpl = require('./dot-detail.tpl.html'),
  itinerary_tpl = require('./itinerary.tpl.html'),
  edit_itinerary_tpl = require('./edit-itinerary.tpl.html'),
  itinerary_item_tpl = require('./itinerary-item.tpl.html'),
  edit_itinerary_item_tpl = require('./edit-itinerary-item.tpl.html'),
  act_success_tpl = require('./act-success.tpl.html'),
  edit_act_setting_tpl = require('./edit-act-setting.tpl.html');

var dotView = {
  /**
   * @method selectDot
   * @description 点的列表
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T17:03:28+0800
   */
  selectDot: function(dataRes) {

    var data = {
      'dotList': dataRes.list_data,
      'searchList': dataRes.search
    };

    var output = appFunc.renderTpl(select_dot_tpl, data);

    tmmApp.getCurrentView().router.load({
      content: output
    });
  },
  /**
   * @method showSubList
   * @description 显示二级导航
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T17:04:35+0800
   */
  showSubList: function() {
    $$(".bg-mask-seek").css('display', 'block');
    var index = $$(this).index();
    var subList = $$('.tmm-seek-subbar .tmm-sublist');

    subList.eq(index).css({
      'maxHeight': $$('body').height() - 135 + 'px'
    });

    var style = subList.eq(index).css('display')
    if (style == 'block') {

      subList.eq(index).hide();
    } else if (style == 'none') {

      $$(this).parent().children().removeClass('active');
      $$(this).addClass('active');
      subList.hide();
      subList.eq(index).show();
    }
  },
  /**
   * @method hideSubList
   * @description 隐藏二级导航
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T17:04:35+0800
   */
  hideSubList: function() {
    $$(".bg-mask-seek").css('display', 'none');
    var subList = $$('.tmm-seek-subbar .tmm-sublist');
    subList.hide();
  },
  /**
   * @method getDotSelect
   * @description 选择标签搜索点
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T17:05:18+0800
   */
  getDotSelect: function(dataRes) {
    $$('.tmm-seek-subbar .tmm-sublist').hide();
    $$(".bg-mask-seek").hide();
    // 转成对象赋值给页面上
    var data = {
      'dotList': dataRes.list_data
    };

    var output = appFunc.renderTpl(dot_li_tpl, data);

    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#myView').find('.tmm-select-dot-card-list').html(output);
    // 把滚动条置顶
    $$('#myView .page-content').scrollTop(0);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  /**
   * @method  refreshLineList
   * @description 上拉刷新线列表
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T17:08:00+0800
   */
  refreshDotList: function(dataRes) {
    var data = {
      'dotList': dataRes.list_data
    };

    var output = appFunc.renderTpl(dot_li_tpl, data);
    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#myView').find('.tmm-select-dot-card-list').html(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
    // 通知下拉刷新完成
    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 1000);

  },
  /**
   * @method  infiniteLineList
   * @description 无穷加载
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T17:08:00+0800
   */
  infiniteDotList: function(dataRes) {
    $$(".bg-mask-seek").css('display', 'none');
    $$('.tmm-seek-subbar .tmm-sublist').hide();
    var data = {
      'dotList': dataRes.list_data
    };
    var output = appFunc.renderTpl(dot_li_tpl, data);
    // 把后面获取的数据，追加到页面上
    $$('#myView').find('.tmm-select-dot-card-list').append(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  getDotDetail: function(dataRes) {
    var data = {
      'dotObj': dataRes
    };

    var output = appFunc.renderTpl(dot_detail_tpl, data);

    tmmApp.getCurrentView().router.load({
      content: output
    });
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  getItinerary: function(operationFlag, dataRes) {
    var data = {
      'actList': dataRes
    };



    if (operationFlag == 'add') {
      var output = appFunc.renderTpl(itinerary_tpl, data);
      tmmApp.getCurrentView().router.load({
        content: output
      });
    } else if (operationFlag == 'edit') {
      var output = appFunc.renderTpl(edit_itinerary_item_tpl, data);
      tmmApp.getCurrentView().router.back({
        'pageName': 'edit-itinerary',
        'force': true
      });
      $$('#myView').find('#itinerary-page-content').html(output);
    }

    dotView.updateTotalPrice();
  },
  updateTotalPrice: function() {
    var priceObj = $$('#myView').find('#itinerary-page').find('.tmm-count-price');
    var total_price = 0.00;
    $$.each(priceObj, function(index, value) {
      var dataObj = $$.dataset($$(value));
      if (dataObj.info != '儿童') {
        total_price += parseFloat(dataObj.price);
      }
    });

    $$('#myView').find('#itinerary-page').find('#total_price').html('￥' + total_price.toFixed(2) + '起/人');
  },
  refreshItinerary: function(operationFlag, dataRes) {
    var data = {
      'actList': dataRes
    };
    if (operationFlag == 'add') {
      var output = appFunc.renderTpl(itinerary_item_tpl, data);
    } else if (operationFlag == 'edit') {
      var output = appFunc.renderTpl(edit_itinerary_item_tpl, data);
    }
    $$('#myView').find('#itinerary-page-content').html(output);

    dotView.updateTotalPrice();
  },
  showSuccessView: function(name) {
    var data = {
      'name': name
    };
    var output = appFunc.renderTpl(act_success_tpl, data);
    tmmApp.getCurrentView().router.load({
      content: output
    });
  },
  showEditView: function(dataRes) {
    var renderData = {
      'actList': dataRes
    };
    var output = appFunc.renderTpl(edit_itinerary_tpl, renderData);
    tmmApp.getCurrentView().router.load({
      'content': output
    });

    dotView.updateTotalPrice();
  },
  showSettingView: function(dataRes) {
    var renderData = {
      'actObj': dataRes,
      'flag': 'dot'
    };
    var output = appFunc.renderTpl(edit_act_setting_tpl, renderData);
    tmmApp.getCurrentView().router.load({
      'content': output
    });
  }
}

module.exports = dotView;
