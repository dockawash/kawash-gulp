/* global breeze:false */
(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('breeze.config', breezeConfig);
    // .config(configure);

    breezeConfig.$inject = ['breeze', '$http'];

    // Common Breeze configuration during Ng's "config" phase
    /* @ngInject */
    function breezeConfig(breeze, $http) {
        var service = {
            breeze: breeze
        };

        configureAjaxForBreeze();

        return service;

        function configureAjaxForBreeze() {
            // Do not validate when we attach a newly created entity to an EntityManager.
            // We could also set this per entityManager
            new breeze.ValidationOptions({
                validateOnAttach: false
            }).setAsDefault();
            var ajaxAdapter = breeze.config.initializeAdapterInstance('ajax', 'angular');
            ajaxAdapter.setHttp($http); // use the $http instance that Angular injected into your app.
            breeze.ajaxpost(ajaxAdapter); // Allow POST in params
        }
    }

    configure.$inject = ['config', 'zDirectivesConfigProvider', 'zStorageConfigProvider'];

    function configure(config, zDir, zStore) {

        // Setup our Breeze-based offline storage
        zStore.config = {
            // zStorage
            enabled: false,
            key: 'CCAngularBreeze',
            events: config.events.storage,

            // zStorageWip
            wipKey: 'CCAngularBreeze.wip',
            appErrorPrefix: config.appErrorPrefix,
            newGuid: breeze.core.getUuid,

            // zStorageCore
            version: config.version
        };

        configureZValidate();

        function configureZValidate() {

            //#region (Optional) Configure the Breeze Validation Directive

            // We're having fun proving we can tweak the way errors are presented
            // We would be fine with the out-of-the-box format
            zDir.zValidateTemplate =
                '<span class="invalid"><i class="fa fa-warning-sign"></i>' +
                'Inconceivable! %error%</span>';

            //zDir.zRequiredTemplate =
            //    '<i class="fa fa-asterisk fa-asterisk-invalid z-required" title="Required"></i>';

            // Learning Point:
            // Can configure during config or app.run phase
            //app.run(['zDirectivesConfig', function(zDir) {
            //    zDir.zValidateTemplate =
            //                 '<span class="invalid"><i class="fa fa-warning-sign"></i>' +
            //                 'Inconceivable! %error%</span>';
            //}]);

            //#endregion
        }
    }
})();
