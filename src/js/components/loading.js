/**
 * @class ローディングインジケーター クラス
 * @param {Object} $scope
 */
export default class Loading{

  /**
   * コンストラクタ
   * @param {Object} $scope - スコープにしたいオブジェクト(通常はnullでおっけです。)
   */
  constructor($scope=null){
    console.log("Loading.constructor");

    //スコープのset
    const element = document.getElementById("content");
    const scope = angular.element(element).scope();
    this.$scope = $scope || scope;
  }

  /**
   * インジケータを表示
   */
  show(){
    console.log("Loading.show");
    this.$scope.loaderClass = "loadshow";
  }

  /**
   * インジケータを非表示
   */
  hide(){
    console.log("Loading.hide");
    this.$scope.loaderClass = "loadhide";
  }

}
