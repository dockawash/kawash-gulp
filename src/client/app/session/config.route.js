(function() {
    'use strict';

    angular
        .module('app.session')
        .run(routeConfig);

    routeConfig.$inject = ['routerHelper'];
    /* @ngInject */
    function routeConfig(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'session',
                config: {
                    url: '/session',
                    title: 'session',
                    templateUrl: 'app/session/session.html',
                    settings: {
                        nav: 2,
                        content: '<i class="fa fa-user"></i> Mon Compte'
                    }
                }
            }
            // {
            //     url: '/sessions/search/:search',
            //     config: {
            //         title: 'sessions-search',
            //         templateUrl: 'app/session/sessions.html',
            //         settings: {}
            //     }
            // },
            // {
            //     url: '/session/:id',
            //     config: {
            //         templateUrl: 'app/session/sessiondetail.html',
            //         title: 'session',
            //         settings: {}
            //     }
            // }
        ];
    }
})();
