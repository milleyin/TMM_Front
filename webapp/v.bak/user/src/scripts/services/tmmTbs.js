'use strict';
/**
 * @ngdoc function
 * @name beclub.services:TabsService
 * @description
 * # TabsService
 * Tabs Service
 */
angular.module('tmm.services')
.factory('Tabs', function() {
  var isHidden = true;
  return {
    setState: function(flag) {
      isHidden = flag;
    },
    getState: function() {
      return isHidden;
    }
  };
});