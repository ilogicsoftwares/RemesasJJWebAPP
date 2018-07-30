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
            } else {
                window.alert("Usuario o Contraseña Incorrecta");
}
        })

    }
   

    

}).controller("adminHomeController", function ($scope, $sce, $location, Request, Notify, $state) {


}).controller("adminRolesController", function ($scope, $sce, $location, Request, Notify, $state) {
    $scope.btnEstatus = "Guardar";
    $scope.accesos = {};
    $scope.Rolex = {newRole:"", id:null};
    $scope.cancelRoles = function () {
       $scope.Rolex.newRole = "";
    }
    $scope.Actualizar = function () {
        $scope.Rolex.newRole = "";
        $scope.Rolex.id = null;
        $scope.btnEstatus = "Guardar";
        Request.make("POST", "/admin/GetAccesos/").then(function (data) {
            $scope.accesos = data;
            Request.make("POST", "/admin/getAllRoles/").then(function (data) {
                $scope.roles = data;
               // $scope.cancelRoles();
            });
        });
       
    }
    $scope.Actualizar();
    
   
    $scope.EditarRol = function (id) {

       

        Request.make("POST", "/admin/GetRole/", { id: id }).then(function (data) {
            $scope.Actualizar();
            $scope.Rolex.newRole = data.name;
            $scope.Rolex.id = id;
            Request.make("POST", "/admin/GetUserAcess/", {id:id}).then(function (data) {
                var usuarioAc = data;

                usuarioAc.forEach(function (item, index) {

                    $scope.accesos.forEach(function (item2) {
                        if (item2.id == item.acesosid) {
                            item2.active = 1;
                        }

                    });
                });
                $scope.btnEstatus = "Editar";
            });

        });


    }

    

    $scope.saveRole = function (event) {
        if (!$scope.form1.$valid)
            return;
        event.preventDefault();
        Request.make("POST", "/admin/saveroles/", { accesos: $scope.accesos, rol: { name: $scope.Rolex.newRole }, id: $scope.Rolex.id }).then(function () {
            if ($scope.Rolex.id == null) {
                window.alert("Se han Guardado los datos");
            } else {
                window.alert("Se han Editado los datos");
            }
            $scope.Actualizar();
        });

    }

    $scope.deleRole = function (id) {
        Request.make("POST", "/admin/deleteroles/", { id: id }).then(function () {
            $scope.Actualizar();

        });
    }

        
    $scope.deleteRole = "";

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
}).controller("remesasReportController", function ($scope, $sce, $location, Request, Notify, $state) {
    $scope.remesa = remesa;
}).controller("adminBancosController", function ($scope, $sce, $location, Request, Notify, $state, cuentas, monedas) {
 
    Request.make("POST", "/admin/GetBancos/").then(function (data) {
        $scope.bancos = data;
    });

    $scope.btnEstatus = "Guardar";

    $scope.cuentas = cuentas;
    $scope.monedas = monedas;
    $scope.enableFuncs = function () {
        if ($scope.cuentaTrans.id <= 1) {
            Request.make("POST", "/admin/GetBancos/").then(function (data) {
                $scope.bancos = data;
            });
        } else {
            Request.make("POST", "/admin/GetBancosEmpre/", { bancoType: $scope.cuentaTrans.id }).then(function (data) {
                $scope.bancos = data;
            });

            }
    }
    $scope.EliminarBanco = function (item) {
        Request.make("POST", "/admin/DelBanco/", { banco: item}).then(function (data) {
            if (data.estatus) {
                window.alert("Banco Eliminado");
                $scope.enableFuncs();

            } else {
                window.alert("Error Al Eliminar el Banco");
            }
        });
     
    }

    $scope.saveBanco = function (event) {

        $scope.banco.cuentaTrans = $scope.cuentaTrans.id;

        event.preventDefault();
        Request.make("POST", "/admin/SaveBancos/", { banco: $scope.banco }).then(function (data) {
            if (data.estatus) {
                window.alert("Banco Guardado");
                $scope.CancelBanco();
                $scope.enableFuncs();
            } else {
                window.alert("Error Al guardar el Banco");
            }
        });
    }
    
    $scope.CancelBanco = function () {
        $scope.banco = null;
        $scope.cuentaTrans = { nombre: "Banco Clientes", id: 1 };
    }

    $scope.tipoBanco = [{ nombre: "Banco Clientes", id: 1 },
                        { nombre: "Banco Depositos", id: 2 },
                        { nombre: "Banco Transferencia", id: 3 },
                       ]

}).controller("adminController", function ($scope, $sce, $location, Request, Notify, $state,Modals) {

    $scope.remesa = {remex:null};
    var remesamain = null;
    $scope.file = { filename: "" };
    $scope.user = { nombre: "", codigo: "" };
    $scope.edicion = {estatus:false};
    $scope.ReporteGeneral = { montoVenta: 0, precioVenta: 0 };
    $scope.NewRemesa = function () {
        $scope.remesa.remex = $scope.createNew();
        $scope.edicion.estatus = false;
        $state.go("FormOffice");

    }

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
        $scope.remesa.remex.remesaType = 1;
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
    $scope.enviarRemesa = function (state,option) {
      
        if (!$scope.Form1.$valid) {
            alert("Debe Completar todos los Datos");
            return;
        }
        $scope.Botton = false;
        $scope.loading2 = true;
        state.preventDefault();
        $scope.remesa.remex.fecha = new Date();
        if (option) {
            if ($scope.remesa.remex.file != null || $scope.remesa.remex.file=='')
            $scope.file.filename = $scope.remesa.remex.file;
        }
        Request.make("POST", "/Form/Enviar", { remesa: $scope.remesa.remex, file: $scope.file.filename}).then(function (data) {
            if (data.estatus) {
                $scope.user.nombre = data.nombre;
                $scope.user.codigo = data.codigo;
                var elmnt = document.getElementById("sHeader");
                if (elmnt) {
                    elmnt.scrollIntoView();
                }
                if (option) {
                    if ($scope.edicion.estatus) {
                        $scope.edicion.estatus = false;
                        $scope.remesa.remex = $scope.createNew();
                        $state.go("ActRemesa");

                    } else {
                        $state.go("PrintRemesa", { id: data.codigo });
                    }
                    

                } else {
                    $state.go("Message");
                }
                    
                

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
    

    $scope.AnulaDetail = "";
    $scope.disableAnula = false;

    $scope.showFile = false;
    $scope.file = { filename: "" };
    $scope.loading = false;
   
    var datax = { remesas: [] };
    $scope.ActiveRemesa = null;
    $scope.modal = Modals;
    $scope.Open = function (event) {
        console.log(event);
    }
   
    $scope.checkAnulado = function (idRemesas) {
        $scope.AnulaDetail = "";
        $scope.disableAnula = false;
       
        Request.make("POST", "/Remesas/checkAnulado/", { id: idRemesas }).then(function (data) {
            
            if (data.estatus==3 && data!=null)
            {
                $scope.AnulaDetail = data.unulaDetail;
                $scope.disableAnula = true;
            }
            Modals.showModal('id03');
        });


    }

    $scope.enviarEmail = function (id) {
        Request.make("POST", "/form/EnviarProc/", { remesaID: id }).then(function (data) {
            window.alert("Correo Enviado");
        });

    }

    $scope.GeneralReport = function () {
        $state.go("ReporteGeneral");
    }
    $scope.btnColor = "btn btn-danger";
    $scope.checkTicket = function (ticketid) {
        if (ticketid != null && ticketid != '') {
            Request.make("POST", "/remesas/checkserial/", { ticketId: ticketid }).then(function (data) {
                if (!data.state)
                    window.alert("El Ticket ya fue usado");
                else {
                    $scope.btnColor = "btn btn-success";
                    $scope.verlo = true;
                }

            });

        }
        
    }

    $scope.editarRemesa = function (index) {
        Request.make("POST", "/remesas/newRemesa/" + index).then(function (data) {

            if (data.estatus > 2) {
                window.alert("No se puede editar una Remesa Procesada, Anulada o Realizada por un Cliente");
                return;
            }

            $scope.edicion.estatus = true;
            $scope.remesa.remex = data;
            $scope.remesa.remex.cedulaBenefType = $scope.remesa.remex.cedulaBenefType.toString();
            $scope.remesa.remex.cuentaBenefType = $scope.remesa.remex.cuentaBenefType.toString();
            $scope.remesa.remex.monedaDeposito = $scope.remesa.remex.monedaDeposito.toString();
           
            $state.go("FormOffice");
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
        var dataRemesa = { id: remesa.id, idDeposito: $scope.idDeposito, idTransf: $scope.idTransferencia, idBanco: $scope.bancoSel,BancoTrans:$scope.bancoTrans,imgName:$scope.file.filename };
        Request.make("POST", "/Remesas/ProcessRemesa/", dataRemesa).then(function (data) {

            if (data.state == null)
                window.alert("Erro de Conexion;");
            if (data.state == true) {
                window.alert("Remesa Procesada");
                remesa.estatus = data.newEstatus;
                remesa.ticketSerial = $scope.idDeposito;
                remesa.idtransf = $scope.idTransferencia;
                Modals.closeModal('id04');
                Modals.closeModal('id01');
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
    $scope.anular = function (remesa,state) {
        Request.make("POST", "/Remesas/anular/",{id:remesa.id,anulaDetail:$scope.AnulaDetail}).then(function (data) {

            if ($scope.AnulaDetail=="") {
                window.alert("Debe colocar una Descripción para la anulación");
                return;
            }
            state.preventDefault();

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

   
    Request.make("POST", "/Remesas/BancosTrans/").then(function (data) {

        $scope.bancosTrans = data;

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
            remesaTipo = remesa.tipo;
            Request.make("POST", "/Remesas/BancosEmpre/").then(function (data) {



                if (remesaTipo == "OFICINA") {
                    data.forEach(function (item, index) {
                        if (!item.nombre.includes("EFECTIVO")) {
                            delete data[index];

                        }

                    });
                } else {
                    data.forEach(function (item, index) {
                        if (item.nombre.includes("EFECTIVO")) {
                            delete data[index];

                        }

                    });
                }


                $scope.bancos = data;

            });

           

            

            if (remesa.estatus != estatusActual) {
                actRemesa = data;
                remesa.estatus = estatusActual;

            }

            if (estatusActual != "RECIBIDA") {
                $scope.verlo = true;
                $scope.idDeposito = actRemesa.ticketSerial;
                $scope.idTransferencia = actRemesa.idtransf;
                $scope.selected = actRemesa.bancoDeposito;
                $scope.selectedTran = actRemesa.BancoTrans;
                $scope.Disable = true;
                
            } else {
                $scope.verlo = false;
                $scope.idDeposito = "";
                if (remesa.tipo == "OFICINA")
                {
                    $scope.verlo = true;
                    $scope.idDeposito = remesa.id;
                }
                
                
                
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

}).controller("adminUsuariosController", function ($scope, $sce, $location, Request, Notify, $state) {
    Request.make("POST", "/admin/getusuarios/").then(function (data) {

        $scope.usuarios = data;

    });
    Request.make("POST", "/admin/getAllRoles/").then(function (data) {

        $scope.roles = data;

    });

    $scope.enableFuncs = function () {
        Request.make("POST", "/admin/getusuarios/").then(function (data) {

            $scope.usuarios = data;

        });
    }
    $scope.btnEstatus = "Guardar";

    $scope.EliminarUsuario = function (item) {
        Request.make("POST", "/admin/EliminarUser/", { user: item }).then(function (data) {
            $scope.enableFuncs();
        });

    }

    $scope.cancelUser = function () {
        $scope.user = null;
       
    }

    $scope.saveUser = function (event) {

        if (!$scope.form1.$valid) {
            window.alert("Complete todos los datos");
            return;
        }
            

        event.preventDefault();
        $scope.user.roleid = $scope.rol.id;
        Request.make("POST", "/admin/saveUser/", { user: $scope.user }).then(function (data) {
      
            $scope.enableFuncs();
            $scope.cancelUser();
           
        });
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

