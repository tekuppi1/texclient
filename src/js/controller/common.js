// INCLUDE
import header from './header.controller';
import main from './main.controller';
import footer from './footer.controller';
import Loading from '../components/loading';

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
    loading.show();
    $scope.hideIndicator = ()=>{loading.hide()};
  }]);