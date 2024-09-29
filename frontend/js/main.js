// Slider functionality
const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
let currentIndex = 0;

function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    updateSlider();
}

function updateSlider() {
    slider.style.transform = `translateX(-${currentIndex * 100}%)`;
}

setInterval(nextSlide, 5000);

// Add any other common functionality here