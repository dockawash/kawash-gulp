/**
 * Ajax Interceptor
 * doc: https://docs.angularjs.org/api/ng/service/$http#interceptors
 */
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
        var $q = common.$q;

        var service = {
            request: fnRequest,
            // requestError: fnRequestError,
            // response: fnResponse,
            // responseError: fnResponseError
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

        function fnRequestError(rejection) {
            console.log('fnRequestError', rejection);
            // do something on error
            // if (canRecover(rejection)) {
            //     return responseOrNewPromise
            // }
            return $q.reject(rejection);

        }

        function fnResponse(response) {
            console.log('fnResponse', response);
            // do something on success
            return response;
        }

        function fnResponseError(rejection) {
            console.log('fnResponseError', rejection);
            // do something on error
            // if (canRecover(rejection)) {
            //     return responseOrNewPromise
            // }
            return $q.reject(rejection);
        }
    }

    configure.$inject = ['$httpProvider'];

    function configure($httpProvider) {
        $httpProvider.interceptors.push('ajaxInterceptor');
    }

})();
