angular.module("angularDirectives", [])
.directive('iform', function () {
    return {
        link: function (scope, element, attributes) {
            element.addClass('row');
        }
    }
});