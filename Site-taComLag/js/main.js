$(".main-slider").slick({
    dots: true,
    dotsClass: 'slick-dots',
    lazyLoad: 'ondemand',
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true
  });

  $(".center").slick({
    dots: true,
    infinite: true,
    centerMode: true,
    slidesToShow: 2,
    slidesToScroll: 3
  });