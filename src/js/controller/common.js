// INCLUDE
import header from './header.controller';
import main from './main.controller';
import footer from './footer.controller';
import Loading from '../util/loading';

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
    const loading = new Loading();

    $scope.yourName = "yourName";
    $scope.apiResp = "API-Responce"
    $scope.showIndicator = true;
    $scope.hideIndicator = () => { $scope.showIndicator = false; }
  }]);