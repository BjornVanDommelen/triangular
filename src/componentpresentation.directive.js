(function() {
  'use strict';
  
  angular
    .module('triangular')
    .directive("tridionComponentPresentation", ComponentPresentationDirective)
    .directive("taCp", ComponentPresentationDirective)
  
  function ComponentPresentationDirective() {
    var directive = {
      controller: "ComponentPresentationController",
      template: '<ng-include src="componentView"></ng-include>',
      replace: true,
      restrict: 'E',
      scope: {
        componentId: "@",
        templateId: "@",
        componentPresentation: "="
      }
    };
    return directive;
  }
})();