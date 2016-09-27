import onScroll from '../util/init';
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
        jQuery('.button-collapse').sideNav({menuWidth: 250,closeOnClick: true});

        //TODO: アニメーション強化
        window.addEventListener('scroll', onScroll, false);
    }

  }]);