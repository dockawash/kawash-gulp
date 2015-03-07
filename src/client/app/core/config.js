(function() {
    'use strict';

    /* jshint -W101 */
    /* jshint -W117 */

    var core = angular.module('app.core');

    core.config(toastrConfig);

    toastrConfig.$inject = ['toastr'];
    /* @ngInject */
    function toastrConfig(toastr) {
        toastr.options.timeOut = 4000;
        toastr.options.positionClass = 'toast-bottom-right';
    }

    /**
     * Outil d'appel à l'API rest Spotern
     * se reporter à Spotern API functions
     * pour la liste des functions
     */

    /* jshint ignore:start */
    /* jscs:disable */
    var API_BUG = {
        "BugNew":{"defaut":{"public":true,"url":"/bug","method":"post","params":{"language":["string",true],"subject":["string",true],"message":["string",true]}}}
    };
    var API_SPOT = {
        "spotNew":{"defaut":{"public":false,"url":"/auth/spot/add","method":"post","params":{"name":["string",true],"userCollections":["array",false],"exactMatch":["bool",true],"imageAllowSpotern":["bool",true],"tags":["array",false],"mediaID":["number",true],"mediaTvSeason":["number",false],"mediaTvEpisode":["number",false],"language":["string",true],"description":["string",false],"productID":["number",false],"wantedText":["string",false]}}},
        "spotImageAdd":{"defaut":{"public":false,"url":"/auth/spot/addImage","method":"post","params":{"image":["file",true],"spotID":["string",true],"imageSpotX":["number",false],"imageSpotY":["number",false],"imageResizeX1":["number",false],"imageResizeY1":["number",false],"imageResizeX2":["number",false],"imageResizeY2":["number",false]}}},
        "spotTagList":{"defaut":{"public":true,"url":"/spot/tagList","method":"post","params":{"language":["string",true],"tag":["string",true]}}},
        "spotInfos":{"defaut":{"public":true,"url":"/spot","method":"get","params":{"spotID":["number",true]}}},
        "spotLike":{"defaut":{"public":false,"url":"/auth/spot/like","method":"get","params":{"spotID":["url",true]}}},
        "spotUnlike":{"defaut":{"public":false,"url":"/auth/spot/unlike","method":"get","params":{"spotID":["number",true]}}},
        "spotUpdate":{"defaut":{"public":false,"url":"/auth/spot/update","method":"post","params":{"spotID":["number",true],"name":["string",false],"userCollections":["array",false],"exactMatch":["bool",false],"imageAllowSpotern":["bool",false],"imageUrl":["string",false],"resellerUrl":["string",false],"productUrl":["string",false],"tags":["array",false],"mediaID":["number",false],"mediaTvSeason":["number",false],"mediaTvEpisode":["number",false]}}},
        "spotResolution":{
            "add":{"public":false,"url":"/auth/spot/addResolution","method":"post","params":{"spotID":["number",true],"productUrl":["string",true]}},
            "get":{"public":false,"url":"/auth/spot/getResolution","method":"get","params":{"spotID":["number",true]}},
            "deleteAll":{"public":false,"url":"/auth/spot/delAllResolution","method":"get","params":{"spotID":["url",true]}}
        },
        "spotList":{"defaut":{"public":true,"url":"/spot/list","method":"post","params":{"language":["string",true],"number":["number",true],"start":["number",true],"type":["string",true],"filter":["string",true],"order":["string",true]}}},
        "spotSearch":{"defaut":{"public":true,"url":"/spot/search","method":"get","params":{"query":["url",true]}}},
        "spotSearchFull":{"defaut":{"public":true,"url":"/spot/searchFull","method":"get","params":{"query":["url",true]}}},
        "spotHome":{"defaut":{"public":true,"url":"/spotHome","method":"post","params":{"language":["string",true],"start":["number",true]}}},
        "spotProduct":{
            "add":{"public":false,"url":"/auth/product/add","method":"post","params":{"imageUrl":["string",true],"resellerUrl":["string",true],"affiliationID":["number",false],"resellerID":["number",false],"name":["string",true],"description":["string",false],"price":["string",false],"currency":["string",false],"resellerName":["string",false],"category":["string",false],"affiliationProductID":["string",false]}},
            "getImageFromUrl":{"public":true,"url":"/product/url/images","method":"post","params":{"url":["string",true]}},
            "search":{"public":true,"url":"/product/search","method":"get","params":{"query":["url",true]}}
        },
        "spotSimilar":{"defaut":{"public":true,"url":"/spot/similar","method":"post","params":{"spotID":["number",true],"language":["string",true]}}},
        "spotCollection":{"defaut":{"public":true,"url":"/spot/collection","method":"get","params":{"spotID":["number",true]}}},
        "spotAlert":{"defaut":{"public":false,"url":"/auth/spot/alert","method":"get","params":{"spotID":["number",true]}}},
    };
    var API_COLLECTION = {
        "collectionInfos":{"defaut":{"public":true,"url":"/collection","method":"get","params":{"collectionID":["number",true]}}},
        "collectionSpots":{"defaut":{"public":true,"url":"/collection/spots","method":"post","params":{"collectionID":["number",true],"order":["string",true],"language":["string",true]}}},
        "collectionFollowers":{"defaut":{"public":true,"url":"/collection/followers","method":"get","params":{"collectionID":["number",true]}}},
        "collectionLike":{"defaut":{"public":false,"url":"/auth/collection/like","method":"get","params":{"collectionID":["number",true]}}},
    };
    var API_MEDIA = {
        "mediaSearch":{
            "query":{"public":true,"url":"/media/search","method":"post","params":{"language":["string",true],"query":["string",true]}},
            "tv":{"public":true,"url":"/media/searchTv","method":"post","params":{"language":["string",true],"query":["string",true]}},
            "movie":{"public":true,"url":"/media/searchMovie","method":"post","params":{"language":["string",true],"query":["string",true]}}
        },
        "mediaNew":{"defaut":{"public":true,"url":"/media/add","method":"post","params":{"language":["string",true],"id":["number",true],"type":["string",true]}}},
        "mediaInfos":{"defaut":{"public":true,"url":"/media/getMedia","method":"post","params":{"language":["string",true], "mediaID":["number",true]}}},
        "mediaTvSeasons":{"defaut":{"public":true,"url":"/media/getTvSeasons","method":"get","params":{"id":["url",true]}}}
    };
    var API_USER = {
        "checkUsername":{"defaut":{"public":true,"url":"/user/username","method":"get","params":{"username":["url",true]}}},
        "checkEmail":{"defaut":{"public":true,"url":"/user/email","method":"get","params":{"email":["url",true]}}},
        "userAdd":{"defaut":{"public":true,"url":"/user/add","method":"post","params":{"lastname":["string",true],"firstname":["string",true],"username":["string",true],"email":["string",true],"password":["string",true]}}},
        "userActivate":{"defaut":{"public":true,"url":"/user/activate","method":"get","params":{"token":["url",true]}}},
        "userProfil":{
            "get":{"public":false,"url":"/auth/user","method":"get","params":{}},
            "update":{"public":false,"url":"/auth/user/update","method":"post","params":{"password":["string",false],"firstname":["string",false],"lastname":["string",false],"biography":["string",false],"localisation":["string",false],"pinterestPage":["string",false],"twitterPage":["string",false],"facebookPage":["string",false],"birthdate":["datetime",false],"mobilePhone":["string",false],"phone":["string",false],"address":["string",false],"newsletterAccount":["bool",false],"newsletterPartners":["bool",false],"newsletterSpotern":["bool",false],"newsletterWeekly":["bool",false],"notifySpot":["bool",false],"notifyNewSell":["bool",false],"notifyWanted":["bool",false],}},
            "public":{"public":true,"url":"/user/infos","method":"get","params":{"userID":["number",true]}},
        },
        "userAvatar":{
            "get":{"public":true,"url":"/user/avatar","method":"get","params":{"userID":["url",true]}},
            "set":{"public":false,"url":"/auth/user/avatar/set","method":"post","params":{"image":["file",true]}},
            "delete":{"public":false,"url":"/auth/user/avatar/del","method":"get","params":{}}
        },
        "userCover":{
            "get":{"public":true,"url":"/user/cover","method":"get","params":{"userID":["url",true]}},
            "set":{"public":false,"url":"/auth/user/cover/set","method":"post","params":{"image":["file",true]}},
            "delete":{"public":false,"url":"/auth/user/cover/del","method":"get","params":{}}
        },
        "userWebsites":{
            "get":{"public":true,"url":"/user/website","method":"get","params":{"userID":["url",true]}},
            "add":{"public":false,"url":"/auth/user/website/add","method":"post","params":{"noname":["array",true]}},
            "delete":{"public":false,"url":"/auth/user/website/del","method":"get","params":{"userWebsiteID":["url",true]}}
        },
        "userCollections":{
            "get":{"public":true,"url":"/user/collection","method":"post","params":{"userID":["number",true],"order":["string",true],"start":["number",true],"limit":["number",true]}},
            "add":{"public":false,"url":"/auth/user/collection/add","method":"post","params":{"name":["string",true],"description":["string",true]}},
            "update":{"public":false,"url":"/auth/user/collection/update","method":"post","params":{"id":["number",true],"name":["string",true],"description":["string",false]}},
            "delete":{"public":false,"url":"/auth/user/collection/del","method":"get","params":{"collectionID":["number",true]}},
            "addCover":{"public":false,"url":"/auth/user/collection/setCover","method":"post","params":{"collectionID":["number",true],"image":["file",true]}},
            "getCover":{"public":true,"url":"/user/collection/cover","method":"get","params":{"collectionID":["number",true]}},
            "delCover":{"public":false,"url":"/auth/user/collection/delCover","method":"get","params":{"collectionID":["number",true]}},
            "follow":{"public":false,"url":"/auth/user/collection/follow","method":"get","params":{"collectionID":["number",true]}},
        },
        "userNotifications":{
            "get":{"public":false,"url":"/auth/notification/list","method":"get","params":{"limit":["url",true]}},
            "getNew":{"public":false,"url":"/auth/notification/new","method":"get","params":{}},
            "setReaded":{"public":false,"url":"/auth/notification/ack","method":"get","params":{}},
            "delete":{"public":false,"url":"/auth/notification/del","method":"get","params":{"notificationID":["url",true]}},
            "deleteAll":{"public":false,"url":"/auth/notification/delAll","method":"get","params":{}}
        },
        "userSpot":{"defaut":{"public":true, "url":"/user/spot", "method":"post", "params":{"userID":["number",true],"start":["number",true],"limit":["number",true],"order":["string",true]}}},
        "userWant":{"defaut":{"public":true, "url":"/user/wanted", "method":"post", "params":{"userID":["number",true],"start":["number",true],"limit":["number",true],"order":["string",true]}}},
        "userFollower":{"defaut":{"public":true, "url":"/user/follower", "method":"post", "params":{"userID":["number",true],"start":["number",true],"limit":["number",true],"order":["string",true]}}},
        "userLostPassword":{"defaut":{"public":true, "url":"/user/lostpassword", "method":"get", "params":{"email":["string",true]}}},
        "loginByToken":{"defaut":{"public":true,"url":"/login/getTokenByRecoverPassword", "method":"get", "params":{"token":["string",true]}}},
    };
    var API_DEF = {
        'APIURL': 'http://api.spotern.com/api/v1',
        'BUG': API_BUG,
        'SPOT': API_SPOT,
        'MEDIA': API_MEDIA,
        'USER': API_USER,
        'COLLECTION': API_COLLECTION,
    };
    /* jscs:enable */
    /* jshint ignore:end */

    var keyCodes = {
        backspace: 8,
        tab: 9,
        enter: 13,
        esc: 27,
        space: 32,
        pageup: 33,
        pagedown: 34,
        end: 35,
        home: 36,
        left: 37,
        up: 38,
        right: 39,
        down: 40,
        insert: 45,
        del: 46
    };

    var events = {
        controllerActivateSuccess: 'controller.activateSuccess',
        entitiesChanged: 'datacontext.entitiesChanged',
        entitiesImported: 'datacontext.entitiesImported',
        hasChangesChanged: 'datacontext.hasChangesChanged',
        storage: {
            error: 'store.error',
            storeChanged: 'store.changed',
            wipChanged: 'wip.changed'
        }
    };

    var config = {
        appErrorPrefix: '[Spotern Error] ', //Configure the exceptionHandler decorator
        appTitle: 'Spotern',
        imageBasePath: '/images/photos/',
        unknownPersonImageSource: 'unknown_person.jpg',
        events: events,
        keyCodes: keyCodes,
        api: API_DEF
    };

    core.value('config', config);

    core.config(configure);

    configure.$inject = ['$logProvider', '$routeProvider', 'routehelperConfigProvider',
        'exceptionConfigProvider', 'toastr', '$translateProvider', '$locationProvider'];

    /* @ngInject */
    function configure ($logProvider, $routeProvider, routehelperConfigProvider,
                        exceptionConfigProvider, toastr, $translateProvider, $locationProvider) {

        configureLocation();
        configureToastr();
        configureLogging();
        configureExceptions();
        configureRouting();
        configureTranslation();

        function configureLocation() {
            $locationProvider.hashPrefix('!');
        }

        function configureToastr() {
            toastr.options.timeOut = 4000;
            toastr.options.positionClass = 'toast-bottom-right';
        }

        function configureLogging() {
            // turn debugging off/on (no info or warn)
            if ($logProvider.debugEnabled) {
                $logProvider.debugEnabled(true);
            }
        }

        function configureExceptions() {
            exceptionConfigProvider.config.appErrorPrefix = config.appErrorPrefix;
        }

        function configureRouting() {
            var routeCfg = routehelperConfigProvider;
            routeCfg.config.$routeProvider = $routeProvider;
            routeCfg.config.docTitle = 'SPOTERN';
            routeCfg.config.resolveAlways = { /* @ngInject */
                ready: ['dataservice', function(dataservice) {
                    return dataservice.ready();
                }]
//                ready: ['datacontext', function (datacontext) {
//                    return datacontext.ready();
//                }]
            };
        }

        function configureTranslation() {
            $translateProvider.translations('enUS', language_enUS);
            $translateProvider.translations('frFR', language_frFR);
            $translateProvider.preferredLanguage('frFR');
        }
    }
})();
