var log = require('../utils/log');
var appFunc = require('../utils/appFunc');
var template = require('./seek.tpl.html');
var listTemplate = require('../recommend/recommend.tpl.html');

var seekView = {

  /**
   * 获取探索主页数据
   * @return {[type]} [description]
   * @param {[type]} dataSeek 探索页面数据
   *
   * @author daixi
   */
  getSeekList: function(dataSeek) {

    var that = this;
    var renderData = {
      seek: dataSeek
    };


    // if ($$('#seekView .seek-page').length <1) {
    var output = appFunc.renderTpl(template, renderData);
    tmmApp.getCurrentView().router.load({
      content: output,
      reload: true
    });

    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
    // }

  },
  /**
   * 显示二级导航对应的列表
   * @return {[type]} [description]
   */
  showSubList: function() {
    var that = this;
    var bg_mask_seek_ele = $$('#tmm-seek-page').find(".bg-mask-seek");

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

  hideSubList: function() {
    log.info("关闭标签");
    $$(".bg-mask-seek").css('display', 'none');
    var subList = $$('.tmm-seek-subbar .tmm-sublist');
    subList.hide();
  },

  /**
   * 用户选择标签后展现的列表
   * @param  {[type]} dataSeek 后台数据
   * @return {[type]}         [description]
   */
  getSeekSelect: function(dataSeek) {
    $$(".bg-mask-seek").css('display', 'none');
    // 转成对象赋值给页面上
    var data = {
      recommend: dataSeek.list_data
    };

    var output = appFunc.renderTpl(listTemplate, data);

    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#seekView').find('.tmm-seek-page-contnet ul').html(output);
    // 把滚动条置顶

    $$('#seekView .page-content').scrollTop(0);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  },
  /**
   * 刷新视图渲染
   * @param  {[type]} dataList [description]
   * @return {[type]}          [description]
   */
  refreshSeekList: function(dataList) {
    var data = {
      recommend: dataList.list_data
    };

    var output = appFunc.renderTpl(listTemplate, data);
    // 模板编译成功后，把编译好的完整页面内容赋值到 推荐视图容器中，渲染到页面去
    $$('#seekView').find('.tmm-seek-page-contnet ul').html(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
    // 通知下拉刷新完成
    setTimeout(function() {
      tmmApp.pullToRefreshDone();
    }, 100);

  },
  /**
   * @method infiniteSeekList
   * @description 无穷加载获取推荐列表后进行编译渲染
   * 
   * @param    {Array} dataRes 点，线，觅趣的数据
   * 
   * @author Moore Mo
   * @dateTime 2015-10-24T02:15:39+0800
   */
  infiniteSeekList: function(dataRes) {
    $$(".bg-mask-seek").css('display', 'none');
    $$('.tmm-seek-subbar .tmm-sublist').hide();
    var data = {
      recommend: dataRes.list_data
    };
    var output = appFunc.renderTpl(listTemplate, data);
    // 把后面获取的数据，追加到页面上
    $$('#seekView').find('.tmm-seek-page-contnet ul').append(output);
    // 实现图片懒加载...
    tmmApp.initImagesLazyLoad(tmmApp.getCurrentView().activePage.container);
  }
}

module.exports = seekView;
