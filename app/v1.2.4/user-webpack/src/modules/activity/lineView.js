var log = require('../utils/log'),
  appFunc = require('../utils/appFunc'),
  select_line_tpl = require('./select-line.tpl.html'),
  line_li_tpl = require('./line-li.tpl.html'),
  line_detail_tpl = require('./line-detail.tpl.html'),
  act_success_tpl = require('./act-success.tpl.html'),
  edit_act_setting_tpl = require('./edit-act-setting.tpl.html');

var lineView = {
  /**
   * @method selectLine
   * @description 线的列表
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T17:03:28+0800
   */
  selectLine: function(dataRes) {

    var data = {
      'lineList': dataRes.list_data,
      'searchList': dataRes.search
    };

    var output = appFunc.renderTpl(select_line_tpl, data);

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
    var that = this;
    var bg_mask_seek_ele = $$('#tmm-select-line-page').find(".bg-mask-seek");

    if ($$(that).hasClass('active')) {
      if (bg_mask_seek_ele.css('display') === 'none') {
        bg_mask_seek_ele.css('display', 'block');
      } else {
        bg_mask_seek_ele.css('display', 'none');
      }
    } else {
      bg_mask_seek_ele.css('display', 'block');
    }


    var index = $$(that).index();
    var subList = $$(that).parent().parent().find('.tmm-seek-subbar .tmm-sublist');

    subList.eq(index).css({
      'maxHeight': $$('body').height() - 135 + 'px'
    });

    var style = subList.eq(index).css('display')
    if (style == 'block') {

      subList.eq(index).hide();
    } else if (style == 'none') {

      $$(that).parent().children().removeClass('active');
      $$(that).addClass('active');
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
   * @method getLineSelect
   * @description 选择标签搜索线
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T17:05:18+0800
   */
  getLineSelect: function(dataRes) {
    $$('.tmm-seek-subbar .tmm-sublist').hide();
    $$(".bg-mask-seek").hide();
    // 转成对象赋值给页面上
    var data = {
      'lineList': dataRes.list_data
    };

    var output = appFunc.renderTpl(line_li_tpl, data);

    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#myView').find('.tmm-select-line-card-list').html(output);
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
  refreshLineList: function(dataRes) {
    var data = {
      'lineList': dataRes.list_data
    };

    var output = appFunc.renderTpl(line_li_tpl, data);
    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#myView').find('.tmm-select-line-card-list').html(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
    // 通知下拉刷新完成
    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 100);

  },
  /**
   * @method  infiniteLineList
   * @description 无穷加载
   * 
   * @author Moore Mo
   * @datetime 2015-11-09T17:08:00+0800
   */
  infiniteLineList: function(dataRes) {
    $$(".bg-mask-seek").css('display', 'none');
    $$('.tmm-seek-subbar .tmm-sublist').hide();
    var data = {
      'lineList': dataRes.list_data
    };
    var output = appFunc.renderTpl(line_li_tpl, data);
    // 把后面获取的数据，追加到页面上
    $$('#myView').find('.tmm-select-line-card-list').append(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  getLineDetail: function(dataRes) {
    var data = {
      'lineObj': dataRes
    };



    var output = appFunc.renderTpl(line_detail_tpl, data);

    tmmApp.getCurrentView().router.load({
      content: output
    });

    var priceObj = $$('#myView').find('#tmm-act-line-detail').find('.tmm-count-price');
    var total_price = 0.00;
    $$.each(priceObj, function(index, value) {
      var dataObj = $$.dataset($$(value));
      if (dataObj.info != '儿童') {
        total_price += parseFloat(dataObj.price);
      }
    });

    $$('#myView').find('#tmm-act-line-detail').find('#total_price').html('￥' + total_price.toFixed(2) + '起/人');


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
      'actObj': dataRes,
      'flag': 'line'
    };
    var output = appFunc.renderTpl(edit_act_setting_tpl, renderData);
    tmmApp.getCurrentView().router.load({
      'content': output
    });
  }
}

module.exports = lineView;
