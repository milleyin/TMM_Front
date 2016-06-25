angular.module('my', ['myInfo', 'mycreateact'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.my', {
      url: '/my',

      templateUrl: 'app/my/templates/my.html',
      controller: 'MyCtrl',
      resolve: {
        data: function($ionicViewSwitcher, $ionicHistory) {
          var currentView = $ionicHistory.currentView();
          if (currentView && (currentView.stateName == 'tab.recommend' || currentView.stateName == 'tab.seek' || currentView.stateName == 'tab.my')) {
            $ionicViewSwitcher.nextTransition("none");
          }
        }
      }
    });
    
}])

.controller('MyCtrl', function($scope, $ionicHistory, security, Resource) {  
  $scope.userInfo = security.currentUser;

  $scope.$on("$ionicView.enter", function() {
      //加载用户信息
      security.getUserInfo().then(function(data) {
        $scope.userInfo = data.userInfo;
      }, function(data) {
        $scope.userInfo = null;
      });

      $ionicHistory.clearHistory();
  });

  $scope.$on('getUserInfo', function(msg, currentUser) {
    $scope.userInfo = currentUser;
  });

  //退出用户登录
  $scope.logout = function() {
    Resource.logOut().then(function(data) {
      $scope.userInfo = null;
      security.userInfo = null;
    }, function(data) {

    });
  };

  $scope.login = function() {
    security.login();
  };

});
