angular.module("angularFilters", [])
.filter('yesNo', function () {
    return function (input) {
        return input ? 'Si' : 'No';
    }
}).filter('join', function () {
    return function join(array, separator, prop) {
        if (!Array.isArray(array)) {
            return array; // if not array return original - can also throw error
        }

        return (!angular.isUndefined(prop) ? array.map(function (item) {
            return item[prop];
        }) : array).join(separator);
    };
});