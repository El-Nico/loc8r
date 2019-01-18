
(function () {
    angular
        .module('loc8rApp')
        .directive('ratingStars', ratingStars);

    function ratingStars() {
        return {
            restrict: 'EA',
            //basically inline scope
            scope: {
                //property of inline scope called rating
                //find any mada in the inline named rating and assign
                thisRating: '=rating'
            },
            templateUrl: "/common/directives/ratingStars/ratingStars.template.html"
        };
    };
})();