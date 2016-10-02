import * as anime  from '../util/animation';
//TODO: カテゴリ情報の集約地点を作成
//TODO: サイドバーのロジックの修正

//--------------------------
// ヘッダーコンテンツ コントローラ
//--------------------------
export default angular.module('controllers.header', [])
  .controller('headerController',['$scope', ($scope) => {

    //ヘッダー初期描画時
    $scope.onLoadHeader = () => {
      console.log("onLoadHeader");
        jQuery('.carousel').carousel();
        jQuery('.carousel.carousel-slider').carousel({full_width: true});
        window.addEventListener('scroll', anime.onScroll, false);
    }

    /**
     * サイドバーの表示
     * @param {boolean} bool - true:表示,false:非表示
     */
    $scope.onSideber = (bool) => { anime.onSideber(bool); }

  }]);