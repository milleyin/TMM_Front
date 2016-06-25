tmmApp.factory('getInfoService',['$http',function($http){
    
    return {
        getInfo: function(url , info) {
            $http.get(url).success(function(data) {
                return data;
            });
        }
    }
    
}]);