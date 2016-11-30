(function() {
  'use strict';

  angular
    .module('myapp')
    .run(runBlock);

  /** @ngInject */
  function runBlock(FormioAuth) {
    FormioAuth.init();
  }

})();
