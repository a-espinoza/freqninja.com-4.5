(function() {
  'use strict';

  angular
    .module('myapp')
    .config(config);

  /** @ngInject */
  function config($logProvider, toastrConfig, FormioProvider, FormioAuthProvider, FormioResourceProvider) {

    // Enable log
    $logProvider.debugEnabled(true);
    FormioProvider.setBaseUrl('https://api.form.io');
    FormioAuthProvider.setStates('auth.login', 'home');
    FormioAuthProvider.setStates('auth.register', 'home');
    FormioAuthProvider.setForceAuth(true);
    FormioAuthProvider.register('login', 'user', 'user/login');
    FormioAuthProvider.register('register', 'user', 'user/register');

    // This will be your races Form.io API url.
    var appUrl = 'https://tilqtcosdfstyvc.form.io';
    FormioResourceProvider.register('race', appUrl + '/race', {
      templates: {
        view: 'views/race/view.html'
      },
      controllers: {
        create: [
          '$scope',
          function($scope) {
            $scope.submission.data.status = 'open';
          }
        ],
        view: [
          '$scope',
          '$stateParams',
          'Formio',
          '$http',
          function($scope, $stateParams, Formio, $http) {
            $scope.selfies = [];
            $http.get(appUrl + '/selfie/submission?limit=100&data.race._id=' + $stateParams.raceId, {
              headers: {
                'x-jwt-token': Formio.getToken()
              }
            }).then(function(result) {
              $scope.selfies = result.data;
            });
          }
        ]
      }
    });

    FormioResourceProvider.register('selfie', appUrl + '/selfie', {
      parent: 'race',
      controllers: {
        create: ['$scope', '$state', '$stateParams', function($scope, $state, $stateParams) {
          $scope.$on('formSubmission', function() {
            $state.go('race.view', {raceId: $stateParams.raceId});
          });
          return {handle: true};
        }]
      }
    })

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }
})();
