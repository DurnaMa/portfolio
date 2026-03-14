# Mahir Durna – Frontend Developer Portfolio

> Personal portfolio website showcasing my projects, skills and professional references.

🔗 **Live:** [mahir-durna.de](https://mahir-durna.de)

---

## ✨ Features

- **Responsive Design** – Fully optimized for desktop, tablet and mobile (down to 320 px)
- **Bilingual (EN / DE)** – Dynamic language switching with `translations.json` and `data-i18n` attributes
- **Testimonials Carousel** – Animated card carousel with colleague references
- **Project Showcase** – Interactive project list with live-preview frame
- **Contact Form** – Validated form with PHP mail backend
- **Smooth Animations** – Scroll indicator, ticker, hover effects and micro-interactions
- **SEO & Accessibility** – Semantic HTML, meta tags, WCAG-friendly font sizes
- **Legal Pages** – Impressum & Datenschutz (German legal requirements)

---

## 🛠 Tech Stack

| Category   | Technologies                                    |
| ---------- | ----------------------------------------------- |
| **Markup** | HTML5, Semantic Elements                        |
| **Styling**| Vanilla CSS (Custom Properties / Design Tokens) |
| **Logic**  | Vanilla JavaScript (ES6+)                       |
| **Backend**| PHP (`mail.php` – contact form handler)         |
| **Tooling**| Prettier, Git                                   |

---

## 📁 Project Structure

```
portfolio/
├── index.html              # Main entry point
├── projects.json           # Project data (name, tags, links)
├── translations.json       # i18n strings (EN & DE)
├── mail.php                # Contact-form backend
├── robots.txt
│
├── css/
│   ├── base.css            # Design tokens, resets, utilities
│   ├── fonts.css           # @font-face declarations
│   ├── overlay.css         # Mobile menu & overlay styles
│   ├── sections.css        # Hero, About, Skills sections
│   ├── sections-lower.css  # Portfolio, References, Contact, Footer
│   └── legal.css           # Impressum & Datenschutz pages
│
├── js/
│   ├── script.js           # Init, scroll logic, header behaviour
│   ├── translations.js     # i18n loader & language toggle
│   ├── carousel.js         # Testimonials carousel logic
│   ├── portfolio.js        # Project list interaction & preview
│   ├── contact.js          # Form validation & submission
│   └── render.js           # W3-include-html template renderer
│
├── templates/
│   ├── header.html         # Reusable header / navigation
│   └── footer.html         # Reusable footer
│
├── img/                    # Images & favicons
├── svg/                    # SVG icons (tech logos, arrows, etc.)
├── fonts/                  # Custom web fonts
├── asset/                  # Miscellaneous assets
├── datenschutz/            # Privacy policy page
└── impressum/              # Legal notice page
```

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser
- *(Optional)* A local web server with PHP support for the contact form (e.g. XAMPP, MAMP, or `php -S localhost:8000`)

### Run Locally

```bash
# Clone the repository
git clone https://github.com/DurnaMa/portfolio.git
cd portfolio

# Open directly in browser
open index.html          # macOS
xdg-open index.html      # Linux

# Or serve with PHP for full functionality
php -S localhost:8000
```

Then visit **http://localhost:8000** in your browser.

---

## 📬 Contact Form Setup

The contact form sends emails via `mail.php`. To configure it for your own domain:

1. Open `mail.php`
2. Set `$siteEmail` (line 15) to your email address
3. Deploy to a PHP-capable server

---

## 📸 Featured Projects

| Project              | Description                                            | Stack                          | Links                                                                                               |
| -------------------- | ------------------------------------------------------ | ------------------------------ | --------------------------------------------------------------------------------------------------- |
| **Join**             | Kanban-based project management tool                   | Angular, TypeScript, Firebase  | [GitHub](https://github.com/DurnaMa/join) · [Live](https://join.mahir-durna.de/)                    |
| **Fantasy Platform** | Jump-and-run browser game with OOP architecture        | JavaScript, HTML, CSS          | [GitHub](https://github.com/DurnaMa/2dGame) · [Live](https://2d-game.mahir-durna.de/)               |

---

## 📄 License

This project is for personal use. Feel free to use it as inspiration for your own portfolio.

---

## 📫 Contact

**Mahir Durna** – Frontend Developer

- ✉️ [contact@mahir-durna.de](mailto:contact@mahir-durna.de)
- 💼 [LinkedIn](https://linkedin.com/in/mahir-durna)
- 🐙 [GitHub](https://github.com/DurnaMa)
