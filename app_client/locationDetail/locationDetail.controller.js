(function () {

    angular
        .module('loc8rApp')
        .controller('locationDetailCtrl', locationDetailCtrl)

    locationDetailCtrl.$inject = ['$routeParams', 'loc8rData', '$uibModal'];
    function locationDetailCtrl($routeParams, loc8rData, $uibModal) {
        var vm = this;
        vm.locationid=$routeParams.locationid;
        
        loc8rData.locationById(vm.locationid)
            .then(function (response) {
                vm.data = { location: response.data };
                vm.pageHeader = {
                    title: vm.data.location.name,
                    strapline: 'sod off errors'
                };
                //console.log(data);
            },function (e) {
                console.log(e);
            });

            vm.popupReviewForm = function(){
                var modalInstance= $uibModal.open({
                    templateUrl: '/reviewModal/reviewModal.view.html',
                    controller: 'reviewModalCtrl',
                    controllerAs: 'vm',
                    resolve : {
                        locationData : function (){
                            return {
                                locationid: vm.locationid,
                                locationName: vm.data.location.name
                            };
                        }
                    }
                });

                modalInstance.result.then(function(data){
                    vm.data.location.reviews.review.push(data);
                });
            };
    }
})();