angular.module('tmmTools', [])

.service('autoRefresh', function($timeout, $ionicScrollDelegate) {
  this.start = function(delegateHandle) {

    $timeout(function() {

      var scrollView = $ionicScrollDelegate.$getByHandle(delegateHandle).getScrollView();

      if (!scrollView) return;

      scrollView.__publish(
        scrollView.__scrollLeft, -scrollView.__refreshHeight,
        scrollView.__zoomLevel, true);

      var d = new Date();

      scrollView.refreshStartTime = d.getTime();

      scrollView.__refreshActive = true;
      scrollView.__refreshHidden = false;
      if (scrollView.__refreshShow) {
        scrollView.__refreshShow();
      }
      if (scrollView.__refreshActivate) {
        scrollView.__refreshActivate();
      }
      if (scrollView.__refreshStart) {
        scrollView.__refreshStart();
      }

    });

  };

})


.directive('hideTabs', function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {

      scope.$on('$ionicView.beforeEnter', function() {
        scope.$watch(attributes.hideTabs, function(value) {
          $rootScope.hideTabs = 'tabs-item-hide';
        });

      });

      scope.$on('$ionicView.beforeLeave', function() {
        scope.$watch(attributes.hideTabs, function(value) {
          $rootScope.hideTabs = 'tabs-item-hide';
        });
        scope.$watch('$destroy', function() {
          $rootScope.hideTabs = '';
        });

      });
    }
  };
})

.directive('navBack', function($ionicHistory, $ionicViewSwitcher, $state) {

  return {
    restrict: 'A',
    link: function(scope, element, attr) {


      if (!attr.ngClick) {
        element.bind('click', function() {

          $ionicViewSwitcher.nextDirection('back');
          if ($ionicHistory.viewHistory().backView) {
            $ionicHistory.goBack();
          } else {
            var rootView = '';
            
            if ('tab-item' in $state.current.views) {
              rootView = 'tab.item';
            } else if ('tab-order' in $state.current.views) {
              rootView = 'tab.order';
            } else if ('tab-my' in $state.current.views) {
              rootView = 'tab.my'
            }

            $ionicHistory.clearCache().then(function() { $state.go(rootView);});
          }
        });
      }
    }
  };

})

.directive('barClass', function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      scope.$on('$ionicView.beforeEnter', function() {

        $rootScope.barClass = attributes.barClass;
      })
      scope.$on('$ionicView.beforeLeave', function() {

        $rootScope.barClass = '';
      })
    }

  };
})

.controller('NavbarController', function() {

})

.directive('navbar', function($compile, ENV) {

  return {
    restrict: 'E',
    replace: true,
    controller: 'NavbarController',
    transclude: true,
    template: '<div class="navbar-wrap"><div ng-transclude class="tmm-navbar"></div></div>',
    link: function(scope, element, attr, ctrl) {

      var navbar = angular.element(element.find('div')[0]);


      if ('back' in attr) {
        navbar.prepend($compile('<div class="left"><i class="icon-back" nav-back="back"></i></div>')(scope));
      }
      if ('title' in attr) {
        navbar.append('<div class="title">' + attr.title + '</i></div>');
      }
    }
  };

})
