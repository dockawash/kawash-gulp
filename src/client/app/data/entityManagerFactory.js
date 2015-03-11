(function() {
    'use strict';

    angular
        .module('app.data')
        .factory('entityManagerFactory', emFactory);

    emFactory.$inject = ['breeze.config', 'model', 'config', 'common'];

    function emFactory(breezeConfig, model, config, common) {
        var breeze = breezeConfig.breeze;
        var serviceName = config.api.APIURL;

        var jsonResultsAdapter = new breeze.JsonResultsAdapter({
            name: 'spotern',
            extractResults: function (data) {
                var results = data.results;
                // console.log('results', results);
                return results.result.spots;
            },
            visitNode: function (node, parseContext, nodeContext) {
                // format timestamp to date
                if(node.date && common.isNumber(node.date)) node.date = new Date(node.date*1000);

                console.log('node', node, parseContext, nodeContext);
                // return { entityType: 'HomeSpot' }; // Using toType(entity)
                return;
            }
        });

        var dataService = new breeze.DataService({
            serviceName: serviceName,
            hasServerMetadata: false,
            useJsonp: true,
            jsonResultsAdapter: jsonResultsAdapter
        });

        var manager = new breeze.EntityManager({dataService: dataService});

        model.initialize(manager.metadataStore);

        var provider = {
            manager: manager
        };

        return provider;
    }
})();
