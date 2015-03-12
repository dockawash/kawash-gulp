(function() {
    'use strict';

    angular
        .module('app.data')
        .factory('model-metadata', modelMetadata);

    modelMetadata.$inject = ['breeze'];

    function modelMetadata(breeze) {
        var DT = breeze.DataType;
        var namespace = 'Spotern.Model';

        var store;

        return {
            fillMetadataStore: fillMetadataStore
        };

        /**** IMPLEMENTATION DETAILS ***/

        function fillMetadataStore(metadataStore) {
            store = metadataStore;

            addSpot();
            addHomespot();
            addUser();
            addSession();
        }

        function addSpot() {
            store.addEntityType({
                shortName: 'Spot',
                namespace: namespace,
                // isComplexType: true,
                dataProperties: {
                    id:              {dataType: 'Int32', isPartOfKey: true},
                    type:            {dataType: 'String'},
                    title:           {dataType: 'String'},
                    subtitle:        {dataType: 'String'},
                    image:           {dataType: 'String'},
                    mediaType:       {dataType: 'String'},
                    mediaTitle:      {dataType: 'String'},
                    imageProductUrl: {dataType: 'String'},
                    productName:     {dataType: 'String'},
                    likes:           {dataType: 'Int32'},
                    date:            {dataType: 'DateTime'},
                    authorID:        {dataType: 'Int32'},
                    author:          {dataType: 'String'},
                    authorUsername:  {dataType: 'String'},
                    authorImage:     {dataType: 'String'}
                }
            });
        }

        function addHomespot() {
            store.addEntityType({
                shortName: 'HomeSpot',
                namespace: namespace,
                dataProperties: {
                    start: {dataType: 'Int32', isPartOfKey: true},
                    total: {dataType: 'Int32'}
                },
                navigationProperties: {
                    spots: {entityTypeName: 'Spot:#'+namespace}
                }
            });
        }

        function addSession() {
            store.addEntityType({
                shortName: 'Session',
                namespace: namespace,
                dataProperties: {
                    token:  {dataType: 'String', isPartOfKey: true},
                    userID: {dataType: 'Int32', defaultValue: 0}
                },
                navigationProperties: {
                    userInfos: {entityTypeName: 'User:#'+namespace, associationName: 'User_Session', foreignKeyNames: ['userID']}
                }
            });
        }

        function addUser() {
            store.addEntityType({
                shortName: 'User',
                namespace: namespace,
                // isComplexType: true,
                dataProperties: {
                    userID:             {dataType: 'Int32', isPartOfKey: true},
                    email:              {dataType: 'String'},
                    username:           {dataType: 'String'},
                    firstname:          {dataType: 'String'},
                    lastname:           {dataType: 'String'},
                    biography:          {dataType: 'String'},
                    localisation:       {dataType: 'String'},
                    pinterestPage:      {dataType: 'String'},
                    twitterPage:        {dataType: 'String'},
                    facebookPage:       {dataType: 'String'},
                    birthdate:          {dataType: 'DateTime'},
                    mobilePhone:        {},
                    phone:              {},
                    address:            {},
                    spots:              {dataType: 'Int32'},
                    collections:        {dataType: 'Int32'},
                    wants:              {dataType: 'Int32'},
                    follower:           {dataType: 'Int32'},
                    popularityAll:      {dataType: 'Decimal'},
                    popularityDelta:    {dataType: 'Decimal'},
                    credibilityAll:     {dataType: 'Decimal'},
                    credibilityDelta:   {dataType: 'Decimal'},
                    balance:            {dataType: 'Int32'},
                    notifications:      {dataType: 'Int32'},
                    avatarUrl:          {},
                    avatarProfilUrl:    {},
                    notifyNewSell:      {dataType: 'Boolean', defaultValue: false},
                    notifyWanted:       {dataType: 'Boolean', defaultValue: false},
                    notifySpot:         {dataType: 'Boolean', defaultValue: false},
                    newsletterSpotern:  {dataType: 'Boolean', defaultValue: false},
                    newsletterPartners: {dataType: 'Boolean', defaultValue: false},
                    newsletterAccount:  {dataType: 'Boolean', defaultValue: false},
                    newsletterWeekly:   {dataType: 'Boolean', defaultValue: false},
                    coverUrl:           {}
                }
            });
        }

    }
})();