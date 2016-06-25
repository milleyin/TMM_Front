angular.module('tmmui', [])
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

.directive('barClass', function($rootScope) {
  return {
    restrict: 'A',
    link: function(scope, element, attributes) {
      scope.$on('$ionicView.beforeEnter', function() {

        $rootScope.barClass = attributes.barClass;
      });
      scope.$on('$ionicView.beforeLeave', function() {

        $rootScope.barClass = '';
      });
    }

  };
})

.directive('loadIcon', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<div class="load-more"><ion-spinner icon="dots"></ion-spinner></div>'
  }
})

.directive('navBack', function($ionicHistory, $ionicViewSwitcher, $state, backStep) {

  return {
    restrict: 'A',
    link: function(scope, element, attr) {

      if (!attr.ngClick) {

        element.bind('click', function() {
          $ionicViewSwitcher.nextDirection('back');
          if ($ionicHistory.viewHistory().backView) {

            $ionicHistory.goBack(backStep.step);
            backStep.step = -1;
          } else {
            var rootView = '';

            $ionicHistory.clearCache().then(function() { $state.go('tab.index') });
          }
        });
      }
    }
  };

})


.controller('SilderController', ['$scope', '$element', function($scope, $element) {
  var self = this,
    w = window.innerWidth,
    ratio = $element.attr('ratio'),
    spacetime = $element.attr('spacetime'),
    index = 0,
    aLi = [],
    elms = [],
    oUl = document.createElement('ul'),
    hoverColor = "#007aff";

  var lock = true;
  var timer = null;
  if (ratio) {
    w = w * ratio;
  }

  var h = w * 2 / 3;
  $element.css({
    'height': h + 'px'
  });

  var ele = $element[0].querySelector('.img-wrap');
  bindDOM();
  self.init = function() {
    index = 0;
    render();

    goIndex(index);
  };


  if (spacetime) {
    timer = setInterval(autoSilder, +spacetime);
  }


  self.reset = function() {
    elms = [];
    aLi = [];
  };
  self.addElm = function(elm) {
    elms.push(elm);
  };

  function autoSilder() {
    if (index == elms.length - 1) {
      index = -1;
    }
    goIndex(++index);
  }

  function render() {
    oUl.innerHTML = '';
    var ch = h-15;
    oUl.style.cssText = "width: 100%;line-height: 0; text-align:center;position: absolute; top:"+ ch +"px; z-index: 11;text-align: center;";
    for (var i = 0, len = elms.length; i < len; i++) {
      var oLi = document.createElement('li');

      oLi.style.cssText = "display:inline-block; width:5px; height:5px; margin:0 8px; border-radius:50%; background-color:#fff;";
      oUl.appendChild(oLi);
      aLi.push(oLi);
    }
    if(elms.length > 1){
      $element[0].parentNode.appendChild(oUl);
      aLi[index].style.backgroundColor = hoverColor;
    }

  }

  function bindDOM() {
    var startTime,
      startX,
      startY,
      offsetX,
      offsetY;

    var startHandler = function(ev) {
      clearInterval(timer);

      startTime = new Date() * 1;
      startX = ev.touches[0].pageX;
      startY = ev.touches[0].pageY;
      self.offsetX = 0;
    };

    var moveHandler = function(ev) {

      offsetX = ev.targetTouches[0].pageX - startX;
      offsetY = ev.targetTouches[0].pageY - startY;
      if (Math.abs(offsetX) > Math.abs(offsetY)) {
        ev.stopPropagation();
        ev.preventDefault();
        lock = false;
      }

      if (lock) {
        return;
      }
      offsetX = (offsetX >= w / 4) ? w / 4 : offsetX;

      ele.style.webkitTransition = '-webkit-transform 0s ease-out';
      ele.style.webkitTransform = 'translate3d(' + (-index * w + offsetX) + 'px, 0, 0)';
    };

    var endHandler = function(ev) {
      if (spacetime) {
        timer = setInterval(autoSilder, +spacetime);
      }
      if (lock) return;

      var boundary = w / 4;
      var endTime = new Date() * 1;

      if (endTime - startTime > 300) {
        if (offsetX >= boundary) {
          goStep(-1);
        } else if (offsetX <= -boundary) {
          goStep(1);
        } else {
          goStep(0);
        }
      } else {
        if (offsetX > 50) {
          goStep(-1);
        } else if (offsetX < -50) {
          goStep(1);
        } else {
          goStep(0);
        }
      }
      lock = true;
    };
    $element[0].addEventListener('touchstart', startHandler);
    $element[0].addEventListener('touchmove', moveHandler);
    $element[0].addEventListener('touchend', endHandler);
  }

  function goStep(n) {
    var oldIndex = index,
      len = elms.length;

    index = index + n;

    if (index > len - 1) {
      index = len - 1;
    } else if (index < 0) {
      index = 0;
    }

    goIndex(index);
  }

  function goIndex(index) {
    var len = elms.length;

    ele.style.webkitTransition = '-webkit-transform 0.2s ease-out';
    ele.style.webkitTransform = 'translate3d(-' + w * index + 'px, 0, 0)';

    for (var i = 0; i < len; i++) {
      aLi[i].style.backgroundColor = "#fff";
    }
    aLi[index].style.backgroundColor = hoverColor;
  }

}])

.directive('slider', function() {

  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    controller: 'SilderController',

    template: '<div ratio class="wrap"><div style="position: relative; width:100%; height: 100%;"><div class="img-wrap" ng-transclude></div></div></div>'
  }

})

.directive('sliderItem', function() {

  return {
    restrict: 'EA',
    require: '^slider',
    replace: true,
    template: '<img ng-src="{{imgsrc}}">',
    scope: {
      last: '=?',
      first: '=?',
      imgsrc: '=imgSrc'
    },
    link: function(scope, elm, attr, sliderCtrl) {

      if (scope.first) {
        sliderCtrl.reset();
      }
      sliderCtrl.addElm(elm[0]);

      if (scope.last) {
        sliderCtrl.init();
      }

    }

  }
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

      if (ENV.device === 'app' && ENV.iOS) {
        element.css({
          paddingTop: '20px'
        });
      }

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
