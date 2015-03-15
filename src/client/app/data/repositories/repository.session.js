/* jshint -W101 */
(function () {
    'use strict';

    angular
        .module('app.data')
        .factory('repository.session', RepositorySession);

    RepositorySession.$inject = ['breeze.config', 'model', 'repository.abstract', 'config', 'ipCookie'];

    function RepositorySession(breezeConfig, model, AbstractRepository, config, ipCookie) {
        var breeze = breezeConfig.breeze;
        var entityName = model.entityNames.session;
        var cookie = {
                name: 'X-Spotern-Token',
                options: {
                    expires: 1800,
                    expirationUnit: 'seconds'
                }
            };

        return {
            create: createRepo // factory function to create the repository
        };

        /* Implementation */
        function createRepo(manager) {
            var base = new AbstractRepository(manager, entityName);
            var $q = base.$q;
            var count, sessionsPerTrack;
            var unchanged = breeze.EntityState.Unchanged;
            var token, session, user;
            var repo = {
                create: create,
                getSession: getSession,
                getSessionFromEmail: getSessionFromEmail
            };

            return repo;

            function create() {
                return manager.createEntity(entityName);
            }

            function getSession() {
                // var entityType = manager.getEntities(entityName);
                // var email = entityType.getProperty('email');
                // var password = entityType.getProperty('email');
            }

            function getSessionFromEmail(email, password) {
                // var em = email || 'nicolas@spotern.com';
                // var pa = password || 'flora1948';
                // var em = email || 'ray.sebastien@gmail.com';
                // var pa = password || 'kawash';

                if (base.areItemsLoaded('session') && !email && !password) {
                    session = base.getAllLocal('login/getTokenByEmailPassword', entityName)[0];
                    return base.$q.when(session);
                }

                if (!email && !password) {
                    user = manager.createEntity('User', {}, unchanged);
                    session = manager.createEntity('Session', {}, unchanged);
                    base.areItemsLoaded('session', true);
                    base.zStorage.save();
                    base.logger.info('Create nullos [Session]', session);
                    return base.$q.when(session);
                }

                return getToken(email, password)
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
            }

            function getToken(email, password) {
                var loginQuery = breeze.EntityQuery
                    .from('login/getTokenByEmailPassword')
                    .toType(entityName)
                    .withParameters({
                        $method: 'POST',
                        $encoding: 'JSON',
                        $data: {
                            email: email,
                            password: password
                        }
                    });

                return loginQuery
                    .using(manager).execute()
                    .then(success).catch(base.queryFailed);

                function success(response) {
                    session = response.results[0];
                    token = session.token;
                    config.token = token;
                    ipCookie(cookie.name, token, cookie.options); // Set cookie
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
})();
