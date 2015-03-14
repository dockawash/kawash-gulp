/* jshint -W101 */
(function () {
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
                // var em = email || 'nicolas@spotern.com';
                // var pa = password || 'flora1948';
                // var em = email || 'ray.sebastien@gmail.com';
                // var pa = password || 'kawash';
                var em = email;
                var pa = password;
                var token, session, user;

                if (base.areItemsLoaded('session') && !forceRemote) {
                    session = base.getAllLocal('login/getTokenByEmailPassword', entityName)[0];
                    return base.$q.when(session);
                }

                return getToken()
                    .then(getUserInfos)
                    .then(getUserWebsites)
                    .then(function (data) {
                        // Save All Data
                        base.areItemsLoaded('session', true);
                        base.zStorage.save();

                        // Get session from local before sending
                        session = base.getAllLocal('login/getTokenByEmailPassword', entityName)[0];
                        return session;
                    });

                function getToken() {
                    var loginQuery = breeze.EntityQuery
                        .from('login/getTokenByEmailPassword')
                        .toType(entityName)
                        .withParameters({
                            $method: 'POST',
                            $encoding: 'JSON',
                            $data: {
                                email: em,
                                password: pa
                            }
                        });

                    return loginQuery
                        .using(manager).execute()
                        .then(success).catch(base.queryFailed);

                    function success(response) {
                        session = response.results[0];
                        token = session.token;
                        config.token = token;
                        base.logger.info('Retrieved [Token] from remote data source', token);
                        return token;
                    }
                }

                function getUserInfos() {
                    var userQuery = breeze.EntityQuery
                        .from('auth/user')
                        .toType('User');

                    return userQuery
                        .using(manager).execute()
                        .then(success).catch(base.queryFailed);

                    function success(response) {
                        user = response.results[0];
                        // Set the userID in session and in config for later user
                        if (user.userID) {
                            session.userID = user.userID;
                            config.userID = user.userID;
                        }
                        base.logger.info('Retrieved [User] from remote data source', user);
                        return user;
                    }
                }

                function getUserWebsites() {
                    var websiteQuery = breeze.EntityQuery
                        .from('user/website/' + session.userID)
                        .toType('Website:#Spotern.Model');

                    return websiteQuery
                        .using(manager).execute()
                        .then(success).catch(base.queryFailed);

                    function success(response) {
                        // Set userID to all websites
                        angular.forEach(response.results, function (website) {
                            website.userID = user.userID;
                        });
                        // Add websites to user infos
                        user.websites = response.results;
                        base.logger.info('Retrieved [Websites] from remote data source', user.websites);
                        return user.websites;
                    }
                }
            }
        }
    }
})();
