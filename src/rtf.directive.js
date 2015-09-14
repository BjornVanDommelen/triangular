(function() {
  'use strict';

  angular
    .module('triangular')
    .directive('tridionRichTextField', RtfDirective)
    .directive('taRtf', RtfDirective)

  RtfDirective.$inject = ['$q', 'ComponentLinkFactory'];
  
  function RtfDirective($q, ComponentLinkFactory) {
    var directive = {
      link: link,
      restrict: 'A',
      scope: {
        html: '=taRtf'
      }
    };

    function link(scope, element, attrs, ctrl) {
      var rawHtml = scope.html;
      // Resolve component links.
      // Note that binary links are pre-resolved by the template and therefore are not a consideration here!
      var linkFragments = rawHtml.match(/xlink:href=\"(tcm:\d+-\d+)\"/gi);
      if (linkFragments) {
        var resolvers = [];
        linkFragments.forEach(function(fragment){
          resolvers.push(resolveFromXlink(fragment));
        });
        // Continue after all component links resolve
        $q.all(resolvers).then(function(resolvedLinks){
          for (var i = 0; i < linkFragments.length; i++) {
            rawHtml = rawHtml.replace(linkFragments[i], 'href="' + resolvedLinks[i] + '"');
          }
          element.append(rawHtml);
        });
      }
      else {
        element.append(rawHtml);
      }
    }

    function resolveFromXlink(attr) {
      var tcmuri = attr.match(/tcm:\d+-\d+/i);
      if (tcmuri) {
        return ComponentLinkFactory.getComponentLinkUrl(tcmuri[0]);
      } else {
        var deferred = $q.defer();
        deferred.resolve(null); 
        return deferred.promise;
      }
    }

    return directive;
  }
})();