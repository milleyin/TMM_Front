angular.module('item.detail', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.detail', {
      url: '/detial/:link',

      views: {
        'tab-item': {
          templateUrl: 'app/item/templates/itemDetail.html',
          controller: 'ItemDetailCtrl',
          resolve: {
            data: function(Resource, $stateParams) {
              return Resource.get($stateParams.link);
            }
          }

        }

      }
    });

}])

.controller('ItemDetailCtrl', function($scope,$sce, $ionicPopover, data) {
  $scope.model = data;
  $scope.contentHTML = $sce.trustAsHtml(data.content);


  $ionicPopover.fromTemplateUrl('app/item/templates/map.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.showMap = function () {
    $scope.popover.show();
  };
});
