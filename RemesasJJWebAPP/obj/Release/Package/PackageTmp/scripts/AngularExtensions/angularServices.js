angular.module('angularServices', ['ui-notification'])
.factory("Request", ['$window', '$http', '$q', 'Notify', function ($window, $http, $q, Notify) {

    var make = function (method, controllerAction, datax) {

        var def = $q.defer();

        $http({
            url: controllerAction,
            method: method,
            data: JSON.stringify(datax)
        })
.then(function (response) {
    if (response.data.error) {
        if (response.data.errorMsg != "" && response.data.errorMsg != null)
        {
            window.alert(response.data.errorMsg);
        } else {
            window.alert("Error al procesar la solicitud...");
        }
      
    }
 
    def.resolve(response.data);
},
function (response) { // optional
   
    window.alert("Error de conexión");
    def.reject(response);
});



        return def.promise;


    }
    return {
        make: make
    }
}]).factory("Notify", ['$window', 'Notification', function ($window, Notification) {

    var saved = function () {

        Notification({ message: 'Datos Guardados...', title: 'Notificación' });
    }
    var edited = function () {

        Notification({ message: 'Datos Editados...', title: 'Notificación' });
    }
    ///'Debe completar todos los datos!'
    var error = function (message) {

        Notification.error({ message: message, title: 'Error', delay: 3000 });
    }
    var warning = function (message) {

        Notification.warning({ message: message, title: 'Alerta', delay: 3000 });
    }
    var sucess = function (message) {

        Notification({ message: message, title: 'Notificación', delay: 3000 });
    }

    return {
        saved: saved,
        edited: edited,
        error: error,
        warning: warning,
        sucess: sucess

    }
}]).factory("Modals", ['$window', '$http', '$q', 'Request', function ($window, $http, $q, Request) {

    var showModal = function (id) {
        var BoolShow = true;
        var dis = "block";
        if (!BoolShow) {
            dis = "none"
        }
        document.getElementById(id).style.display = dis;

    }
    var openView = function (id, view, inscope) {
        inscope = view;
        modalShow(id);
    }
    var closeModal = function (id) {
        var BoolShow = false;
        var dis = "block";
        if (!BoolShow) {
            dis = "none"
        }
        document.getElementById(id).style.display = dis;

    }

    return {
        showModal: showModal,
        closeModal: closeModal,
        openView: openView
    }

}])


