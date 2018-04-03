angular.module("angularConfig", ['ui.router'])
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
                  return 1;
              }
          }

      }).state({
          name: "Form",
          url: "/home",
          templateUrl: "/form/index",
          controller: "FormController",
          resolve: {
              clientes: function () {
                  return 1;
              }
          }

      })
 }])