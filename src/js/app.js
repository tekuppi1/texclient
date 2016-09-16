//include
const api = require('./components/api.js');

window.onload = () => {
  console.log('Page Loaded');
  $('.modal-trigger').leanModal();
};

let swiper = () => {
  new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 1,
    paginationClickable: true,
    spaceBetween: 30,
    grabCursor: true,
    loop: true,
  });
}

let modal_option = {
  dismissible: true, // Modal can be dismissed by clicking outside of the modal
  opacity: .6, // Opacity of modal background
  in_duration: 500, // Transition in duration
  out_duration: 500, // Transition out duration
  starting_top: '0%', // Starting top style attribute
  ending_top: '0%', // Ending top style attribute
  ready: () => { swiper(); }, // Callback for Modal open
}

angular.module('mainApp', [])
  .controller('mainController', ['$scope', ($scope) => {
    console.log("mainController");
    $scope.yourName = "yourName";
    $scope.showIndicator = true;
    swiper();
    api.RequestAPI();
    $scope.hideIndicator = () => {
      $scope.showIndicator = false;
    }
    //console.log(jQuery(".mainbutton").text("aaaaa"));
  }])
  
  .controller('midController',['$scope', ($scope) => {
    $scope.onLoadModal = () => {
      console.log("midController");
      jQuery('.modal-trigger').leanModal(modal_option);
    }  
  }]);

  /***
   * ## メモ ##
   * ng-includeは、onLoadModel後じゃないとクエリの発行はできないよ！
   * 
   */