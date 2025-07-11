# Site da Campanha Eleitoral AMAPAR 2025

Um site simples e moderno para a campanha eleitoral com funcionalidade de inscrição em newsletter. Construído com HTML, CSS e JavaScript para fácil implantação e manutenção.

## Recursos

- **Design Responsivo**: Funciona perfeitamente em desktop, tablet e dispositivos móveis
- **Inscrição em Newsletter**: Coleta endereços de email com validação de formulário
- **Seção de Notícias**: Exibe as últimas atualizações e comunicados
- **Interface Moderna**: Design limpo e profissional com animações suaves
- **Carregamento Rápido**: Sem frameworks pesados, apenas código limpo

## Início Rápido

1. Abra `index.html` no seu navegador para visualizar o site localmente
2. Não é necessário processo de build - está pronto para implantar!

## Opções de Hospedagem

### Serviços de Hospedagem Gratuitos

**GitHub Pages** (Recomendado para iniciantes):
1. Crie um novo repositório no GitHub
2. Faça upload de todos os arquivos para o repositório
3. Vá em Configurações > Pages
4. Selecione "Deploy from a branch" e escolha "main"
5. Seu site estará disponível em `https://seuusuario.github.io/nome-repositorio`

**Netlify**:
1. Drag and drop the project folder to [netlify.com/drop](https://netlify.com/drop)
2. Get an instant live URL

**Vercel**:
1. Sign up at [vercel.com](https://vercel.com)
2. Import your GitHub repository or drag and drop files

## Email Integration

Currently, the newsletter form stores subscriptions in the browser's localStorage for demonstration. To collect real email subscriptions, you can integrate with:

### Free Email Services (Recommended)
- **Mailchimp** (Free up to 500 contacts)
- **ConvertKit** (Free tier available)
- **Brevo** (formerly Sendinblue)

### Integration Steps
1. Sign up for an email service
2. Get your API key or embed code
3. Replace the form submission logic in `script.js`
4. Follow the service's documentation for form integration

## Customization

### Adding News Articles
Edit the news section in `index.html`:
```html
<article class="news-card">
    <div class="news-date">Your Date</div>
    <h3>Your Title</h3>
    <p>Your content...</p>
    <a href="#" class="read-more">Read More</a>
</article>
```

### Changing Colors and Fonts
Modify the CSS variables in `styles.css` or update the color values throughout the stylesheet.

### Adding More Sections
Follow the existing HTML structure and add corresponding CSS styles for consistency.

## File Structure

```
campanha/
├── index.html          # Main website content
├── styles.css          # All styling and responsive design
├── script.js           # Form handling and interactions
├── README.md           # This file
└── .github/
    └── copilot-instructions.md
```

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Internet Explorer 11+ (with minor limitations)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development Tips

1. **Testing**: Open `index.html` directly in your browser
2. **Form Testing**: Use browser developer tools to test form submissions
3. **Responsive Testing**: Use browser dev tools to test different screen sizes
4. **Email Export**: Type `exportSubscriptionsCSV()` in browser console to download subscriber data

## Next Steps

1. **Add Content**: Update the news section with real event information
2. **Customize Design**: Modify colors, fonts, and layout to match your brand
3. **Email Integration**: Connect with a real email service for newsletter functionality
4. **Domain**: Consider purchasing a custom domain for a professional URL
5. **Analytics**: Add Google Analytics to track visitor behavior

## Need Help?

- Check browser console for any JavaScript errors
- Test forms in different browsers
- Use browser developer tools to debug styling issues
- Refer to the email service documentation for integration help

## License

This project is open source and available under the [MIT License](LICENSE).
