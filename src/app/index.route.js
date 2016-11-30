(function() {
  'use strict';

  var appUrl = 'https://tilqtcosdfstyvc.form.io';

  angular
    .module('myapp')
    .config(routerConfig);

  /** @ngInject */
  function routerConfig($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: ['$scope', '$http', 'Formio', '$rootScope', function($scope, $http, Formio, $rootScope) {
          $scope.races = {};
          $scope.noraces = false;

          // Get all of my selfies.
          $http.get(appUrl + '/selfie/submission?owner=' + $rootScope.user._id, {headers: {'x-jwt-token': Formio.getToken()}}).then(function(result) {
            result.data.forEach(function(selfie) {
              if (selfie.data.race && selfie.data.race._id && selfie.data.race.data.title) {
                $scope.races[selfie.data.race._id] = selfie.data.race;
              }
            });
            $scope.noraces = (Object.keys($scope.races).length === 0);
          });

          // Get all of my races that I created.
          $http.get(appUrl + '/race/submission?owner=' + $rootScope.user._id, {headers: {'x-jwt-token': Formio.getToken()}}).then(function(result) {
            result.data.forEach(function(race) {
              if (race && race._id && race.data.title) {
                $scope.races[race._id] = race;
              }
            });
            $scope.noraces = (Object.keys($scope.races).length === 0);
          });
        }]
      })
      .state('find', {
        url: '/find',
        templateUrl: 'views/race/find.html',
        controller: ['$scope', '$http', 'toastr', 'Formio', '$state', function($scope, $http, toastr, Formio, $state) {
          $scope.raceName = '';
          $scope.loading = false;
          $scope.findrace = function() {
            $scope.loading = true;
            $http.get(appUrl + '/race/submission?data.name=' + $scope.raceName.toLowerCase(), {
              headers: {'x-jwt-token': Formio.getToken()}
            }).then(function(result) {
              $scope.loading = false;
              if (!result || !result.data || !result.data.length) {
                toastr.info('race not found');
              }
              else {
                $state.go('race.view', {raceId: result.data[0]._id});
              }
            });
          };
        }]
      });

    $urlRouterProvider.otherwise('/');
  }

})();
