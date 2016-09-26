
	$(document).ready(function(){
	$('.parallax').parallax();
		$('.button-collapse').sideNav({
				menuWidth: 250,
				closeOnClick: true
			}
		);
	$('.modal-trigger').leanModal();
	$('ul.tabs').tabs();
		$('.carousel').carousel();
		$('.carousel.carousel-slider').carousel({full_width: true});



});
	function onScroll() {
		if ($(window).scrollTop() > 90) {
			$('.original').css('opacity', '0');
			$('.navbar-fixed-top').css('opacity', '1');
			$('.navbar-fixed-top').css('display', 'block');
		} else {
			$('.original').css('opacity', '1');
			$('.navbar-fixed-top').css('opacity', '0');
			$('.navbar-fixed-top').css('display', 'none');
		}
	}


	window.addEventListener('scroll', onScroll, false);
