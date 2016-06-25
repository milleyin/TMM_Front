angular.module('tools',[])

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
        })

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
          // $ionicViewSwitcher.nextTransition('ios')
          $ionicViewSwitcher.nextDirection('back');
          if($ionicHistory.viewHistory().backView){
            $ionicHistory.goBack();
          } else {
            var rootView = ''
           
            $ionicHistory.clearCache().then(function(){ $state.go('tab.recommend')});
          }
        });
      }
    }
  }
    
})

.factory('autoRefresh', function($timeout, $ionicScrollDelegate) {
  return {
    start: function(delegateHandle) {
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
    }
  }
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

.controller('SilderController', ['$scope', '$element', function($scope, $element) {
  var self = this,
    w = window.innerWidth - 32,
    h = 194,
    index = 0,
    aLi = [],
    elms = [],
    hoverColor = "#007aff";

  self.init = function() {

    render();
    bindDOM();
  }

  self.addElm = function(elm) {
    elms.push(elm);
  }

  function render() {
    var oUl = document.createElement('ul');
    oUl.style.cssText = "width:100%; position:absolute; bottom:5px; text-align:center;"
    for (var i = 0, len = elms.length; i < len; i++) {
      var oLi = document.createElement('li');

      oLi.style.cssText = "display:inline-block; width:8px; height:8px; margin:0 8px; border-radius:50%; background-color:#fff;"

      elms[i].style.webkitTransform = 'translate3d(' + i * w + 'px, 0, 0)';
      oUl.appendChild(oLi);
      aLi.push(oLi);
    }
    $element[0].appendChild(oUl);
    aLi[index].style.backgroundColor = hoverColor;
  }

  function bindDOM() {
    var startTime,
      startX,
      offsetX

    var startHandler = function(ev) {
      startTime = new Date() * 1;
      startX = ev.touches[0].pageX;
      self.offsetX = 0;
    }

    var moveHandler = function(ev) {
      ev.preventDefault();

      offsetX = ev.targetTouches[0].pageX - startX;

      var i = index - 1;
      var m = i + 3;
      for (i; i < m; i++) {
        elms[i] && (elms[i].style.webkitTransition = '-webkit-transform 0s ease-out');
        elms[i] && (elms[i].style.webkitTransform = 'translate3d(' + ((i - index) * w + offsetX) + 'px, 0, 0)');
      }

    }

    var endHandler = function(ev) {
      ev.preventDefault();

      var boundary = w / 4;
      var endTime = new Date() * 1;

      if (endTime - startTime > 300) {
        if (offsetX >= boundary) {
          goIndex(-1);
        } else if (offsetX <= -boundary) {
          goIndex(1);
        } else {
          goIndex(0);
        }
      } else {
        if (offsetX > 50) {
          goIndex(-1);
        } else if (offsetX < -50) {
          goIndex(1);
        } else {
          goIndex(0);
        }
      }
    }

    $element[0].addEventListener('touchstart', startHandler);
    $element[0].addEventListener('touchmove', moveHandler);
    $element[0].addEventListener('touchend', endHandler);
  }

  function goIndex(n) {
    var oldIndex = index,
      len = elms.length;

    index = index + n;

    if (index > len - 1) {
      index = len - 1;
    } else if (index < 0) {
      index = 0;
    }

    elms[index].style.webkitTransition = '-webkit-transform 0.2s ease-out';
    elms[index - 1] && (elms[index - 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');
    elms[index + 1] && (elms[index + 1].style.webkitTransition = '-webkit-transform 0.2s ease-out');

    elms[index].style.webkitTransform = 'translate3d(0, 0, 0)';
    elms[index - 1] && (elms[index - 1].style.webkitTransform = 'translate3d(-' + w + 'px, 0, 0)');
    elms[index + 1] && (elms[index + 1].style.webkitTransform = 'translate3d(' + w + 'px, 0, 0)');

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
    template: '<div style="width:100%;height:100%;" class="img-wrap" ng-transclude>',
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
      imgsrc: '=imgSrc'
    },
    link: function(scope, elm, attr, sliderCtrl) {
      sliderCtrl.addElm(elm[0]);

      if (scope.last) {
        sliderCtrl.init();
      }

    }

  }
})

//储存登录用户
.factory('tmmCache', function() {
  var oData = {};
  return {
    set: function(key, val) {
      val = val || '';
      oData[key] = val;
    },
    get: function(key) {
      oData[key] = oData[key] || '';
      return oData[key];
    },
    clean: function(key) {
      delete oData[key];
    },
    cleanAll: function() {
      oData = {};
    }
  };
})

.factory('appFunc', function($ionicPopup) {
  return {
    isPhone: function(str) {
      var reg = /^1[34578][0-9]{9}$/;
      return reg.test(str);
    },
    isEmail: function(str) {
      var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
      return reg.test(str);
    },
    isUndefine: function(str) {
      return str == undefined;
    },
    validatePassword: function(str) {
      var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]+$/;
      return reg.test(str);
    },
    validateVerifyCodeHash: function(value, hash) {
      for (var i = value.length - 1, h = 0; i >= 0; --i) {
        h += value.toLowerCase().charCodeAt(i);
      }
      return h == hash;
    },
    alert: function(msg) {
      $ionicPopup.alert({'title': msg});
    }
  };
});
