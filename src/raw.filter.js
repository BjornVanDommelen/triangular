(function() {
  'use strict';

  angular
    .module('triangular')
    .filter('raw', RawFilter);

  RawFilter.$inject = ['$sce'];
  
  function RawFilter($sce, ComponentLinkFactory) {
    return filter;
    
    function filter(input) {
      return $sce.trustAsHtml(input);
    }
  }
})();