(function (){
    angular
        .module('loc8rApp')
        .service('authentication', authentication);
    
    authentication.$inject = ['$window', '$http'];

    function authentication ($window, $http) {

        var saveToken = function(token) {
            $window.localStorage['loc8r-token'] = token;
        };

        var getToken = function() {
            return $window.localStorage['loc8r-token'];
        };
/*$http({
            method : "GET",
            url : "welcome.htm"
        }).then(function mySuccess(response) {
            $scope.myWelcome = response.data;
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });*/
        register = function(user){
            return $http.post('/api/register', user)
            .then(function(response){
                saveToken(response.data.token);
            }, function myError(err){
                console.log(err +"coming from a failed reg inangualar service auth");
            });
        };

        logout = function(){
            $window.localStorage.removeItem('loc8r-token');
        };

        login = function(user){
            return $http.post('/api/login', user)
            .then(function(response){
                saveToken(response.data.token);
            }, function myError(err){
                console.log(err +"coming from a failed login not reg inangualar service auth");
            });
        };

        //method to check if user is logged in

        var isLoggedIn = function(){
            var token = getToken();

            if(token){
                var payload = JSON.parse($window.atob(token.split('.')[1]));
                return payload.exp > Date.now() / 1000;
            } else{
                return false;
            }
        };

        var currentUser = function(){
            if(isLoggedIn()){
                var token = getToken();

                var payload = JSON.parse($window.atob(token.split('.')[1]));

                return{
                    email: payload.email,
                    name : payload.name
                };
            };
        }
        

        return {
            //expose methods to application
            saveToken: saveToken,
            getToken : getToken,
            register : register,
            login : login,
            logout : logout,
            isLoggedIn: isLoggedIn,
            currentUser:  currentUser
        };
    }
})();