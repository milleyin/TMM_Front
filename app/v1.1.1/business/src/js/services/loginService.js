tmmApp.factory('loginService',function(){
    
    return {
        login : function(token){
            $http.post(
                API + 'index.php?r=store/store_login/index',
                token,
                {
                    headers:{'Content-Type': 'application/x-www-form-urlencoded'}
                }
            ).success(function(data) {
                if (data.status == 1) {
                    return true;
                } else {
                    return false;
                }
            })
        }
    };
    
});