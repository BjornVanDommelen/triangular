(function() {
  'use strict';

  angular
    .module('triangular', [])
    .config(['$routeProvider', routeTridionPages])
    .config(['$locationProvider', useHtml5Urls]);

  function routeTridionPages($routeProvider) {
    // Trigger a reload for image URLs as these need to come from the server
    $routeProvider.when('/Images/:binaryFile', {
      redirectTo: function(){ window.location.reload(); }
    });

    // Assume all other URLs are pages to be processed by the page controller
    $routeProvider.otherwise({
      template: '<ng-include src="pageView"></ng-include>',
      controller: 'PageController as pageController'
    });
  }
  
  function useHtml5Urls($locationProvider) {
    $locationProvider.html5Mode(true);
  }
})();
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

(function() {
  'use strict';
  
  angular
    .module('triangular')
    .controller('PageController', PageController);
  
  PageController.$inject = ['$scope', '$location', 'PageFactory'];

  function PageController($scope, $location, PageFactory) {
    activate();
    
    function activate() {
      PageFactory.getPage(getTridionUrl($location.path()))
        .then(injectModelAndView);
    }
    
    function getTridionUrl(relativeUrl) {
      console.log('Original path is ' + relativeUrl);
      // Use extensionless URLs
      // Append .html or default.html depending on if we end with a /
      // If path is empty make path equal to /
      // TODO: move this to a factory or service?
      if (!relativeUrl) {
        relativeUrl = '/';
      }
      if (relativeUrl.indexOf('.html', relativeUrl.length - 5) !== -1) {
        // Don't adjust path for pages ending in .html
      }
      else {
        relativeUrl = relativeUrl.indexOf('/', relativeUrl.length - 1) !== -1 ? relativeUrl + 'default.html' : relativeUrl + '.html';
      }
      return relativeUrl;
    }
    
    function injectModelAndView(page) {
      // We can update the scope directly here as we are 'in' angular context!
      // So no need for $scope.apply()...
      $scope.page = page;
      // TODO: use a factory to determine the correct view from the page
      $scope.pageView = '/pageViews/' + page.PageTemplate.Title + '.html';
    }
  }
})();
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