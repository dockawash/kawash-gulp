(function () {
    'use strict';

    /* jshint -W101 */
    /* jshint -W074 */

    angular
        .module('app.data')
        .factory('spoternapi', spoternapi);

    spoternapi.$inject = ['config', 'common', '$http', 'authHttp', 'authentication'];

    /* @ngInject */
    function spoternapi(config, common, $http, authHttp, authentication) {
        var $ = angular.element;
        var $q = common.$q;
        var API_DEF = config.api;

        return func;

        ////////////////

        function func(fn_cat, fn_name, fn_action, fn_params) {
            if (typeof (fn_cat) !== 'string' || typeof (fn_name) !== 'string') return;
            fn_action = typeof (fn_action) === 'undefined' || fn_action === '' || fn_action === null ? 'defaut' : fn_action;
            fn_cat = fn_cat.toUpperCase();
            // console.log( 'spoternAPI> '+fn_cat+'.'+fn_name+'.'+fn_action,' params: ', fn_params );

            // init
            var deferred = $q.defer();

            // recup param d'appel
            var ApiParams = API_DEF[fn_cat.toUpperCase()][fn_name][fn_action];
            // console.log( 'spoternAPI> '+fn_cat+'.'+fn_name+'.'+fn_action+': ', ApiParams );
            if (typeof (ApiParams) === 'undefined') {
                deferred.reject(fn_cat + '.' + fn_name + '.' + fn_action + ' undefined');
                return deferred.promise;
            }
            // return default params
            if (fn_params === false) {
                var defParams = ApiParams.params;
                var retParams = {};
                if ($.type(defParams) === 'object') {
                    $.each(defParams, function (key, val) {
                        if (!val[1]) return true;
                        var myVal;
                        // val: [type, require, default]
                        switch (val[0]) {
                        case 'string':
                        case 'url':
                            myVal = val[2] != null ? val[2] : key;
                            break;
                        case 'number':
                            myVal = val[2] != null ? val[2] : 0;
                            break;
                        case 'bool':
                            myVal = val[2] != null ? val[2] : false;
                            break;
                        case 'array':
                            myVal = val[2] != null ? val[2] : [];
                            break;
                            // case 'file':
                        default:
                            myVal = null;
                            break;
                        }
                        retParams[key] = myVal;
                    });
                }
                // console.log('spoternAPI> default:',retParams);
                return retParams;
            }

            var callParams = {
                'url': API_DEF.APIURL + ApiParams.url
            };

            // setup params
            var errorParams = [],
                hasError = false;
            var myParams = {},
                isFile = false,
                hasParams = false,
                myFile;
            angular.forEach(ApiParams.params, function (val, key) {
                var isOK = true;
                if (fn_params[key] === undefined && val[1]) {
                    hasError = true;
                    isOK = false;
                    errorParams.push('Paramètre inexistant : ' + key);
                }
                /* CONTROL REQUIRED */
                if (isOK && val[0] !== 'file' && $.type(fn_params[key]) !== (val[0] === 'url' ? 'string' : val[0])) {
                    if (val[1]) hasError = true;
                    isOK = false;
                    console.log('spoternAPI> ' + key + ' :', fn_params[key]);
                    errorParams.push('Paramètre ' + key + ' type incorect attendu: ' + val[0] + ', obtenu: ' + typeof (fn_params[key]));
                }
                if (fn_params[key] === undefined) return true;
                if (isOK && val[0] === 'file' && fn_params[key])
                    isFile = true;
                if (isOK) {
                    if (key === 'noname') myParams = fn_params[key];
                    else if (val[0] === 'file') myFile = fn_params[key];
                    else if (val[0] === 'url') callParams.url += '/' + fn_params[key];
                    else myParams[key] = fn_params[key];
                    if (myParams[key] !== undefined) hasParams = true;
                }
            });
            console.log('spoternAPI> hasError: ', hasError, ', param error: ', errorParams, ', callParams: ', callParams, ', params: ', myParams);
            if (hasError) {
                deferred.reject(errorParams);
                return deferred.promise;
            }

            // POST
            if (ApiParams.method.toLowerCase() === 'post') {
                callParams.method = 'POST';
                callParams.data = myParams;
            }
            // GET
            if (ApiParams.method.toLowerCase() === 'get' && hasParams) {
                var tmpValues = [];
                for (var param in myParams) {
                    if (param) tmpValues.push(myParams[param]);
                }
                console.log('spoternAPI GET tmpValues> ', tmpValues);
                callParams.url = API_DEF.APIURL + ApiParams.url + '/' + tmpValues.join('/');
                //callParams.params = myParams;
            }
            console.log('spoternAPI call> ', callParams, myParams, myFile);
            // mode Public
            if (ApiParams.public)
                return $http(callParams)
                    .success(function (data) {
                        console.log('spoternAPI public> ', data);
                    })
                    .error(function (data, status, headers, config) {
                        console.error('Impossible d\'acceder à l\'API');
                        console.error(data, status, headers, config);
                    });
            // mode Connecté
            else {
                authentication.updateTokenLife();
                if (isFile)
                    return authHttp.fileUpload(callParams.url, myFile, myParams)
                        .success(function (data) {
                            console.log('spoternAPI secure file> ', data);
                        })
                        .error(function (data, status, headers, config) {
                            console.error('Impossible d\'acceder à l\'API');
                            console.error(data, status, headers, config);
                        });
                else if (ApiParams.method.toLowerCase() === 'get')
                    return authHttp.get(callParams.url, myParams)
                        .success(function (data) {
                            console.log('spoternAPI secure> ', data);
                        })
                        .error(function (data, status, headers, config) {
                            console.error('Impossible d\'acceder à l\'API');
                            console.error(data, status, headers, config);
                        });
                else if (ApiParams.method.toLowerCase() === 'post')
                    return authHttp.post(callParams.url, myParams)
                        .success(function (data) {
                            console.log('spoternAPI secure> ', data);
                        })
                        .error(function (data, status, headers, config) {
                            console.error('Impossible d\'acceder à l\'API');
                            console.error(data, status, headers, config);
                        });
                return deferred.promise;
            }
        }
    }
})();
