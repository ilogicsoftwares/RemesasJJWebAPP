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
                 
              }
          }
      }).state({
          name: "ActRemesa",
          url: "/remesas/",
          templateUrl: "/remesas/index",
          controller: "adminRemesaController",
          resolve: {
              clientes: function () {
                
              }
          }
      }).state({
          name: "Form",
          url: "/home",
          templateUrl: "/form/index",
          controller: "FormController",
          resolve: {
              bancos: function (Request) {
                  return Request.make("POST","/form/Bancos/");
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