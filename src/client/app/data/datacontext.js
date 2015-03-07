(function() {
    'use strict';

    angular
        .module('app.data')
        .factory('datacontext', datacontext);

    datacontext.$inject = [
        'common',
        '$rootScope'
    ];

    /* @ngInject */
    function datacontext(common, $rootScope) {
        var service = {
            func: func
        };

        return service;

        //////////////////////

        function func() {

        }
    }
})();
