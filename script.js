// Newsletter form submission handling
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('newsletter-form');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const department = formData.get('department');

        // Basic validation
        if (!name || !email) {
            showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showMessage('Por favor, insira um endereço de email válido.', 'error');
            return;
        }

        // Simulate form submission (you'll replace this with actual integration)
        submitNewsletter(name, email, department);
    });

    function submitNewsletter(name, email, department) {
        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Inscrevendo...';
        submitButton.disabled = true;

        // Simulate API call (replace this with actual service integration)
        setTimeout(() => {
            // For now, we'll just store in localStorage and show success
            // In a real implementation, you'd send this to your email service
            
            const subscription = {
                name: name,
                email: email,
                department: department,
                timestamp: new Date().toISOString()
            };
            
            // Store subscription locally (for demonstration)
            let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
            
            // Check if email already exists
            if (subscriptions.find(sub => sub.email === email)) {
                showMessage('Este email já está inscrito em nossa newsletter.', 'error');
            } else {
                subscriptions.push(subscription);
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
                
                showMessage(`Obrigado, ${name}! Você foi inscrito com sucesso em nossa newsletter.`, 'success');
                form.reset();
            }
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.display = 'block';
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
});

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-links a, .cta-button');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 70; // Account for fixed navbar
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
});

// Add scroll effect to navbar
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.background = '#fff';
        navbar.style.backdropFilter = 'none';
    }
});

// Function to get all newsletter subscriptions (for admin purposes)
function getSubscriptions() {
    const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
    console.log('Newsletter Subscriptions:', subscriptions);
    return subscriptions;
}

// Function to export subscriptions as CSV (for admin purposes)
function exportSubscriptionsCSV() {
    const subscriptions = getSubscriptions();
    if (subscriptions.length === 0) {
        alert('Nenhuma inscrição para exportar.');
        return;
    }

    let csv = 'Nome,Email,Setor,Data de Inscrição\n';
    subscriptions.forEach(sub => {
        const date = new Date(sub.timestamp).toLocaleDateString('pt-BR');
        csv += `"${sub.name}","${sub.email}","${sub.department || 'Não especificado'}","${date}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inscricoes_newsletter.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Make functions available globally for console access
window.getSubscriptions = getSubscriptions;
window.exportSubscriptionsCSV = exportSubscriptionsCSV;
