angular.module("RemesasApp", ["angularServices","angularConfig"])
 .controller("HomeController", function ($scope, $sce, $location,Request, Notify,$state) {
     $state.go("Form");
     var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
     $scope.titulo = "Angular Ready"
     $scope.remesa = $scope.createNew();
     $scope.dolarBs = (cambioxz.bolivares);
     $scope.solBs = (cambioxz.bolivares / cambioxz.cambio1);
     $scope.fecha = (new Date(cambioxz.fecha)).toLocaleDateString("es-ES", options);
     $scope.cambio = cambioxz.cambio1;

     $scope.dolarAct = false;
     $scope.monedaAct = function () {
         if ($scope.option == 3) {
             $scope.dolarAct = true;
         } else {1
             $scope.dolarAct = false;
         }
     }
     
     $scope.createNew = function () {
         return angular.copy(remesax);
     }
     $scope.option = 0;
     $scope.monto = 0.00;
     $scope.total=0.00
     $scope.calculator = function () {
         if ($scope.option == 0) {
            alert("Seleccione una opción para calcular");
         }
         if ($scope.option==1) {
             $scope.total = $scope.monto * $scope.solBs;
         }
         if ($scope.option==2) {
             $scope.total = $scope.monto * $scope.dolarBs;
         }
         if ($scope.option==3) {
             $scope.total = $scope.monto / $scope.cambio;
             
         }
     }
 
 })

.controller("MainController", function ($scope, $sce, $location,Request, Notify,$state) {

    var user1 = { userName: "", password: "" };
    $scope.usuario = user1;
    $scope.loger = function () {
        Request.make("POST", "/admin/login/", user1).then(function (data) {
            if (data.estatus) {

                window.location.href = "/admin/desktop";
            }
        })

    }
   

    

}).controller("adminHomeController", function ($scope, $sce, $location, Request, Notify, $state) {

}).controller("messageController", function ($scope, $sce, $location, Request, Notify, $state) {


}).controller("adminController", function ($scope, $sce, $location, Request, Notify, $state) {

    $state.go("AdminHome");
}).controller("FormController", function ($scope, $sce, $location, Request, Notify, $state,$http) {
  
    $scope.showFile = false;
    $scope.newFileName = "";
    $scope.loading = false;
    $scope.filejpg = null;
    $scope.depoTran = false;
    
    $scope.enviarRemesa = function (state) {
        if (!$scope.Form1.$valid) {
            return;
        }
        state.preventDefault();

        Request.make("POST", "/Form/Enviar", { remesa: $scope.remesa, file: $scope.newFileName}).then(function (data) {
            if (data.estatus) {
                $scope.remesa = $scope.createNew();
                $state.go("Message");
            }

        })
    }


    $scope.add = function () {
        $scope.loading = true;
        var fd = new FormData();
        var file = document.getElementById('file').files[0];
        fd.append('File', file);
       
        $http.post("/Form/uploadFileClient/", fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (data) {
            $scope.loading = false;
            $scope.newFileName = data.data.filename;
            $scope.showFile = true;
        }, function () {
          
        })

    }
    $scope.showForm = function (boll) {
        $scope.depoTran = boll;
    }
    $scope.canEnvio = 0;
    $scope.totalEnvio = 0;
    $scope.calEnvio = function () {
        if ($scope.remesa.monedaDeposito == 1) {
            $scope.remesa.montoDestino = $scope.remesa.montoDeposito * $scope.solBs != 0 ? $scope.remesa.montoDeposito * $scope.solBs : null;
        }else if
        ($scope.remesa.monedaDeposito == 2) {
            $scope.remesa.montoDestino = $scope.remesa.montoDeposito * $scope.dolarBs != 0 ? $scope.remesa.montoDeposito * $scope.dolarBs : null;
        } else {
            window.alert("Seleccione una opción (Soles o Dólares)");
        }
        
    }
    $scope.calEnviox = function () {
        if ($scope.remesa.monedaDeposito == 1) {
            $scope.remesa.montoDestino = $scope.remesa.montoDeposito * $scope.solBs !=0 ? $scope.remesa.montoDeposito * $scope.solBs :null;
        } else if 
        ($scope.remesa.monedaDeposito == 2) {
            $scope.remesa.montoDestino = $scope.remesa.montoDeposito * $scope.dolarBs !=0 ? $scope.remesa.montoDeposito * $scope.dolarBs:null;
        } 

    }
  
}).controller("adminCambioController", function ($scope, $sce, $location, Request, Notify, $state) {

    $scope.cambio = cambio;
    $scope.Enviar = function (event) {
        event.preventDefault();
        if (!$scope.form1.$valid) {
            return
        }

        Request.make("POST", "/cambios/create/", $scope.cambio).then(function (data) {

            if (data.estatus) {
                alert("Cambio Actualizado");
                
            } else {
                alert("Error al Actualizar, Consulte al Administrador");
            }
        })

    }
})

function getFecha(Jsondate) {

    return new Date(parseInt(Jsondate.substr(6)));
}

