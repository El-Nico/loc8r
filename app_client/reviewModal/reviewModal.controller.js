(function () {

    angular
        .module('loc8rApp')
        .controller('reviewModalCtrl', reviewModalCtrl);

    reviewModalCtrl.$inject = ['$uibModalInstance', 'locationData', 'loc8rData'];
    function reviewModalCtrl($uibModalInstance, locationData, loc8rData) {
        var vm = this;
        vm.locationData = locationData;

        vm.modal = {
            close: function (result) {
                $uibModalInstance.close(result);
            },
            cancel: function () {
                $uibModalInstance.dismiss('cancel');
            }
        };

        vm.onSubmit = function () {
            vm.formError = "";
            if (!vm.formData.name || !vm.formData.rating || !vm.formData.reviewText) {
                vm.formError = "All fields required, please try again";
                return false;
            } else {
                vm.doAddReview(vm.locationData.locationid, vm.formData);
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
        vm.doAddReview = function (locationid, formData) {
            loc8rData.addReviewById(locationid, {
                author: formData.name,
                rating: formData.rating,
                reviewText: formData.reviewText
            })
                .then(function (data) {
                    vm.modal.close(data);
                }, function (e) {
                    vm.formError = "Your review has not been saved, try again";
                });
            return false;
        };
    }
})();