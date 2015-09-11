(function() {
  'use strict';
  
  angular
    .module('triangular')
    .factory('ComponentLinkFactory', ComponentLinkFactory);
  
  ComponentLinkFactory.$inject = ['$http'];

  function ComponentLinkFactory($http) {
    return {
      getComponentLinkUrl: getComponentLinkUrl
    };

    function getComponentLinkUrl(componentTcmUri) {
      console.log('ComponentLinkFactory:getComponentLinkUrl() - Fetch url for component id ' + componentTcmUri);
      // TODO: make service url injectable
      var serviceUri = "http://azeroth.local:83/linking.svc/";
      var requestUri = serviceUri + '/componentLink' +
        '?sourcePageURI=tcm:0-0-0' +
        '&targetComponentURI=' + componentTcmUri +
        '&excludeTemplateURI=tcm:0-0-0' +
        '&linkTagAttributes=' + 
        '&linkText=x' +
        '&showTextOnFail=true' + 
        '&showAnchor=false';
      return $http.get(requestUri)
        .then(extractHref)
        .catch(function (err) {
          console.error(JSON.stringify(err));
        });
    }
    
    function extractHref(response) {
      var matches = /href="(.*)"/.exec(response.data);
      return matches ? matches[1] : null;
    }
  }
})();