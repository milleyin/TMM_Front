var httpService = require('../services/httpService'),
    appFunc = require('../utils/appFunc'),
    log = require('../utils/log'),
    actMoreView = require('./hotMoreView');

/**
 * 下一的页面链接
 * @type {String}
 */
var nextPageLink = '';
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var loading = false;
/**
 * 控制滚动加载的flag
 * @type {Boolean}
 */
var moreLoading = false;


var hotMore = {
    init: function() {
        hotMore.bindEvent();
        hotMore.getHotMore();
    },


    //获取觅趣专题更多
    getHotMore: function() {
        appFunc.hideToolbar();
        actMoreView.getHotMoreList();
    },

    bindEvent: function() {

        var bindings = [ ];

        appFunc.bindEvents(bindings);
    }
};

module.exports = hotMore;
