// Newsletter form submission handling - Version 2.0 with Mailchimp API
console.log('🚀 Newsletter script loaded - Version 2.0 with Mailchimp API integration');

document.addEventListener('DOMContentLoaded', function() {
    console.log('📧 Newsletter form initialized');
    const form = document.getElementById('newsletter-form');
    const messageDiv = document.getElementById('form-message');

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        console.log('📝 Form submitted');
        
        // Get form data
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const department = formData.get('department');
        
        console.log('📋 Form data:', { name, email, department });

        // Basic validation
        if (!name || !email) {
            console.log('❌ Validation failed: missing required fields');
            showMessage('Por favor, preencha todos os campos obrigatórios.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            console.log('❌ Validation failed: invalid email format');
            showMessage('Por favor, insira um endereço de email válido.', 'error');
            return;
        }

        console.log('✅ Validation passed, submitting to Mailchimp...');
        // Submit to Mailchimp API
        submitNewsletter(name, email, department);
    });

    function submitNewsletter(name, email, department) {
        console.log('🔄 Starting Mailchimp submission for:', email);
        
        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Inscrevendo...';
        submitButton.disabled = true;

        // Try Mailchimp API through a CORS proxy
        const AUDIENCE_ID = 'c1c5cbe984';
        const API_KEY = '5140fa32d3b61db303e63f81d1d35dd9-us4';
        const DATACENTER = 'us4';
        
        const memberData = {
            email_address: email,
            status: 'subscribed',
            merge_fields: {
                FNAME: name,
                MMERGE3: department || 'Não especificado'
            }
        };
        
        console.log('📤 Sending to Mailchimp:', memberData);

        // Use a CORS proxy to call Mailchimp API
        const proxyUrl = 'https://api.allorigins.win/raw?url=';
        const mailchimpUrl = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`;
        const encodedUrl = encodeURIComponent(mailchimpUrl);
        
        console.log('🌐 Proxy URL:', `${proxyUrl}${encodedUrl}`);
        
        fetch(`${proxyUrl}${encodedUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${btoa(`anystring:${API_KEY}`)}`
            },
            body: JSON.stringify(memberData)
        })
        .then(response => {
            console.log('📥 Mailchimp response status:', response.status);
            console.log('📥 Mailchimp response:', response);
            
            if (response.ok) {
                return response.json();
            }
            throw new Error(`Mailchimp API error: ${response.status}`);
        })
        .then(data => {
            console.log('✅ Mailchimp success response:', data);
            
            // Success - store locally as backup
            const subscription = {
                name: name,
                email: email,
                department: department,
                timestamp: new Date().toISOString(),
                mailchimp_id: data.id || 'success',
                source: 'mailchimp_api'
            };
            
            let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
            
            // Check if email already exists locally
            if (!subscriptions.find(sub => sub.email === email)) {
                subscriptions.push(subscription);
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
                console.log('💾 Saved to local storage');
            }
            
            showMessage(`Obrigado, ${name}! Você foi inscrito com sucesso em nossa newsletter.`, 'success');
            form.reset();
        })
        .catch(error => {
            console.error('❌ Mailchimp API error:', error);
            
            // Fallback to local storage if API fails
            const subscription = {
                name: name,
                email: email,
                department: department,
                timestamp: new Date().toISOString(),
                status: 'pending_api',
                source: 'local_fallback',
                error: error.message
            };
            
            let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
            
            if (subscriptions.find(sub => sub.email === email)) {
                console.log('⚠️ Email already exists locally');
                showMessage('Este email já está inscrito em nossa newsletter.', 'error');
            } else {
                subscriptions.push(subscription);
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
                console.log('💾 Saved to local storage as fallback');
                showMessage(`Inscrição registrada localmente. Tentaremos sincronizar com Mailchimp posteriormente.`, 'success');
                form.reset();
            }
        })
        .finally(() => {
            console.log('🔄 Resetting form button');
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        });
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
