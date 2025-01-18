document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('nav');
  
  hamburger.addEventListener('click', () => {
    // Toggle the 'active' class for both the hamburger and the navigation menu
    hamburger.classList.toggle('active');
    nav.classList.toggle('active');
  });
});
