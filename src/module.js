(function() {
  'use strict';

  angular
    .module('triangular', [])
    .config(['$routeProvider', routeTridionPages])
    .config(['$locationProvider', useHtml5Urls]);

  function routeTridionPages($routeProvider) {
    $routeProvider.otherwise({
      template: '<ng-include src="pageView"></ng-include>',
      controller: 'PageController as pageController'
    });
  }
  
  function useHtml5Urls($locationProvider) {
    $locationProvider.html5Mode(true);
  }
})();