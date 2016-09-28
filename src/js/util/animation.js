//--------------------------
// アニメーションメソッド
//--------------------------

/**
 * フェードインクラスの付加
 * @param {string} name - 適用するタグ名
 */
export function addFadein(name){
  $(name).addClass("fadein");
  $(name).removeClass("fadeout");
}
/**
 * フェードインクラスの付加
 * @param {string} name - 適用するタグ名
 */
export function addFadeout(name){
  $(name).addClass("fadeout");
  $(name).removeClass("fadein");
}
//---------------------------------------------------------------------------------
/**
 * スクロールのトップバー表示
 */
export function onScroll() {
  ($(window).scrollTop() > 90) ? addFadein('.navbar-fixed-top') : addFadeout('.navbar-fixed-top');
}

/**
 * スクロールのサイドバー表示
 * @param {boolean=true} bool - 表示時:ture,非表示時:false
 */
export function onSideber(bool=true) {
  bool ? addFadein('#sideber') : addFadeout('#sideber');
}




