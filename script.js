document.addEventListener('DOMContentLoaded', () => {
  // Debounce utility function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Dark Mode Toggle
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const themeIcon = themeToggle?.querySelector('i');
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    body.setAttribute('data-theme', 'dark');
    themeIcon?.classList.replace('fa-moon', 'fa-sun');
  }

  themeToggle?.addEventListener('click', () => {
    const isDark = body.getAttribute('data-theme') === 'dark';
    body.setAttribute('data-theme', isDark ? 'light' : 'dark');
    themeIcon.classList.toggle('fa-moon', isDark);
    themeIcon.classList.toggle('fa-sun', !isDark);
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  });

  // Highlight active nav link
  const links = document.querySelectorAll('.fixed-sidebar nav a');
  links.forEach((link) => {
    link.addEventListener('click', function () {
      links.forEach((l) => l.classList.remove('active'));
      this.classList.add('active');
      
      // Close mobile menu after clicking a link
      if (window.innerWidth <= 768) {
        document.querySelector('.fixed-sidebar').classList.remove('active');
        document.getElementById('hamburger').innerHTML = '<i class="fas fa-bars"></i>';
      }
    });
  });

  // Smooth scroll with offset for fixed sidebar
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        const offset = window.innerWidth <= 768 ? 100 : 20;
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });

  // Update active link and progress bar on scroll
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.fixed-sidebar nav a');
  const stickyCta = document.getElementById('stickyCta');

  window.addEventListener('scroll', debounce(() => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.pageYOffset >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href').slice(1) === current) {
        link.classList.add('active');
      }
    });

    // Update progress bar
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    document.getElementById('progressBar').style.width = `${scrollPercentage}%`;

    // Show/hide sticky CTA
    if (stickyCta) {
      stickyCta.style.display = scrollTop > 200 ? 'flex' : 'none';
    }
  }, 100));

  // Scroll-triggered animations using IntersectionObserver
  const animatedElements = document.querySelectorAll('[data-animate]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  animatedElements.forEach(element => observer.observe(element));

  // Ripple effect for buttons
  const buttons = document.querySelectorAll('.btn, .open-popup, .open-service, .prev-slide, .next-slide');
  buttons.forEach(button => {
    button.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${e.clientY - rect.top - size / 2}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Page load animation
  const mainContent = document.querySelector('.main-content');
  if (mainContent) {
    mainContent.style.opacity = '0';
    setTimeout(() => {
      mainContent.style.transition = 'opacity 0.5s ease';
      mainContent.style.opacity = '1';
    }, 100);
  }

  // Hamburger menu toggle
  const hamburger = document.getElementById('hamburger');
const sidebar = document.querySelector('.fixed-sidebar');

if (hamburger && sidebar) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // يمنع التفاعل المكرر
    const isActive = sidebar.classList.contains('active');
    sidebar.classList.toggle('active');
    hamburger.innerHTML = isActive ? '<i class="fas fa-bars"></i>' : '<i class="fas fa-times"></i>';
  });

  // أغلق القائمة لما تدوس بره منها
  document.addEventListener('click', (e) => {
    const clickedInsideSidebar = sidebar.contains(e.target);
    const clickedHamburger = hamburger.contains(e.target);

    if (window.innerWidth <= 768 && sidebar.classList.contains('active') && !clickedInsideSidebar && !clickedHamburger) {
      sidebar.classList.remove('active');
      hamburger.innerHTML = '<i class="fas fa-bars"></i>';
    }
  });
}


  // Close sidebar when clicking outside on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebar.classList.contains('active')) {
      if (!sidebar.contains(e.target) && e.target !== hamburger) {
        sidebar.classList.remove('active');
        hamburger.innerHTML = '<i class="fas fa-bars"></i>';
      }
    }
  });

  // Service Popups
  const openService = document.querySelectorAll('.open-service');
  const closeService = document.querySelectorAll('.close-service');
  const servicePopup = document.getElementById('servicePopup');

  openService.forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceId = btn.dataset.service;
      const serviceContent = document.querySelector(`#${serviceId}`);
      document.querySelectorAll('.service-content').forEach(content => content.style.display = 'none');
      serviceContent.style.display = 'flex';
      servicePopup.style.display = 'flex';
    });
  });

  closeService.forEach(btn => {
    btn.addEventListener('click', () => {
      servicePopup.style.display = 'none';
    });
  });

  servicePopup?.addEventListener('click', (e) => {
    if (e.target === servicePopup) {
      servicePopup.style.display = 'none';
    }
  });
});
// Previous JavaScript remains the same, add these new functions at the end of the DOMContentLoaded event listener

// Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll('.counter');
  const speed = 200;
  
  counters.forEach(counter => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const increment = target / speed;
    
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(animateCounters, 1);
    } else {
      counter.innerText = target;
    }
  });
}

// Testimonial Slider
function setupTestimonialSlider() {
  const testimonials = document.querySelectorAll('.testimonial');
  const prevBtn = document.querySelector('.prev-slide');
  const nextBtn = document.querySelector('.next-slide');
  let currentIndex = 0;
  
  function showTestimonial(index) {
    testimonials.forEach(testimonial => testimonial.classList.remove('active'));
    testimonials[index].classList.add('active');
  }
  
  prevBtn.addEventListener('click', () => {
    currentIndex = (currentIndex > 0) ? currentIndex - 1 : testimonials.length - 1;
    showTestimonial(currentIndex);
  });
  
  nextBtn.addEventListener('click', () => {
    currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
    showTestimonial(currentIndex);
  });
  
  // Auto-rotate testimonials
  setInterval(() => {
    currentIndex = (currentIndex < testimonials.length - 1) ? currentIndex + 1 : 0;
    showTestimonial(currentIndex);
  }, 8000);
}

// Visitor Counter (simulated - you can replace with real tracking)
function setupVisitorCounter() {
  // Start with a random number between 50-150 for demo purposes
  // In a real implementation, you would fetch this from your analytics
  let count = Math.floor(Math.random() * 100) + 50;
  const counterElement = document.getElementById('visitorCount');
  
  // Animate the initial count
  let displayCount = 0;
  const increment = count / 50;
  
  const timer = setInterval(() => {
    displayCount = Math.min(count, Math.ceil(displayCount + increment));
    counterElement.textContent = displayCount;
    
    if (displayCount >= count) {
      clearInterval(timer);
      // Simulate fluctuating visitor count
      setInterval(() => {
        count += Math.floor(Math.random() * 3) - 1; // Randomly increase or decrease
        count = Math.max(50, count); // Don't go below 50
        counterElement.textContent = count;
      }, 5000);
    }
  }, 20);
}

// Initialize new features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Previous code remains the same...
  
  // Add these at the end of the event listener
  animateCounters();
  setupTestimonialSlider();
  setupVisitorCounter();
});