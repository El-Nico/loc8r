
(function () {
    angular.module('loc8rApp', ['ngRoute','ngSanitize','ui.bootstrap']);

    config.$inject = ['$routeProvider', '$locationProvider'];
    //location provider helps remove #symbol from routes not working
    function config($routeProvider, $locationProvider) {
        //nasty little fix for non # supporting web browsers
        /*if (window.location.pathname !== '/') {
            window.location.href = '/#' + window.location.pathname;
        }*/

        $routeProvider
            .when('/', {
                templateUrl: '/home/home.view.html',
                controller: 'homeCtrl',
                controllerAs: 'vm'
            })
            .when('/about', {
                templateUrl: '/common/views/genericText.view.html',
                controller: 'aboutCtrl',
                controllerAs: 'vm'
            })
            .when('/location/:locationid', {
                templateUrl: '/locationDetail/locationDetail.view.html',
                controller: 'locationDetailCtrl',
                controllerAs: 'vm'
            })
          .otherwise({
                redirectTo: '/'
            });

            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
              });
    };

    angular
        .module('loc8rApp')
        .config(['$routeProvider', '$locationProvider', config]);
})();
