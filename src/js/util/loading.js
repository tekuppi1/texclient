// ローディングインジケーター クラス
export default class Loading{

  /**
   * コンストラクタ
   */
  constructor(){
    console.log("Loading.constructor");
    //$scope = angular.element('#loading-content').scope();
    //console.log($scope);
  }

  /**
   * インジケータを表示
   */
  show(){
    console.log("Loading.show");
  }

  /**
   * インジケータを非表示
   */
  hide(){
    console.log("Loading.hide");
  }

}
