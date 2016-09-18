// INCLUDE
import modal_setting from '../constant/modal_setiing';
import ApiClass from '../util/api';


//--------------------------
// メインコンテンツ コントローラ
//--------------------------
export default angular.module('controllers.main', [])
  .controller('midController',['$scope', ($scope) => {
    console.log("controllers.main");
    const sampleApi = new ApiClass("sample");

    // モーダル表示ボタン
    $scope.onLoadModal = () => {
      console.log("onLoadModal");
      jQuery('.modal-trigger').leanModal(modal_setting());
    }

    // APIレスポンス表示ボタン
    $scope.onLoadRequestAPI = () => {
      console.log("onLoadRequestAPI");
      console.log(showIndicator);
      $scope.showIndicator = true;

      // APIリクエスト(Thenでres|errorを受け取ってください。)
      sampleApi.post().then(
        (res) => {
          console.log("API OK!")
          console.log(res.books);
          $scope.serch_count = res.search_count;
          $scope.books = res.books;
          $scope.$apply(); //画面更新
        },(error) => {
          console.log("API NG!")
        }
      );
    }

  }]);