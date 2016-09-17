//----------------------------------------------------------------------
// INCLUDE
//----------------------------------------------------------------------
setting = require('./constant/setting.js');
api = require('./util/api.js');


//----------------------------------------------------------------------
// INITIALIZE
//----------------------------------------------------------------------
window.onload = () => {
  console.log('Page Loaded');
  $('.modal-trigger').leanModal();
};


//----------------------------------------------------------------------
// メインコントローラ
//----------------------------------------------------------------------
angular.module('mainApp', [])
  .controller('mainController', ['$scope', ($scope) => {
    console.log("mainController");
    $scope.yourName = "yourName";
    $scope.apiResp = "API-Responce"
    $scope.showIndicator = true;
    $scope.hideIndicator = () => { $scope.showIndicator = false; }
    //swiper();
  }])
  //--------------------------
  // メインコンテンツ コントローラ
  //--------------------------
  .controller('midController',['$scope', ($scope) => {

    // モーダル表示ボタン
    $scope.onLoadModal = () => {
      console.log("onLoadModal");
      jQuery('.modal-trigger').leanModal(setting.modal_option);
    }

    // APIレスポンス表示ボタン
    $scope.onLoadRequestAPI = () => {
      console.log("onLoadRequestAPI");
      api.RequestAPI("sample").then(
        (res) => {
          console.log("API OK!")
          $scope.apiResp = res.search_count;
          $scope.$apply();
        },(error) => {
          console.log("API NG!")
        }
      );
    }
  }]);

  /***
   * ## メモ ##
   * ng-includeは、onLoadModel後じゃないとクエリの発行はできないよ！
   * 
   */