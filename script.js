// Global variables for 3D scenes
let heroScene, heroCamera, heroRenderer, heroGeometry, heroMaterial, heroCube;
let aboutScene, aboutCamera, aboutRenderer;
let contactScene, contactCamera, contactRenderer;
let footerScene, footerCamera, footerRenderer;
let animationId;

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    document.documentElement.classList.toggle('is-mobile', isMobile);
    
    // Prevent rubber band effect on iOS
    if (isMobile) {
        document.addEventListener('touchmove', function(e) {
            if (e.target.closest('.nav-menu, textarea, input')) return;
        }, { passive: true });
    }
    
    // Show loading screen
    showLoadingScreen();
    
    // Initialize all functionality
    setTimeout(() => {
        initNavigation();
        initScrollEffects();
        initContactForm();
        initAnimations();
        init3DElements();
        initParticles();
        initAdvancedEffects();
        initMobileOptimizations();
        hideLoadingScreen();
    }, 2000);
});

// Loading Screen
function showLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.style.display = 'flex';
        
        // Animate loading progress
        const progress = document.querySelector('.loading-progress');
        if (progress) {
            let width = 0;
            const interval = setInterval(() => {
                width += Math.random() * 15;
                if (width >= 100) {
                    width = 100;
                    clearInterval(interval);
                }
                progress.style.width = width + '%';
            }, 100);
        }
    }
}

function hideLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        loadingScreen.classList.add('hidden');
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    }
}

// Mobile Optimizations
function initMobileOptimizations() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        // Reduce animation complexity on mobile
        document.documentElement.style.setProperty('--animation-duration', '0.3s');
        
        // Optimize 3D elements for mobile
        const hero3D = document.getElementById('hero-3d');
        if (hero3D && heroRenderer) {
            // Reduce renderer quality on mobile
            heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        const isMobileNow = window.innerWidth <= 768;
        if (isMobileNow !== isMobile) {
            window.location.reload();
        }
    }, 250));
    
    // Optimize touch events
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchend', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
}

// Debounce utility for resize events
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

// Initialize 3D Elements
function init3DElements() {
    // Check if device is mobile
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);
    
    // Skip 3D on mobile devices
    if (isMobile) {
        console.log('Mobile device detected - skipping 3D elements');
        return;
    }
    
    initHero3D();
    initAbout3D();
    initServices3D();
    initPricing3D();
    initContact3D();
    initFooter3D();
    animate3D();
}

// Hero 3D Background
function initHero3D() {
    const container = document.getElementById('hero-3d');
    if (!container) return;
    
    // Skip on mobile
    if (window.innerWidth <= 768) return;

    // Scene setup
    heroScene = new THREE.Scene();
    heroCamera = new THREE.PerspectiveCamera(75, container.offsetWidth / container.offsetHeight, 0.1, 1000);
    heroRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'low-power' });
    
    heroRenderer.setSize(container.offsetWidth, container.offsetHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    heroRenderer.setClearColor(0x000000, 0);
    container.appendChild(heroRenderer.domElement);

    // Create floating geometric shapes
    const geometries = [
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.SphereGeometry(1.5, 32, 32),
        new THREE.ConeGeometry(1, 2, 8),
        new THREE.TorusGeometry(1, 0.4, 16, 100)
    ];

    const materials = [
        new THREE.MeshPhongMaterial({ 
            color: 0x3b82f6, 
            transparent: true, 
            opacity: 0.7,
            shininess: 100
        }),
        new THREE.MeshPhongMaterial({ 
            color: 0x60a5fa, 
            transparent: true, 
            opacity: 0.6,
            shininess: 100
        }),
        new THREE.MeshPhongMaterial({ 
            color: 0x1e40af, 
            transparent: true, 
            opacity: 0.8,
            shininess: 100
        })
    ];

    // Create multiple floating objects
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 50;
        mesh.position.y = (Math.random() - 0.5) * 30;
        mesh.position.z = (Math.random() - 0.5) * 30;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        mesh.userData = {
            rotationSpeed: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            },
            floatSpeed: Math.random() * 0.02 + 0.01,
            floatRange: Math.random() * 5 + 2
        };
        
        heroScene.add(mesh);
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    heroScene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0x60a5fa, 1);
    directionalLight.position.set(10, 10, 5);
    heroScene.add(directionalLight);

    const pointLight = new THREE.PointLight(0x3b82f6, 1, 100);
    pointLight.position.set(0, 0, 10);
    heroScene.add(pointLight);

    heroCamera.position.z = 20;

    // Floating cube for hero
    const cubeContainer = document.getElementById('floating-cube');
    if (cubeContainer) {
        const cubeScene = new THREE.Scene();
        const cubeCamera = new THREE.PerspectiveCamera(75, 200 / 200, 0.1, 1000);
        const cubeRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        cubeRenderer.setSize(200, 200);
        cubeRenderer.setClearColor(0x000000, 0);
        cubeContainer.appendChild(cubeRenderer.domElement);

        const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
        const cubeMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.8,
            shininess: 100
        });
        heroCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        cubeScene.add(heroCube);

        const cubeLight = new THREE.PointLight(0x60a5fa, 1, 100);
        cubeLight.position.set(5, 5, 5);
        cubeScene.add(cubeLight);

        cubeCamera.position.z = 5;

        // Animate floating cube
        function animateCube() {
            if (heroCube) {
                heroCube.rotation.x += 0.01;
                heroCube.rotation.y += 0.01;
                cubeRenderer.render(cubeScene, cubeCamera);
            }
            requestAnimationFrame(animateCube);
        }
        animateCube();
    }
}

// About 3D Icon
function initAbout3D() {
    const container = document.getElementById('about-3d');
    if (!container) return;

    aboutScene = new THREE.Scene();
    aboutCamera = new THREE.PerspectiveCamera(75, 100 / 100, 0.1, 1000);
    aboutRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    aboutRenderer.setSize(100, 100);
    aboutRenderer.setClearColor(0x000000, 0);
    container.appendChild(aboutRenderer.domElement);

    // Create a rotating torus
    const geometry = new THREE.TorusGeometry(1, 0.3, 16, 100);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x3b82f6,
        shininess: 100
    });
    const torus = new THREE.Mesh(geometry, material);
    aboutScene.add(torus);

    const light = new THREE.PointLight(0x60a5fa, 1, 100);
    light.position.set(5, 5, 5);
    aboutScene.add(light);

    aboutCamera.position.z = 3;

    // Animation
    function animateAbout() {
        if (torus) {
            torus.rotation.x += 0.02;
            torus.rotation.y += 0.02;
            aboutRenderer.render(aboutScene, aboutCamera);
        }
        requestAnimationFrame(animateAbout);
    }
    animateAbout();
}

// Services 3D Backgrounds
function initServices3D() {
    const services = ['web-dev-3d', 'branding-3d', 'presentation-3d'];
    
    services.forEach((serviceId, index) => {
        const container = document.getElementById(serviceId);
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 300 / 200, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(300, 200);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        // Different shapes for different services
        let geometry;
        switch(index) {
            case 0: // Web Development - Cube
                geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
                break;
            case 1: // Branding - Sphere
                geometry = new THREE.SphereGeometry(1, 32, 32);
                break;
            case 2: // Presentation - Torus
                geometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
                break;
        }

        const material = new THREE.MeshPhongMaterial({ 
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.3,
            shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const light = new THREE.PointLight(0x60a5fa, 1, 100);
        light.position.set(3, 3, 3);
        scene.add(light);

        camera.position.z = 4;

        // Animation
        function animateService() {
            if (mesh) {
                mesh.rotation.x += 0.01;
                mesh.rotation.y += 0.015;
                renderer.render(scene, camera);
            }
            requestAnimationFrame(animateService);
        }
        animateService();
    });
}

// Pricing 3D Icons
function initPricing3D() {
    const icons = ['web-dev-icon-3d', 'brand-icon-3d', 'presentation-icon-3d'];
    
    icons.forEach((iconId, index) => {
        const container = document.getElementById(iconId);
        if (!container) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 60 / 60, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        
        renderer.setSize(60, 60);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);

        let geometry;
        switch(index) {
            case 0: // Web Development
                geometry = new THREE.OctahedronGeometry(1);
                break;
            case 1: // Branding
                geometry = new THREE.IcosahedronGeometry(1);
                break;
            case 2: // Presentation
                geometry = new THREE.TetrahedronGeometry(1);
                break;
        }

        const material = new THREE.MeshPhongMaterial({ 
            color: 0x3b82f6,
            shininess: 100
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const light = new THREE.PointLight(0x60a5fa, 1, 100);
        light.position.set(2, 2, 2);
        scene.add(light);

        camera.position.z = 3;

        // Animation
        function animateIcon() {
            if (mesh) {
                mesh.rotation.x += 0.02;
                mesh.rotation.y += 0.02;
                renderer.render(scene, camera);
            }
            requestAnimationFrame(animateIcon);
        }
        animateIcon();
    });
}

// Contact 3D Element
function initContact3D() {
    const container = document.getElementById('contact-3d');
    if (!container) return;

    contactScene = new THREE.Scene();
    contactCamera = new THREE.PerspectiveCamera(75, 120 / 120, 0.1, 1000);
    contactRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    contactRenderer.setSize(120, 120);
    contactRenderer.setClearColor(0x000000, 0);
    container.appendChild(contactRenderer.domElement);

    // Create a complex shape
    const geometry = new THREE.DodecahedronGeometry(1);
    const material = new THREE.MeshPhongMaterial({ 
        color: 0x3b82f6,
        shininess: 100
    });
    const dodecahedron = new THREE.Mesh(geometry, material);
    contactScene.add(dodecahedron);

    const light = new THREE.PointLight(0x60a5fa, 1, 100);
    light.position.set(3, 3, 3);
    contactScene.add(light);

    contactCamera.position.z = 3;

    // Animation
    function animateContact() {
        if (dodecahedron) {
            dodecahedron.rotation.x += 0.015;
            dodecahedron.rotation.y += 0.015;
            contactRenderer.render(contactScene, contactCamera);
        }
        requestAnimationFrame(animateContact);
    }
    animateContact();
}

// Footer 3D Background
function initFooter3D() {
    const container = document.getElementById('footer-3d');
    if (!container) return;

    footerScene = new THREE.Scene();
    footerCamera = new THREE.PerspectiveCamera(75, window.innerWidth / 300, 0.1, 1000);
    footerRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    footerRenderer.setSize(window.innerWidth, 300);
    footerRenderer.setClearColor(0x000000, 0);
    container.appendChild(footerRenderer.domElement);

    // Create floating particles
    for (let i = 0; i < 50; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x3b82f6,
            transparent: true,
            opacity: 0.6
        });
        const particle = new THREE.Mesh(geometry, material);
        
        particle.position.x = (Math.random() - 0.5) * 100;
        particle.position.y = (Math.random() - 0.5) * 20;
        particle.position.z = (Math.random() - 0.5) * 20;
        
        particle.userData = {
            velocity: {
                x: (Math.random() - 0.5) * 0.02,
                y: (Math.random() - 0.5) * 0.02,
                z: (Math.random() - 0.5) * 0.02
            }
        };
        
        footerScene.add(particle);
    }

    footerCamera.position.z = 10;

    // Animation
    function animateFooter() {
        footerScene.children.forEach(particle => {
            if (particle.userData && particle.userData.velocity) {
                particle.position.x += particle.userData.velocity.x;
                particle.position.y += particle.userData.velocity.y;
                particle.position.z += particle.userData.velocity.z;
                
                // Boundary check
                if (Math.abs(particle.position.x) > 50) particle.userData.velocity.x *= -1;
                if (Math.abs(particle.position.y) > 10) particle.userData.velocity.y *= -1;
                if (Math.abs(particle.position.z) > 10) particle.userData.velocity.z *= -1;
            }
        });
        
        footerRenderer.render(footerScene, footerCamera);
        requestAnimationFrame(animateFooter);
    }
    animateFooter();
}

// Main 3D Animation Loop
function animate3D() {
    animationId = requestAnimationFrame(animate3D);
    
    // Animate hero scene
    if (heroScene && heroRenderer && heroCamera) {
        heroScene.children.forEach(child => {
            if (child.userData && child.userData.rotationSpeed) {
                child.rotation.x += child.userData.rotationSpeed.x;
                child.rotation.y += child.userData.rotationSpeed.y;
                child.rotation.z += child.userData.rotationSpeed.z;
                
                // Floating animation
                child.position.y += Math.sin(Date.now() * child.userData.floatSpeed) * 0.01;
            }
        });
        
        heroRenderer.render(heroScene, heroCamera);
    }
}

// Initialize Particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: "#60a5fa"
                },
                shape: {
                    type: "circle",
                    stroke: {
                        width: 0,
                        color: "#000000"
                    }
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false,
                        speed: 1,
                        opacity_min: 0.1,
                        sync: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false,
                        speed: 40,
                        size_min: 0.1,
                        sync: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: "#3b82f6",
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 6,
                    direction: "none",
                    random: false,
                    straight: false,
                    out_mode: "out",
                    bounce: false,
                    attract: {
                        enable: false,
                        rotateX: 600,
                        rotateY: 1200
                    }
                }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: {
                        enable: true,
                        mode: "repulse"
                    },
                    onclick: {
                        enable: true,
                        mode: "push"
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 400,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    bubble: {
                        distance: 400,
                        size: 40,
                        duration: 2,
                        opacity: 8,
                        speed: 3
                    },
                    repulse: {
                        distance: 200,
                        duration: 0.4
                    },
                    push: {
                        particles_nb: 4
                    },
                    remove: {
                        particles_nb: 2
                    }
                }
            },
            retina_detect: true
        });
    }
}

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;

    // Toggle mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation();
            isMenuOpen = !isMenuOpen;
            
            if (isMenuOpen) {
                navMenu.classList.add('active');
                hamburger.classList.add('active');
                // Prevent body scroll when menu is open
                document.body.style.overflow = 'hidden';
            } else {
                navMenu.classList.remove('active');
                hamburger.classList.remove('active');
                document.body.style.overflow = '';
            }
            
            // Update ARIA attributes
            hamburger.setAttribute('aria-expanded', isMenuOpen);
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            navMenu.classList.remove('active');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            isMenuOpen = false;
            
            // Smooth scroll to target
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (isMenuOpen && 
            navMenu?.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !hamburger?.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            isMenuOpen = false;
        }
    });

    // Close menu on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            isMenuOpen = false;
        }
    });

    // Close menu on scroll
    window.addEventListener('scroll', function() {
        if (isMenuOpen && navMenu?.classList.contains('active')) {
            navMenu.classList.remove('active');
            hamburger?.classList.remove('active');
            hamburger?.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            isMenuOpen = false;
        }
        
        // Header background on scroll with enhanced effects
        const header = document.querySelector('.header');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
            header.style.backdropFilter = 'blur(20px)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            header.style.backdropFilter = 'blur(10px)';
        }
    });
}

// Advanced scroll effects with GSAP
function initScrollEffects() {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero animations
        gsap.timeline()
            .from('.hero-title', { duration: 1, y: 100, opacity: 0, ease: "power3.out" })
            .from('.hero-subtitle', { duration: 1, y: 50, opacity: 0, ease: "power3.out" }, "-=0.5")
            .from('.hero-buttons', { duration: 1, y: 50, opacity: 0, ease: "power3.out" }, "-=0.5")
            .from('.hero-stats', { duration: 1, y: 50, opacity: 0, ease: "power3.out" }, "-=0.5");

        // Section animations
        gsap.utils.toArray('.service-card').forEach((card, index) => {
            gsap.from(card, {
                duration: 1,
                y: 100,
                opacity: 0,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                delay: index * 0.1
            });
        });

        gsap.utils.toArray('.pricing-card').forEach((card, index) => {
            gsap.from(card, {
                duration: 1,
                scale: 0.8,
                opacity: 0,
                ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: card,
                    start: "top 80%",
                    end: "bottom 20%",
                    toggleActions: "play none none reverse"
                },
                delay: index * 0.1
            });
        });

        // Feature animations
        gsap.utils.toArray('.feature').forEach((feature, index) => {
            gsap.from(feature, {
                duration: 0.8,
                x: -50,
                opacity: 0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: feature,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                delay: index * 0.1
            });
        });

        // Contact items animation
        gsap.utils.toArray('.contact-item').forEach((item, index) => {
            gsap.from(item, {
                duration: 0.8,
                x: 50,
                opacity: 0,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: item,
                    start: "top 85%",
                    end: "bottom 15%",
                    toggleActions: "play none none reverse"
                },
                delay: index * 0.1
            });
        });
    }

    // Parallax effect for hero section
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const hero3d = document.getElementById('hero-3d');
        const particles = document.getElementById('particles-js');
        
        if (hero3d) {
            hero3d.style.transform = `translateY(${scrolled * 0.3}px)`;
        }
        
        if (particles) {
            particles.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Active navigation link highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', function() {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
}

// Enhanced contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const name = formData.get('name');
            const email = formData.get('email');
            const service = formData.get('service');
            const message = formData.get('message');
            
            // Basic validation
            if (!name || !email || !service || !message) {
                showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('يرجى إدخال بريد إلكتروني صحيح', 'error');
                return;
            }
            
            // Enhanced form submission with animation
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            
            // Add loading animation
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>جاري الإرسال...</span>';
            submitBtn.disabled = true;
            submitBtn.style.transform = 'scale(0.95)';
            
            // Simulate form submission with enhanced feedback
            setTimeout(() => {
                showNotification('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'success');
                contactForm.reset();
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                submitBtn.style.transform = 'scale(1)';
                
                // Add success animation
                if (typeof gsap !== 'undefined') {
                    gsap.from(submitBtn, { duration: 0.3, scale: 1.1, ease: "back.out(1.7)" });
                }
            }, 2000);
        });

        // Enhanced input focus effects
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, { duration: 0.3, scale: 1.02, ease: "power2.out" });
                }
            });

            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (typeof gsap !== 'undefined') {
                    gsap.to(this, { duration: 0.3, scale: 1, ease: "power2.out" });
                }
            });
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Enhanced notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Enhanced styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10b981, #059669)' : type === 'error' ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'linear-gradient(135deg, #3b82f6, #2563eb)'};
        color: white;
        padding: 1.5rem 2rem;
        border-radius: 12px;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        z-index: 10000;
        transform: translateX(400px);
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 400px;
        font-family: 'Cairo', sans-serif;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
    `;
    
    notification.querySelector('.notification-content').style.cssText = `
        display: flex;
        align-items: center;
        gap: 1rem;
    `;
    
    notification.querySelector('.notification-close').style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0;
        margin-right: auto;
        opacity: 0.8;
        transition: opacity 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in with enhanced effect
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
        if (typeof gsap !== 'undefined') {
            gsap.from(notification, { duration: 0.6, scale: 0.8, ease: "back.out(1.7)" });
        }
    }, 100);
    
    // Close functionality
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 400);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 400);
        }
    }, 5000);
}

// Initialize advanced animations
function initAnimations() {
    // Enhanced counter animation for hero stats
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Enhanced hover effects for service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { 
                    duration: 0.4, 
                    y: -15, 
                    rotationX: 10, 
                    rotationY: 5, 
                    scale: 1.02,
                    ease: "power2.out" 
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { 
                    duration: 0.4, 
                    y: 0, 
                    rotationX: 0, 
                    rotationY: 0, 
                    scale: 1,
                    ease: "power2.out" 
                });
            }
        });
    });
    
    // Enhanced pricing card hover effects
    const pricingCards = document.querySelectorAll('.pricing-card');
    pricingCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('featured') && typeof gsap !== 'undefined') {
                gsap.to(this, { 
                    duration: 0.4, 
                    y: -10, 
                    rotationX: 8, 
                    scale: 1.02,
                    ease: "power2.out" 
                });
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('featured') && typeof gsap !== 'undefined') {
                gsap.to(this, { 
                    duration: 0.4, 
                    y: 0, 
                    rotationX: 0, 
                    scale: 1,
                    ease: "power2.out" 
                });
            }
        });
    });

    // Button ripple effects
    const buttons = document.querySelectorAll('.btn-3d, .service-btn, .pricing-btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = this.querySelector('.btn-ripple');
            if (ripple) {
                ripple.style.transform = 'scale(0)';
                ripple.style.opacity = '1';
                
                setTimeout(() => {
                    if (typeof gsap !== 'undefined') {
                        gsap.to(ripple, { duration: 0.6, scale: 2, opacity: 0, ease: "power2.out" });
                    }
                }, 10);
            }
        });
    });
}

// Enhanced counter animation
function animateCounter(element) {
    const target = element.getAttribute('data-target') || element.textContent;
    const isNumber = /^\d+$/.test(target);
    
    if (isNumber) {
        const targetNumber = parseInt(target);
        let current = 0;
        const increment = targetNumber / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetNumber) {
                element.textContent = targetNumber;
                clearInterval(timer);
                
                // Add completion animation
                if (typeof gsap !== 'undefined') {
                    gsap.from(element, { duration: 0.3, scale: 1.2, ease: "back.out(1.7)" });
                }
            } else {
                element.textContent = Math.floor(current);
            }
        }, 30);
    }
}

// Initialize advanced effects
function initAdvancedEffects() {
    // Tilt effect for cards
    const tiltElements = document.querySelectorAll('[data-tilt]');
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    duration: 0.3,
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    ease: "power2.out"
                });
            }
        });
        
        element.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, {
                    duration: 0.3,
                    rotationX: 0,
                    rotationY: 0,
                    ease: "power2.out"
                });
            }
        });
    });

    // Scroll indicator functionality
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const aboutSection = document.getElementById('about');
            if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }

    // Enhanced logo glow effects
    const logos = document.querySelectorAll('.logo-container, .footer-logo-container');
    logos.forEach(logo => {
        logo.addEventListener('mouseenter', function() {
            const glow = this.querySelector('.logo-glow');
            if (glow && typeof gsap !== 'undefined') {
                gsap.to(glow, { duration: 0.3, opacity: 0.7, scale: 1.1, ease: "power2.out" });
            }
        });
        
        logo.addEventListener('mouseleave', function() {
            const glow = this.querySelector('.logo-glow');
            if (glow && typeof gsap !== 'undefined') {
                gsap.to(glow, { duration: 0.3, opacity: 0, scale: 1, ease: "power2.out" });
            }
        });
    });

    // Social links enhanced effects
    const socialLinks = document.querySelectorAll('.social-link-3d');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { 
                    duration: 0.3, 
                    y: -5, 
                    rotationX: 15, 
                    scale: 1.1,
                    ease: "back.out(1.7)" 
                });
            }
        });
        
        link.addEventListener('mouseleave', function() {
            if (typeof gsap !== 'undefined') {
                gsap.to(this, { 
                    duration: 0.3, 
                    y: 0, 
                    rotationX: 0, 
                    scale: 1,
                    ease: "power2.out" 
                });
            }
        });
    });
}

// Resize handler for 3D elements
window.addEventListener('resize', function() {
    // Resize hero 3D
    if (heroRenderer && heroCamera) {
        const container = document.getElementById('hero-3d');
        if (container) {
            heroCamera.aspect = container.offsetWidth / container.offsetHeight;
            heroCamera.updateProjectionMatrix();
            heroRenderer.setSize(container.offsetWidth, container.offsetHeight);
        }
    }
    
    // Resize footer 3D
    if (footerRenderer && footerCamera) {
        footerCamera.aspect = window.innerWidth / 300;
        footerCamera.updateProjectionMatrix();
        footerRenderer.setSize(window.innerWidth, 300);
    }
});

// Performance optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    const originalScrollHandler = window.onscroll;
    
    window.onscroll = function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(() => {
            if (originalScrollHandler) {
                originalScrollHandler();
            }
        }, 10);
    };
    
    // Intersection Observer for performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loading');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.service-card, .pricing-card, .feature, .contact-item');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Initialize performance optimizations
optimizePerformance();

// Cleanup function
window.addEventListener('beforeunload', function() {
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

console.log('🚀 عزم Tech Clan Enhanced Website loaded successfully with 3D effects!');

