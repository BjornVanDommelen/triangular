(function() {
  'use strict';

  angular
    .module('triangular')
    .directive('tridionComponentLink', ComponentLinkDirective)
    .directive('taLink', ComponentLinkDirective)

  function ComponentLinkDirective() {
    var directive = {
      controller: 'ComponentLinkController',
      link: link,
      restrict: 'E',
      scope: {
        componentUri: '@',
        component: '='
      },
      transclude: true
    };
    return directive;
    
    function link(scope, element, attrs, ctrl, transclude) {
      // Note we're explicitly modifying the transclusion scope to be identical to our directive scope.
      // This means we have NO access to the outside controller scope as the directive scope is isolated!
      // Note that due to this reason we need to append the element ourselves and omit the ng-transclude
      //   directive (or transcluded HTML will still have it's own scope).
      transclude(scope, function(clone, transcludeScope){
        element.append(clone);
      });
    }
  }
})();