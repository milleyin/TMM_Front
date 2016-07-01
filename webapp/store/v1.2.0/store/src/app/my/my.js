angular.module('my', ['myInfo', 'disposit'])



.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.my', {
      url: '/my',
      views: {
        'tab-my': {
          templateUrl: 'app/my/templates/my.html',
          controller: 'myCtrl',
        }
      }

    });

}])

.controller('myCtrl', function($scope, $ionicActionSheet, $ionicHistory, security, Resource) {

  // security.getUserInfo().then(function(data) {
  //   $scope.model = data;
  // })

  $scope.$on("$ionicView.enter", function() {
    security.getUserInfo().then(function(data) {
      $scope.model = data;
    })
    $ionicHistory.clearHistory();

  });

  // 登录成功
  $scope.$on("loginSuccess", function(data, msg) {
    $scope.model = msg;
  });

  $scope.loginOut = function() {
    var hideSheet = $ionicActionSheet.show({
      buttons: [
        { text: '退出登录' }
      ],
      destructiveText: '取消',
      cssClass: 'tmm-action-sheet',
      destructiveButtonClicked: function() {
        return true;
      },
      buttonClicked: function() {
        Resource.loginOut().then(function(data) {
          security.userInfo = null;
          security.login();
        }, function(data) {

        });

        return true;
      }
    });
  }
});
