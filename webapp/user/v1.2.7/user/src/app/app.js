angular.module('app', ['ionic',
  'security',
  'resources',
  'destination',
  'tools',
  'tmmui',
  'index',
  'recommend',
  'fresh',
  'order',
  'my',
  'shop',
  'item',
  'login',
  'wallet',
  'payment',
  'mypraise',
  'myorder',
  'payType',
  'myjoinact',
  'calendar',
  'device'
])

.run(function($ionicPlatform, $rootScope, $state, $log, $ionicPopup, $ionicLoading, device, ENV, Resource) {

  if (ENV.device === 'weixin') {

    device.getLocation(function() {
      $rootScope.$broadcast('refreshLocation');
    });
  }

  if (ENV.device === 'app') {
    if (ENV.android) {
      try {
        var str = window.jsObj.sendLocation();
        var arr = str.split("*");
        var dataLoation = {
          "location": {
            "lng": arr[1], //维度 小数点后不超过6位
            "lat": arr[0] //经度 小数点后不超过6位
          }
        }

        Resource.setLoactionGPS(dataLoation).then(function(data) {

        }, function(data) {

        });
      } catch (e) {

      }

    }

  }

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

    if (fromState.name) {
      $ionicLoading.show({
        template: error.msg,
        duration: 1000
      });
    } else {
      $ionicPopup.alert({
        title: error.msg,
        cssClass: 'tmm-ionic-alert',
        okText: '确认'
      }).then(function() {
        $state.go('tab.recommend');
      });
    }

  });
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, $sceDelegateProvider, $ionicConfigProvider, $logProvider, ENV) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';

  $ionicConfigProvider.views.transition('ios');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.scrolling.jsScrolling(false);
  $ionicConfigProvider.navBar.alignTitle('center');

  function isWeixin() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == "micromessenger") {
      return true;
    } else {
      return false;
    }
  }

  ENV.isWeixin = isWeixin();
  ENV.android = ionic.Platform.isAndroid();
  ENV.iOS = ionic.Platform.isIOS();

  if (ENV.debug) {
    ENV.apiEndpoint = 'http://test2.365tmm.net';
    $logProvider.debugEnabled(true);
  } else {
    $logProvider.debugEnabled(false);
  }

  // 插入css样式表
  function addcss() {
    var css = '.has-header { top: 64px;} .navbar{padding-top: 20px}';
    var head = document.getElementsByTagName('head')[0];
    var s = document.createElement('style');
    s.setAttribute('type', 'text/css');
    s.appendChild(document.createTextNode(css));
    head.appendChild(s);
  }

  if (ENV.device === 'app' && ENV.iOS) {
    addcss();
  }

  // 友盟统计
  var youmenUrl = '';
  if (ENV.device === 'app') {
    youmenUrl = "https://s4.cnzz.com/z_stat.php?id=1259610452&web_id=1259610452";
  } else {
    youmenUrl = "https://s95.cnzz.com/z_stat.php?id=1259610736&web_id=1259610736";
  }

  addScript(youmenUrl);

  // 动态创建script标签
  function addScript(src) {
    var script = document.createElement("script");
    script.setAttribute("language", "JavaScript");
    script.setAttribute("src", src);
    document.body.appendChild(script);
  }

  $stateProvider.state('tab', {
    abstract: true,
    templateUrl: 'app/base/templates/tabs.html',
    controller: 'TabBarCtrl'
  });

  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    '**',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://wap.koudaitong.com/**',
    'https://wap.koudaitong.com/**'
  ]);

  $urlRouterProvider.otherwise('/index');

})

.directive('tabBar', function() {

})

.controller('TabBarCtrl', function($scope, $state) {
  $scope.$on('$stateChangeSuccess', update);
  $scope.active = 'tab.index';

  function update() {
    $scope.active = $state.current.name;
  }
})

.filter('formatDay', function() {
  return function(num) {
    num = parseInt(num);
    var arr = ['第一天', '第一天', '第二天', '第二天', '第三天', '第三天', '第四天', '第四天', '第五天', '第五天', '第六天', '第六天', '第七天', '第七天', '第八天', '第八天', '第九天', '第九天', '第十天', '第十天'];

    return arr[num];
  }
})

.filter('room', function() {
  return function(room_number) {
    room_number = parseInt(room_number);
    var arr = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

    return arr[room_number] + '人间';
  }
})
