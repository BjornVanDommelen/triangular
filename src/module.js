(function() {
  'use strict';

  angular
    .module('triangular', [])
    .config(['$routeProvider', routeTridionPages])
    .config(['$locationProvider', useHtml5Urls]);

  function routeTridionPages($routeProvider) {
    // Trigger a reload for image URLs as these need to come from the server
    $routeProvider.when('/Images/:binaryFile', {
      redirectTo: function(){ window.location.reload(); }
    });

    // Assume all other URLs are pages to be processed by the page controller
    $routeProvider.otherwise({
      template: '<ng-include src="pageView"></ng-include>',
      controller: 'PageController as pageController'
    });
  }
  
  function useHtml5Urls($locationProvider) {
    $locationProvider.html5Mode(true);
  }
})();