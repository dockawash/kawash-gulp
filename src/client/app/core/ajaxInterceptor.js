(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('ajaxInterceptor', ajaxInterceptor)
        .config(configure);

    ajaxInterceptor.$inject = ['common', 'config'];

    /* @ngInject */
    function ajaxInterceptor(common, config) {
        var $q = common.$q;

        var service = {
            request: fnRequest,
            // requestError: fnrequestError,
            // response: fnresponse,
            // responseError: fnresponseError
        };

        return service;

        ////////////////

        function fnRequest(pConfig) {
            var resource = pConfig.url.replace(config.api.APIURL+'/','').replace(/\?(.*?)/,'');
            // console.log('resource', resource);
            switch(resource) {
                case 'auth/user':
                    // Get token from config
                    if (config.token)
                        pConfig.headers = angular.extend( pConfig.headers, { 'X-Spotern-Token': config.token } );
                    break;
            }
            return pConfig;
        }

        function fnRequestError(rejection) {
        }

        function fnResponse(response) {
        }

        function fnResponseErro(rejection) {
        }
    }

    configure.$inject = ['$httpProvider'];

    function configure($httpProvider) {
        $httpProvider.interceptors.push('ajaxInterceptor');
    }

})();
