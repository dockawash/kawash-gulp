(function() {
    'use strict';

    angular
        .module('app.core')
        .factory('authHttp', authHttp);

    authHttp.$inject = ['$http', '$rootScope', 'authentication', '$upload', 'logger'];

    /* @ngInject */
    function authHttp($http, $rootScope, authentication, $upload, logger) {
        var service = {};
        if (typeof ($http.defaults.cache) === 'undefined') $http.defaults.cache = false;
        // Append the right header to the request
        var extendHeaders = function (config) {
            config.headers = config.headers || {};
            config.headers[authentication.getTokenType] = authentication.getAccessToken();
        };
        // Do this for each $http call
        angular.forEach(['get', 'delete', 'head', 'jsonp'], function (name) {
            service[name] = function (url, config) {
                config = config || {};
                extendHeaders(config);
                return $http[name](url, config);
            };
        });
        angular.forEach(['post', 'put'], function (name) {
            service[name] = function (url, data, config) {
                config = config || {};
                extendHeaders(config);
                return $http[name](url, data, config);
            };
        });
        service.fileUpload = function (url, file, data) {
            var headtoken = {};
            var mydata = data || {};
            headtoken[authentication.getTokenType] = authentication.getAccessToken();
            logger.log('Envoi du fichier ', file);
            return $upload.upload({
                url: url,
                method: 'POST',
                headers: headtoken,
                data: mydata,
                fileFormDataName: 'image',
                file: file
            }).progress(function (evt) {
                $rootScope.$broadcast('uploadPercent', parseInt(100.0 * evt.loaded / evt.total, 10));
                logger.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total, 10));
            }).success(function (data, status, headers, config) {
                // file is uploaded successfully
                logger.success('Fichier bien envoyé!', data);
            }).error(function (data, status, headers, config) {
                logger.error('Erreur lors de l\'envoi du fichier :', data);
            });
        };
        return service;
    }
})();
