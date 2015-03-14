/* jshint -W101 */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('ajaxInterceptor', ajaxInterceptor)
        .config(configure);

    ajaxInterceptor.$inject = ['common', 'config'];

    /* @ngInject */
    function ajaxInterceptor(common, config) {
        // var $q = common.$q;

        var service = {
            request: fnRequest,
            // requestError: fnrequestError,
            // response: fnresponse,
            // responseError: fnresponseError
        };

        return service;

        ////////////////

        function fnRequest(ajaxConfig) {
            var resource = ajaxConfig.url.replace(config.api.APIURL + '/', '').replace(/\?(.*?)/, '');
            // Set the token for auth resource
            if (resource.indexOf('auth') >= 0 && config.token)
                ajaxConfig.headers = angular.extend(ajaxConfig.headers, {
                    'X-Spotern-Token': config.token
                });
            return ajaxConfig;
        }

        function fnRequestError(rejection) {}

        function fnResponse(response) {}

        function fnResponseErro(rejection) {}
    }

    configure.$inject = ['$httpProvider'];

    function configure($httpProvider) {
        $httpProvider.interceptors.push('ajaxInterceptor');
    }

})();
