require('framework7');
require('framework7.ios.css');
require('framework7.ios.colors.css');
// 自定义的css
require('../styles/css/iconfont.css');
require('../styles/css/commond.css');
require('../styles/css/recommend.css');
require('../styles/css/seek.css');
require('../styles/css/my.css');
require('../styles/css/daixi-my.css');
require('../styles/css/daixi-activity.css');
require('../styles/css/myinfo.css');
require('../styles/css/search.css');
require('../styles/css/items.css');
//唐亚敏增加
require('../styles/css/tym-activity.css');
require('../styles/css/activity-detail.css');
require('../styles/css/tym-wallet.css');

var appFunc = require('./utils/appFunc'),
  router = require('./router'),
  appModule = require('./app/app'),
  retinueSelectDefault = []; //保存复选框选中的值

var app = {
  initialize: function() {
    this.initFramework7();
  },
  initFramework7: function() {
    Template7.registerHelper('room', function(number) {
      var number = parseInt(number, 10);
      if (number) {
        var roomObj = {
          1: '单人间',
          2: "双人间",
          3: '三人间',
          4: '四人间',
          5: '五人间',
          6: '六人间',
          7: '七人间',
          8: '八人间',
          9: '九人间',
          10: '十人间'
        };
        return roomObj[number];
      } else {
        return 0;
      }

    });

    Template7.registerHelper('showDay', function(day) {

      var num_han = function(num) {
        if (num >= 100) {
          return num;
        }
        if (day_num >= 100) {
          return '第' + day_num + '天' + wu + '午';
        } else {
          var zi = {
            0: '零',
            1: '一',
            2: '二',
            3: '三',
            4: '四',
            5: '五',
            6: '六',
            7: '七',
            8: '八',
            9: '九',
            10: '十'
          };
          if (num > 10 || num < 0 || isNaN(num)) {
            if (num > 10) {
              var str = num + '';
              var nu = '';
              for (var i = 0, len = str.length; i < len; i++) {
                var j = i == 0 ? zi[10] : '';
                if (str[i] != 0) {
                  nu += num_han(str[i]) + j;
                }
              }
              return nu;
            } else {
              return num;
            }
          } else {
            return zi[num];
          }
        }

      };

      // 计算上下午
      var wu = day % 2 == 1 ? '上' : '下';
      // 计算第几天
      var day_num = Math.ceil(day / 2);

      return '第' + num_han(day_num) + '天' + wu + '午';
    });

    Template7.registerHelper('formatStartDate', function(date) {
      return date.replace(/-/g, '.');
    });
    Template7.registerHelper('formatEndDate', function(date) {
      return date.slice(5).replace(/-/g, '.');
    });

    window.$$ = Dom7;
    window.tmmApp = new Framework7({
      imagesLazyLoadThreshold: 300,
      popupCloseByOutside: false,
      animateNavBackIcon: true,
      modalTitle: '',
      modalButtonOk: '确定',
      modalButtonCancel: '取消',
      fastClicksDelayBetweenClicks: 200,
      showBarsOnPageScrollEnd: false,
      template7Pages: true,
      template7Data: {

      }
    });

    window.homeF7View = tmmApp.addView('#recommendView', {
      dynamicNavbar: true,
      domCache: true
    });

    tmmApp.addView('#seekView', {
      dynamicNavbar: true,
      domCache: true
    });

    tmmApp.addView('#seekFreshView', {
      dynamicNavbar: true,
      domCache: true
    });
    
    tmmApp.addView('#myView', {
      dynamicNavbar: true,
      domCache: true
    });

    // init app
    router.init();
    appModule.init();
  }
};


app.initialize();
