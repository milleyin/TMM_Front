angular.module('item', [])

.config(['$stateProvider', function($stateProvider) {

  $stateProvider
    .state('tab.item', {
      url: '/item/:link',
      templateUrl: 'app/items/shop-eat-detail.html',
      controller: 'EatItemCtrl',
      resolve: {
        data: function(Resource, $stateParams) {
          return Resource.get($stateParams.link);
        }
      }
    })

}])
.controller('EatItemCtrl', function($scope, data) {
  $scope.info = data;
  console.log(data)
})