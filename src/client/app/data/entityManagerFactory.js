/* jshint -W101 */
(function () {
    'use strict';

    angular
        .module('app.data')
        .factory('entityManagerFactory', emFactory);

    emFactory.$inject = ['breeze.config', 'model', 'config', 'common'];

    function emFactory(breezeConfig, model, config, common) {
        var breeze = breezeConfig.breeze;
        var logger = common.logger;
        var $translate = common.$translate;
        var serviceName = config.api.APIURL;
        var resource;

        var jsonResultsAdapter = new breeze.JsonResultsAdapter({
            name: 'jsonApiAdapter',
            extractResults: function (data) {
                resource = data.httpResponse.config.url.replace(serviceName + '/', '').replace(/\?.*/, '');
                console.log('jsonExtractResults resource:', resource, data.httpResponse.config.url, data.results);
                return extractJsonResults(data, resource);
            },
            visitNode: function (node, parseContext, nodeContext) {
                // if (nodeContext.nodeType === 'root' && resource === 'spotHome') {
                //     console.log('visitNode [spotHome]', node, parseContext);
                // }

                // if (resource.match(/auth\/user/)) {
                //     // node.websites = [];
                //     console.log('jsonvisitNode', node, nodeContext);
                // }

                // Set entityType for navProp only if there is a node !!
                // if ( node && (nodeContext.nodeType === 'navProp' || nodeContext.nodeType === 'navPropItem') && nodeContext.navigationProperty.entityType.shortName) {
                //     console.log('jsonvisitNode', node, nodeContext);
                //     var meta = parseContext.entityManager.metadataStore;
                //     var typeName = nodeContext.navigationProperty.entityType.shortName;
                //     var type = typeName && meta.getEntityType(typeName, true);
                //     var result = node;
                //     if (type) {
                //         console.log('jsonvisitNode', node, nodeContext);
                //         result.entityType = type;
                //         // Format timestamp to date
                //         if (result.date && common.isNumber(result.date)) result.date = new Date(result.date * 1000);
                //     }
                //     // console.log('result', result);
                //     return result;
                // }
            }
        });

        var dataService = new breeze.DataService({
            serviceName: serviceName,
            hasServerMetadata: false,
            // useJsonp: true,
            jsonResultsAdapter: jsonResultsAdapter
        });

        var manager = new breeze.EntityManager({
            dataService: dataService
        });

        model.initialize(manager.metadataStore);

        var provider = {
            manager: manager
        };

        return provider;

        function extractJsonResults(data, resource) {
            var results = {};
            if (!data.results.status) {
                var error = {};
                error.ref = 'Spotern API';
                error.error = data.results.error;
                error.message = data.results.message;
                throw error;
            }
            switch (resource) {
                case 'spotHome':
                    var spots = data.results.result.spots || [];
                    angular.forEach(spots, function(spot) {
                        spot.start = data.results.result.start;
                        spot.total = data.results.result.total;
                    });
                    results = spots;
                    break;
                default:
                    results = data.results.result || results;
            }
            return results;
        }

    }
})();
