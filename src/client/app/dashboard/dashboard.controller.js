(function() {
    'use strict';

    angular
        .module('app.dashboard')
        .controller('Dashboard', Dashboard);

    Dashboard.$inject = ['$state', 'dataservice', 'datacontext', 'logger', 'common'];
    function Dashboard($state, dataservice, datacontext, logger, common) {
        var vm = this;
        var $q = common.$q;
        vm.customers = [];
        vm.gotoCustomer = gotoCustomer;
        vm.title = 'Dashboard';

        activate();

        function activate() {
            var promises = [
                getCustomers(),
                getHomeSpots(),
                getSession()
            ];
            return $q.all(promises).then(function() {
                logger.info('Activated Dashboard');
            });
        }

        function getCustomers() {
            return dataservice.getCustomers().then(function(data) {
                // console.log('getCustomers', data);
                vm.customers = data;
                return vm.customers;
            });
        }

        function getHomeSpots() {
            return datacontext.homespot.getHomeSpots().then(function(data) {
                console.log('getHomeSpots', data);
            })
        }

        function getSession() {
            return datacontext.session.getSessionFromEmail().then(function(data) {
                console.log('getSession', data);
            });
        }

        function gotoCustomer(c) {
            $state.go('customer.detail', {id: c.id});
        }
    }
})();
