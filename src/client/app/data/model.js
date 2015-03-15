(function () {
    'use strict';

    angular
        .module('app.data')
        .factory('model', model);

    model.$inject = ['breeze', 'model-metadata', 'model-validation'];

    /* @ngInject */
    function model(breeze, modelMetadata, modelValidation) {
        var nulloDate = new Date(1900, 0, 1);
        var nullosExist = false;

        // Set the entityType by repo
        var entityNames = {
            spot: 'Spot',
            session: 'Session'
        };

        var service = {
            initialize: initialize,
            entityNames: entityNames
        };

        return service;

        /////////////

        function initialize(metadataStore) {
            modelValidation.createAndRegister(entityNames);
            modelMetadata.fillMetadataStore(metadataStore);
            modelValidation.applyValidators(metadataStore);
        }

    }
})();
