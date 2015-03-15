(function() {

    'use strict';

    angular.module('app', [
        /* Shared modules */
        'app.core',
        'app.data',
        'app.widgets',

        /* Feature areas */
        'app.session',
        'app.dashboard',
        'app.home',
        'app.layout'
    ]);

})();
