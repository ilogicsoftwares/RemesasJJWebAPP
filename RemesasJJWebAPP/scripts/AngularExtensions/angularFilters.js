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
    }

}).filter('currencyde', function () {
    return function (input) {
        return input.toFixed(2) // always two decimal digits
       .replace(".", ",") // replace decimal point character with ,
       .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1."); // use . as a separator
    }
}).filter('filterMultiple',['$filter',function ($filter) {
    return function (items, keyObj) {
        var filterObj = {
            data:items,
            filteredData:[],
            applyFilter : function(obj,key){
                var fData = [];
                if (this.filteredData.length == 0)
                    this.filteredData = this.data;
                if (obj){
                    var fObj = {};
                    if (!angular.isArray(obj)){
                        fObj[key] = obj;
                        fData = fData.concat($filter('filter')(this.filteredData,fObj));
                    } else if (angular.isArray(obj)){
                        if (obj.length > 0){
                            for (var i=0;i<obj.length;i++){
                                if (angular.isDefined(obj[i])){
                                    fObj[key] = obj[i];
                                    fData = fData.concat($filter('filter')(this.filteredData,fObj));    
                                }
                            }

                        }
                    }
                    if (fData.length > 0){
                        this.filteredData = fData;
                    }
                }
            }
        };
        if (keyObj){
            angular.forEach(keyObj,function(obj,key){
                filterObj.applyFilter(obj,key);
            });
        }
        return filterObj.filteredData;
    }
}]);

