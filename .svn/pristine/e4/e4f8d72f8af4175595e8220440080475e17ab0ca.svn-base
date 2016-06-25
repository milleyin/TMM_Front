
angular.module('app', ['ionic', 'resources', 'security','login','tools', 'recommend', 'my', 'shop', 'item', 'login', 'wallet'])


.constant('API_CONFIG', {
  url: 'http://test2.365tmm.net'
})

.run(function($ionicPlatform, $rootScope, $state, $log, $ionicPopup, $ionicLoading) {
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

  $rootScope.$on('$stateChangeError', function(event, toState, toParams, fromState, fromParams, error) {

    if (fromState.name) {
      $ionicLoading.show({
        template: error.msg,
        duration : 1000
      });
    } else {
      $ionicPopup.alert({
        title: error.msg,
        okText: '确认'
      }).then(function() {
        $state.go('tab.recommend')
      })
    }

  })
})

.config(function($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider, $logProvider) {
  $httpProvider.defaults.withCredentials = true;
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';

  $ionicConfigProvider.views.transition('ios');
  $ionicConfigProvider.tabs.position('bottom');
  $ionicConfigProvider.tabs.style('standard');
  $ionicConfigProvider.navBar.alignTitle('center');

  // $ionicConfigProvider.views.transition('none');
  
  $logProvider.debugEnabled(true);


  $stateProvider.state('tab', {
    abstract: true,
    templateUrl: 'app/base/tabs.html',
    controller: 'TabBarCtrl'
  })

  $urlRouterProvider.otherwise('/recommend');

})

.controller('TabBarCtrl', function($scope, $state) {
  $scope.$on('$stateChangeSuccess', update);
  $scope.active = 'tab.recommend';

  function update() {
    $scope.active = $state.current.name;
  }
})

