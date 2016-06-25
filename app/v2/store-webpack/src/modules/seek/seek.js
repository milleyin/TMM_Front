var appFunc = require('../utils/appFunc'),
  log = require('../utils/log'),
  template = require('./seek.tpl.html');

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


var seek = {
  init: function() {
    this.bindEvents();
  },
  getSeekList: function() {
    log.info('getSeekList....');
    var that = this;
    seek.renderSeek({});

  },
  renderSeek: function(data, type) {
    var renderData = {
      seekList: data
    };
    var output = appFunc.renderTpl(template, renderData);
    if (type === 'prepend') {
      $$('#seekView').find('.tmm-seek-page-contnet ul').prepend(output);
    } else if (type === 'append') {
      $$('#seekView').find('.tmm-seek-page-contnet ul').append(output);
    } else {
      $$('#seekView').find('.tmm-seek-page-contnet ul').html(output);
    }
  },
  bindEvents: function() {
    var bindings = [{
      element: '#seekView',
      event: 'show',
      handler: seek.getSeekList
    }];

    appFunc.bindEvents(bindings);
  }
};

module.exports = seek;
