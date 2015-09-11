(function() {
  'use strict';
  
  angular
    .module('triangular')
    .controller('PageController', PageController);
  
  PageController.$inject = ['$scope', '$location', 'PageFactory'];

  function PageController($scope, $location, PageFactory) {
    activate();
    
    function activate() {
      PageFactory.getPage(getTridionUrl($location.path()))
        .then(injectModelAndView);
    }
    
    function getTridionUrl(relativeUrl) {
      console.log('Original path is ' + relativeUrl);
      // Use extensionless URLs
      // Append .html or default.html depending on if we end with a /
      // If path is empty make path equal to /
      // TODO: move this to a factory or service?
      if (!relativeUrl) {
        relativeUrl = '/';
      }
      if (relativeUrl.indexOf('.html', relativeUrl.length - 5) !== -1) {
        // Don't adjust path for pages ending in .html
      }
      else {
        relativeUrl = relativeUrl.indexOf('/', relativeUrl.length - 1) !== -1 ? relativeUrl + 'default.html' : relativeUrl + '.html';
      }
      return relativeUrl;
    }
    
    function injectModelAndView(page) {
      // We can update the scope directly here as we are 'in' angular context!
      // So no need for $scope.apply()...
      $scope.page = page;
      // TODO: use a factory to determine the correct view from the page
      $scope.pageView = '/pageViews/' + page.PageTemplate.Title + '.html';
    }
  }
})();