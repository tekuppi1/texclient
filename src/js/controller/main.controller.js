// INCLUDE
import modal_setting from '../constant/modal_setiing';
import ApiClass from '../util/api'; //APIのクラス
import Loading from '../util/loading'; //ローディングインジケータのクラス

//--------------------------
// メインコンテンツ コントローラ
//--------------------------
export default angular.module('controllers.main', [])
  .controller('midController',['$scope', ($scope) => {
    console.log("controllers.main");
    const sampleApi = new ApiClass("sample");
    const loading = new Loading();

    // モーダル表示ボタン
    $scope.onLoadModal = () => {
      console.log("onLoadModal");
      jQuery('.modal-trigger').leanModal(modal_setting());
    }

    // APIレスポンス表示ボタン
    $scope.onLoadRequestAPI = () => {
      console.log("onLoadRequestAPI");
      loading.show();

      // APIリクエスト(Thenでres|errorを受け取ってください。)
      sampleApi.post().then(
        (res) => {
          console.log("API OK!");
          console.log(res.books);
          $scope.serch_count = res.search_count;
          $scope.books = res.books;
          loading.hide();
          $scope.$apply(); //画面更新
        },(error) => {
          console.log("API NG!");
          loading.hide();
          $scope.$apply(); //画面更新
        }
      );
    }

  }]);