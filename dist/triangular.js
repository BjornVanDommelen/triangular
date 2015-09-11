!function(){"use strict";function n(n,t,e){function o(){n.componentPresentation?r(n.componentPresentation):t.getComponentPresentation(n.componentId,n.templateId).then(r)}function r(t){e(function(){console.log(t),n.componentView="/cpViews/"+t.ComponentTemplate.Title+".html",n.component=t.Component})}o()}angular.module("triangular").controller("ComponentPresentationController",n),n.$inject=["$scope","ComponentPresentationFactory","$timeout"]}(),function(){"use strict";function n(){var n={controller:"ComponentPresentationController",template:'<ng-include src="componentView"></ng-include>',replace:!0,restrict:"E",scope:{componentId:"@",templateId:"@",componentPresentation:"="}};return n}angular.module("triangular").directive("tridionComponentPresentation",n).directive("taCp",n)}(),function(){"use strict";function n(n){function t(t,e){console.log("ComponentPresentationFactory:getComponentPresentation() - Fetch component presentation with component id "+t+" and template id "+e);var o="http://azeroth.local:83/odata.svc/",r=t.substring(4).split("-")[0],i=t.substring(4).split("-")[1],c=e.substring(4).split("-")[1],a="PublicationId="+r+",ComponentId="+i+",TemplateId="+c,l=o+"ComponentPresentations("+a+")?$format=json";return n.read(l).then(function(n){return n.PresentationContent}).then(JSON.parse)["catch"](function(n){console.error(JSON.stringify(n))})}return{getComponentPresentation:t}}angular.module("triangular").factory("ComponentPresentationFactory",n),n.$inject=["ODataService"]}(),function(){"use strict";function n(n,t,e){function o(){var e="";if(n.component){if(console.log("ComponentLinkController: Using explicit component"),n.component.Multimedia&&n.component.Multimedia.Url)return console.log("ComponentLinkController: Link to MM component"),void r(n.component.Multimedia.Url);console.log("ComponentLinkController: Link to normal component"),e=n.component.Id}else console.log("ComponentLinkController: Using tcm uri "+n.componentUri),e=n.componentUri;console.log("ComponentLinkController: Fetching component link url from factory"),t.getComponentLinkUrl(e).then(r)}function r(t){e(function(){n.resolvedUrl=t})}o()}angular.module("triangular").controller("ComponentLinkController",n),n.$inject=["$scope","ComponentLinkFactory","$timeout"]}(),function(){"use strict";function n(){function n(n,t,e,o,r){r(n,function(n,e){t.append(n)})}var t={controller:"ComponentLinkController",link:n,restrict:"E",scope:{componentUri:"@",component:"="},transclude:!0};return t}angular.module("triangular").directive("tridionComponentLink",n).directive("taLink",n)}(),function(){"use strict";function n(n){function t(t){console.log("ComponentLinkFactory:getComponentLinkUrl() - Fetch url for component id "+t);var o="http://azeroth.local:83/linking.svc/",r=o+"/componentLink?sourcePageURI=tcm:0-0-0&targetComponentURI="+t+"&excludeTemplateURI=tcm:0-0-0&linkTagAttributes=&linkText=x&showTextOnFail=true&showAnchor=false";return n.get(r).then(e)["catch"](function(n){console.error(JSON.stringify(n))})}function e(n){var t=/href="(.*)"/.exec(n.data);return t?t[1]:null}return{getComponentLinkUrl:t}}angular.module("triangular").factory("ComponentLinkFactory",n),n.$inject=["$http"]}(),function(){"use strict";function n(n){n.otherwise({template:'<ng-include src="pageView"></ng-include>',controller:"PageController as pageController"})}function t(n){n.html5Mode(!0)}angular.module("triangular",[]).config(["$routeProvider",n]).config(["$locationProvider",t])}(),function(){"use strict";function n(n){function t(t){return console.log("Requesting "+t),n(function(n,e){OData.read(t,n,e)})}return{read:t}}angular.module("triangular").service("ODataService",n),n.$inject=["$q"]}(),function(){"use strict";function n(n,t,e){function o(){e.getPage(r(t.path())).then(i)}function r(n){return console.log("Original path is "+n),n||(n="/"),-1!==n.indexOf(".html",n.length-5)||(n=-1!==n.indexOf("/",n.length-1)?n+"default.html":n+".html"),n}function i(t){n.page=t,n.pageView="/pageViews/"+t.PageTemplate.Title+".html"}o()}angular.module("triangular").controller("PageController",n),n.$inject=["$scope","$location","PageFactory"]}(),function(){"use strict";function n(n){function t(t){console.log("PageFactory:getPage() - Fetch page with url "+t);var e="http://azeroth.local:83/odata.svc/",o=e+"Pages?$filter=Url+eq+%27"+t+"%27&$format=json&$expand=PageContent";return n.read(o).then(function(n){var t=n.results;return 0!==t.length?n.results[0].PageContent.Content:void console.error("404! Panic!")}).then(JSON.parse)["catch"](function(n){console.error(JSON.stringify(n))})}return{getPage:t}}angular.module("triangular").factory("PageFactory",n),n.$inject=["ODataService"]}(),function(){"use strict";function n(n,t){function e(t){return n.trustAsHtml(t)}return e}angular.module("triangular").filter("raw",n),n.$inject=["$sce"]}(),function(){"use strict";function n(n,t){function e(t,e,r,i){var c=t.html,a=c.match(/xlink:href=\"(tcm:\d+-\d+)\"/gi);if(a){var l=[];a.forEach(function(n){l.push(o(n))}),n.all(l).then(function(n){for(var t=0;t<a.length;t++)c=c.replace(a[t],'href="'+n[t]+'"');e.append(c)})}}function o(e){var o=e.match(/tcm:\d+-\d+/i);if(o)return t.getComponentLinkUrl(o[0]);var r=n.defer();return r.resolve(null),r.promise}var r={link:e,restrict:"A",scope:{html:"=taRtf"}};return r}angular.module("triangular").directive("tridionRichTextField",n).directive("taRtf",n),n.$inject=["$q","ComponentLinkFactory"]}();