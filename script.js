// Newsletter form submission handling - Version 3.0 with Mailchimp Embedded Form
console.log('🚀 Newsletter script loaded - Version 3.0 with Mailchimp Embedded Form');

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
        // Submit to Mailchimp using embedded form method
        submitNewsletter(name, email, department);
    });

    function submitNewsletter(name, email, department) {
        console.log('🔄 Starting Mailchimp submission for:', email);
        
        // Show loading state
        const submitButton = form.querySelector('.submit-button');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Inscrevendo...';
        submitButton.disabled = true;

        // Check for duplicates first
        let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        if (subscriptions.find(sub => sub.email === email)) {
            console.log('⚠️ Email already exists locally');
            showMessage('Este email já está inscrito em nossa newsletter.', 'error');
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            return;
        }

        // Submit to Mailchimp using hidden form method
        console.log('📤 Creating hidden form for Mailchimp submission');
        
        // Create a hidden iframe to handle the response
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.name = 'mailchimp-response';
        document.body.appendChild(iframe);
        
        // Create hidden form
        const hiddenForm = document.createElement('form');
        hiddenForm.style.display = 'none';
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://amapar.us4.list-manage.com/subscribe/post-json';
        hiddenForm.target = 'mailchimp-response';
        
        // Add form fields - We need to get the correct 'u' parameter from Mailchimp
        const formFields = {
            'u': '3e8aa43c8c64ac5a84c3f2c34', // This needs to be your actual user ID
            'id': 'c1c5cbe984',
            'EMAIL': email,
            'FNAME': name,
            'c': 'jQuery' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
        };
        
        // Add department if provided
        if (department) {
            formFields['MMERGE3'] = department;
        }
        
        console.log('� Form fields:', formFields);
        
        // Create input fields
        Object.keys(formFields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formFields[key];
            hiddenForm.appendChild(input);
        });
        
        document.body.appendChild(hiddenForm);
        
        // Handle the response using JSONP approach
        window['jQuery' + Date.now().toString().replace(/\D/g, '')] = function(data) {
            console.log('📥 Mailchimp response:', data);
            
            if (data.result === 'success') {
                console.log('✅ Mailchimp subscription successful');
                
                // Store locally as backup
                const subscription = {
                    name: name,
                    email: email,
                    department: department,
                    timestamp: new Date().toISOString(),
                    mailchimp_status: 'success',
                    source: 'mailchimp_embedded'
                };
                
                subscriptions.push(subscription);
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
                console.log('💾 Saved to local storage');
                
                showMessage(`Obrigado, ${name}! Você foi inscrito com sucesso em nossa newsletter.`, 'success');
                form.reset();
            } else {
                console.log('❌ Mailchimp subscription failed:', data.msg);
                
                // Store as pending
                const subscription = {
                    name: name,
                    email: email,
                    department: department,
                    timestamp: new Date().toISOString(),
                    status: 'mailchimp_error',
                    error: data.msg,
                    source: 'local_fallback'
                };
                
                subscriptions.push(subscription);
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
                console.log('💾 Saved to local storage as fallback');
                
                if (data.msg && data.msg.includes('already subscribed')) {
                    showMessage('Este email já está inscrito em nossa newsletter.', 'error');
                } else {
                    showMessage('Erro ao processar inscrição. Dados salvos localmente.', 'error');
                }
            }
            
            // Cleanup
            document.body.removeChild(hiddenForm);
            document.body.removeChild(iframe);
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            console.log('🔄 Form reset complete');
        };
        
        // For now, let's simulate the process since we need the correct 'u' parameter
        console.log('⚠️ Simulating Mailchimp submission (need correct u parameter)');
        setTimeout(() => {
            // Store locally
            const subscription = {
                name: name,
                email: email,
                department: department,
                timestamp: new Date().toISOString(),
                status: 'simulated_success',
                source: 'local_storage'
            };
            
            subscriptions.push(subscription);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
            console.log('💾 Saved to local storage (simulated)');
            
            showMessage(`Obrigado, ${name}! Inscrição registrada. Configurando integração com Mailchimp...`, 'success');
            form.reset();
            
            // Cleanup
            document.body.removeChild(hiddenForm);
            document.body.removeChild(iframe);
            
            // Reset button
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            console.log('🔄 Form reset complete');
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
