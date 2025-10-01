// ========== INNOVATECH SOLUTIONS ==========

// Variables globales
let isMenuOpen = false;
let formData = {};
let validationErrors = {};

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ========== INICIALIZACIÓN DE LA APLICACIÓN ==========
function initializeApp() {
    console.log('🚀 Inicializando UltraNano Soluciones...');
    
    // Inicializar componentes
    setupNavigationEnhancement();
    setupFormValidation();
    setupScrollAnimations();
    setupServiceInteractions();
    setupHeaderEffects();
    setupSocialLinks();
    
    console.log('✅ Aplicación inicializada correctamente');
}

// ========== MEJORAS DE NAVEGACIÓN ==========
function setupNavigationEnhancement() {
    const navLinks = document.querySelectorAll('nav ul li a');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            
            // Si el enlace NO comienza con #, dejarlo funcionar normalmente
            if (!targetId.startsWith('#')) {
                return; // Permite que el navegador maneje el enlace normalmente
            }
            
            // Solo prevenir default para enlaces internos (#)
            e.preventDefault();
            
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                smoothScrollTo(targetSection);
                
                // Destacar enlace activo
                setActiveNavLink(this);
            }
        });
        
        // Efectos hover mejorados
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.transition = 'all 0.3s ease';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Scroll suave personalizado
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
    
    // Efecto visual de llegada
    setTimeout(() => {
        element.style.transform = 'scale(1.02)';
        element.style.transition = 'transform 0.3s ease';
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }, 500);
}

// Establecer enlace activo
function setActiveNavLink(activeLink) {
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.classList.remove('active-nav');
        link.style.color = '#1e293b';
    });
    
    activeLink.classList.add('active-nav');
    activeLink.style.color = '#0ea5e9';
    activeLink.style.fontWeight = '700';
}

// ========== VALIDACIÓN AVANZADA DEL FORMULARIO ==========
function setupFormValidation() {
    const form = document.querySelector('#contact form');
    const nombreInput = document.getElementById('nombre');
    const correoInput = document.getElementById('correo');
    const mensajeTextarea = document.getElementById('mensaje');
    const submitButton = form.querySelector('button[type="submit"]');
    
    // Agregar contenedores de error
    addErrorContainers();
    
    // Event listeners para validación en tiempo real
    nombreInput.addEventListener('input', () => validateField('nombre'));
    nombreInput.addEventListener('blur', () => validateField('nombre'));
    
    correoInput.addEventListener('input', () => validateField('correo'));
    correoInput.addEventListener('blur', () => validateField('correo'));
    
    mensajeTextarea.addEventListener('input', () => validateField('mensaje'));
    mensajeTextarea.addEventListener('blur', () => validateField('mensaje'));
    
    // Validación al enviar el formulario
    form.addEventListener('submit', handleFormSubmit);
    
    // Efectos visuales mejorados
    addFormVisualEffects();
}

// Agregar contenedores de error
function addErrorContainers() {
    const inputs = ['nombre', 'correo', 'mensaje'];
    
    inputs.forEach(inputName => {
        const input = document.getElementById(inputName);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.id = inputName + '-error';
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 0.875rem;
            margin-top: 0.25rem;
            display: none;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
        `;
        input.parentNode.insertBefore(errorDiv, input.nextSibling);
    });
}

// Validación individual de campos
function validateField(fieldName) {
    const field = document.getElementById(fieldName);
    const value = field.value.trim();
    const errorElement = document.getElementById(fieldName + '-error');
    
    let isValid = true;
    let errorMessage = '';
    
    // Limpiar estados previos
    clearFieldErrors(field, errorElement);
    
    // Validaciones específicas
    switch(fieldName) {
        case 'nombre':
            if (value === '') {
                errorMessage = 'El nombre es obligatorio';
                isValid = false;
            } else if (value.length < 2) {
                errorMessage = 'El nombre debe tener al menos 2 caracteres';
                isValid = false;
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(value)) {
                errorMessage = 'El nombre solo puede contener letras';
                isValid = false;
            } else if (value.length > 50) {
                errorMessage = 'El nombre no puede exceder 50 caracteres';
                isValid = false;
            }
            break;
            
        case 'correo':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value === '') {
                errorMessage = 'El correo electrónico es obligatorio';
                isValid = false;
            } else if (!emailRegex.test(value)) {
                errorMessage = 'Ingrese un correo electrónico válido';
                isValid = false;
            } else if (value.length > 100) {
                errorMessage = 'El correo es demasiado largo';
                isValid = false;
            }
            break;
            
        case 'mensaje':
            if (value === '') {
                errorMessage = 'El mensaje es obligatorio';
                isValid = false;
            } else if (value.length < 10) {
                errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                isValid = false;
            } else if (value.length > 1000) {
                errorMessage = 'El mensaje no puede exceder 1000 caracteres';
                isValid = false;
            }
            break;
    }
    
    // Mostrar error si existe
    if (!isValid) {
        showFieldError(field, errorElement, errorMessage);
        validationErrors[fieldName] = errorMessage;
    } else {
        showFieldSuccess(field);
        delete validationErrors[fieldName];
    }
    
    return isValid;
}

// Limpiar errores del campo
function clearFieldErrors(field, errorElement) {
    field.style.borderColor = '#cbd5e1';
    field.style.backgroundColor = '#ffffff';
    field.classList.remove('error', 'success');
    
    if (errorElement) {
        errorElement.style.display = 'none';
        errorElement.style.opacity = '0';
    }
}

// Mostrar error en el campo
function showFieldError(field, errorElement, message) {
    field.style.borderColor = '#ef4444';
    field.style.backgroundColor = '#fef2f2';
    field.classList.add('error');
    
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.opacity = '1';
            errorElement.style.transform = 'translateY(0)';
        }, 10);
    }
    
    // Animación de shake
    field.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        field.style.animation = '';
    }, 500);
}

// Mostrar éxito en el campo
function showFieldSuccess(field) {
    field.style.borderColor = '#10b981';
    field.style.backgroundColor = '#f0fdf4';
    field.classList.add('success');
}

// Manejo del envío del formulario
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validar todos los campos
    const isNombreValid = validateField('nombre');
    const isCorreoValid = validateField('correo');
    const isMensajeValid = validateField('mensaje');
    
    const isFormValid = isNombreValid && isCorreoValid && isMensajeValid;
    
    if (isFormValid) {
        await submitForm(e.target);
    } else {
        // Scroll al primer error
        const firstError = document.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
        
        showNotification('Por favor, corrija los errores antes de enviar', 'error');
    }
}

// Envío del formulario
async function submitForm(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Estado de carga
    submitButton.disabled = true;
    submitButton.innerHTML = `
        <span style="display: inline-flex; align-items: center; gap: 0.5rem;">
            <span class="spinner"></span>
            Enviando...
        </span>
    `;
    
    // Agregar CSS para spinner
    addSpinnerStyles();
    
    try {
        // Simular envío (en producción sería una llamada real a la API)
        const formData = new FormData(form);
        const data = {
            nombre: formData.get('nombre'),
            correo: formData.get('correo'),
            mensaje: formData.get('mensaje'),
            timestamp: new Date().toISOString()
        };
        
        await simulateFormSubmission(data);
        
        // Éxito
        showNotification('¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.', 'success');
        form.reset();
        clearAllFieldStates(form);
        
        // Efecto de celebración
        createCelebrationEffect();
        
    } catch (error) {
        showNotification('Error al enviar el mensaje. Por favor, inténtelo nuevamente.', 'error');
        console.error('Error en el envío:', error);
    } finally {
        // Restaurar botón
        setTimeout(() => {
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }, 1000);
    }
}

// Simulación del envío
function simulateFormSubmission(data) {
    return new Promise((resolve, reject) => {
        console.log('📤 Enviando datos:', data);
        
        setTimeout(() => {
            // Simular 95% de éxito
            if (Math.random() < 0.95) {
                resolve(data);
            } else {
                reject(new Error('Error simulado de red'));
            }
        }, 2000);
    });
}

// Limpiar todos los estados del formulario
function clearAllFieldStates(form) {
    const fields = form.querySelectorAll('input, textarea');
    const errorMessages = form.querySelectorAll('.error-message');
    
    fields.forEach(field => {
        field.style.borderColor = '#cbd5e1';
        field.style.backgroundColor = '#ffffff';
        field.classList.remove('error', 'success');
    });
    
    errorMessages.forEach(error => {
        error.style.display = 'none';
        error.style.opacity = '0';
    });
    
    validationErrors = {};
}

// ========== EFECTOS VISUALES DEL FORMULARIO ==========
function addFormVisualEffects() {
    const inputs = document.querySelectorAll('#contact input, #contact textarea');
    
    inputs.forEach(input => {
        // Efectos de foco
        input.addEventListener('focus', function() {
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(14, 165, 233, 0.15)';
        });
        
        input.addEventListener('blur', function() {
            if (!this.classList.contains('error')) {
                this.style.transform = 'translateY(0)';
                this.style.boxShadow = 'none';
            }
        });
        
        // Contador de caracteres para textarea
        if (input.tagName === 'TEXTAREA') {
            addCharacterCounter(input);
        }
    });
}

// Agregar contador de caracteres
function addCharacterCounter(textarea) {
    const counter = document.createElement('div');
    counter.className = 'char-counter';
    counter.style.cssText = `
        text-align: right;
        font-size: 0.75rem;
        color: #64748b;
        margin-top: 0.25rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    textarea.parentNode.insertBefore(counter, textarea.nextSibling);
    
    textarea.addEventListener('input', function() {
        const length = this.value.length;
        const maxLength = 1000;
        
        counter.textContent = `${length}/${maxLength} caracteres`;
        counter.style.opacity = length > 0 ? '1' : '0';
        
        if (length > maxLength * 0.9) {
            counter.style.color = '#ef4444';
        } else if (length > maxLength * 0.7) {
            counter.style.color = '#f59e0b';
        } else {
            counter.style.color = '#64748b';
        }
    });
}

// ========== INTERACCIONES DE SERVICIOS ==========
function setupServiceInteractions() {
    const servicios = document.querySelectorAll('.servicio');
    
    servicios.forEach((servicio, index) => {
        // Animación de entrada
        servicio.style.opacity = '0';
        servicio.style.transform = 'translateY(50px)';
        servicio.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            servicio.style.opacity = '1';
            servicio.style.transform = 'translateY(0)';
        }, index * 200);
        
        // Efectos hover mejorados
        servicio.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0,0,0,0.15)';
            
            const icono = this.querySelector('.icono');
            icono.style.transform = 'scale(1.2) rotate(10deg)';
            icono.style.transition = 'transform 0.3s ease';
        });
        
        servicio.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)';
            
            const icono = this.querySelector('.icono');
            icono.style.transform = 'scale(1) rotate(0deg)';
        });
        
        // Click para más información
        servicio.addEventListener('click', function() {
            const titulo = this.querySelector('h3').textContent;
            const descripcion = this.querySelector('p').textContent;
            
            showServiceModal(titulo, descripcion);
        });
    });
}

// Modal para servicios
function showServiceModal(titulo, descripcion) {
    // Crear modal
    const modal = document.createElement('div');
    modal.className = 'service-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 10000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.style.cssText = `
        background: white;
        padding: 2rem;
        border-radius: 15px;
        max-width: 500px;
        width: 90%;
        transform: scale(0.7);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <h3 style="color: #0ea5e9; margin-bottom: 1rem; font-size: 1.5rem;">${titulo}</h3>
        <p style="margin-bottom: 1.5rem; line-height: 1.6;">${descripcion}</p>
        <p style="margin-bottom: 1.5rem; color: #64748b;">
            ¿Interesado en este servicio? Contáctanos para obtener más información y una cotización personalizada.
        </p>
        <div style="display: flex; gap: 1rem; justify-content: flex-end;">
            <button onclick="closeServiceModal()" style="
                padding: 0.75rem 1.5rem;
                background: #e2e8f0;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            ">Cerrar</button>
            <button onclick="scrollToContactFromModal()" style="
                padding: 0.75rem 1.5rem;
                background: #0ea5e9;
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 600;
            ">Contactar</button>
        </div>
    `;
    
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
    
    // Animaciones de entrada
    setTimeout(() => {
        modal.style.opacity = '1';
        modalContent.style.transform = 'scale(1)';
    }, 10);
    
    // Cerrar con clic fuera
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeServiceModal();
        }
    });
}

// Cerrar modal
function closeServiceModal() {
    const modal = document.querySelector('.service-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.querySelector('div').style.transform = 'scale(0.7)';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// Scroll al contacto desde modal
function scrollToContactFromModal() {
    closeServiceModal();
    setTimeout(() => {
        const contactSection = document.getElementById('contact');
        smoothScrollTo(contactSection);
    }, 300);
}

// ========== EFECTOS DEL HEADER ==========
function setupHeaderEffects() {
    const header = document.querySelector('header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', function() {
        const currentScrollY = window.scrollY;
        
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            // Scrolling down
            header.style.transform = 'translateY(-100%)';
            header.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
            // Scrolling up
            header.style.transform = 'translateY(0)';
            header.style.boxShadow = currentScrollY > 50 ? '0 2px 20px rgba(0,0,0,0.15)' : '0 2px 6px rgba(0,0,0,0.1)';
        }
        
        lastScrollY = currentScrollY;
    });
    
    // Efecto parallax sutil en el hero
    const hero = document.querySelector('.hero');
    const heroContent = document.querySelector('.hero-contenido');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        const parallax = scrolled * 0.5;
        
        if (hero && scrolled < hero.offsetHeight) {
            hero.style.transform = `translateY(${parallax}px)`;
        }
    });
}

// ========== ANIMACIONES DE SCROLL ==========
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observar elementos
    const animatedElements = document.querySelectorAll('#services h2, #mision-vision .mision, #mision-vision .vision, #contact h2');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // CSS para animación
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ========== ENLACES SOCIALES ==========
function setupSocialLinks() {
    const socialLinks = document.querySelectorAll('footer .redes a');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const platform = this.textContent.toLowerCase();
            const messages = {
                'facebook': '¡Síguenos en Facebook para las últimas novedades tecnológicas!',
                'twitter': '¡Síguenos en Twitter para actualizaciones en tiempo real!',
                'instagram': '¡Síguenos en Instagram para contenido visual de nuestros proyectos!',
                'linkedin': '¡Conéctate con nosotros en LinkedIn para oportunidades profesionales!'
            };
            
            showNotification(messages[platform] || 'Redirigiendo a redes sociales...', 'info');
            
            // En producción, aquí irían las URLs reales
            setTimeout(() => {
                // window.open(this.href, '_blank');
            }, 1000);
        });
        
        // Efecto hover mejorado
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.1)';
            this.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.textShadow = 'none';
        });
    });
}

// ========== SISTEMA DE NOTIFICACIONES ==========
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationBackground(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 350px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    `;
    
    notification.innerHTML = `
        <span>${getNotificationIcon(type)}</span>
        <span>${message}</span>
        <button onclick="closeNotification(this)" style="
            background: none;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            margin-left: auto;
            opacity: 0.8;
        ">×</button>
    `;
    
    document.body.appendChild(notification);
    
    // Animación de entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-cerrar
    setTimeout(() => {
        if (notification.parentNode) {
            closeNotificationElement(notification);
        }
    }, 5000);
}

function getNotificationBackground(type) {
    const backgrounds = {
        success: 'linear-gradient(135deg, #10b981, #059669)',
        error: 'linear-gradient(135deg, #ef4444, #dc2626)',
        warning: 'linear-gradient(135deg, #f59e0b, #d97706)',
        info: 'linear-gradient(135deg, #0ea5e9, #0284c7)'
    };
    return backgrounds[type] || backgrounds.info;
}

function getNotificationIcon(type) {
    const icons = {
        success: '✅',
        error: '❌',
        warning: '⚠️',
        info: 'ℹ️'
    };
    return icons[type] || icons.info;
}

function closeNotification(button) {
    const notification = button.parentNode;
    closeNotificationElement(notification);
}

function closeNotificationElement(notification) {
    notification.style.transform = 'translateX(400px)';
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 300);
}

// ========== EFECTO DE CELEBRACIÓN ==========
function createCelebrationEffect() {
    const colors = ['#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            border-radius: 50%;
            pointer-events: none;
            z-index: 10000;
            top: 50%;
            left: 50%;
            animation: celebrate ${2 + Math.random() * 2}s ease-out forwards;
        `;
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            particle.remove();
        }, 4000);
    }
}

// ========== ESTILOS CSS ADICIONALES ==========
function addSpinnerStyles() {
    if (!document.getElementById('spinner-styles')) {
        const style = document.createElement('style');
        style.id = 'spinner-styles';
        style.textContent = `
            .spinner {
                width: 16px;
                height: 16px;
                border: 2px solid #1e293b;
                border-top: 2px solid transparent;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
                20%, 40%, 60%, 80% { transform: translateX(10px); }
            }
            
            @keyframes celebrate {
                0% {
                    transform: translate(-50%, -50%) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translate(
                        calc(-50% + ${Math.random() * 400 - 200}px),
                        calc(-50% + ${Math.random() * 400 - 200}px)
                    ) rotate(720deg);
                    opacity: 0;
                }
            }
            
            .error {
                animation: shake 0.5s ease-in-out;
            }
            
            .success {
                position: relative;
            }
            
            .success::after {
                content: '✓';
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                color: #10b981;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }
}

// ========== UTILIDADES ADICIONALES ==========

// Función para detectar dispositivo móvil
function isMobileDevice() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Función para log mejorado
function log(message, type = 'info') {
    const styles = {
        info: 'color: #0ea5e9; font-weight: bold;',
        success: 'color: #10b981; font-weight: bold;',
        error: 'color: #ef4444; font-weight: bold;',
        warning: 'color: #f59e0b; font-weight: bold;'
    };
    
    console.log(`%c[Innovatech] ${message}`, styles[type] || styles.info);
}

// Función de debounce para optimizar eventos
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

// ========== EVENTOS GLOBALES ==========

// Manejar errores globales
window.addEventListener('error', function(e) {
    log(`Error detectado: ${e.message}`, 'error');
});

// Optimización para rendimiento
window.addEventListener('beforeunload', function() {
    log('Limpiando recursos...', 'info');
});

// Mensaje de bienvenida en la consola
console.log(`
%c
╔══════════════════════════════════════════════════════════════╗
║                    UltraNano Soluciones                      ║
║              🚀 JavaScript Avanzado Cargado 🚀              ║
╠══════════════════════════════════════════════════════════════╣
║  ✅ Validación de formularios en tiempo real                ║
║  ✅ Animaciones y efectos visuales                          ║
║  ✅ Navegación suave mejorada                               ║
║  ✅ Sistema de notificaciones                               ║
║  ✅ Interacciones de servicios                              ║
║  ✅ Efectos de scroll y parallax                            ║
║  ✅ Optimización para móviles                               ║
╚══════════════════════════════════════════════════════════════╝
`, 
'color: #0ea5e9; font-weight: bold; font-family: monospace;'
);

// ========== FUNCIONES ADICIONALES ESPECÍFICAS ==========

// Función para resaltar secciones al hacer scroll
function setupSectionHighlight() {
    const sections = document.querySelectorAll('section, aside');
    const navLinks = document.querySelectorAll('nav ul li a');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                        link.style.color = '#0ea5e9';
                        link.style.fontWeight = '700';
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    sections.forEach(section => observer.observe(section));
}

// Función para mejorar la accesibilidad
function enhanceAccessibility() {
    // Añadir roles ARIA donde sea necesario
    const form = document.querySelector('#contact form');
    if (form) {
        form.setAttribute('role', 'form');
        form.setAttribute('aria-label', 'Formulario de contacto');
    }
    
    // Mejorar navegación con teclado
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #0ea5e9';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // Navegación con teclas
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeServiceModal();
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                closeNotificationElement(notification);
            });
        }
    });
}

// Función para estadísticas de interacción
function trackUserInteractions() {
    const stats = {
        formSubmissions: 0,
        serviceClicks: 0,
        navigationClicks: 0,
        socialClicks: 0
    };
    
    // Track form submissions
    document.addEventListener('submit', function() {
        stats.formSubmissions++;
        log(`Formulario enviado. Total: ${stats.formSubmissions}`, 'success');
    });
    
    // Track service clicks
    document.querySelectorAll('.servicio').forEach(servicio => {
        servicio.addEventListener('click', function() {
            stats.serviceClicks++;
            log(`Servicio clickeado. Total: ${stats.serviceClicks}`, 'info');
        });
    });
    
    // Track navigation clicks
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function() {
            stats.navigationClicks++;
            log(`Navegación utilizada. Total: ${stats.navigationClicks}`, 'info');
        });
    });
    
    // Track social clicks
    document.querySelectorAll('footer .redes a').forEach(link => {
        link.addEventListener('click', function() {
            stats.socialClicks++;
            log(`Red social clickeada. Total: ${stats.socialClicks}`, 'info');
        });
    });
    
    // Mostrar estadísticas en consola cada 30 segundos
    setInterval(() => {
        if (Object.values(stats).some(value => value > 0)) {
            console.table(stats);
        }
    }, 30000);
}

// Función para optimización de imágenes lazy loading
function setupLazyLoading() {
    const heroSection = document.querySelector('.hero');
    
    if (heroSection && 'IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                }
            });
        });
        
        imageObserver.observe(heroSection);
    }
}

// Función para modo oscuro (bonus)
function setupDarkModeToggle() {
    // Crear botón de modo oscuro
    const darkModeBtn = document.createElement('button');
    darkModeBtn.innerHTML = '🌙';
    darkModeBtn.title = 'Alternar modo oscuro';
    darkModeBtn.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: none;
        background: #0ea5e9;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: all 0.3s ease;
    `;
    
    darkModeBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
    });
    
    darkModeBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
    });
    
    darkModeBtn.addEventListener('click', toggleDarkMode);
    
    document.body.appendChild(darkModeBtn);
    
    // Verificar preferencia guardada
    const savedTheme = localStorage.getItem('innovatech-theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeBtn.innerHTML = '☀️';
    }
}

// Función para alternar modo oscuro
function toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    const darkModeBtn = document.querySelector('button[title="Alternar modo oscuro"]');
    
    darkModeBtn.innerHTML = isDark ? '☀️' : '🌙';
    localStorage.setItem('innovatech-theme', isDark ? 'dark' : 'light');
    
    // Agregar estilos de modo oscuro si no existen
    if (!document.getElementById('dark-mode-styles')) {
        addDarkModeStyles();
    }
    
    showNotification(
        isDark ? 'Modo oscuro activado' : 'Modo claro activado',
        'info'
    );
}

// Función para agregar estilos de modo oscuro
function addDarkModeStyles() {
    const darkStyles = document.createElement('style');
    darkStyles.id = 'dark-mode-styles';
    darkStyles.textContent = `
        .dark-mode {
            background-color: #0f172a !important;
            color: #e2e8f0 !important;
        }
        
        .dark-mode header {
            background: #1e293b !important;
            color: #e2e8f0 !important;
        }
        
        .dark-mode .logo {
            color: #0ea5e9 !important;
        }
        
        .dark-mode nav ul li a {
            color: #e2e8f0 !important;
        }
        
        .dark-mode nav ul li a:hover {
            color: #0ea5e9 !important;
        }
        
        .dark-mode .servicio {
            background: #1e293b !important;
            color: #e2e8f0 !important;
        }
        
        .dark-mode #mision-vision {
            background-color: #1e293b !important;
        }
        
        .dark-mode #contact form {
            background: #1e293b !important;
        }
        
        .dark-mode input,
        .dark-mode textarea {
            background: #334155 !important;
            border-color: #475569 !important;
            color: #e2e8f0 !important;
        }
        
        .dark-mode input:focus,
        .dark-mode textarea:focus {
            border-color: #0ea5e9 !important;
            background: #475569 !important;
        }
        
        .dark-mode label {
            color: #e2e8f0 !important;
        }
    `;
    document.head.appendChild(darkStyles);
}

// Función para detección de velocidad de conexión
function checkConnectionSpeed() {
    if ('connection' in navigator) {
        const connection = navigator.connection;
        const speed = connection.effectiveType;
        
        log(`Velocidad de conexión detectada: ${speed}`, 'info');
        
        // Optimizar según la velocidad
        if (speed === 'slow-2g' || speed === '2g') {
            // Reducir animaciones para conexiones lentas
            document.querySelectorAll('*').forEach(element => {
                element.style.animationDuration = '0.1s';
                element.style.transitionDuration = '0.1s';
            });
            
            showNotification('Optimizando para conexión lenta...', 'warning');
        }
    }
}

// Función para manejo de errores del formulario con reintento
function setupFormRetry() {
    let retryCount = 0;
    const maxRetries = 3;
    
    const originalSubmit = submitForm;
    
    window.submitFormWithRetry = async function(form) {
        try {
            await originalSubmit(form);
            retryCount = 0; // Reset en caso de éxito
        } catch (error) {
            retryCount++;
            
            if (retryCount < maxRetries) {
                showNotification(
                    `Error en el envío. Reintentando... (${retryCount}/${maxRetries})`,
                    'warning'
                );
                
                setTimeout(() => {
                    window.submitFormWithRetry(form);
                }, 2000 * retryCount); // Delay incremental
            } else {
                showNotification(
                    'No se pudo enviar el mensaje después de varios intentos. Por favor, inténtalo más tarde.',
                    'error'
                );
                retryCount = 0;
            }
        }
    };
}

// Función para analytics básicos
function setupBasicAnalytics() {
    const analytics = {
        pageLoadTime: Date.now(),
        interactions: [],
        timeOnPage: 0
    };
    
    // Registrar tiempo en la página
    setInterval(() => {
        analytics.timeOnPage += 1;
    }, 1000);
    
    // Registrar interacciones
    document.addEventListener('click', function(e) {
        analytics.interactions.push({
            element: e.target.tagName.toLowerCase(),
            timestamp: Date.now(),
            coordinates: { x: e.clientX, y: e.clientY }
        });
    });
    
    // Mostrar estadísticas al salir
    window.addEventListener('beforeunload', function() {
        log('Estadísticas de la sesión:', 'info');
        console.table({
            'Tiempo en página': `${analytics.timeOnPage} segundos`,
            'Total interacciones': analytics.interactions.length,
            'Tiempo de carga': `${Date.now() - analytics.pageLoadTime}ms`
        });
    });
}

// Función para mejoras de rendimiento
function optimizePerformance() {
    // Precargar enlaces importantes
    const importantLinks = document.querySelectorAll('a[href^="#"]');
    importantLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                // Precarga la sección
                target.style.willChange = 'transform';
                setTimeout(() => {
                    target.style.willChange = 'auto';
                }, 1000);
            }
        });
    });
    
    // Optimizar animaciones
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducedMotion.matches) {
        document.documentElement.style.setProperty('--animation-duration', '0.01s');
        log('Animaciones reducidas por preferencia del usuario', 'info');
    }
}

// ========== INICIALIZACIÓN COMPLETA ==========
function initializeAdvancedFeatures() {
    setupSectionHighlight();
    enhanceAccessibility();
    trackUserInteractions();
    setupLazyLoading();
    setupDarkModeToggle();
    checkConnectionSpeed();
    setupFormRetry();
    setupBasicAnalytics();
    optimizePerformance();
    
    log('Características avanzadas inicializadas', 'success');
}

// ========== AUTO-EJECUCIÓN AL CARGAR ==========
document.addEventListener('DOMContentLoaded', function() {
    // Delay para asegurar que todo esté cargado
    setTimeout(initializeAdvancedFeatures, 500);
});

// ========== FUNCIONES GLOBALES EXPUESTAS ==========
window.InnovatechSolutions = {
    showNotification,
    closeServiceModal,
    scrollToContactFromModal,
    closeNotification,
    validateField,
    log,
    version: '1.0.0',
    author: 'Innovatech Solutions Dev Team',
    lastUpdate: '2025'
};

log('🎉 Innovatech Solutions JavaScript completamente inicializado!', 'success');