angular.module("angularConfig", ['ui.router','angularServices'])
 .config(['$stateProvider', function ($stateProvider) {
  
     $stateProvider
      .state({
          name: "AdminHome",
          url: "/admin/home",
          templateUrl: "/admin/homes",
          controller: "adminHomeController",
          resolve: {
              clientes: function () {
                  return 1;
              }
          }

      }).state({
          name: "ActCambio",
          url: "/admin/cambio",
          templateUrl: "/admin/cambio",
          controller: "adminCambioController",
          resolve: {
              clientes: function () {
                  $("#wrapper").toggleClass("toggled");
              }
          }
      }).state({
          name: "Bancos",
          url: "/admin/Bancos",
          templateUrl: "/admin/bancos",
          controller: "adminBancosController",
          resolve: {
              clientes: function () {
                  $("#wrapper").toggleClass("toggled");
              },
              cuentas: function (Request) {
                  return Request.make("POST", "/Admin/getcuentas/");
              },
              monedas: function (Request) {
                  return Request.make("POST", "/Admin/getmonedas/");
              }
          }
      }).state({
          name: "ActRemesa",
          url: "/remesas/Remesas",
          templateUrl: "/remesas/index",
          controller: "adminRemesaController",
          resolve: {
              clientes: function () {
                  $("#wrapper").toggleClass("toggled");
              }
          }
      }).state({
          name: "FormOffice",
          templateUrl: "/formOffice/index",
          controller: "FormController",
          resolve: {
              bancos: function (Request) {
                
                  return Request.make("POST", "/form/Bancos/");
              }, closex: function () {


                  $("#wrapper").toggleClass("toggled");
              }
          }
      }).state({
          name: "FormOffice2",
          templateUrl: "/formOffice/form2",
          controller: "FormController",
          resolve: {
              bancos: function (Request) {
                  return Request.make("POST", "/form/Bancos/");
              }
          }
      }).state({
          name: "FormOffice3",
          templateUrl: "/formOffice/form3",
          controller: "FormController",
          resolve: {
              bancos: function (Request) {
                  return Request.make("POST", "/form/Bancos/");
              }
          }
      }).state({
          name: "FormOffice4",
          templateUrl: "/formOffice/form4",
          controller: "FormController",
          resolve: {
              bancos: function (Request) {
                  return Request.make("POST", "/form/Bancos/");
              }
          }
      }).state({
          name: "PrintRemesa",
          url: "/form/remesasReport/:id",
          templateUrl:function(stateParams) {
             return "/formOffice/remesasReport/"+stateParams.id;
          } ,
          controller: "remesasReportController"
      }).state({
          name: "Form",
          templateUrl: "/form/index",
          controller: "FormController",
          resolve: {
              bancos: function (Request) {
                  return Request.make("POST","/form/Bancos/");
              }
          }
      }).state({
          name: "Form2",
          templateUrl: "/form/form2",
          controller: "FormController",
          resolve: {
              bancos: function (Request) {
                  return Request.make("POST", "/form/Bancos/");
              }
          }
      }).state({
          name: "Form3",
          templateUrl: "/form/form3",
          controller: "FormController",
          resolve: {
              bancos: function (Request) {
                  return Request.make("POST", "/form/Bancos/");
              }
          }
      }).state({
          name: "ReporteGeneral",
          url:"/reports/reporteDiario",
          templateUrl: "/reports/GeneralRemesas",
          controller: "ReportGController",
          resolve: {
          bancos: function (Request) {
             return Request.make("POST", "/Remesas/BancosEmpre/");
         }
     }
          
      }).state({
          name: "Form4",
          templateUrl: "/form/form4",
          controller: "FormController",
          resolve: {
              bancos: function (Request) {
                  return Request.make("POST", "/form/Bancos/");
              }
          }
      }).state({
          name: "Message",
          url: "/Message",
          templateUrl: "/form/message/",
          controller: "messageController",
          resolve: {
              clientes: function () {
                  return 1;
              }
          }

      }).state({
          name: "Error",
          url: "/Error",
          templateUrl: "/form/error/",
          controller: "messageController",
          resolve: {
              clientes: function () {
                  return 1;
              }
          }

      })
 }])