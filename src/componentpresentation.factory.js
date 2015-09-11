(function() {
  'use strict';
  
  angular
    .module('triangular')
    .factory('ComponentPresentationFactory', ComponentPresentationFactory);
  
  ComponentPresentationFactory.$inject = ['ODataService'];

  function ComponentPresentationFactory(ODataService) {
    return {
      getComponentPresentation: getComponentPresentation
    };

    function getComponentPresentation(componentId, templateId) {
      console.log('ComponentPresentationFactory:getComponentPresentation() - Fetch component presentation with component id ' + componentId + ' and template id ' + templateId);
      // TODO: make service url injectable
      var serviceUri = "http://azeroth.local:83/odata.svc/";
      // TODO: factory/service for parsing item IDs
      var componentPublicationId = componentId.substring(4).split('-')[0];
      var componentItemId = componentId.substring(4).split('-')[1];
      var templateItemId = templateId.substring(4).split('-')[1];
      var identity = 'PublicationId=' + componentPublicationId + ',ComponentId=' + componentItemId + ',TemplateId=' + templateItemId
      var requestUri = serviceUri + 
        'ComponentPresentations(' + identity + ')' +
        '?$format=json';
        
      return ODataService.read(requestUri)
        .then(function (data) {
          return data.PresentationContent;
        })
        .then(JSON.parse)
        .catch(function (err) {
          console.error(JSON.stringify(err));
        });
    }
  }
})();
