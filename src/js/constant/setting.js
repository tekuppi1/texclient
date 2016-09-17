//swiperの設定
exports.swiper = () => {
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

// モーダルの設定
exports.modal_option = {
  dismissible: true, // Modal can be dismissed by clicking outside of the modal
  opacity: .6, // Opacity of modal background
  in_duration: 500, // Transition in duration
  out_duration: 500, // Transition out duration
  starting_top: '0%', // Starting top style attribute
  ending_top: '0%', // Ending top style attribute
  ready: () => { setting.swiper(); }, // Callback for Modal open
}