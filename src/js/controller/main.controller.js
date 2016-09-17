// INCLUDE
import modal from '../constant';
//import util from '../util';

//--------------------------
// メインコンテンツ コントローラ
//--------------------------
export default angular.module('controllers.main', [])
  .controller('midController',['$scope', ($scope) => {

    // モーダル表示ボタン
    $scope.onLoadModal = () => {
      console.log("onLoadModal");
      jQuery('.modal-trigger').leanModal(modal);
    }

    // APIレスポンス表示ボタン
    $scope.onLoadRequestAPI = () => {
      console.log("onLoadRequestAPI");
      /*
      api.RequestAPI("sample").then(
        (res) => {
          console.log("API OK!")
          $scope.apiResp = res.search_count;
          $scope.$apply();
        },(error) => {
          console.log("API NG!")
        }
      );
      */
    }

  }]);