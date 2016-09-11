(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
},{"./components/Hello":2,"./components/header":3}],2:[function(require,module,exports){
 function Hello() {
    this.message = 'Hello!';
}

module.exports = Hello;
},{}],3:[function(require,module,exports){

},{}]},{},[1]);
