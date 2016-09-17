//swiperの設定
export function swiper_setiing(){
  console.log("swiper_setiing");
  new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 1,
    paginationClickable: true,
    spaceBetween: 30,
    grabCursor: true,
    loop: true,
  });
}