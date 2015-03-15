(function () {
    'use strict';

    angular
        .module('app.data')
        .factory('model-validation', modelValidation);

    modelValidation.$inject = ['breeze', 'common'];

    function modelValidation(breeze, common) {
        var entityNames;
        var logger = common.logger;
        var Validator = breeze.Validator,
            requireReferenceValidator,
            twitterValidator;

        var service = {
            applyValidators: applyValidators,
            createAndRegister: createAndRegister
        };

        return service;

        function applyValidators(metadataStore) {
            // applyRequireReferenceValidators(metadataStore);
            // applyTwitterValidators(metadataStore);
            applyEmailValidators(metadataStore);
            // applyUrlValidators(metadataStore);
            logger.info('Validators applied', null);
        }

        function createAndRegister(eNames) {
            entityNames = eNames;
            // Step 1) Create it
            // requireReferenceValidator = createRequireReferenceValidator();
            // twitterValidator = createTwitterValidator();
            // Step 2) Tell breeze about it
            // Validator.register(requireReferenceValidator);
            // Validator.register(twitterValidator);
            // Step 3) Later we will apply them to the properties/entities via applyValidators
            logger.info('Validators created and registered', null);
        }

        function applyRequiredValidators(metadataStore) {
            var entityType = metadataStore.getEntityType('Session');
            ['email', 'password'].forEach(function(propertyName) {
                entityType.getProperty(propertyName).validators.push(Validator.required);
            });
        }

        function applyEmailValidators(metadataStore) {
            var entityTypeSession = metadataStore.getEntityType('Session');
            var sessionEmail = entityTypeSession.getProperty('email');
            sessionEmail.validators.push(Validator.emailAddress());
            // var entityTypeUser = metadataStore.getEntityType('User');
            // entityTypeUser.getProperty('email').validators.push(Validator.emailAddress());
        }

        function applyRequireReferenceValidators(metadataStore) {
            var navigations = ['room', 'track', 'timeSlot', 'speaker'];
            var entityType = metadataStore.getEntityType(entityNames.session);

            navigations.forEach(function (propertyName) {
                entityType.getProperty(propertyName).validators
                    .push(requireReferenceValidator);
            });
        }

        function applyTwitterValidators(metadataStore) {
            var entityType = metadataStore.getEntityType(entityNames.speaker);
            entityType.getProperty('twitter').validators.push(twitterValidator);
        }

        function applyUrlValidators(metadataStore) {
            var entityType = metadataStore.getEntityType('User');
            entityType.getProperty('blog').validators.push(Validator.url());
        }

        function createTwitterValidator() {
            var val = Validator.makeRegExpValidator(
                'twitter',
                /^@([a-zA-Z]+)([a-zA-Z0-9_]+)$/,
                'Invalid Twitter User Name: "%value%"');
            return val;
        }

        function createRequireReferenceValidator() {
            var name = 'requireReferenceEntity';
            // isRequired = true so zValidate directive displays required indicator
            var ctx = {messageTemplate: 'Missing %displayName%', isRequired: true};
            var val = new Validator(name, valFunction, ctx);
            return val;

            // passes if reference has a value and is not the nullo (whose id===0)
            function valFunction(value) {
                return value ? value.id !== 0 : false;
            }
        }
    }
})();
