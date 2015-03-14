(function() {
    'use strict';

    angular
        .module('app.home')
        .run(appRun);

    appRun.$inject = ['routerHelper'];
    /* @ngInject */
    function appRun(routerHelper) {
        routerHelper.configureStates(getStates());
    }

    function getStates() {
        return [
            {
                state: 'home',
                config: {
                    url: '/home',
                    templateUrl: 'app/home/home.html',
                    // controller: 'HomeGrid',
                    // controllerAs: 'vm',
                    title: 'home',
                    settings: {
                        nav: 3,
                        content: '<i class="fa fa-home"></i> Home Grid'
                    }
                }
            }
        ];
    }
})();
