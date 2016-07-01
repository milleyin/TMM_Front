angular.module('app', ['ionic',
  'security',
  'resources',
  'destination',
  'tools',
  'tmmui',
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

.run(function($ionicPlatform, $rootScope, $state, $log, $ionicPopup, $ionicLoading, device, Resource) {

  // Resource.getWeixinToken().then(function(data) {
  //   wx.config({
  //     debug: true,
  //     appId: data.appId,
  //     timestamp: data.timestamp,
  //     nonceStr: data.nonceStr,
  //     signature: data.signature,
  //     jsApiList: ['getLocation']
  //   });
  //   wx.getLocation({
  //     type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
  //     success: function(res) {
  //       var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
  //       var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
  //       var speed = res.speed; // 速度，以米/每秒计
  //       var accuracy = res.accuracy; // 位置精度
  //       alert(angular.toJson(res));
  //     }
  //   });
  // });


  device.getLocation(function(){
 
    $rootScope.$broadcast('refreshLocation');
  });



  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

    if (fromState.name) {
      $ionicLoading.show({
        template: error.msg,
        duration: 1000
      });
    } else {
      $ionicPopup.alert({
        title: error.msg,
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

  if (ENV.debug) {
    ENV.apiEndpoint = 'http://test2.365tmm.net';
    $logProvider.debugEnabled(true);
  } else {
    $logProvider.debugEnabled(false);
  }

  $stateProvider.state('tab', {
    abstract: true,
    templateUrl: 'app/base/templates/tabs.html',
    controller: 'TabBarCtrl'
  });

  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from our assets domain.  Notice the difference between * and **.
    'http://wap.koudaitong.com/**',
    'https://wap.koudaitong.com/**'
  ]);

  $urlRouterProvider.otherwise('/recommend');

})

.directive('tabBar', function() {

})

.controller('TabBarCtrl', function($scope, $state) {
  $scope.$on('$stateChangeSuccess', update);
  $scope.active = 'tab.recommend';

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
    var arr = ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];

    return arr[room_number] + '人间';
  }
})
