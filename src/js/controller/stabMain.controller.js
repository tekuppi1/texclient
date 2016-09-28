// INCLUDE
import ApiClass from '../util/api'; //APIのクラス
import Loading from '../components/loading'; //ローディングインジケータのクラス
import Book from '../components/book'; //本情報のクラス
import Modal from '../components/modal';

//--------------------------
// メインコンテンツ コントローラ
//--------------------------
export default angular.module('controllers.stabMain', [])
  .controller('stabMidController',['$scope', ($scope) => {
    console.log("controllers.stabMain");
    const sampleApi = new ApiClass("sample");
    const loading = new Loading();
    const modal = new Modal();

    //メイン初期描画時
    $scope.onLoadStabMid = () => {
      console.log("onLoadMid");
      //jQuery('.modal-trigger').leanModal(modal.setting());
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