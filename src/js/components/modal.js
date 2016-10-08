//import
import swiper_setiing from './swiper_setiing';

/**
 * モーダル クラス
 * @param {Object} $scope
 */
export default class Modal{

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
	 * モーダルの設定
	 * @return {object} 設定内容
	 */
	setting(){
		console.log("modal_setting");
		return{
			dismissible: true, // Modal can be dismissed by clicking outside of the modal
			opacity: .6, // Opacity of modal background
			in_duration: 500, // Transition in duration
			out_duration: 500, // Transition out duration
			starting_top: '0%', // Starting top style attribute
			ending_top: '0%', // Ending top style attribute
			ready: () => { // Callback for Modal open
				swiper_setiing()
			}
		}
	}

	/**
	 * モーダルのオブジェクトのsetter
	 * @param {Object} book 本管理クラスのオブジェクト
	 */
	set(book={}){
		console.log("modal.set");
		this.$scope.modal_books = book;
	}
}
