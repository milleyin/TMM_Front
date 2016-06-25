angular.module('security', [])

.factory('security', function($q, Resource) {

  function getUser() {
    Resource.getUser().then(function(data) {
      this.user = data;
    }, function(data) {

    });
  }



  var service = {
    isLogin: false,

    userInfo: null,

    login: function() {

    },

    logout: function() {
      return Resource.logout();
    },

    getUser: function() {
      if (service.userInfo) {
        return $q.when(service.userInfo);
      } else {
        return Resource.getUser().then(function(response) {
          service.userInfo = response;
          service.isLogin = true;
          return service.userInfo;
        });
      }
    }
  }

  return service;
})
