angular.module("RemesasApp", ["angularServices", "angularConfig", "angularUtils.directives.dirPagination"])
 .controller("HomeController", function ($scope, $sce, $location,Request, Notify,$state) {
     $scope.user = { nombre: "", codigo: "" };
     $state.go("Form");
     $scope.createNew = function () {
         return angular.copy(remesax);
     }
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
   

}).controller("adminController", function ($scope, $sce, $location, Request, Notify, $state,Modals) {

    $state.go("AdminHome");
    $scope.show = function (id) {
        Modals.showModal(id);
    }
    $scope.close = function (id) {
        Modals.closeModal(id);
    }
}).controller("FormController", function ($scope, $sce, $location, Request, Notify, $state,$http,bancos) {
    $scope.remesa = $scope.createNew();
    $scope.Botton = true;

    $scope.showFile = false;
    $scope.newFileName = "";
    $scope.loading = false;
    $scope.loadin2 = false;
    $scope.filejpg = null;
    $scope.depoTran = false;
    $scope.bancos = bancos;
    $scope.enviarRemesa = function (state) {
      
        if (!$scope.Form1.$valid) {
            return;
        }
        $scope.Botton = false;
        $scope.loading2 = true;
        state.preventDefault();

        Request.make("POST", "/Form/Enviar", { remesa: $scope.remesa, file: $scope.newFileName}).then(function (data) {
            if (data.estatus) {
                $scope.user.nombre = data.nombre;
                $scope.user.codigo = data.codigo;
                var elmnt = document.getElementById("sHeader");
                elmnt.scrollIntoView();
                $state.go("Message");

            } else {
                $state.go("Error");
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
            if (data.data.estatus) {
                $scope.loading = false;
                $scope.newFileName = data.data.filename;
                $scope.ImgError = "";
                $scope.showFile = true;
            } else {
                $scope.loading = false;
                $scope.showFile = false;
                $scope.ImgError = data.data.message;
            }
        }, function () {
            $scope.loading = false;
            $scope.showFile = false;
            $scope.ImgError = "Error al subir el Archivo";
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

}).controller("adminRemesaController", function ($scope, $sce, $location, Request, Notify, $state,Modals,$filter) {
    
    var datax = { remesas: [] };
    $scope.ActiveRemesa = null;
    $scope.modal = Modals;
    $scope.Open = function (event) {
        console.log(event);
    }
    $scope.calcularTotals = function () {
        $scope.sumDepositosSol = sumaDeposito($scope.remesasx, "montoDepositoN").totalSol;
        $scope.sumDepositosDol = sumaDeposito($scope.remesasx, "montoDepositoN").totalDol;
        $scope.sumEnvios = suma($scope.remesasx, "montoDestinoN");
    }
    
    $scope.setRemesa = function (event, remesa) {
        if (remesa.estatus == "RECIBIDA") { 
        if (!$scope.form1.$valid)
            return;
        event.preventDefault();
        var dataRemesa = { id: remesa.id, idDeposito: $scope.idDeposito, idTransf: $scope.idTransferencia, idBanco: $scope.bancoSel };
        Request.make("POST", "/Remesas/ProcessRemesa/", dataRemesa).then(function (data) {
            if (data.state==null)
                window.alert("Erro de Conexion;");
            if (data.state == true)
                window.alert("Remesa Procesada");
                remesa.estatus = data.newEstatus;
                Modals.closeModal('id02');
                $scope.calcularTotals();
                if (data.state == false)
                    window.alert("Ya existe una trasacción con el ticket " + $scope.idDeposito);

        })
            }
    }
    $scope.anular = function (remesa) {
        Request.make("POST", "/Remesas/anular/",{id:remesa.id}).then(function (data) {
            if (data.state == null)
                window.alert("Erro de Conexion;");
            if (data.state == true)
                window.alert("Remesa Anulada");
                Modals.closeModal("id01");
                remesa.estatus = data.newStatus;
                Modals.closeModal('id03');
                $scope.calcularTotals();
                if (data.state == false)
                window.alert("No se puede anular una Remesa Procesada");

        })

    }

    Request.make("POST", "/Remesas/BancosEmpre/").then(function (data) {
       
        $scope.bancos = data;
        
    })
    $scope.ProcRemesa = function (remesa) {
        $scope.idDeposito = "";
        $scope.idTransferencia = "";
        $scope.selected = 0;
        $scope.Disable = false;
        if (remesa.estatus != "RECIBIDA") {
            $scope.idDeposito=remesa.ticketSerial;
            $scope.idTransferencia=remesa.idtransf;
            $scope.selected = remesa.bancoDeposito;
            $scope.Disable = true;
        }
      
        $scope.ActiveRemesa = remesa;
     
        Modals.showModal("id01");
       
    }

    $scope.filtrar = function (param) {

        $scope.remesasx = $filter("filter")(datax.remesas, param);
        $scope.calcularTotals();
    }
   

    function suma(array,property){
        var total=0;
        angular.forEach(array,function(item){
            if (item.estatus == "PROCESADA")
            total = total + item[property];
        })
        return total;
    }
    function sumaDeposito(array, property) {
        var totalSol = 0;
        var TotalDol = 0;
        angular.forEach(array, function (item) {
            if (item.monedaDeposito == 1 && item.estatus!="ANULADA") {
                totalSol = totalSol + item[property];
            } else if (item.monedaDeposito == 2 && item.estatus != "ANULADA")
                {
                TotalDol = TotalDol + item[property];
            }
            
        })
        return { totalSol: totalSol, totalDol: TotalDol };
    }
   
    $scope.$watch('estatus', function (estatus) {
        $scope.filtrar(estatus);
    });
    Request.make("POST", "/remesas/getall/").then(function (data) {
        datax.remesas = data;
        $scope.remesasx = data;
        $scope.calcularTotals();
    });

}).controller("adminCambioController", function ($scope, $sce, $location, Request, Notify, $state) {


    function NewCambio() {
        return angular.copy(cambio);
    }

    $scope.cambio = NewCambio();
    $scope.Enviar = function (event) {
        event.preventDefault();
        if (!$scope.form1.$valid) {
            return
        }
       
        Request.make("POST", "/cambios/create/", $scope.cambio).then(function (data) {

            if (data.estatus) {
                alert("Cambio Actualizado");
                $scope.cambio = NewCambio();
            } else {
                alert("Error al Actualizar, Consulte al Administrador");
            }
        })

    }
})

function getFecha(Jsondate) {

    return new Date(parseInt(Jsondate.substr(6)));
}

