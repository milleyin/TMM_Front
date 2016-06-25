'use strict';

/**
 * @ngdoc function
 * @name shareActiveApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the shareActiveApp
 */
angular.module('shareActiveApp')

.controller('MainCtrl', function($sce, $window, $routeParams ,data) {
  this.frame = {
    height:  $window.innerHeight + 'px'
  }
  this.id = $routeParams.id

  this.model = data.data;
  this.active_intro = $sce.trustAsHtml(this.model.actives_info.remark)
});
