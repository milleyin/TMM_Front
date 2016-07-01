angular.module('fresh', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.fresh', {
      url: '/fresh',

      templateUrl: 'app/fresh/templates/fresh.html',
      controller: 'FreshCtrl'

    })
    .state('tab.fresh-item', {
      url: '/fresh-item/:name/:link',

      templateUrl: 'app/fresh/templates/fresh-item.html',
      controller: 'FreshItemCtrl'

    })
    

}])

.controller('FreshCtrl', function($scope) {
  $scope.link = 'http://wap.koudaitong.com/v2/showcase/feature?alias=129wsjuci'
})

.controller('FreshItemCtrl', function($scope, $stateParams) {

  $scope.link = $stateParams.link;
  $scope.name = $stateParams.name;
});
