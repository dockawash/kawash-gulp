(function () {
    'use strict';

    angular
        .module('app.home')
        .controller('HomeGrid', HomeGrid);

    HomeGrid.$inject = ['$scope', '$state', 'datacontext', 'common', 'config'];

    /* @ngInject */
    function HomeGrid($scope, $state, datacontext, common, config) {
        /*jshint validthis: true */
        var $q = common.$q;
        var logger = common.logger;
        var vm = this;
        var wipEntityKey;

        vm.title = 'HomeGrid';
        vm.spots = [];
        vm.session = undefined;
        vm.hasChanges = false;
        vm.isValid = false;
        vm.isSaving = false;
        vm.cleanHomeSpot = cleanHomeSpot;
        vm.login = login;
        vm.save = save;

        activate();

        function activate() {
            getSession();
            onDestroy();
            onHasChanges();
            return getHomeSpots()
                .then(function (data) {
                    return logger.info('Home Activated !');
                });
        }

        function login() {
            var prom = datacontext.session.getSessionFromEmail(vm.session.email, vm.session.password);
            return vm.save()
                .then(prom)
                .then(function(data) {
                    vm.session = data;
                    return logger.info('User [' + vm.session.userID + '] Connecté !', data);
                })

        }

        function getSession() {
            return datacontext.session.getSessionFromEmail()
                .then(function (data) {
                    console.log('getSessionFromEmail', data);
                    vm.session = data;
                });
        }

        function cleanHomeSpot() {
            return datacontext.spot.cleanHomeSpot().then(function (data) {
                return logger.info('Clean up HomeSpot !', data);
            });
        }

        function getHomeSpots() {
            return datacontext.spot.getHomeSpots(0).then(function (data) {
                // console.log('getHomeSpots', data);
                if (common.isType(data) === 'array')
                    vm.spots = data;
                return data;
            });
        }

        function moreHomeSpots() {
            var spotCount = vm.spots.length || 0;
            return datacontext.spot.getHomeSpots(spotCount).then(function (data) {
                // console.log('moreHomeSpots', data);
                if (common.isType(data) === 'array')
                    vm.spots = vm.spots.concat(data);
                return data;
            });
        }

        function autoStoreWip(immediate) {
            common.debouncedThrottle('sessiondetail', storeWipEntity, 1000, immediate);
        }

        function cancel() {
            datacontext.cancel();
            removeWipEntity();
            // common.replaceLocationUrlGuidWithId(vm.session.id);
            // if (vm.session.entityAspect.entityState.isDetached()) {
            //     gotoSessions();
            // }
        }

        function canSave() {
            return vm.hasChanges && !vm.isSaving;
        }

        function onDestroy() {
            $scope.$on('$destroy', function() {
                autoStoreWip(true);
                datacontext.cancel();
            });
        }

        function onEveryChange() {
            $scope.$on(config.events.entitiesChanged,
                function(event, data) {
                    autoStoreWip();
                });
        }

        function onHasChanges() {
            $scope.$on(config.events.hasChangesChanged,
                function(event, data) {
                    vm.hasChanges = data.hasChanges;
                });
        }

        function removeWipEntity() {
            datacontext.zStorageWip.removeWipEntity(wipEntityKey);
        }

        function save() {
            if (!canSave()) {
                return $q.when(null);
            } // Must return a promise

            vm.isSaving = true;
            return datacontext.save().then(function(saveResult) {
                vm.isSaving = false;
                removeWipEntity();
                // common.replaceLocationUrlGuidWithId(vm.session.id);
                // datacontext.speaker.calcIsSpeaker();
            }).catch(function(error) {
                vm.isSaving = false;
            });
        }

        function storeWipEntity() {
            if (!vm.session) {
                return;
            }
            var description = vm.title;
            wipEntityKey = datacontext.zStorageWip.storeWipEntity(vm.session, wipEntityKey, 'Session', description);
        }
    }
})();
