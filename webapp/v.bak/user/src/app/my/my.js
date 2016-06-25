angular.module('my', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.my', {
      url: '/my',
      templateUrl: 'app/my/my.html',
      controller: 'MyCtrl',
      resolve: {
        data: function($ionicViewSwitcher, $ionicHistory) {
          var currentView = $ionicHistory.currentView();
          if (currentView && (currentView.stateName == 'tab.recommend' || currentView.stateName == 'tab.seek' || currentView.stateName == 'tab.my')) {
            $ionicViewSwitcher.nextTransition("none")
          }
        }
      }

    })

}])

.controller('MyCtrl', function($scope, $ionicModal, security) {
  $scope.model = {};

  security.getUser().then(function(data) {
    $scope.model = data;
    $scope.model.isLogin = true;
  });


  $scope.logout = function() {
    security.logout().then(function(data) {
      $scope.model.isLogin = false;
    });
  }

  $ionicModal.fromTemplateUrl('app/login/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.login = function() {
     $scope.modal.show();
  }

})
