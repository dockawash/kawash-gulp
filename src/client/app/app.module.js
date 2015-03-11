(function() {

    'use strict';

    angular.module('app', [
        /* Shared modules */
        'app.core',
        'app.data',
        'app.widgets',

        /* Feature areas */
        'app.customers',
        'app.dashboard',
        'app.layout'
    ]);

})();
