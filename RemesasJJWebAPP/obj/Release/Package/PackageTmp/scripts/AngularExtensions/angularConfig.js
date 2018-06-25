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