var httpService = require('../services/httpService'),
    appFunc = require('../utils/appFunc'),
    log = require('../utils/log'),
    actMoreView = require('./actMoreView');

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


var actMore = {
    init: function() {
        actMore.bindEvent();
        actMore.getActMore();
    },


    //获取觅趣专题更多
    getActMore: function() {
        appFunc.hideToolbar();
        actMoreView.getActMoreList();
    },

    bindEvent: function() {

        var bindings = [];

        appFunc.bindEvents(bindings);
    }
};

module.exports = actMore;
