'use strict';

/**
 * @ngdoc overview
 * @name shareActiveApp
 * @description
 * # shareActiveApp
 *
 * Main module of the application.
 */
angular
  .module('shareActiveApp', [
    'ngAnimate',
    'ngRoute',
    'ngTouch'
  ])
  .constant('ENV', {
    apiEndpoint: 'http://test2.365tmm.net'
      // apiEndpoint: 'https://m.365tmm.com'
  })
  .config(function($routeProvider, $httpProvider) {
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=utf-8';
    $httpProvider.defaults.withCredentials = true;

    $routeProvider
      .when('/:id', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'active',
        resolve: {
          data: function($http, $q, $route, ENV) {

            var url = ENV.apiEndpoint + '/index.php?r=api/actives/view&id=' + $route.current.params.id;

            return $http.get(url).then(function(response) {
              if (response.data.status == 1) {
                return response.data;
              } else {
                return $q.reject({
                  code: '0'
                })
              }
            }, function(data) {
              return $q.reject({
                code: '-1'
              })
            })
          }
        }
      })
      .when('/apply/:id', {
        templateUrl: 'views/apply.html',
        controller: 'ApplyCtrl',
        controllerAs: 'apply'
      })
      .otherwise({
        redirectTo: '/',
        templateUrl: 'views/loadapp.html',
      });
  })
  .run(function($rootScope, $location) {
    $rootScope.loadApp = function() {
      window.location.href = "http://m.365tmm.com/index.php?r=admin/tmm_qrcode/user";
    }
    $rootScope.$on('$routeChangeError', function() {

      $location.path('/')
    });
  })
