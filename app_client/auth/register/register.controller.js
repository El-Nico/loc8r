(function () {

    angular
        .module('loc8rApp')
        .controller('registerCtrl', registerCtrl);

    registerCtrl.$inject = ['$location', 'authentication'];

    function registerCtrl($location, authentication) {
        var vm = this;

        vm.pageHeader = {
            title: 'Create a new Loc8r account'
        };

        vm.credentials = {
            name: "",
            email: "",
            password: ""
        };

        vm.returnPage = $location.search().page || '/';


        /*To register a user we’ll call the register method in the 
        authentication service,passing it the credentials. Remember 
        that the register method uses the $http service,so it will 
        return promises that we can chain to. So if the method returns
        an error we can display this on the form. But if registration
        was successful we’ll clear the query string object and then 
        set the application path to be the returnPage we captured 
        earlier. This will redirect the user to that path.*/
        vm.onSubmit = function () {
            vm.formError = "";
            if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                vm.doRegister();
            }
        };

        /*$http({
            method : "GET",
            url : "welcome.htm"
        }).then(function mySuccess(response) {
            $scope.myWelcome = response.data;
        }, function myError(response) {
            $scope.myWelcome = response.statusText;
        });*/
        vm.doRegister = function() {
            vm.formError = "";
            authentication
                .register(vm.credentials)
                
                .then(function(){
                    $location.search('page', null);
                    $location.path(vm.returnPage);
                })
                .catch(function(err){
                    vm.formError = err;
                });
        };
    }
})();