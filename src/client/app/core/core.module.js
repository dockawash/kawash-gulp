(function() {
    'use strict';

    angular
        .module('app.core', [
            /* Angular modules */
            'ngRoute',
            'ngAnimate',
            'ngSanitize',
            /* Cross-app modules */
            'blocks.exception',
            'blocks.logger',
            'blocks.router',
            /* 3rd-party modules */
            'ui.router',
            'breeze.angular',   // tells breeze to use $q instead of Q.js
            // 'breeze.directives',// breeze validation directive (zValidate)
            'ngzWip',           // zStorage and zStorageWip
            'ngplus',
            'ipCookie',
            'pascalprecht.translate',
            'angularFileUpload',
            'ngTagsInput',
            'directives.clamp',
            'wu.masonry'
        ]);

})();
