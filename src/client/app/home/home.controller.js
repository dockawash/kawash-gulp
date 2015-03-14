(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeGrid', HomeGrid);

    HomeGrid.$inject = ['$state', 'datacontext', 'common'];

    /* @ngInject */
    function HomeGrid($state, datacontext, common) {
        /*jshint validthis: true */
        var $q = common.$q;
        var logger = common.logger;
        var vm = this;
        vm.title = 'HomeGrid';
        vm.spots = [];
        vm.session = {
            email: '',
            password: ''
        };

        vm.cleanHomeSpot = cleanHomeSpot;
        vm.getSessionFromEmail = getSessionFromEmail;

        activate();

        function activate() {
            return getHomeSpots()
                .then(moreHomeSpots)
                .then(function(data) {
                    return logger.info('Home Activated !');
                });
        }

        function getSessionFromEmail() {
            return datacontext.session.getSessionFromEmail(vm.session.email, vm.session.password)
                .then(function(data) {
                    console.log('getSessionFromEmail', data);
                });
        }

        function cleanHomeSpot() {
            return datacontext.spot.cleanHomeSpot().then(function(data){
                return logger.info('Clean up HomeSpot !', data);
            });
        }

        function getHomeSpots() {
            return datacontext.spot.getHomeSpots(0).then(function(data) {
                // console.log('getHomeSpots', data);
                if(common.isType(data)==='array')
                    vm.spots = data;
                return data;
            });
        }

        function moreHomeSpots() {
            var spotCount = vm.spots.length || 0;
            return datacontext.spot.getHomeSpots(spotCount).then(function(data) {
                // console.log('moreHomeSpots', data);
                if(common.isType(data)==='array')
                    vm.spots = vm.spots.concat(data);
                return data;
            });
        }
    }
})();
