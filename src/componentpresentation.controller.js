(function() {
  'use strict';
  
  angular
    .module('triangular')
    .controller('ComponentPresentationController', ComponentPresentationController);
  
  ComponentPresentationController.$inject = ['$scope', 'ComponentPresentationFactory', '$timeout'];

  function ComponentPresentationController($scope, ComponentPresentationFactory, $timeout) {
    activate();
    
    function activate() {
      if ($scope.componentPresentation) {
        injectModelAndView($scope.componentPresentation);
      }
      else {
        ComponentPresentationFactory.getComponentPresentation($scope.componentId, $scope.templateId)
          .then(injectModelAndView);
      }
    }
    
    function injectModelAndView(componentPresentation) {
      // Defer updating the scope for the component presentation to the next digest cycle
      //   as we are most likely running from a page controller apply() call which means
      //   we cannot apply() ourselves at the moment.
      $timeout(function() {
        console.log(componentPresentation);
        $scope.componentView = '/cpViews/' + componentPresentation.ComponentTemplate.Title + '.html';
        $scope.component = componentPresentation.Component;
      });
    }
  }
})();
