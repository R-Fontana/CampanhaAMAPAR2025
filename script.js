// Newsletter form submission handling - Version 4.2 - Improved Mailchimp Integration & No Autocomplete!
console.log('🚀 Newsletter script loaded - Version 4.2 - Improved Mailchimp Integration & No Autocomplete!');

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

        // No local duplicate checking - let Mailchimp handle it
        let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');

        // Submit to Mailchimp using hidden form method
        console.log('📤 Creating hidden form for Mailchimp submission');
        
        // Create hidden form - Change to standard POST instead of post-json for better response
        const hiddenForm = document.createElement('form');
        hiddenForm.style.display = 'none';
        hiddenForm.method = 'POST';
        hiddenForm.action = 'https://github.us4.list-manage.com/subscribe/post';
        hiddenForm.target = '_blank'; // Open in new tab to see response
        
        // Add form fields - Using correct Mailchimp parameters
        const formFields = {
            'u': 'ac3a092659fe22258c3089252', // Correct user ID from embedded form
            'id': 'c1c5cbe984',
            'EMAIL': email,
            'FNAME': name,
            'b_ac3a092659fe22258c3089252_c1c5cbe984': '' // Bot protection field
        };
        
        // Add department if provided
        if (department) {
            formFields['MMERGE3'] = department;
        }
        
        console.log('📋 Form fields:', formFields);
        
        // Create input fields
        Object.keys(formFields).forEach(key => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = formFields[key];
            hiddenForm.appendChild(input);
        });
        
        document.body.appendChild(hiddenForm);
        
        // Submit to Mailchimp
        console.log('🚀 Submitting to Mailchimp - will open in new tab');
        hiddenForm.submit();
        
        // Store locally as backup regardless of Mailchimp response
        const subscription = {
            name: name,
            email: email,
            department: department,
            timestamp: new Date().toISOString(),
            status: 'submitted_to_mailchimp',
            source: 'mailchimp_direct'
        };
        
        subscriptions.push(subscription);
        localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
        console.log('💾 Saved to local storage');
        
        // Show success message
        showMessage(`Obrigado, ${name}! Sua inscrição foi enviada para o Mailchimp. Verifique a nova aba para confirmar.`, 'success');
        form.reset();
        
        // Cleanup and reset button
        document.body.removeChild(hiddenForm);
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        console.log('🔄 Form submitted and reset complete');
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

// Function to clear all newsletter subscriptions (for testing purposes)
function clearSubscriptions() {
    localStorage.removeItem('newsletterSubscriptions');
    console.log('🗑️ Cleared all newsletter subscriptions from localStorage');
    alert('Local storage limpo! Agora você pode testar novamente as inscrições.');
}

// Make clear function available globally
window.clearSubscriptions = clearSubscriptions;
