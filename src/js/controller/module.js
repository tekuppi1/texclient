// INCLUDE
import header from './header.controller';
import main from './main.controller';
import footer from './footer.controller';

//----------------------------------------------------------------------
// グローバル コントローラ
//----------------------------------------------------------------------
export default angular.module('mainApp.controller', [
  header.name,
  main.name,
  footer.name
])
  .controller('mainController', ['$scope', ($scope) => {
    console.log("mainController");
    $scope.yourName = "yourName";
    $scope.apiResp = "API-Responce"
    $scope.showIndicator = true;
    $scope.hideIndicator = () => { $scope.showIndicator = false; }
    //swiper();
  }]);