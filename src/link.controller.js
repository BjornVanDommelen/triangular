(function() {
  'use strict';

  angular
    .module('triangular')
    .controller('ComponentLinkController', ComponentLinkController);

  ComponentLinkController.$inject = ['$scope', 'ComponentLinkFactory', '$timeout'];
  
  function ComponentLinkController($scope, ComponentLinkFactory, $timeout) {
    activate();
    
    function activate() {
      var targetUri = '';
      if ($scope.component) {
        console.log('ComponentLinkController: Using explicit component');
        if ($scope.component.Multimedia && $scope.component.Multimedia.Url) {
          console.log('ComponentLinkController: Link to MM component');
          injectResolvedUrl($scope.component.Multimedia.Url);
          return;
        }
        else {
          console.log('ComponentLinkController: Link to normal component');
          targetUri = $scope.component.Id;
        }
      }
      else {
        console.log('ComponentLinkController: Using tcm uri ' + $scope.componentUri);
        targetUri = $scope.componentUri;
      }
      console.log('ComponentLinkController: Fetching component link url from factory');
      ComponentLinkFactory.getComponentLinkUrl(targetUri)
        .then(injectResolvedUrl);
    }
    
    function injectResolvedUrl(resolvedUrl) {
      // Defer updating the scope for the component presentation to the next digest cycle
      //   as we are most likely running from a page controller apply() call which means
      //   we cannot apply() ourselves at the moment.
      $timeout(function() {
        $scope.resolvedUrl = resolvedUrl;
      });
    }
  }
})();