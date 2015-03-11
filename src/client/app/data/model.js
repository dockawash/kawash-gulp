(function() {
    'use strict';

    angular
        .module('app.data')
        .factory('model', model);

    model.$inject = ['breeze'];

    /* @ngInject */
    function model(breeze) {
        var DT = breeze.DataType; // alias
        var modelName = 'Spotern';

        var entityNames = {
            homespot: 'HomeSpot'
        };

        var service = {
            initialize: initialize,
            entityNames: entityNames
        };

        return service;

        /////////////

        function initialize(metadataStore) {
            metadataStore.addEntityType({
                shortName: 'HomeSpot',
                namespace: modelName,
                dataProperties: {
                    id: { dataType: DT.Int64, isPartOfKey: true },
                    type: { dataType: DT.String },
                    title: { dataType: DT.String },
                    subtitle: { dataType: DT.String },
                    image: { dataType: DT.String },
                    mediaType: { dataType: DT.String },
                    mediaTitle: { dataType: DT.String },
                    imageProductUrl: { dataType: DT.String },
                    productName: { dataType: DT.String },
                    likes: { dataType: DT.Int32 },
                    date: { dataType: DT.DateTime },
                    authorID: { dataType: DT.Int64 },
                    author: { dataType: DT.String },
                    authorUsername: { dataType: DT.String },
                    authorImage: { dataType: DT.String }
                }
            });
        }
    }
})();

/* model: entity definitions
app.factory('model', function () {
    var DT = breeze.DataType; // alias
    return {
        initialize: initialize
    }

    function initialize(metadataStore) {
        metadataStore.addEntityType({
            shortName: "Make",
            namespace: "Edmunds",
            dataProperties: {
                id:         { dataType: DT.Int64, isPartOfKey: true },
                name:       { dataType: DT.String },
                niceName:   { dataType: DT.String },
                modelLinks: { dataType: DT.Undefined }
            },
            navigationProperties: {
                models: {
                    entityTypeName:  "Model:#Edmunds", isScalar: false,
                    associationName: "Make_Models"
                }
            }
        });

        metadataStore.addEntityType({
            shortName: "Model",
            namespace: "Edmunds",
            dataProperties: {
                id:            { dataType: "String", isPartOfKey: true },
                makeId:        { dataType: "Int64" },
                makeName:      { dataType: "String" },
                makeNiceName:  { dataType: "String" },
                name:          { dataType: "String" },
                niceName:      { dataType: "String" },
                vehicleStyles: { dataType: "String" },
                vehicleSizes:  { dataType: "String" },
                categories:    { dataType: "Undefined" }
            },
            navigationProperties: {
                make: {
                    entityTypeName:  "Make:#Edmunds", isScalar: true,
                    associationName: "Make_Models",  foreignKeyNames: ["makeId"]
                }
            }
        });
    }
})
*/
