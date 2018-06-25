angular.module("RemesasApp", ["angularServices", "angularFilters", "angularConfig", "angularUtils.directives.dirPagination"])
 .controller("HomeController", function ($scope, $sce, $location, Request, Notify, $state) {
     
     $scope.user = { nombre: "", codigo: "" };
     $scope.file = { filename: "" };
     $scope.remesa = {remex:{}};
     $state.go("Form");
     
     $scope.GotoReport=function(){
         if (ReporteFecha!=null){
             $state.go("ReporteGeneral");
  
         } else {
             window.alert("El reporte debe contener una Fecha");
         }
     
     }


     $scope.createNew = function () {
         return angular.copy(remesamain);
     }
     $scope.remesa.remex = $scope.createNew();
    
     var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
     $scope.titulo = "Angular Ready"
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
   


}).controller("ReportGController", function ($scope, $sce, $location, Request, Notify, $state,bancos) {

    $scope.Totals = {};
   

    if (ReporteFecha!=null){
    Request.make("POST", "/reports/RemesasTotales/", {fecha:ReporteFecha}).then(function (data) {
       
        $scope.Totals = data.subTotal;
        $scope.Ftotals = data.total;
        $scope.totalDo = data.totalGen;
        $scope.totalEnviado = data.totalEnv;
        $scope.fecha = data.fecha;
        $scope.cambio = data.cambio;
        $scope.montoVenta = parseFloat($scope.ReporteGeneral.montoVenta);
        $scope.precioVenta = parseFloat($scope.ReporteGeneral.precioVenta);
        $scope.precioCompra = data.precioCompra;
        console.log(data);
    });
    } else {
        window.alert("El reporte debe contener una Fecha");
    }


    $scope.bancos = bancos;
}).controller("messageController", function ($scope, $sce, $location, Request, Notify, $state) {
        $scope.goToNew = function () {
            $scope.remesa.remex = $scope.createNew();
                     
            $state.go("Form");
       }

}).controller("adminController", function ($scope, $sce, $location, Request, Notify, $state,Modals) {

    $scope.remesa = {remex:null};
    var remesamain = null;
    $scope.file = { filename: "" };
    $scope.user = { nombre: "", codigo: "" };
    $scope.ReporteGeneral = { montoVenta:0, precioVenta:0};
    Request.make("POST", "/cambios/get/").then(function (data) {
        var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        $scope.dolarBs = (data.bolivares);
        $scope.solBs = (data.bolivares / data.cambio1);
     //   $scope.fecha = (new Date(data.fecha)).toLocaleDateString("es-ES", options);
        $scope.cambio = data.cambio1;

     
    });
    $scope.dolarAct = false;
    $scope.monedaAct = function () {
        if ($scope.option == 3) {
            $scope.dolarAct = true;
        } else {
            1
            $scope.dolarAct = false;
        }
    }

    Request.make("POST", "/remesas/newremesa/0").then(function (data) {
        remesamain = data;
        $scope.createNew = function () {
            return angular.copy(remesamain);
        }
        $scope.remesa.remex = $scope.createNew();
    });
   

    $state.go("AdminHome");
    $scope.show = function (id) {
        Modals.showModal(id);
    }
    $scope.close = function (id) {
        Modals.closeModal(id);
    }
}).controller("FormController", function ($scope, $sce, $location, Request, Notify, $state,$http,bancos) {

  
  
    
    $scope.Botton = true;

    $scope.showFile = false;
   
    $scope.loading = false;
    $scope.loadin2 = false;
    $scope.filejpg = null;
    $scope.depoTran = false;
    $scope.bancos = bancos;

    $scope.gotoForm = function (form) {
        if (!$scope.Form1.$valid) {
            
            return;
        }
        $state.go(form);
    }
    $scope.enviarRemesa = function (state) {
      
        if (!$scope.Form1.$valid) {
            alert("Debe Completar todos los Datos");
            return;
        }
        $scope.Botton = false;
        $scope.loading2 = true;
        state.preventDefault();
        $scope.remesa.remex.fecha = new Date();
        Request.make("POST", "/Form/Enviar", { remesa: $scope.remesa.remex, file: $scope.file.filename}).then(function (data) {
            if (data.estatus) {
                $scope.user.nombre = data.nombre;
                $scope.user.codigo = data.codigo;
                var elmnt = document.getElementById("sHeader");
                if (elmnt) {
                    elmnt.scrollIntoView();
                }
                
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
                $scope.file.filename = data.data.filename;
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
        if ($scope.remesa.remex.monedaDeposito == 1) {
            $scope.remesa.remex.montoDestino = $scope.remesa.remex.montoDeposito * $scope.solBs != 0 ? $scope.remesa.remex.montoDeposito * $scope.solBs : null;
        }else if
        ($scope.remesa.remex.monedaDeposito == 2) {
            $scope.remesa.remex.montoDestino = $scope.remesa.remex.montoDeposito * $scope.dolarBs != 0 ? $scope.remesa.remex.montoDeposito * $scope.dolarBs : null;
        } else {
            window.alert("Seleccione una opción (Soles o Dólares)");
        }
        
    }
    $scope.calEnviox = function () {
        if ($scope.remesa.remex.monedaDeposito == 1) {
            $scope.remesa.remex.montoDestino = $scope.remesa.remex.montoDeposito * $scope.solBs !=0 ? $scope.remesa.remex.montoDeposito * $scope.solBs :null;
        } else if 
        ($scope.remesa.remex.monedaDeposito == 2) {
            $scope.remesa.remex.montoDestino = $scope.remesa.remex.montoDeposito * $scope.dolarBs !=0 ? $scope.remesa.remex.montoDeposito * $scope.dolarBs:null;
        } 

    }

}).controller("adminRemesaController", function ($scope, $sce, $location, Request, Notify, $http , $state,Modals,$filter) {
    




    $scope.showFile = false;
    $scope.file = { filename: "" };
    $scope.loading = false;
   
    var datax = { remesas: [] };
    $scope.ActiveRemesa = null;
    $scope.modal = Modals;
    $scope.Open = function (event) {
        console.log(event);
    }
   
    $scope.GeneralReport = function () {
        $state.go("ReporteGeneral");
    }

    $scope.editarRemesa = function (index) {
        Request.make("POST", "/remesas/newRemesa/" + index).then(function (data) {
            $scope.remesa.remex = data;
            $state.go("Form");
        });
    }

    Request.make("POST", "/remesas/getall/").then(function (data) {
        datax.remesas = data;
        $scope.remesasx = data;
        var fechita = new Date();
        $scope.fechaVal = formattedDateG(fechita);
        var forFilter = formattedDate(fechita);
        $scope.filtrar(forFilter);
        ReporteFecha = $scope.fechaVal;

        $scope.calcularTotals();
    });
    $scope.calcularTotals = function () {
        $scope.sumDepositosSol = sumaDeposito($scope.remesasx, "montoDepositoN").totalSol;
        $scope.sumDepositosDol = sumaDeposito($scope.remesasx, "montoDepositoN").totalDol;
        $scope.sumEnvios = suma($scope.remesasx, "montoDestinoN");
    }
    $scope.filtrar = function (param, tipo) {

        if (tipo == "fecha") {
            param = formattedDate(param);
            ReporteFecha= param;
        }

        $scope.remesasx = $filter("filter")(datax.remesas, param);
        $scope.calcularTotals();
    }

   
    
    $scope.setRemesa = function (event, remesa) {
        if (remesa.estatus == "RECIBIDA") { 
        if (!$scope.form1.$valid)
            return;
        event.preventDefault();
        var dataRemesa = { id: remesa.id, idDeposito: $scope.idDeposito, idTransf: $scope.idTransferencia, idBanco: $scope.bancoSel,imgName:$scope.file.filename };
        Request.make("POST", "/Remesas/ProcessRemesa/", dataRemesa).then(function (data) {

            if (data.state == null)
                window.alert("Erro de Conexion;");
            if (data.state == true) {
                window.alert("Remesa Procesada");
                remesa.estatus = data.newEstatus;
                Modals.closeModal('id03');
                $scope.calcularTotals();
                Request.make("POST", "/Form/EnviarProc/",{remesaID: dataRemesa.id}).then(function (data) {
                });
            }
                if (data.state == false && data.msg == null) {
                    window.alert("Ya existe una trasacción con el ticket " + $scope.idDeposito);
                } else if (data.msg!=null) {
                    window.alert(data.msg);
                }
                    

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
        var estatusActual;
        Request.make("POST", "/Remesas/GetEst/"+remesa.id).then(function (data) {

            var actRemesa = remesa;
            estatusActual = data.estatus;
            
            if (remesa.estatus != estatusActual) {
                actRemesa = data;
                remesa.estatus = estatusActual;

            }

            if (estatusActual != "RECIBIDA") {
                $scope.idDeposito = actRemesa.ticketSerial;
                $scope.idTransferencia = actRemesa.idtransf;
                $scope.selected = actRemesa.bancoDeposito;
                $scope.Disable = true;
                
            } else {
                $scope.idDeposito = "";
                $scope.idTransferencia = "";
                $scope.bancoSel = null;
                var fileElement = angular.element('#file');
                angular.element(fileElement).val(null);
                $scope.fileTranfer = "";
                $scope.loading = false;

            }
         
            $scope.ActiveRemesa = remesa;
            Modals.showModal("id01");

        })
      
       
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
   
    $scope.add = function () {
      
      
        var fd = new FormData();
        var file = document.getElementById('file').files[0];
        fd.append('File', file);

        $http.post("/Form/uploadFileClient/", fd, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function (data) {
            if (data.data.estatus) {
                $scope.loading = true;
                $scope.file.filename = data.data.filename;
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

var ReporteFecha;
function getFecha(Jsondate) {

    return new Date(parseInt(Jsondate.substr(6)));
}
function formattedDate(d) {
    if (d == null) {
        return "";
    }
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${day}/${month}/${year}`;
}
function formattedDateG(d) {
    if (d == null) {
        return "";
    }
    let month = String(d.getMonth() + 1);
    let day = String(d.getDate());
    const year = String(d.getFullYear());

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return `${year}-${month}-${day}`;
}

