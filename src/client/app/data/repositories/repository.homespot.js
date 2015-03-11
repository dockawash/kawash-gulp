(function() {
    'use strict';

    angular
        .module('app.data')
        .factory('repository.homespot', RepositoryHomespot);

    RepositoryHomespot.$inject = ['breeze.config', 'model', 'repository.abstract'];

    function RepositoryHomespot(breezeConfig, model, AbstractRepository) {
        var breeze = breezeConfig.breeze;
        var entityName = model.entityNames.homespot;
        var sessionsQuery = breeze.EntityQuery.from('spotHome');

        return {
            create: createRepo // factory function to create the repository
        };

        /* Implementation */
        function createRepo(manager) {
            var base = new AbstractRepository(manager, entityName);
            var count, sessionsPerTrack;
            var repo = {
                create: create,
                getHomeSpots: getHomeSpots
            };

            return repo;

            function create() {
                return manager.createEntity(entityName);
            }

            function getHomeSpots(forceRemote) {
                console.log('forceRemote', forceRemote, base.zStorage.areItemsLoaded('homespot'));
                var spots;
                if (base.zStorage.areItemsLoaded('homespot') && !forceRemote) {
                    spots = base.getAllLocal('spotHome', entityName);
                    return base.$q.when(spots);
                }

                var spotsQuery = breeze.EntityQuery
                    .from('spotHome')
                    .withParameters({
                        $method: 'POST',
                        // $encoding: 'JSON', // set in dataService
                        $data: {
                            start: 0,
                            language: 'fr'
                        }
                    });

                return spotsQuery
                    .toType(entityName)
                    .using(manager).execute()
                    .then(success).catch(base.queryFailed);

                function success(response) {
                    spots = base.setIsPartialTrue(response.results);
                    console.log('spots', spots);
                    base.zStorage.areItemsLoaded('homespot', true);
                    base.logger.info('Retrieved [HomeSpot Partials] from remote data source', spots.length);
                    base.zStorage.save();
                    return spots;
                }
            }
        }
    }
})();