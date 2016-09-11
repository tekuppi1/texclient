(function() {
    window.addEventListener('load', function() {
        console.log('Page Loaded');
   });
   sample();
   $.material.init();
   $.material.ripples();
})();

require('./components/header');

angular.module('mainApp', []);
angular.module('mainApp').controller('mainController', function($scope) {
  $.material.radio($('.radio'));
  $('.btn').click(
    ()=>{$('.btn').ripples();}
  );
});

function sample(){
  var Hello = require('./components/Hello');
  var hello = new Hello();
  console.log(hello.message);
}