angular.module('index', [])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider
    .state('tab.index', {
      url: '/index',

      templateUrl: 'app/index/templates/index.html',
      controller: 'IndexCtrl',
      resolve: {
        data: function($ionicViewSwitcher, $ionicHistory, ENV, device) {
          if (ENV.device === 'app') {
            device.exitSeekFresh();
          }
          var currentView = $ionicHistory.currentView();
          if (currentView && (currentView.stateName == 'tab.recommend' || currentView.stateName == 'tab.seek' || currentView.stateName == 'tab.my')) {
            $ionicViewSwitcher.nextTransition("none");
          }
        }
      }

    })
    .state('tab.fresh-subject', {
      url: '/fresh-subject',
      templateUrl: 'app/index/templates/fresh-subject.html',
      controller: 'FreshSubjectCtrl'
    })
    .state('tab.interest-subject', {
      url: '/interest-subject',
      templateUrl: 'app/index/templates/interest-subject.html',
      controller: 'InterestSubjectCtrl'
    })
    .state('tab.fresh-list', {
      url: '/fresh-list/:link/:name',
      templateUrl: 'app/index/templates/fresh-list.html',
      controller: 'FreshListCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.fresh-list') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.get($stateParams.link);
          }
        }
      }
    })
    .state('tab.interest-list', {
      url: '/interest-list/:link/:name',
      templateUrl: 'app/index/templates/interest-list.html',
      controller: 'InterestListCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.interest-list') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.get($stateParams.link);
          }
        }
      }
    })
    .state('tab.seek-list', {
      url: '/seek-list/:link/:name',
      templateUrl: 'app/index/templates/seek-list.html',
      controller: 'SeekListCtrl',
      resolve: {
        data: function(Resource, $stateParams, $ionicLoading, $ionicHistory) {
          if ($ionicHistory.backView() == null || $ionicHistory.backView().stateName !== 'tab.seek-list') {
            $ionicLoading.show({
              template: '玩命加载中...',
              hideOnStateChange: true
            });
            return Resource.get($stateParams.link);
          }
        }
      }
    });

}])

// 首页
.controller('IndexCtrl', function($scope, $ionicHistory, $state, device, ENV, Resource, indexSubject) {
  var api = ENV.apiEndpoint;

  var link = {
    banner: api + '/index.php?r=api/ad/list', // banner
    hotsell: api + '/index.php?r=api/ad/index&type=1', // 当季热销
    hotact: api + '/index.php?r=api/shops/column', // 觅趣活动
    circumtour: api + '/index.php?r=api/shops/column&type=1' // 热门景区
  };

  $scope.$on("$ionicView.enter", function() {
    $ionicHistory.clearHistory();

  });

  $scope.freshStyle = {
    height: (window.innerWidth - 30) / 2 * 2 / 3 * 2 + 20 + 'px'
  };

  $scope.seekStyle = {
    height: (window.innerWidth - 20) * 0.66 + 'px'
  };



  $scope.model = {};
  // setTimeout(getData, 2000)
  getData();

  $scope.model.banner = device.GET('banner');
  $scope.model.hotsell = device.GET('hotsell');
  $scope.model.hotact = device.GET('hotact');
  $scope.model.circumtour = device.GET('circumtour');

  function getData(type) {
    var i = 0;
    type = null;
    if (!type) {
      // banner
      Resource.get(link.banner).then(function(data) {
        device.SET('banner', data.list_data);
        $scope.model.banner = data.list_data;
        countTimes();

      });

    }
    // 当季热销
    Resource.get(link.hotsell).then(function(data) {
      device.SET('hotsell', data.list_data);
      indexSubject.fresh = data;
      $scope.model.hotsell = data.list_data;
      countTimes();
    });
    // 觅趣活动
    Resource.get(link.hotact).then(function(data) {
      device.SET('hotact', data.list_data);
      indexSubject.interest = data;

      $scope.model.hotact = data.list_data;
      countTimes();
    });
    // 周边城市
    Resource.get(link.circumtour).then(function(data) {
      device.SET('circumtour', data.list_data);
      $scope.model.circumtour = data.list_data;
      $scope.model.nextPage = data.page.next;
      countTimes();

    });

    function countTimes() {
      i++;

      if ((!type && 4 == i) || (type && 3 == i)) {
        $scope.$broadcast('scroll.refreshComplete');
      }
    }
  }
  // 下拉刷新
  $scope.doRefresh = function() {
    getData(1);
  };

  // 加载更多
  $scope.loadMore = function() {
    if ($scope.model.nextPage) {
      Resource.get($scope.model.nextPage).then(function(data) {

        $scope.model.nextPage = data.page.next;
        $scope.model.circumtour = $scope.model.circumtour.concat(data.list_data);
        $scope.$broadcast("scroll.infiniteScrollComplete");
      }, function(data) {
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
  };

  $scope.goBannerDetail = function(type, link, title, thumb_url) {
    var state;
    type = +type;

    if (type > 3 && type < 7) {
      state = "tab.more-detail" + (type - 3);
      $state.go(state, { link: link });

    } else if (type == 7 || type == 8) {

      if (ENV.device === 'app') {
        device.goSeekFreshDetail2(title, title, thumb_url, link);
      } else {
        // $state.go("tab.fresh-item", {link:link, name:title});
        window.location.href = link;
      }

    } else if (type <= 3) {
      state = "tab.shop" + type;
      $state.go(state, { link: link, type: type });
    }
  };

})

// 觅鲜专题
.controller('FreshSubjectCtrl', function($scope, $rootScope, indexSubject, Resource, ENV) {
  $rootScope.hideTabs = 'tabs-item-hide';
  var tmp = {};
  $scope.model = {};
  $scope.name = '精挑细选';
  $scope.imgStyle = {
    height: (window.innerWidth - 30) * 0.33 + 'px'
  };
  if (!!indexSubject.fresh) {} else {
    getData();
  }

  $scope.$on("$ionicView.enter", function() {
    if (!$scope.model.list_data && !!indexSubject.fresh) {
      $scope.model.nextPage = indexSubject.fresh.page.next;
      $scope.model.list_data = indexSubject.fresh.list_data;
    }
  });


  function getData() {
    Resource.get(ENV.apiEndpoint + '/index.php?r=api/ad/index&type=1').then(function(data) {
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function() { $scope.$broadcast('scroll.refreshComplete'); });
  }

  $scope.doRefresh = function() {
    getData();
  };

  $scope.loadMore = function() {
    if ($scope.model.nextPage) {
      Resource.get($scope.model.nextPage).then(function(data) {
        $scope.model.nextPage = data.page.next;
        $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
        $scope.$broadcast("scroll.infiniteScrollComplete");
      }, function() {
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
  };

})

// 觅趣专题
.controller('InterestSubjectCtrl', function($scope, $rootScope, indexSubject, Resource, ENV) {
  $rootScope.hideTabs = 'tabs-item-hide';
  $scope.model = {};
  $scope.name = '拒绝平凡';

  if (!!indexSubject.interest) {

  } else {
    getData();
  }

  $scope.$on("$ionicView.enter", function() {
    if (!$scope.model.list_data && !!indexSubject.interest) {
      $scope.model.nextPage = indexSubject.interest.page.next;
      $scope.model.list_data = indexSubject.interest.list_data;
    }
  });
  $scope.seekStyle = {
    height: (window.innerWidth - 20) * 0.66 + 'px'
  };

  function getData() {
    Resource.get(ENV.apiEndpoint + '/index.php?r=api/shops/column').then(function(data) {
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function() { $scope.$broadcast('scroll.refreshComplete'); });
  }

  $scope.doRefresh = function() {
    getData();
  };

  $scope.loadMore = function() {
    if ($scope.model.nextPage) {
      Resource.get($scope.model.nextPage).then(function(data) {
        $scope.model.nextPage = data.page.next;
        $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
        $scope.$broadcast("scroll.infiniteScrollComplete");
      }, function() {
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
  };

})


// 觅鲜列表
.controller('FreshListCtrl', function($scope, $rootScope, $state, $stateParams, data, ENV, device, Resource) {
  $rootScope.hideTabs = 'tabs-item-hide';
  $scope.name = $stateParams.name;
  $scope.model = {};

  var url = $stateParams.link;

  $scope.$on("$ionicView.enter", function() {
    if (!$scope.model.list_data) {
      $scope.model.list_data = data.list_data;
      $scope.model.nextPage = data.page.next;
    }
  });

  $scope.imgStyle = {
    height: (window.innerWidth - 20) * 2 / 3 + 'px'
  }

  function getData() {
    Resource.get(url).then(function(data) {

      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  // 加载更多
  $scope.loadMore = function() {
    if ($scope.model.nextPage) {
      Resource.get($scope.model.nextPage).then(function(data) {
        
        $scope.model.nextPage = data.page.next;
        $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
        $scope.$broadcast("scroll.infiniteScrollComplete");

      }, function(data) {
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
  };

  // 下拉刷新
  $scope.doRefresh = function() {
    getData();
  };

  // 觅鲜详情页面
  $scope.goFresh = function(title, description, thumb_url, webpageUrl) {
    if (ENV.device === 'app') {
      device.goSeekFreshDetail2(title, description, thumb_url, webpageUrl);
    } else {
      if (ENV.android) {
        window.location.href = webpageUrl;
      } else {
        $state.go("tab.fresh-item", { link: webpageUrl, name: title });

      }
    }
  };
})

// 觅趣活动列表
.controller('InterestListCtrl', function($scope, $rootScope, $stateParams, data, ENV, Resource) {
  $rootScope.hideTabs = 'tabs-item-hide';
  $scope.name = $stateParams.name;
  $scope.model = {};
  var url = $stateParams.link;

  $scope.imgStyle = {
    height: (window.innerWidth - 20) * 2 / 3 + 'px'
  }

  $scope.$on("$ionicView.enter", function() {
    if (!$scope.model.list_data) {
      $scope.model.list_data = data.list_data;
      $scope.model.nextPage = data.page.next;
    }
  });

  function getData() {
    Resource.get(url).then(function(data) {
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  // 加载更多
  $scope.loadMore = function() {
    if ($scope.model.nextPage) {
      Resource.get($scope.model.nextPage).then(function(data) {

        $scope.model.nextPage = data.page.next;
        $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
        $scope.$broadcast("scroll.infiniteScrollComplete");
      }, function(data) {
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
  };

  // 下拉刷新
  $scope.doRefresh = function() {
    getData();
  };
})

// 觅境线路列表
.controller('SeekListCtrl', function($scope, $rootScope, $stateParams, data, ENV, Resource) {
  $rootScope.hideTabs = 'tabs-item-hide';
  $scope.name = $stateParams.name;
  $scope.model = {};

  var url = $stateParams.link;

  $scope.$on("$ionicView.enter", function() {
    if (!$scope.model.list_data) {
      $scope.model.list_data = data.list_data;
      $scope.model.nextPage = data.page.next;
    }
  });

  $scope.imgStyle = {
    height: (window.innerWidth - 20) * 2 / 3 + 'px'
  }

  function getData() {
    Resource.get(url).then(function(data) {
      $scope.model.nextPage = data.page.next;
      $scope.model.list_data = data.list_data;
      $scope.$broadcast('scroll.refreshComplete');
    }, function(data) {
      $scope.$broadcast('scroll.refreshComplete');
    });
  }

  // 加载更多
  $scope.loadMore = function() {
    if ($scope.model.nextPage) {
      Resource.get($scope.model.nextPage).then(function(data) {

        $scope.model.nextPage = data.page.next;
        $scope.model.list_data = $scope.model.list_data.concat(data.list_data);
        $scope.$broadcast("scroll.infiniteScrollComplete");
      }, function(data) {
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
    }
  };

  // 下拉刷新
  $scope.doRefresh = function() {
    getData();
  };
})

.factory('indexSubject', function() {
  return {};
})

.directive('drawImg', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<canvas></canvas>',
    link: function(scope, element, attr) {

      var canvas = element[0];
      var ctx = canvas.getContext('2d');
      var w = window.innerWidth - 20;
      var h = Math.round(w * 0.666);
      canvas.width = w * 2;
      canvas.height = h * 2;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';

      var img = new Image();
      img.src = attr.src;

      img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    }
  }

})

.directive('drawSmallImg', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<canvas></canvas>',
    link: function(scope, element, attr) {

      var canvas = element[0];
      var w = Math.round(window.innerWidth - 30) / 2;
      var h = Math.round(w * 2 / 3);
      var index = attr.index;

      var top = 10 + Math.floor(index / 2) * (h + 10);
      var left = 10 + index % 2 * (w + 10);

      element.css({
        width: w + "px",
        height: h + "px",
        top: top + "px",
        left: left + "px",
      });
      canvas.width = w * 2;
      canvas.height = h * 2;

      var ctx = canvas.getContext('2d');

      var img = new Image();
      img.src = attr.src;
      img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
    }
  };
})




/*

 */
