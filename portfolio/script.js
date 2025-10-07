

document.addEventListener('DOMContentLoaded', function() {
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  const savedActiveItemId = localStorage.getItem('activeAccordionItem');
  if (savedActiveItemId) {
    const savedItem = document.getElementById(savedActiveItemId);
    if (savedItem) {
      accordionHeaders.forEach(header => {
        header.parentElement.classList.remove('active');
      });
      savedItem.classList.add('active');
    }
  }
  
  accordionHeaders.forEach(header => {
    header.addEventListener('click', function() {
      const item = this.parentElement;
      const isCurrentlyActive = item.classList.contains('active');
      
      accordionHeaders.forEach(otherHeader => {
        otherHeader.parentElement.classList.remove('active');
      });
      
      if (!isCurrentlyActive) {
        item.classList.add('active');
      }
      
      localStorage.setItem('activeAccordionItem', item.id);
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
    disableScroll()
  });
});

modalClose.addEventListener('click', function() {
  modal.style.display = 'none';
  document.body.style.overflow = 'auto';
  enableScroll()
});

modal.addEventListener('click', function(e) {
  if (e.target === modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    enableScroll()
  }
});

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape' && modal.style.display === 'flex') {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    enableScroll()
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
    
    this.touchStartX = 0;
    this.touchEndX = 0;
    this.isDragging = false;
    this.startPos = 0;
    this.currentTranslate = 0;
    this.prevTranslate = 0;
    this.animationID = 0;
    
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

    this.addTouchEvents();
  }

  addTouchEvents() {

    this.track.addEventListener('touchstart', this.touchStart.bind(this));
    this.track.addEventListener('touchmove', this.touchMove.bind(this));
    this.track.addEventListener('touchend', this.touchEnd.bind(this));
    
    this.track.addEventListener('mousedown', this.touchStart.bind(this));
    this.track.addEventListener('mousemove', this.touchMove.bind(this));
    this.track.addEventListener('mouseup', this.touchEnd.bind(this));
    this.track.addEventListener('mouseleave', this.touchEnd.bind(this));
    
    this.track.addEventListener('dragstart', (e) => e.preventDefault());
  }

  touchStart(e) {
    if (e.type === 'mousedown') {
      this.startPos = e.clientX;
    } else {
      this.startPos = e.touches[0].clientX;
    }
    
    this.isDragging = true;
    this.track.style.cursor = 'grabbing';
    this.track.style.transition = 'none';
    
    cancelAnimationFrame(this.animationID);
  }

  touchMove(e) {
    if (!this.isDragging) return;
    
    e.preventDefault();
    
    let currentPos;
    if (e.type === 'mousemove') {
      currentPos = e.clientX;
    } else {
      currentPos = e.touches[0].clientX;
    }
    
    const currentTranslate = this.prevTranslate + currentPos - this.startPos;
    
    const slideWidth = this.track.getBoundingClientRect().width / this.slidesPerView;
    const maxTranslate = 0;
    const minTranslate = -this.maxIndex * slideWidth;
    
    if (currentTranslate > maxTranslate + 50 || currentTranslate < minTranslate - 50) {
      return;
    }
    
    this.currentTranslate = currentTranslate;
    this.track.style.transform = `translateX(${this.currentTranslate}px)`;
  }

  touchEnd() {
    if (!this.isDragging) return;
    
    this.isDragging = false;
    this.track.style.cursor = 'grab';
    this.track.style.transition = 'transform 0.3s ease';
    
    const slideWidth = this.track.getBoundingClientRect().width / this.slidesPerView;
    const movedBy = this.currentTranslate - this.prevTranslate;
    
    const threshold = slideWidth * 0.15;
    
    if (Math.abs(movedBy) > threshold) {
      if (movedBy > 0 && this.currentIndex > 0) {
        this.currentIndex--;
      } else if (movedBy < 0 && this.currentIndex < this.maxIndex) {
        this.currentIndex++;
      }
    }
    
    this.updateSlider();
    this.prevTranslate = -this.currentIndex * slideWidth;
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
    this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);
    
    const slideWidth = this.track.getBoundingClientRect().width / this.slidesPerView;
    this.prevTranslate = -this.currentIndex * slideWidth;
    this.currentTranslate = this.prevTranslate;
    
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
    
    const slideWidth = this.track.getBoundingClientRect().width / this.slidesPerView;
    this.prevTranslate = -this.currentIndex * slideWidth;
    this.currentTranslate = this.prevTranslate;
  }

  updateSlider() {
    this.currentIndex = Math.max(0, Math.min(this.currentIndex, this.maxIndex));
    
    const slideWidth = 100 / this.slidesPerView;
    const translateX = this.currentIndex * slideWidth;
    this.track.style.transform = `translateX(-${translateX}%)`;
    this.track.style.transition = 'transform 0.3s ease';
  }

  setSlidesPerView(count) {
    this.slidesPerView = count;
    this.maxIndex = Math.max(0, this.slides.length - this.slidesPerView);
    
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

if(window.innerWidth <= 768) {
  document.querySelectorAll('.header-sidebar__list a').forEach((el) => {
    el.addEventListener('click', () => {
      enableScroll()
      newBurger.classList.remove('_active')
      headerSidebar.classList.remove("_opened")
      newBurger.querySelectorAll('div').forEach((el) => {
        el.classList.remove('burger-item_active')
      })
    })
  })
}

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