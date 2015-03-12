(function() {
    'use strict';

    angular
        .module('app.data')
        .factory('repository.session', RepositorySession);

    RepositorySession.$inject = ['breeze.config', 'model', 'repository.abstract', 'config'];

    function RepositorySession(breezeConfig, model, AbstractRepository, config) {
        var breeze = breezeConfig.breeze;
        var entityName = model.entityNames.session;

        return {
            create: createRepo // factory function to create the repository
        };

        /* Implementation */
        function createRepo(manager) {
            var base = new AbstractRepository(manager, entityName);
            var $q = base.$q;
            var count, sessionsPerTrack;
            var repo = {
                create: create,
                getSessionFromEmail: getSessionFromEmail
            };

            return repo;

            function create() {
                return manager.createEntity(entityName);
            }

            function getSessionFromEmail(email, password, forceRemote) {
                var email = email || 'ray.sebastien@gmail.com';
                var password = password || 'kawash';
                var token, sess;

                if (base.zStorage.areItemsLoaded('session') && !forceRemote) {
                    sess = base.getAllLocal('login/getTokenByEmailPassword', entityName)[0];
                    return base.$q.when(sess);
                }

                return getToken().then(getUserInfos).then(function(data){
                    base.logger.info('[getSessionFromEmail]', data);
                    return data;
                });

                function getToken() {
                    var loginQuery = breeze.EntityQuery
                        .from('login/getTokenByEmailPassword')
                        .withParameters({
                            $method: 'POST',
                            $encoding: 'JSON',
                            $data: {
                                email: email,
                                password: password
                            }
                        });

                    return loginQuery
                        .toType(entityName)
                        .using(manager).execute()
                        .then(success).catch(base.queryFailed);

                    function success(response) {
                        token = response.results[0].token;
                        config.token = token;
                        console.log('token', token);
                        // base.zStorage.areItemsLoaded('homespot', true);
                        base.logger.info('Retrieved [Token] from remote data source', token);
                        base.zStorage.save();
                        return token;
                    }
                }

                function getUserInfos() {
                    var userQuery = breeze.EntityQuery
                        .from('auth/user');

                    // Add token to header
                    // $http.defaults.headers.get = { 'X-Spotern-Token': token };

                    return userQuery
                        .toType('User')
                        .using(manager).execute()
                        .then(success).catch(base.queryFailed);

                    function success(response) {
                        var infos = response.results[0];
                        // Set the userID in session and save
                        sess = base.getAllLocal('login/getTokenByEmailPassword', entityName)[0];
                        if (infos.userID) sess.userID = infos.userID;
                        base.zStorage.areItemsLoaded('session', true);
                        base.zStorage.save();
                        return sess;
                    }
                }
            }
        }
    }
})();