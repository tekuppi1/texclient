// INCLUDE
import ApiClass from '../util/api'; //APIのクラス
import Loading from '../components/loading'; //ローディングインジケータのクラス
import Book from '../components/book'; //ローディングインジケータのクラス
import Modal from '../components/modal';

//--------------------------
// メインコンテンツ コントローラ
//--------------------------
export default angular.module('controllers.main', [])
  .controller('midController',['$scope', ($scope) => {
    console.log("controllers.main");
    const sampleApi = new ApiClass("sample");
    const loading = new Loading();
    const modal = new Modal();

    // モーダル表示ボタン
    $scope.onLoadModal = () => {
      console.log("onLoadModal");
      jQuery('.modal-trigger').leanModal(modal.setting());
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

    // 予約のモーダル表示
    $scope.pushReservation = (obj) => {
      console.log("pushReservation");
      console.log(obj);
      const book = new Book({
        title:  obj.book_title,
        author: obj.book_author,
        price:  obj.book_price,
        img:    obj.book_img,
      });
      modal.set({book});
      $('#modal1').openModal();
    }

  }]);