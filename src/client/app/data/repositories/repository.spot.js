/* jshint -W101 */
(function () {
    'use strict';

    angular
        .module('app.data')
        .factory('repository.spot', RepositorySpot);

    RepositorySpot.$inject = ['breeze.config', 'model', 'repository.abstract', 'config'];

    function RepositorySpot(breezeConfig, model, AbstractRepository, config) {
        var breeze = breezeConfig.breeze;
        var entityName = model.entityNames.spot;
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
                getHomeSpots: getHomeSpots,
                getUserSpots: getUserSpots,
                cleanHomeSpot: cleanHomeSpot
            };

            return repo;

            function create() {
                return manager.createEntity(entityName);
            }

            function cleanHomeSpot() {
                return base.cleanEntity('spotHome', entityName);
            }

            function getHomeSpots(start, forceRemote) {
                var st = start || 0,
                    resource = 'spotHome',
                    localkey = resource + start, // define a unique local key to trigger the cache
                    predicate = new breeze.Predicate('start', '==', st),
                    homespot;
                // console.log('getHomeSpots', st);

                if (base.areItemsLoaded(localkey) && !forceRemote) {
                    homespot = base.getAllLocal(resource, entityName, null, predicate);
                    return base.$q.when(homespot);
                }

                var spotsQuery = breeze.EntityQuery
                    .from(resource)
                    .where(predicate);

                spotsQuery.queryOptions = new breeze.QueryOptions({
                    mergeStrategy: breeze.MergeStrategy.OverwriteChanges
                });

                return spotsQuery
                    .toType(entityName)
                    .withParameters({
                        $method: 'POST',
                        $encoding: 'JSON',
                        $data: {
                            start: st,
                            language: 'fr'
                        }
                    })
                    .using(manager).execute()
                    .then(success).catch(base.queryFailed);

                function success(response) {
                    homespot = response.results;
                    base.areItemsLoaded(localkey, true);
                    base.logger.info('Retrieved [HomeSpot] from: ' + localkey, homespot);
                    base.zStorage.save();
                    return homespot;
                }
            }

            function getUserSpots(forceRemote, userID, start, limit) {
                var st  = start || 0,
                    li  = limit || 10,
                    uid = userID || config.userID;

                var spots;

                var spotsQuery = breeze.EntityQuery
                    .from('user/spot')
                    .toType('Spot')
                    .withParameters({
                        $method: 'POST',
                        $encoding: 'JSON',
                        $data: {
                            'userID': uid,
                            'order': 'date',
                            'start': st,
                            'limit': li
                        }
                    });

                return spotsQuery
                    .using(manager).execute()
                    .then(success).catch(base.queryFailed);

                function success(response) {
                    spots = response.results;
                    return spots;
                }
            }
        }
    }
})();
