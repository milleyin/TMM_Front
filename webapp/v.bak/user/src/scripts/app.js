// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
'use strict';
angular.module('tmmApp', ['ionic', 'tmm.controllers'])

.run(function($ionicPlatform, $rootScope, $state, $ionicLoading,$log, getLineDetail, log) {
  $rootScope.$log = $log;

  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $logProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';

  $ionicConfigProvider.views.transition('ios');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.navBar.alignTitle('center');

  $logProvider.debugEnabled(true);

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider.state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'tpls/tabs.html',
    controller: 'MainCtrl'
  })

  .state('tab.recommend', {
    url: '/recommend',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/recommend.html',
        controller: 'RecommendCtrl'
      }
    }
  })

  .state('tab.dot-detail', {
    url: '/dot-detail/:link/:type',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/shop-dot-detail.html',
        controller: 'DotDetailCtrl'
      }
    }
  })

  .state('tab.dot-order-book', {
    url: '/dot-order-book',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/shop-dotorder-book.html'
      }
    }
  })

  .state('tab.line-order-book', {
    url: '/line-order-book',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/shop-lineorder-book.html'
      }
    }
  })

  .state('tab.eat-detail', {
    url: '/eat-detail/:link',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/shop-eat-detail.html',
        controller: 'EatDetailCtrl'
      }
    }
  })

  .state('tab.live-detail', {
    url: '/live-detail/:link',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/shop-live-detail.html',
        controller: 'EatDetailCtrl'
      }
    }
  })

  .state('tab.book-info', {
    url: '/book-info/:type/:id',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/shop-book-info.html',
        controller: 'BookInfoCtrl'
      }
    }
  })

  .state('tab.line-detail', {
    url: '/line-detail/:link/:type',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/shop-line-detail.html',
        controller: 'DotDetailCtrl'
      }
    }
  })

  .state('tab.act-detail', {
    url: '/act-detail/:link/:type',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/shop-act-detail.html',
        controller: 'DotDetailCtrl'
      }
    }
  })

  .state('tab.item', {
    url: '/item',
    views: {
      'tab-recommend': {
        templateUrl: 'tpls/item.html'
      }
    }
  })

  .state('tab.seek', {
    url: '/seek',
    views: {
      'tab-seek': {
        templateUrl: 'tpls/seek.html',
        controller: 'SeekCtrl'
      }
    }
  })

  .state('tab.seekFresh', {
    url: '/seekFresh',
    views: {
      'tab-seekFresh': {
        templateUrl: 'tpls/seek-fresh.html',
        controller: 'SeekFreshCtrl'
      }
    }
  })

  .state('tab.search', {
    url: '/search',
    views: {
      'tab-seek': {
        templateUrl: 'tpls/search.html',
        controller: 'SearchCtrl'
      }
    }
  })


  .state('tab.my', {
    url: '/my',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my.html',
        controller: 'MyCtrl'
      }
    }
  })

  .state('tab.mypraise', {
    url: '/mypraise',
    views: {
      'tab-my': {
        templateUrl: 'tpls/mypraise.html',
        controller: 'MyPraiseCtrl'
      }
    }
  })

  .state('tab.order', {
    url: '/order',
    views: {
      'tab-my': {
        templateUrl: 'tpls/order.html'
      }
    }
  })
  
  .state('tab.myorder', {
    url: '/myorder',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-order.html',
        controller: 'MyorderCtrl'
      }
    }
  })
  
  .state('tab.dot-order', {
    url: '/dot-order',
    views: {
      'tab-my': {
        templateUrl: 'tpls/dot-order.html'
      }
    }
  })
  
  .state('tab.launch-act', {
    url: '/launch-act',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-launch-act.html'
      }
    }
  })
  

  .state('tab.launch-actdeta', {
    url: '/launch-actdeta',
    views: {
      'tab-my': {
        templateUrl: 'tpls/launch-act-details.html'
      }
    }
  })

  .state('tab.mywallet', {
    url: '/mywallet',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-wallet.html',
        controller: 'MyWalletCtrl'
      }
    }
  })

  .state('tab.drawmoneyrecord', {
    url: '/drawmoneyrecord',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-drawmoney-record.html',
        controller:'DrawMoneyRecordCtrl'
      }
    }
  })

  .state('tab.drawmoneymessage', {
    url: '/drawmoneymessage',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-drawmoney-message.html',
        controller: 'MyWithDrawCtrl'
      }
    }
  })

  .state('tab.drawmoneyinfo', {
    url: '/drawmoneyinfo',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-drawmoney-info.html',
        controller: 'MyWithDrawInfoCtrl'
      }
    }
  })

  .state('tab.mywithdraw', {
    url: '/mywithdraw/:withdraw/:withdraw_format',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-withdraw.html',
        controller: 'MyWithDrawCtrl'
      }
    }
  })

  .state('tab.mybankcardmanagement', {
    url: '/mybankcardmanagement',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-bankcard-management.html',
        controller: 'MyBankCardCtrl'
      }
    }
  })

  .state('tab.newbank', {
    url: '/newbank',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-newbank.html',
        controller: 'MyBankCardCtrl'
      }
    }
  })

  .state('tab.changebank', {
    url: '/changebank',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-changebank.html',
        controller: 'MyBankCardCtrl'
      }
    }
  })

  .state('tab.bankprotocal', {
    url: '/bankprotocal',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-bankprotocal.html'
      }
    }
  })

  .state('tab.bankcardmessage', {
    url: '/bankcardmessage',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-bankcard-message.html',
        controller: 'MyBankCardCtrl'
      }
    }
  })

  .state('tab.traderecord', {
    url: '/traderecord',
    views: {
      'tab-my': {
        templateUrl: 'tpls/my-trade-record.html',
        controller: 'TradeRecordCtrl'
      }
    }
  })

  .state('tab.order-detail', {
    url: '/order-detail',
    views: {
      'tab-my': {
        templateUrl: 'tpls/order-detail.html'
      }
    }
  })

  .state('tab.login', {
      url: '/login',
      views: {
        'tab-my': {
          templateUrl: 'tpls/login.html',
          controller: 'LoginCtrl'
        }
      }
    })
    .state('tab.acc-login', {
      url: '/acc-login',
      views: {
        'tab-my': {
          templateUrl: 'tpls/acc-login.html',
          controller: 'AccLoginCtrl'
        }
      }
    })

  .state('tab.mob-login', {
    url: '/mob-login',
    views: {
      'tab-my': {
        templateUrl: 'tpls/mob-login.html',
        controller: 'MobLoginCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/recommend');

});
angular.module('tmm.controllers', ['tmm.services', 'tmm.directives']);
angular.module('tmm.services', []);
angular.module('tmm.directives', []);