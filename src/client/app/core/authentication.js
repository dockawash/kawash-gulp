(function () {
    'use strict';

    angular
        .module('app.core')
        .factory('authentication', authentication);

    authentication.$inject = ['ipCookie'];

    /* @ngInject */
    function authentication(ipCookie) {
        var service = {
            getCookieTokenName: 'spotern-token',
            getCookieTokenValue: '',
            getCookieTokenOption: {
                expires: 1800,
                expirationUnit: 'seconds'
            },
            getTokenType: 'X-Spotern-Token',
            getCookieToken: getCookieToken,
            setCookieToken: setCookieToken,
            delCookieToken: delCookieToken,
            renewCookieToken: renewCookieToken,
            getAccessToken: getAccessToken,
            setAccesToken: setAccesToken,
            delAccessToken: delAccessToken,
            isConnect: isConnect,
            updateTokenLife: updateTokenLife
        };

        return service;

        ////////////////

        function getCookieToken() {
            return ipCookie(service.getCookieTokenName);
        }

        function setCookieToken(token) {
            ipCookie(service.getCookieTokenName, token, service.getCookieTokenOption);
        }

        function delCookieToken() {
            ipCookie.remove(service.getCookieTokenName);
        }

        function renewCookieToken() {
            var tk = ipCookie(service.getCookieTokenName);
            ipCookie(service.getCookieTokenName, tk, service.getCookieTokenOption);
        }

        function getAccessToken() {
            if (service.getCookieTokenValue === '') return service.getCookieToken();
            else return service.getCookieTokenValue;
        }

        function setAccesToken(token) {
            service.getCookieTokenValue = token;
            service.setCookieToken(token);
        }

        function delAccessToken() {
            service.delCookieToken();
            service.getCookieTokenValue = '';
        }

        function isConnect() {
            var myToken = service.getAccessToken();
            return (typeof (myToken) !== 'undefined' && myToken.length > 0);
        }

        function updateTokenLife() {
            var token = ipCookie(service.getCookieTokenName);
            ipCookie.remove(service.getCookieTokenName);
            ipCookie(service.getCookieTokenName, token, service.getCookieTokenOption);
        }

    }
})();
