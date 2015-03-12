(function() {
    'use strict';

    angular
        .module('app.data')
        .factory('model', model);

    model.$inject = ['breeze', 'model-metadata'];

    /* @ngInject */
    function model(breeze, modelMetadata) {
        // Set the entityType by repo
        var entityNames = {
            homespot: 'HomeSpot',
            session: 'Session',
            user: 'User'
        };

        var service = {
            initialize: initialize,
            entityNames: entityNames
        };

        return service;

        /////////////

        function initialize(metadataStore) {
            modelMetadata.fillMetadataStore(metadataStore);
        }

    }
})();
