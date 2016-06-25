require('framework7');
require('framework7.ios.css');
require('framework7.ios.colors.css');
// 自定义的css
require('../styles/css/iconfont.css');
require('../styles/css/commond.css');
require('../styles/css/recommend.css');
require('../styles/css/seek.css');
require('../styles/css/my.css');
require('../styles/css/myinfo.css');
require('../styles/css/search.css');

var appFunc = require('./utils/appFunc'),
  appService = require('./services/appService'),
  router = require('./router'),
  appModule = require('./app/app');

var app = {
  initialize: function() {
    this.initMainView();
  },
  initMainView: function() {
    var lang = appService.getLocal();

    switch (lang) {
      case 'en-us':
        require(['./lang/en-us'], function(lang) {
          window.i18n = lang;
          app.initFramework7();
        });
        break;
      case 'zh-cn':
        require(['./lang/zh-cn'], function(lang) {
          window.i18n = lang;
          app.initFramework7();
        });
        break;
    }

  },
  initFramework7: function() {

    //Register custom Template7 helpers
    Template7.registerHelper('t', function(options) {
      var key = options.hash.i18n || '';
      var keys = key.split('.');

      var value;
      for (var idx = 0, size = keys.length; idx < size; idx++) {
        if (value != null) {
          value = value[keys[idx]];
        } else {
          value = i18n[keys[idx]];
        }

      }
      return value;
    });

    window.$$ = Dom7;
    window.tmmApp = new Framework7({
      pushState: false,
      popupCloseByOutside: false,
      animateNavBackIcon: true,
      modalTitle: i18n.global.modal_title,
      modalButtonOk: i18n.global.modal_button_ok,
      modalButtonCancel: i18n.global.cancel,
      template7Pages: true,
      template7Data: {
        'page:item': {
          back: i18n.global.back,
          title: i18n.item.title,
          comment: i18n.timeline.comment,
          forward: i18n.timeline.forward
        },
        'page:message': {
          chat: i18n.chat.title,
          chatPlaceholder: i18n.chat.chatPlaceholder,
          send: i18n.global.send
        },
        'page:feedback': {
          feedBack: i18n.setting.feed_back,
          feedBackPlaceholder: i18n.setting.feed_back_placeholder
        },
        'page:about': {
          appName: i18n.app.name,
          about: i18n.setting.about
        },
        'page:language': {
          back: i18n.global.back,
          done: i18n.global.done,
          switchLanguage: i18n.global.switch_language
        }
      },
      preprocess: router.preprocess
    });

    window.homeF7View = tmmApp.addView('#recommendView', {
      dynamicNavbar: true
    });

    tmmApp.addView('#seekView', {
      dynamicNavbar: true
    });

    tmmApp.addView('#myView', {
      dynamicNavbar: true
    });

    // init app
    router.init();
    appModule.init();
  }
};

app.initialize();
