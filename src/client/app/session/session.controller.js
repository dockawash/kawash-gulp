(function () {
    'use strict';

    angular
        .module('app.session')
        .controller('Session', Session);

    Session.$inject = ['$scope', 'common', 'config', 'datacontext'];

    function Session($scope, common, config, datacontext) {
        /*jshint validthis: true */
        var vm = this;

        vm.title = 'Sessions';

        activate();

        function activate() {
        }
    }
})();
