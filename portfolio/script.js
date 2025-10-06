

document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      
      item.classList.toggle('active');
    });
  });
});

const openModalBtns = document.querySelectorAll('.open-modal-btn');
const modal = document.getElementById('modal');
const modalClose = document.querySelector('.modal-close');

openModalBtns.forEach(button => {
  button.addEventListener('click', function() {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  });
});

modalClose.addEventListener('click', function() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
});

modal.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }
});

class MultiSlideSlider {
  constructor(sliderElement, slidesPerView = 5) {
    this.slider = sliderElement;
    this.track = this.slider.querySelector('.slider-track');
    this.slides = this.slider.querySelectorAll('.slider-slide');
    this.scrollAreas = this.slider.querySelectorAll('.slider-scroll-area');
    this.slidesPerView = slidesPerView;
    this.currentIndex = 0;
    this.maxIndex = this.slides.length - this.slidesPerView;
    
    this.init();
    this.updateResponsiveSlidesPerView();
    
    window.addEventListener('resize', this.updateResponsiveSlidesPerView.bind(this));
  }

  init() {
    this.scrollAreas.forEach(area => {
      area.addEventListener('mouseenter', this.handleScrollAreaHover.bind(this));
    });

    this.scrollAreas.forEach(area => {
      area.addEventListener('click', this.handleScrollAreaClick.bind(this));
    });
  }

  updateResponsiveSlidesPerView() {
    const width = window.innerWidth;
    if (width <= 768) {
      this.slidesPerView = 2;
    } else if (width <= 1024) {
      this.slidesPerView = 3;
    } else {
      this.slidesPerView = 5;
    }
    this.maxIndex = this.slides.length - this.slidesPerView;
    this.updateSlider();
  }

  handleScrollAreaHover(e) {
    const direction = e.currentTarget.getAttribute('data-direction');
    this.scroll(direction);
  }

  handleScrollAreaClick(e) {
    const direction = e.currentTarget.getAttribute('data-direction');
    this.scroll(direction);
  }

  scroll(direction) {
    if (direction === 'next' && this.currentIndex < this.maxIndex) {
      this.currentIndex++;
    } else if (direction === 'prev' && this.currentIndex > 0) {
      this.currentIndex--;
    }

    this.updateSlider();
  }

  updateSlider() {
    const slideWidth = 100 / this.slidesPerView;
    const translateX = this.currentIndex * slideWidth;
    this.track.style.transform = `translateX(-${translateX}%)`;
  }
  setSlidesPerView(count) {
    this.slidesPerView = count;
    this.maxIndex = this.slides.length - this.slidesPerView;
    
    this.slides.forEach(slide => {
      slide.style.flex = `0 0 ${100 / count}%`;
    });
    
    this.updateSlider();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const sliderElement = document.querySelector('.slider');
  const slider = new MultiSlideSlider(sliderElement, 5);

});

let newBurger = document.querySelector('.nbl-burger.n-burger_mob')
let headerSidebar = document.querySelector('.header-sidebar')

newBurger.addEventListener('click', function() {

  if(!this.querySelector('div').classList.contains('burger-item_active')) {
    this.querySelectorAll('div').forEach(el => {
      el.classList.add('burger-item_active')
    });
    this.classList.add('_active')
    disableScroll()
    headerSidebar.classList.add("_opened")
  }
  else {
    this.querySelectorAll('div').forEach(el => {
      el.classList.remove('burger-item_active')
    });
    this.classList.remove('_active')
    enableScroll()
    headerSidebar.classList.remove("_opened")
  }
})

const disableScroll = () => {
  const pagePosition = window.scrollY;
  const paddingOffset = window.innerWidth - document.body.offsetWidth;

  document.documentElement.style.scrollBehavior = 'none';
  document.body.style.paddingRight = paddingOffset + 'px';
  document.body.classList.add('dis-scroll');
  document.body.dataset.position = pagePosition;
  document.body.style.top = `-${pagePosition}px`;
}

const enableScroll = () => {
  const pagePosition = parseInt(document.body.dataset.position, 10);
  document.body.style.paddingRight = '0px';

  document.documentElement.style.scrollBehavior = 'auto';
  
  document.body.style.top = 'auto';
  document.body.classList.remove('dis-scroll');
  window.scroll({
    top: pagePosition,
    left: 0
  });
  
  setTimeout(() => {
    document.documentElement.style.scrollBehavior = '';
  }, 100);
  
  document.body.removeAttribute('data-position');
}