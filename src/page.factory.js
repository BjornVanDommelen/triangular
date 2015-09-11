(function() {
  'use strict';
  
  angular
    .module('triangular')
    .factory('PageFactory', PageFactory);
  
  PageFactory.$inject = ['ODataService'];

  function PageFactory(ODataService) {
    return {
      getPage: getPage
    };

    function getPage(relativeUrl) {
      console.log('PageFactory:getPage() - Fetch page with url ' + relativeUrl);
      // TODO: make service url injectable
      var serviceUri = "http://azeroth.local:83/odata.svc/";
      // Determine the URI of the OData query for the page with this URL.
      // Note that currently this means CWA limitations apply (every page must have a unique relative URL)!
      var requestUri = serviceUri + 'Pages' +
        '?$filter=Url+eq+%27' + relativeUrl + '%27' +
        '&$format=json' +
        '&$expand=PageContent';
      return ODataService.read(requestUri)
        .then(function (data) {
          var matchingPages = data.results;
          if (matchingPages.length === 0) {
            // This represents a 404 error (there is no page in Tridion with this URL)
            // TODO: handle this
            console.error("404! Panic!");
          }
          else {
            return data.results[0].PageContent.Content;
          }
        })
        .then(JSON.parse)
        .catch(function (err) {
          // TODO: error handling for any errors in OData or JSON operations
          console.error(JSON.stringify(err));
        });
     }
  }
})();