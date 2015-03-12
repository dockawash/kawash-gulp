(function() {
    'use strict';

    angular
        .module('app.data')
        .factory('entityManagerFactory', emFactory);

    emFactory.$inject = ['breeze.config', 'model', 'config', 'common'];

    function emFactory(breezeConfig, model, config, common) {
        var breeze = breezeConfig.breeze;
        var logger = common.logger;
        var serviceName = config.api.APIURL;
        var resource;

        var jsonResultsAdapter = new breeze.JsonResultsAdapter({
            name: 'jsonApiAdapter',
            extractResults: function (data) {
                console.log('jsonExtractResults', data);
                resource = data.httpResponse.config.url.replace(serviceName+'/','');
                return extractJsonResults(data, resource);
            },
            visitNode: function (node, parseContext, nodeContext) {
                // console.log('jsonvisitNode', node, nodeContext);

                // Set entityType for Spots
                if(   (nodeContext.nodeType=='navProp' || nodeContext.nodeType=='navPropItem')
                    && nodeContext.navigationProperty.entityType.shortName) {
                    var meta = parseContext.entityManager.metadataStore;
                    var typeName = nodeContext.navigationProperty.entityType.shortName;
                    var type = typeName && meta.getEntityType(typeName, true);
                    var result = node;
                    if (type) {
                        result.entityType = type;
                        // Format timestamp to date
                        if(result.date && common.isNumber(result.date)) result.date = new Date(result.date*1000);
                    };
                    // console.log('result', result);
                    return result;
                }
            }
        });

        var dataService = new breeze.DataService({
            serviceName: serviceName,
            hasServerMetadata: false,
            // useJsonp: true,
            jsonResultsAdapter: jsonResultsAdapter
        });

        var manager = new breeze.EntityManager({dataService: dataService});

        model.initialize(manager.metadataStore);

        var provider = {
            manager: manager
        };

        return provider;

        function extractJsonResults(data, resource) {
            if (!data.results.status) {
                // console.log('['+data.results.error+']', data.results);
                logger.error('['+data.results.error+'] '+data.results.message, data);
                return {};
            }
            var results;
            switch(resource) {
                // case 'spotHome':
                //     results = data.results.result.spots;
                //     break;
                default:
                    results = data.results.result
            }
            return results;
        }

    }
})();
