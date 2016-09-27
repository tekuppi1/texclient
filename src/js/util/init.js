//jQuery使いすぎなのでリファクタ必要

export default function onScroll() {
  if ($(window).scrollTop() > 90) {
    $('.navbar-fixed-top').addClass("fadein");
    $('.navbar-fixed-top').removeClass("fadeout");
  } else {
    $('.navbar-fixed-top').addClass("fadeout");
    $('.navbar-fixed-top').removeClass("fadein");
  }
}