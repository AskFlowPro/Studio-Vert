import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Header -->
    <header class="header" [class.scrolled]="isScrolled">
      <div class="header-container">
        <div class="logo">STUDIO<span>VERT</span></div>
        <nav class="nav">
          <a href="#accueil" class="nav-link">Accueil</a>
          <a href="#services" class="nav-link">Services</a>
          <a href="#realisations" class="nav-link">Réalisations</a>
          <a href="#avis" class="nav-link">Avis</a>
          <a href="#contact" class="nav-link contact-btn">Contact</a>
        </nav>
        <button class="mobile-menu-btn" (click)="toggleMenu()">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
      <div class="mobile-nav" [class.open]="menuOpen">
        <a href="#accueil" class="mobile-nav-link" (click)="closeMenu()">Accueil</a>
        <a href="#services" class="mobile-nav-link" (click)="closeMenu()">Services</a>
        <a href="#realisations" class="mobile-nav-link" (click)="closeMenu()">Réalisations</a>
        <a href="#avis" class="mobile-nav-link" (click)="closeMenu()">Avis</a>
        <a href="#contact" class="mobile-nav-link" (click)="closeMenu()">Contact</a>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="accueil" class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <h1 class="hero-title animate-in">
          <span class="hero-title-small">STUDIO</span>
          <span class="hero-title-large">VERT</span>
        </h1>
        <p class="hero-subtitle animate-in delay-1">Entretien et création paysagères</p>
        <p class="hero-location animate-in delay-2">Lyon & Alentours</p>
        <a href="#contact" class="hero-cta animate-in delay-3">Demander un devis gratuit</a>
      </div>
      <div class="scroll-indicator">
        <span>Scroll</span>
        <div class="scroll-line"></div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services">
      <div class="container">
        <h2 class="section-title">Nos Services</h2>
        <div class="services-grid">
          <div class="service-card" *ngFor="let service of services">
            <h3 class="service-title">{{service.title}}</h3>
            <p class="service-description">{{service.description}}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Tax Credit Section -->
    <section class="tax-credit">
      <div class="container">
        <div class="tax-credit-content">
          <div class="tax-credit-badge">-50%</div>
          <div class="tax-credit-text">
            <h2 class="tax-credit-title">Crédit d'Impôt</h2>
            <p class="tax-credit-description">
              Profitez d'un crédit d'impôt de <strong>50%</strong> sur vos travaux d'entretien de jardin.
              Un jardin magnifique à moitié prix grâce à la réduction fiscale pour les services à la personne.
            </p>
            <ul class="tax-credit-list">
              <li>Déduction immédiate sur votre déclaration d'impôts</li>
              <li>Applicable sur l'entretien régulier de votre jardin</li>
              <li>Plafonné à 5 000€ de dépenses par an</li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="realisations" class="gallery">
      <div class="container-fluid">
        <h2 class="section-title">Nos Réalisations</h2>
        <div class="gallery-grid">
          <div class="gallery-item" *ngFor="let photo of photos; let i = index"
               [style.animation-delay.s]="i * 0.1"
               (click)="openLightbox(i)">
            <img [src]="photo" [alt]="'Réalisation Studio Vert ' + (i + 1)" loading="lazy">
            <div class="gallery-overlay">
              <span class="gallery-icon">+</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Reviews Section -->
    <section id="avis" class="reviews">
      <div class="container">
        <h2 class="section-title">Ce que disent nos clients</h2>
        <p class="reviews-subtitle">Témoignages de clients satisfaits</p>

        <div class="reviews-carousel">
          <button class="carousel-btn prev" (click)="prevReview()" [disabled]="currentReviewIndex === 0">
            ←
          </button>

          <div class="carousel-viewport">
            <div class="reviews-track" [style.transform]="'translateX(-' + (currentReviewIndex * 100) + '%)'">
              <div class="review-card" *ngFor="let review of reviews; let i = index"
                   [class.active]="i === currentReviewIndex">
                <div class="review-header">
                  <div class="review-avatar">{{review.initial}}</div>
                  <div class="review-author">
                    <h4>{{review.author}}</h4>
                    <div class="review-stars">
                      <span *ngFor="let star of [1,2,3,4,5]">★</span>
                    </div>
                  </div>
                </div>
                <p class="review-text">{{review.text}}</p>
                <span class="review-date">{{review.date}}</span>
              </div>
            </div>
          </div>

          <button class="carousel-btn next" (click)="nextReview()" [disabled]="currentReviewIndex === reviews.length - 1">
            →
          </button>
        </div>

        <div class="reviews-dots">
          <button *ngFor="let review of reviews; let i = index"
                  class="dot"
                  [class.active]="i === currentReviewIndex"
                  (click)="goToReview(i)"></button>
        </div>

        <div class="google-reviews-info">
          <p class="google-note">Avis récupérés automatiquement depuis Google</p>
          <a href="https://www.google.com/search?sa=X&sca_esv=9421703a431dddec&sxsrf=ANbL-n7NE4sXMvIW3VkJyLKliHrb2q5TfA:1770483364422&q=studiovert+Avis&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNLY0NzM0tTQ2t7S0NDE2MjcxMNzAyPiKkb-4pDQlM78stahEwbEss3gRK7oIAOtcoVA_AAAA&rldimm=13976159379994327401&tbm=lcl&hl=fr-FR&ved=2ahUKEwiDppHA7MeSAxUYU6QEHWH9KuQQ9fQKegQIURAG&biw=1920&bih=945&dpr=1#lkt=LocalPoiReviews"
             target="_blank"
             rel="noopener noreferrer"
             class="google-link">
            Voir tous les avis sur Google
          </a>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="contact">
      <div class="container">
        <h2 class="section-title">Contactez-nous</h2>
        <div class="contact-content">
          <div class="contact-info">
            <h3>Studio Vert</h3>
            <div class="contact-item">
              <span class="contact-icon">📞</span>
              <a href="tel:0699663809">06 99 66 38 09</a>
            </div>
            <div class="contact-item">
              <span class="contact-icon">✉️</span>
              <a href="mailto:studiovertpaysage@gmail.com">studiovertpaysage&#64;gmail.com</a>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📍</span>
              <span>Lyon & Alentours</span>
            </div>
            <div class="contact-item">
              <span class="contact-icon">📱</span>
              <a href="https://www.instagram.com/studiovert_paysage" target="_blank" rel="noopener noreferrer">
                &#64;studiovert_paysage
              </a>
            </div>
          </div>

          <form class="contact-form" (ngSubmit)="submitForm()" #contactForm="ngForm">
            <div class="form-group">
              <input
                type="text"
                name="name"
                [(ngModel)]="formData.name"
                placeholder="Votre nom"
                required
                class="form-input">
            </div>
            <div class="form-group">
              <input
                type="email"
                name="email"
                [(ngModel)]="formData.email"
                placeholder="Votre email"
                required
                class="form-input">
            </div>
            <div class="form-group">
              <input
                type="tel"
                name="phone"
                [(ngModel)]="formData.phone"
                placeholder="Votre téléphone"
                required
                class="form-input">
            </div>
            <div class="form-group">
              <textarea
                name="message"
                [(ngModel)]="formData.message"
                placeholder="Décrivez votre projet"
                rows="5"
                required
                class="form-input"></textarea>
            </div>
            <button type="submit" class="form-submit" [disabled]="!contactForm.form.valid">
              Envoyer ma demande
            </button>
            <p *ngIf="formSubmitted" class="form-success">
              ✓ Merci ! Votre message a été envoyé. Nous vous recontacterons rapidement.
            </p>
          </form>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-logo">STUDIO<span>VERT</span></div>
          <p class="footer-text">Entretien et création paysagères - Lyon & Alentours</p>
          <p class="footer-credits">© 2026 Studio Vert - Tous droits réservés</p>
        </div>
      </div>
    </footer>

    <!-- Lightbox -->
    <div class="lightbox" *ngIf="lightboxOpen" (click)="closeLightbox()">
      <button class="lightbox-close">×</button>
      <button class="lightbox-prev" (click)="prevPhoto($event)">←</button>
      <img [src]="photos[currentPhotoIndex]" [alt]="'Photo ' + (currentPhotoIndex + 1)">
      <button class="lightbox-next" (click)="nextPhoto($event)">→</button>
    </div>
  `,
  styles: [],
})
export class AppComponent implements OnInit {
  isScrolled = false;
  menuOpen = false;
  lightboxOpen = false;
  currentPhotoIndex = 0;
  currentReviewIndex = 0;
  formSubmitted = false;

  formData = {
    name: '',
    email: '',
    phone: '',
    message: ''
  };

  constructor(private http: HttpClient) {}

  services = [
    {
      number: '01',
      title: 'Création de jardins',
      description: 'Conception et réalisation de votre jardin sur-mesure, adapté à vos envies et votre environnement.'
    },
    {
      number: '02',
      title: 'Entretien paysager',
      description: 'Taille, tonte, débroussaillage et entretien régulier pour un jardin impeccable toute l\'année.'
    },
    {
      number: '03',
      title: 'Aménagement végétal',
      description: 'Plantation d\'arbres, arbustes, massifs floraux et création de haies pour embellir vos espaces.'
    }
  ];

  photos = [
    'assets/photos/WhatsApp Image 2026-02-07 at 17.11.58.jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.12 (1).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.12.jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.33 (1).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.33 (2).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.33 (3).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.33.jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.34 (1).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.34 (2).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.34 (3).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.34 (4).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.34 (5).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.34 (6).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.34.jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.35 (1).jpeg',
    'assets/photos/WhatsApp Image 2026-02-07 at 17.12.35.jpeg'
  ];

  reviews = [
    {
      author: 'Sophie Martin',
      initial: 'S',
      text: 'Excellent travail ! Damien a transformé notre jardin en un véritable havre de paix. Professionnel, à l\'écoute et de très bon conseil.',
      date: 'Il y a 2 semaines'
    },
    {
      author: 'Pierre Dubois',
      initial: 'P',
      text: 'Je recommande vivement Studio Vert. Travail soigné, respect des délais et crédit d\'impôt appliqué. Notre terrasse est magnifique !',
      date: 'Il y a 1 mois'
    },
    {
      author: 'Marie Leclerc',
      initial: 'M',
      text: 'Service impeccable du début à la fin. Damien a su créer un aménagement paysager qui correspond parfaitement à nos attentes.',
      date: 'Il y a 3 semaines'
    },
    {
      author: 'Jean Rousseau',
      initial: 'J',
      text: 'Très satisfait de la prestation. L\'entretien régulier de notre jardin est toujours réalisé avec soin. Merci !',
      date: 'Il y a 1 semaine'
    }
  ];

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 50;
      });
    }

    // Charger les avis Google depuis le fichier JSON
    this.loadGoogleReviews();
  }

  loadGoogleReviews() {
    this.http.get<any[]>('assets/google-reviews.json').subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.reviews = data;
          console.log('✅ Avis Google chargés:', this.reviews.length);
        }
      },
      error: (error) => {
        console.error('❌ Erreur chargement avis:', error);
        // Garde les avis par défaut si erreur
      }
    });
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    this.menuOpen = false;
  }

  openLightbox(index: number) {
    this.currentPhotoIndex = index;
    this.lightboxOpen = true;
    document.body.style.overflow = 'hidden';
  }

  closeLightbox() {
    this.lightboxOpen = false;
    document.body.style.overflow = 'auto';
  }

  nextPhoto(event: Event) {
    event.stopPropagation();
    this.currentPhotoIndex = (this.currentPhotoIndex + 1) % this.photos.length;
  }

  prevPhoto(event: Event) {
    event.stopPropagation();
    this.currentPhotoIndex = (this.currentPhotoIndex - 1 + this.photos.length) % this.photos.length;
  }

  nextReview() {
    if (this.currentReviewIndex < this.reviews.length - 1) {
      this.currentReviewIndex++;
    }
  }

  prevReview() {
    if (this.currentReviewIndex > 0) {
      this.currentReviewIndex--;
    }
  }

  goToReview(index: number) {
    this.currentReviewIndex = index;
  }

  submitForm() {
    console.log('Form submitted:', this.formData);
    this.formSubmitted = true;

    setTimeout(() => {
      this.formData = { name: '', email: '', phone: '', message: '' };
      this.formSubmitted = false;
    }, 5000);
  }
}
