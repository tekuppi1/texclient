// INCLUDE
import ApiClass from '../util/ApiClass'; //APIのクラス
import Loading from '../components/loading';

/**
 * API通信用
 * @param {Object} $scope - スコープ
 * @param {String} path - root以下のパス
 */
export default function LoadRequestAPI($scope,path){
  console.log("onLoadRequestAPI");
  const api = new ApiClass(path);
  const loading = new Loading();
  loading.show();

  // APIリクエスト(Thenでres|errorを受け取ってください。)
  api.post().then(
    (res) => {
      console.log("API OK!");
      console.log(res.books);
      $scope.parents = res.parents;
      $scope.categories = res.categories;
      $scope.books = res.books;
      loading.hide();
      $scope.$apply(); //画面更新
      jQuery('ul.tabs').tabs(); //描画後にtabにアニメーションを適用してね！
      jQuery('.modal-trigger').leanModal(); //描画後にモーダルのアニメーションを適用してね！
    },(error) => {
      console.log("API NG!");
      loading.hide();
      $scope.$apply(); //画面更新
    }
  );
}
