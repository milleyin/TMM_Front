'use strict';
/**
 * @ngdoc module
 * @name tmmSdk
 * @require beUtil
 * @description Uniform android and ios native app binding
 */
angular.module('tmm.services')
  /**
   * @ngdoc function
   * @name tmmSdk.BeintooSdk
   *
   * @description object with native sdk bind functions
   *
   */
  .factory('BeintooSdk', function(sessionData, log) {
    var isLoading = true;
    return {
      saveQrcodeImage: function() {
      }
    }
  });
