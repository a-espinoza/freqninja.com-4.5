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

    // Set options third-party lib
    toastrConfig.allowHtml = true;
    toastrConfig.timeOut = 3000;
    toastrConfig.positionClass = 'toast-top-right';
    toastrConfig.preventDuplicates = true;
    toastrConfig.progressBar = true;
  }

})();
