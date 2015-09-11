(function() {
  'use strict';
  
  angular
    .module('triangular')
    .service('ODataService', ODataService);
  
  ODataService.$inject = ['$q'];

  function ODataService($q) {
    return {
      read: read
    };

    function read(requestUri) {
      console.log('Requesting ' + requestUri);
      return $q(function(resolve, reject) {
        OData.read(requestUri, resolve, reject);
      });
    }
  }
})();
