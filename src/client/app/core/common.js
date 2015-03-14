(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('common', common);

    common.$inject = ['$location', '$q', '$rootScope', '$timeout', 'logger'];

    /* @ngInject */
    function common($location, $q, $rootScope, $timeout, logger) {
        var throttles = {};

        var service = {
            // common angular dependencies
            $broadcast: $broadcast,
            $q: $q,
            $timeout: $timeout,
            // generic
            // createSearchThrottle: createSearchThrottle,
            // debouncedThrottle: debouncedThrottle,
            isNumber: isNumber,
            isType: isType,
            logger: logger, // for accessibility
            // replaceLocationUrlGuidWithId: replaceLocationUrlGuidWithId,
            textContains: textContains
        };

        return service;

        //////////////////////

        function $broadcast() {
            return $rootScope.$broadcast.apply($rootScope, arguments);
        }

        function isNumber(val) {
            // negative or positive
            return (/^[-]?\d+$/).test(val);
        }

        function isType(val) {
            return angular.element.type(val);
        }

        function textContains(text, searchText) {
            return text && -1 !== text.toLowerCase().indexOf(searchText.toLowerCase());
        }

    }
})();
