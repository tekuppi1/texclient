// INCLUDE
import ApiClass from '../util/api'; //APIのクラス
import Loading from '../components/loading'; //ローディングインジケータのクラス
import Book from '../components/book'; //本情報のクラス
import Modal from '../components/modal';

//--------------------------
// メインコンテンツ コントローラ
//--------------------------
export default angular.module('controllers.main', [])
  .controller('midController',['$scope', ($scope) => {
    console.log("controllers.main");
    const loading = new Loading();
    const modal = new Modal();

    //メイン初期描画時
    $scope.onLoadMid = () => {
      console.log("onLoadMid");
    }

  }]);