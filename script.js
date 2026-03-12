/**
 * Script principal para la página web de HELAR-TEC
 * Maneja la interactividad del frontend, incluyendo temas, navegación móvil,
 * slider de testimonios, formularios, efectos de scroll y chat con IA.
 */

// ===== DATOS DE TESTIMONIOS =====

/**
 * Array con los datos de los testimonios de clientes
 * Cada objeto contiene información del cliente y su testimonio
 */
const testimonialsData = [
    {
        name: "María González",
        business: "Helados Artesanales MG",
        text: "Desde que implementamos HELARV TEC, redujimos el desperdicio en un 45% y nuestras ventas aumentaron un 30%. ¡Increíble!",
        avatar: "MG"
    },
    {
        name: "Carlos Rodríguez",
        business: "Frozen Delights",
        text: "La app móvil es increíblemente útil. Puedo revisar mi inventario desde cualquier lugar y tomar decisiones informadas al instante.",
        avatar: "CR"
    },
    {
        name: "Laura Méndez",
        business: "Heladería Dulce Sabor",
        text: "Las alertas automáticas nos han salvado varias veces de quedarnos sin ingredientes clave durante temporada alta. Un sistema indispensable.",
        avatar: "LM"
    },
    {
        name: "Juan Pérez",
        business: "Ice Cream Paradise",
        text: "El análisis de ventas me permitió identificar los sabores menos populares y optimizar mi menú. Ahora mi negocio es mucho más rentable.",
        avatar: "JP"
    }
];

// ===== INICIALIZACIÓN =====

/**
 * Inicialización principal cuando el DOM está completamente cargado
 * Configura todos los componentes de la página
 */
document.addEventListener('DOMContentLoaded', function() {
    // Ocultar loader después de 2 segundos para mejor UX
    setTimeout(() => {
        const loader = document.getElementById('loader');
        loader.classList.add('hidden');

        // Remover completamente después de la animación
        setTimeout(() => {
            loader.style.display = 'none';
        }, 500);
    }, 2000);

    // Inicializar todos los componentes de la página
    initThemeToggle();
    initMobileMenu();
    initTestimonialsSlider();
    initForms();
    initScrollEffects();
    initBackToTop();
    updateCurrentYear();

    // Iniciar animaciones de contadores estadísticos
    initCounterAnimations();
});

// ===== GESTIÓN DE TEMAS (CLARO/OSCURO) =====

/**
 * Inicializa el alternador de temas (claro/oscuro)
 * Verifica preferencias guardadas o del sistema y configura el evento de cambio
 */
function initThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const body = document.body;

    // Verificar tema guardado en localStorage o preferencia del sistema
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Aplicar tema oscuro si está guardado o es preferencia del sistema
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        body.classList.add('dark');
    }

    // Evento de clic para alternar tema
    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark');
        const theme = body.classList.contains('dark') ? 'dark' : 'light';
        localStorage.setItem('theme', theme);

        // Actualizar iconos del botón según el tema
        updateThemeIcons(theme);
    });

    // Actualizar iconos inicialmente
    updateThemeIcons(body.classList.contains('dark') ? 'dark' : 'light');
}

/**
 * Actualiza la opacidad de los iconos del sol y la luna según el tema actual
 * @param {string} theme - El tema actual ('light' o 'dark')
 */
function updateThemeIcons(theme) {
    const sunIcon = document.querySelector('.sun-icon');
    const moonIcon = document.querySelector('.moon-icon');

    if (theme === 'dark') {
        sunIcon.style.opacity = '0.3';
        moonIcon.style.opacity = '1';
    } else {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0.3';
    }
}

// ===== MENÚ MÓVIL =====

/**
 * Inicializa el menú de navegación móvil
 * Maneja la apertura/cierre del menú y la navegación por enlaces
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Evento para alternar el menú hamburguesa
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.querySelector('i').classList.toggle('fa-bars');
        menuToggle.querySelector('i').classList.toggle('fa-times');
    });

    // Cerrar menú al hacer clic en un enlace de navegación
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        });
    });

    // Cerrar menú al hacer clic fuera del área del menú
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            navMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.add('fa-bars');
            menuToggle.querySelector('i').classList.remove('fa-times');
        }
    });
}

// ===== SLIDER DE TESTIMONIOS =====

/**
 * Inicializa el slider de testimonios de clientes
 * Crea slides dinámicamente y configura navegación automática y manual
 */
function initTestimonialsSlider() {
    const sliderContainer = document.getElementById('sliderContainer');
    const sliderDots = document.getElementById('sliderDots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    let currentSlide = 0;

    // Renderizar slides desde los datos de testimonios
    testimonialsData.forEach((testimonial, index) => {
        const slide = document.createElement('div');
        slide.className = 'testimonial-slide';
        slide.style.display = index === 0 ? 'block' : 'none';

        slide.innerHTML = `
            <div class="testimonial-content">
                <div class="quote-icon">
                    <i class="fas fa-quote-left"></i>
                </div>
                <p class="testimonial-text">${testimonial.text}</p>
                <div class="testimonial-author">
                    <div class="author-avatar">
                        ${testimonial.avatar}
                    </div>
                    <div class="author-info">
                        <h4>${testimonial.name}</h4>
                        <p>${testimonial.business}</p>
                    </div>
                </div>
            </div>
        `;

        sliderContainer.appendChild(slide);

        // Crear puntos indicadores del slider
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', () => goToSlide(index));
        sliderDots.appendChild(dot);
    });

    // Eventos para botones de navegación
    prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + testimonialsData.length) % testimonialsData.length;
        goToSlide(currentSlide);
    });

    nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % testimonialsData.length;
        goToSlide(currentSlide);
    });

    // Auto-slide cada 5 segundos
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonialsData.length;
        goToSlide(currentSlide);
    }, 5000);

    /**
     * Navega a un slide específico
     * @param {number} index - Índice del slide a mostrar
     */
    function goToSlide(index) {
        // Ocultar slide actual
        const slides = document.querySelectorAll('.testimonial-slide');
        slides[currentSlide].style.display = 'none';

        // Actualizar puntos indicadores
        const dots = document.querySelectorAll('.dot');
        dots[currentSlide].classList.remove('active');

        // Mostrar nuevo slide
        currentSlide = index;
        slides[currentSlide].style.display = 'block';
        dots[currentSlide].classList.add('active');
    }
}

// ===== FORMULARIOS =====

/**
 * Inicializa los formularios de contacto y newsletter
 * Configura validación y envío simulado con feedback visual
 */
function initForms() {
    const contactForm = document.getElementById('contactForm');
    const newsletterForm = document.querySelector('.newsletter-form');

    // Formulario de contacto principal
    if (contactForm) {
        let submitted = false; // Previene envíos múltiples

        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            if (submitted) return; // Ya enviado
            submitted = true;

            // Simular envío con feedback visual
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Mostrar notificación de éxito
                showNotification('¡Solicitud enviada con éxito! Te contactaremos en breve.', 'success');
                // Deshabilitar campos para evitar reenvío
                const inputs = contactForm.querySelectorAll('input, textarea, button');
                inputs.forEach(el => el.disabled = true);
            }, 2000);
        });
    }

    // Formulario de newsletter
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const emailInput = this.querySelector('input[type="email"]');
            const submitBtn = this.querySelector('button[type="submit"]');

            if (emailInput.value) {
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

                setTimeout(() => {
                    showNotification('¡Gracias por suscribirte!', 'success');
                    emailInput.value = '';
                    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
                }, 1500);
            }
        });
    }
}

// ===== EFECTOS DE SCROLL =====

/**
 * Inicializa los efectos relacionados con el scroll de la página
 * Incluye header sticky, navegación activa y animaciones de aparición
 */
function initScrollEffects() {
    const header = document.querySelector('.header');
    const navLinks = document.querySelectorAll('.nav-link');

    // Header con efecto sticky al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Actualizar enlaces de navegación activos
        updateActiveNavLink();
    });

    /**
     * Actualiza el enlace activo de navegación basado en la sección visible
     */
    function updateActiveNavLink() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Configuración del Intersection Observer para animaciones de aparición
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observar elementos para animación al aparecer en viewport
    document.querySelectorAll('.feature-card, .stat-card, .testimonial-slide').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ===== BOTÓN VOLVER ARRIBA =====

/**
 * Inicializa el botón "volver arriba" que aparece al hacer scroll
 */
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');

    // Mostrar/ocultar botón según posición de scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    // Evento para scroll suave hacia arriba
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ===== ANIMACIONES DE CONTADORES =====

/**
 * Inicializa las animaciones de los contadores estadísticos en la sección hero
 * Anima los números desde 0 hasta el valor objetivo
 */
function initCounterAnimations() {
    const statNumbers = document.querySelectorAll('.stat-number');

    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 50; // Dividir en 50 pasos para animación suave
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            // Mantener símbolos de porcentaje si existen
            stat.textContent = Math.round(current) + (stat.textContent.includes('%') ? '%' : '');
        }, 30);
    });
}

// ===== UTILIDADES =====

/**
 * Actualiza el año actual en el copyright del footer
 */
function updateCurrentYear() {
    const yearElement = document.getElementById('currentYear');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
}

/**
 * Muestra una notificación temporal en la parte superior de la pantalla
 * @param {string} message - El mensaje a mostrar
 * @param {string} type - Tipo de notificación ('success', 'error', 'info')
 */
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;

    // Configurar colores e iconos según el tipo
    let bgColor, icon, textColor;
    switch (type) {
        case 'success':
            bgColor = '#4CAF50';
            icon = 'fa-check-circle';
            textColor = '#ffffff';
            break;
        case 'error':
            bgColor = '#f44336';
            icon = 'fa-exclamation-circle';
            textColor = '#ffffff';
            break;
        default:
            bgColor = '#2196F3';
            icon = 'fa-info-circle';
            textColor = '#ffffff';
    }

    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;

    // Aplicar estilos dinámicos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        background: ${bgColor};
        color: ${textColor};
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: space-between;
        min-width: 300px;
        max-width: 400px;
        transform: translate(-50%, -120%);
        transition: transform 0.3s ease-out;
        font-family: var(--font-body);
    `;

    // Estilos del contenido
    const content = notification.querySelector('.notification-content');
    content.style.cssText = `
        display: flex;
        align-items: center;
        gap: 12px;
        flex-grow: 1;
    `;

    // Botón de cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: inherit;
        cursor: pointer;
        font-size: 16px;
        margin-left: 16px;
        padding: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    // Añadir al DOM
    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => {
        notification.style.transform = 'translate(-50%, 0)';
    }, 10);

    // Configurar cierre manual
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });

    // Cierre automático después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(120%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// ===== CHAT CON IA =====

/**
 * Alterna la visibilidad del contenedor del chat
 */
function toggleChat() {
    const chat = document.getElementById("chatContainer");

    if (chat.style.display === "flex") {
        chat.style.display = "none";
    } else {
        chat.style.display = "flex";
    }
}

/**
 * Envía un mensaje al chat de IA y maneja la respuesta
 * Realiza una petición POST al backend de FastAPI
 */
async function sendMessage() {
    const input = document.getElementById("input");
    const messages = document.getElementById("messages");

    const userMessage = input.value;

    // Validar que el mensaje no esté vacío
    if (userMessage.trim() === "") {
        return;
    }

    // Agregar mensaje del usuario al chat
    messages.innerHTML += `<div class="user-message">${userMessage}</div>`;

    // Limpiar input
    input.value = "";

    // Mostrar indicador de "escribiendo"
    messages.innerHTML += `<div class="bot-message" id="typing">Escribiendo...</div>`;

    // Scroll automático
    messages.scrollTop = messages.scrollHeight;

    // Enviar petición al backend
    const response = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: userMessage
        })
    });

    const data = await response.json();

    // Remover indicador de escribiendo
    document.getElementById("typing").remove();

    // Agregar respuesta del bot con enlaces formateados
    messages.innerHTML += `<div class="bot-message">${formatLinks(data.reply)}</div>`;

    // Scroll automático
    messages.scrollTop = messages.scrollHeight;
}

/**
 * Formatea URLs en el texto como enlaces clicables
 * @param {string} text - El texto a formatear
 * @returns {string} Texto con URLs convertidas en enlaces
 */
function formatLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.replace(urlRegex, url => {
        return `<a href="${url}" target="_blank">${url}</a>`;
    });
}

// Evento para enviar mensaje con Enter
const input = document.getElementById("input");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
});