import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <!-- Loader -->
    <div class="page-loader" [class.hidden]="!isLoading">
      <div class="loader-content">
        <div class="loader-logo">STUDIO<span>VERT</span></div>
        <div class="loader-spinner">
          <div class="spinner-leaf"></div>
        </div>
      </div>
    </div>

    <!-- Header -->
    <header class="header" [class.scrolled]="isScrolled">
      <div class="header-container">
        <a href="/" class="logo">STUDIO<span>VERT</span></a>
        <nav class="nav">
          <a href="#accueil" class="nav-link">Accueil</a>
          <a href="#realisations" class="nav-link">Projets</a>
          <a href="#services" class="nav-link">Services</a>
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
        <a href="#realisations" class="mobile-nav-link" (click)="closeMenu()">Projets</a>
        <a href="#services" class="mobile-nav-link" (click)="closeMenu()">Services</a>
        <a href="#avis" class="mobile-nav-link" (click)="closeMenu()">Avis</a>
        <a href="#contact" class="mobile-nav-link" (click)="closeMenu()">Contact</a>
      </div>
    </header>

    <!-- Hero Section -->
    <section id="accueil" class="hero">
      <div class="hero-bg"></div>

      <div class="hero-container">
        <!-- Location Card - Bottom Right -->
        <div class="hero-location-card animate-in delay-4">
          <div class="location-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
            </svg>
          </div>
          <div class="location-content">
            <div class="location-title">StudioVert</div>
            <div class="location-text">Lyon, Alentours & Savoie</div>

            <!-- Contact Icons -->
            <div class="location-contact-icons">
              <div class="location-contact-icon"
                   [class.active]="phoneVisible"
                   (click)="togglePhone($event)"
                   title="Téléphone">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <div class="contact-bubble" (click)="stopPropagation($event)">06 99 66 38 09</div>
              </div>
              <div class="location-contact-icon"
                   [class.active]="emailVisible"
                   (click)="toggleEmail($event)"
                   title="Email">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
                <div class="contact-bubble" (click)="stopPropagation($event)">studiovertpaysage&#64;gmail.com</div>
              </div>
              <a href="https://instagram.com/studiovert_paysage" target="_blank" rel="noopener noreferrer" class="location-contact-icon" title="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div class="hero-content">
          <h1 class="hero-title animate-in delay-1">
            CRÉEZ VOTRE<br>
            JARDIN DE RÊVE
          </h1>
          <p class="hero-subtitle animate-in delay-2">
            Conception et entretien de jardins de rêve avec passion, créativité et durabilité
          </p>
          <div class="hero-buttons animate-in delay-3">
            <a href="#contact" class="btn btn-primary">Commencer</a>
            <a href="#realisations" class="btn btn-secondary">Voir nos projets</a>
          </div>
        </div>

        <div class="scroll-indicator">
          <span>Scroll</span>
          <div class="scroll-line"></div>
        </div>
      </div>
    </section>

    <!-- Works Carousel Section - LeafLife Style -->
    <section id="realisations" class="works-carousel">
      <div class="works-container">
        <div class="works-header scroll-reveal">
          <h2 class="works-title">
            DÉCOUVREZ <span class="works-title-light">NOS</span><br>
            CRÉATIONS
          </h2>
          <div>
            <h3 class="works-nav-label">[ PROJETS ]</h3>
          </div>
        </div>

        <div class="works-content-wrapper scroll-reveal">
          <!-- Drag hint -->
          <div class="works-scroll-hint">
            <span>Glisser pour naviguer →</span>
          </div>

          <div class="works-carousel-shell">
            <!-- Fixed overlay - positioned absolutely over second image -->
            <div class="work-preview-controls">
              <div class="work-preview-overlay"></div>
            </div>

            <!-- Button NEXT - positioned at container edge -->
            <button class="work-next-btn" (click)="nextSlide()">NEXT</button>

            <!-- Simple Carousel with CSS Scroll Snap -->
            <div class="works-carousel-container" #carouselContainer>
              <div class="works-carousel-track">
                <!-- Loop through photos twice for infinite effect -->
                <div *ngFor="let photo of featuredPhotos; let i = index" class="work-slide" [attr.data-index]="i">
                  <div class="work-main-image">
                    <img [src]="photo.src" [alt]="photo.name">
                  </div>
                </div>
                <div *ngFor="let photo of featuredPhotos; let i = index" class="work-slide" [attr.data-index]="i + featuredPhotos.length">
                  <div class="work-main-image">
                    <img [src]="photo.src" [alt]="photo.name">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Info section - outside scrollable area -->
          <div class="work-main-info">
            <div class="work-info-location">
              <p class="work-info-label">LOCALISATION</p>
              <h3 class="work-info-value work-info-animated">{{featuredPhotos[currentWorkIndex].location}}</h3>
            </div>
            <div class="work-main-description work-info-animated">
              {{featuredPhotos[currentWorkIndex].description}}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="services-v2">
      <div class="services-container">
        <!-- Header avec label et titre -->
        <div class="services-header scroll-reveal">
          <div>
            <h3 class="services-nav-label">[ SERVICES ]</h3>
          </div>
          <h2 class="services-title">
            CRÉATION <span class="highlight-word">&</span><br>
            ENTRETIEN
          </h2>
        </div>

        <!-- Description -->
        <p class="services-description scroll-reveal">
          Du jardin de rêve à l'entretien régulier, nous transformons vos espaces extérieurs avec passion et expertise. Découvrez nos prestations sur-mesure.
        </p>

        <!-- Grille de services -->
        <div class="services-grid">
          <div class="service-card-v2 scroll-reveal-scale" [class.stagger-1]="i === 0" [class.stagger-2]="i === 1" [class.stagger-3]="i === 2" *ngFor="let service of services; let i = index">
            <div class="service-image">
              <img [src]="service.image" [alt]="service.title">
              <div class="service-content-overlay">
                <h3 class="service-title-v2">{{service.title}}</h3>
                <p class="service-description-v2">{{service.description}}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Tax Credit Section -->
    <section class="tax-credit">
      <div class="container">
        <div class="tax-credit-content scroll-reveal">
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

    <!-- Reviews Section -->
    <section id="avis" class="reviews-v2">
      <div class="reviews-v2-container">
        <!-- Header centré -->
        <div class="reviews-v2-header scroll-reveal-scale">
          <h3 class="reviews-section-title">[ AVIS ]</h3>
          <h2 class="reviews-tagline">
            CE QUE DISENT<br>
            <span class="reviews-tagline-light">NOS</span> CLIENTS
          </h2>
          <p class="reviews-intro-text">
            Découvrez les témoignages de nos clients satisfaits qui nous ont fait confiance pour transformer leurs espaces extérieurs.
          </p>
        </div>

        <!-- Carousel existant -->
        <div class="reviews-carousel scroll-reveal-scale stagger-1">
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
          <a href="https://www.google.com/search?sa=X&sca_esv=9421703a431dddec&sxsrf=ANbL-n7NE4sXMvIW3VkJyLKliHrb2q5TfA:1770483364422&q=studiovert+Avis&rflfq=1&num=20&stick=H4sIAAAAAAAAAONgkxIxNLY0NzM0tTQ2t7S0NDE2MjcxMNzAyPiKkb-4pDQlM78stahEwbEss3gRK7oIAOtcoVA_AAAA&rldimm=13976159379994327401&tbm=lcl&hl=fr-FR&ved=2ahUKEwiDppHA7MeSAxUYU6QEHWH9KuQQ9fQKegQIURAG&biw=1920&bih=945&dpr=1#lkt=LocalPoiReviews"
             target="_blank"
             rel="noopener noreferrer"
             class="google-link">
            Voir tous les avis sur Google
          </a>
        </div>
      </div>
    </section>

    <!-- Contact Section - Side by Side Layout -->
    <section id="contact" class="contact-v2">
      <div class="contact-container">
        <!-- Colonne gauche -->
        <div class="contact-left-column">
          <!-- Header avec tagline -->
          <div class="contact-intro scroll-reveal-left">
            <h2 class="contact-tagline">Parlons de <span class="contact-tagline-light">vos</span><br>envies</h2>
          </div>

          <!-- Image -->
          <div class="contact-image scroll-reveal-left stagger-1">
            <img src="assets/photos/wooden-house-grassy-field-surrounded-by-plants-flowers.jpg" alt="Studio Vert Paysage">
          </div>
        </div>

        <!-- Section Title en haut à droite -->
        <h3 class="contact-section-title scroll-reveal-right">[ CONTACT ]</h3>

        <!-- Contenu à droite -->
        <div class="contact-content scroll-reveal-right stagger-1">
          <!-- En-tête avec nom -->
          <div class="contact-header">
            <h2 class="contact-name">Bonjour, je suis <span>Damien</span></h2>
            <p class="contact-message">
              Passionné par l'art paysager, je transforme vos espaces extérieurs en véritables havres de paix.
              Partagez-moi votre vision et créons ensemble votre jardin de rêve.
            </p>
          </div>

          <!-- Formulaire -->
          <form class="contact-form-compact" (ngSubmit)="submitForm()" #contactForm="ngForm">
            <div class="form-row">
              <div class="form-field">
                <input
                  type="text"
                  name="name"
                  [(ngModel)]="formData.name"
                  placeholder="Nom"
                  required
                  class="form-input-compact">
              </div>

              <div class="form-field">
                <input
                  type="email"
                  name="email"
                  [(ngModel)]="formData.email"
                  placeholder="Email"
                  required
                  class="form-input-compact">
              </div>
            </div>

            <div class="form-field">
              <input
                type="tel"
                name="phone"
                [(ngModel)]="formData.phone"
                placeholder="Téléphone"
                required
                class="form-input-compact">
            </div>

            <div class="form-field message-field-wrapper">
              <textarea
                name="message"
                [(ngModel)]="formData.message"
                placeholder="Décrivez votre projet..."
                rows="4"
                maxlength="3000"
                required
                class="form-input-compact form-textarea-compact"></textarea>
              <div class="character-counter">
                {{formData.message.length}} / 3000
              </div>
            </div>

            <!-- Upload de photos compact -->
            <div class="form-field">
              <input
                type="file"
                id="fileInput"
                accept="image/*"
                multiple
                (change)="onFileSelect($event)"
                [disabled]="formData.attachments.length >= 3"
                class="file-input">

              <label
                for="fileInput"
                class="file-upload-compact"
                [class.disabled]="formData.attachments.length >= 3"
                [class.has-error]="fileUploadError">
                <div class="file-upload-left">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>

                  <!-- Message d'erreur si présent -->
                  <div class="file-upload-placeholder" *ngIf="fileUploadError">
                    <span class="file-upload-text error-text">{{fileUploadError}}</span>
                  </div>

                  <!-- Preview compact intégré -->
                  <div class="file-preview-compact" *ngIf="formData.attachments.length > 0 && !fileUploadError">
                    <div
                      class="file-preview-item"
                      *ngFor="let file of formData.attachments; let i = index">
                      <span class="file-preview-name">{{file.name}}</span>
                      <button
                        type="button"
                        class="file-remove-compact"
                        (click)="removeAttachment(i, $event)">×</button>
                    </div>
                  </div>

                  <!-- Placeholder par défaut -->
                  <div class="file-upload-placeholder" *ngIf="formData.attachments.length === 0 && !fileUploadError">
                    <span class="file-upload-text">Ajouter des photos (max 3)</span>
                    <span class="file-upload-info">Max 10 MB par image</span>
                  </div>
                </div>

                <div class="file-upload-add-btn">+</div>
              </label>
            </div>

            <button
              type="submit"
              class="form-submit-compact"
              [disabled]="!contactForm.form.valid || formSending"
              [class.sending]="formSending"
              [class.success]="formSubmitted">
              <span *ngIf="!formSending && !formSubmitted">Envoyer ma demande</span>
              <span *ngIf="formSending" class="btn-loader">
                <svg class="spinner" viewBox="0 0 50 50">
                  <circle class="path" cx="25" cy="25" r="20" fill="none" stroke-width="5"></circle>
                </svg>
                Envoi en cours...
              </span>
              <span *ngIf="formSubmitted" class="btn-success">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Message envoyé !
              </span>
            </button>
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
export class AppComponent implements OnInit, AfterViewInit {
  isScrolled = false;
  menuOpen = false;
  lightboxOpen = false;
  currentPhotoIndex = 0;
  currentReviewIndex = 0;
  currentWorkIndex = 0;
  formSubmitted = false;
  formSending = false;
  phoneVisible = false;
  emailVisible = false;
  isLoading = true;

  formData = {
    name: '',
    email: '',
    phone: '',
    message: '',
    attachments: [] as File[]
  };

  fileUploadError = '';

  @ViewChild('carouselContainer') carouselContainer!: ElementRef<HTMLElement>;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService
  ) {}

  services = [
    {
      number: '01',
      title: 'Création de jardins',
      description: 'Conception et réalisation de votre jardin sur-mesure, adapté à vos envies.',
      image: 'assets/photos/dessin.png'
    },
    {
      number: '02',
      title: 'Entretien paysager',
      description: 'Taille, tonte, débroussaillage et entretien régulier toute l\'année.',
      image: 'assets/photos/WhatsApp Image 2026-02-07 at 17.12.34 (1).jpeg'
    },
    {
      number: '03',
      title: 'Aménagement végétal',
      description: 'Plantation d\'arbres, arbustes et massifs floraux pour embellir vos espaces.',
      image: 'assets/photos/amenagement.jpg'
    }
  ];

  featuredPhotos = [
    {
      src: 'assets/photos/wooden-house-grassy-field-surrounded-by-plants-flowers.jpg',
      name: 'JARDIN ZEN',
      location: 'LYON, FRANCE',
      description: 'Un jardin zen apaisant parfait pour se détendre en famille ou seul dans votre maison confortable.'
    },
    {
      src: 'assets/photos/WhatsApp Image 2026-02-07 at 17.12.12 (1).jpeg',
      name: 'ESPACE MODERNE',
      location: 'VILLEURBANNE, FRANCE',
      description: 'Un espace paysager moderne alliant design contemporain et végétation luxuriante.'
    },
    {
      src: 'assets/photos/WhatsApp Image 2026-02-07 at 17.12.33 (1).jpeg',
      name: 'JARDIN NATUREL',
      location: 'CALUIRE, FRANCE',
      description: 'Un jardin naturel intégrant parfaitement la biodiversité locale avec élégance.'
    },
    {
      src: 'assets/photos/WhatsApp Image 2026-02-07 at 17.12.34 (2).jpeg',
      name: 'TERRASSE VÉGÉTALE',
      location: 'TASSIN, FRANCE',
      description: 'Une terrasse végétalisée transformant un espace urbain en oasis de verdure.'
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
      author: 'Lucas Couillard',
      initial: 'L',
      text: 'Mr. Calcine est intervenu chez moi 2 fois, il a effectué un travail très soigné en plus d\'avoir été de bon conseil ! Je recommande fortement !',
      date: 'Il y a 2 semaines'
    },
    {
      author: 'Thierry Houssin',
      initial: 'T',
      text: 'Pour avoir eu recours à cette entreprise personnellement et professionnellement, entreprise très sérieuse avec des tarifs raisonnables. Travaux déductibles des impôts avec cette société à titre perso - je recommande sans hésitation.',
      date: 'Il y a 2 semaines'
    },
    {
      author: 'Morgan B.',
      initial: 'M',
      text: 'Professionnel et sympathique, franchement rien à redire, si ce n\'est : A très vite !',
      date: 'Il y a 2 semaines'
    }
  ];

  // Slick carousel configuration

  ngOnInit() {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', () => {
        this.isScrolled = window.scrollY > 50;
      });

      // Setup scroll animations
      this.setupScrollAnimations();

      // Fermer les bulles de contact si on clique ailleurs
      document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        // Ne pas fermer si on clique sur l'icône ou sur la bulle elle-même
        if (!target.closest('.location-contact-icon') && !target.closest('.contact-bubble')) {
          this.phoneVisible = false;
          this.emailVisible = false;
        }
      });

      // Masquer le loader une fois que tout est chargé
      window.addEventListener('load', () => {
        setTimeout(() => {
          this.isLoading = false;
          // Ajouter une classe au body pour déclencher les animations
          document.body.classList.add('loaded');
        }, 500);
      });
    }

    // Charger les avis Google depuis le fichier JSON
    this.loadGoogleReviews();
  }

  setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
        }
      });
    }, observerOptions);

    // Observe all scroll-reveal elements
    setTimeout(() => {
      const elements = document.querySelectorAll('.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale');
      elements.forEach(el => observer.observe(el));
    }, 100);
  }

  loadGoogleReviews() {
    this.http.get<any>('https://us-central1-studiovert-site.cloudfunctions.net/api/reviews').subscribe({
      next: (data) => {
        if (data && data.reviews && data.reviews.length > 0) {
          // Tronquer les avis trop longs (max 200 caractères)
          this.reviews = data.reviews.map((review: any) => ({
            ...review,
            text: this.truncateText(review.text, 200)
          }));
          console.log('✅ Avis Google chargés:', this.reviews.length);
        }
      },
      error: (error) => {
        console.error('❌ Erreur chargement avis:', error);
        // Garde les avis par défaut si erreur
      }
    });
  }

  truncateText(text: string, maxLength: number): string {
    if (!text || text.length <= maxLength) {
      return text;
    }
    // Tronquer au dernier espace avant la limite pour éviter de couper un mot
    const truncated = text.substring(0, maxLength);
    const lastSpace = truncated.lastIndexOf(' ');
    return lastSpace > 0 ? truncated.substring(0, lastSpace) + '...' : truncated + '...';
  }

  ngAfterViewInit() {
    // Slick carousel gère tout automatiquement
  }

  nextSlide() {
    const container = this.carouselContainer?.nativeElement;
    if (!container) return;

    // Animate only values and description (not labels)
    const animatedElements = document.querySelectorAll('.work-info-animated') as NodeListOf<HTMLElement>;
    animatedElements.forEach(el => {
      el.style.animation = 'fadeOut 0.3s ease forwards';
    });

    setTimeout(() => {
      const slideWidth = 1063 + 24; // width + gap

      // Move to next slide
      this.currentWorkIndex = (this.currentWorkIndex + 1) % this.featuredPhotos.length;
      container.scrollBy({ left: slideWidth, behavior: 'smooth' });

      // Check if we've scrolled past the midpoint (first set of slides)
      // If yes, instantly reset to beginning without user noticing
      setTimeout(() => {
        const newScroll = container.scrollLeft;
        const currentSlideIndex = Math.round(newScroll / slideWidth);

        if (currentSlideIndex >= this.featuredPhotos.length) {
          // We're in the second set of slides, jump back to first set
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = newScroll - (this.featuredPhotos.length * slideWidth);
          setTimeout(() => {
            container.style.scrollBehavior = 'smooth';
          }, 50);
        }
      }, 600);

      // Animate text in
      setTimeout(() => {
        animatedElements.forEach(el => {
          el.style.animation = 'fadeInUp 0.6s cubic-bezier(0.65, 0, 0.35, 1) forwards';
        });
      }, 50);
    }, 300);
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

  nextCarouselSlide() {
    const wrapper = document.querySelector('.cs_slider_wrapper') as HTMLElement;
    if (wrapper) {
      const cardWidth = 1200 + 24; // card width + gap
      wrapper.scrollBy({ left: cardWidth, behavior: 'smooth' });
    }
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

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    this.fileUploadError = ''; // Réinitialiser l'erreur

    if (input.files) {
      const files = Array.from(input.files);
      const totalFiles = this.formData.attachments.length + files.length;

      if (totalFiles > 3) {
        this.fileUploadError = 'Maximum 3 photos autorisées';
        input.value = ''; // Reset input
        return;
      }

      // Vérifier que ce sont des images
      const validFiles = files.filter(file => file.type.startsWith('image/'));
      if (validFiles.length !== files.length) {
        this.fileUploadError = 'Seules les images (JPG, PNG, etc.) sont acceptées';
        input.value = '';
        return;
      }

      // Vérifier la taille de chaque fichier (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB en bytes
      const oversizedFiles = validFiles.filter(file => file.size > maxSize);

      if (oversizedFiles.length > 0) {
        this.fileUploadError = 'Fichier trop gros (max 10 MB)';
        input.value = '';
        return;
      }

      this.formData.attachments = [...this.formData.attachments, ...validFiles];
      input.value = ''; // Reset pour permettre de réajouter le même fichier si supprimé
    }
  }

  removeAttachment(index: number, event: Event) {
    event.stopPropagation();
    event.preventDefault();
    this.formData.attachments.splice(index, 1);
    this.fileUploadError = ''; // Clear error when removing a file
  }

  getFilePreview(file: File): string {
    return URL.createObjectURL(file);
  }

  async submitForm() {
    console.log('Form submitted:', this.formData);

    // Activer l'état d'envoi
    this.formSending = true;
    this.formSubmitted = false;

    try {
      // Convertir les fichiers en base64
      const attachmentsBase64 = await Promise.all(
        this.formData.attachments.map(file => this.fileToBase64(file))
      );

      // Préparer les données en JSON
      const payload = {
        name: this.formData.name,
        email: this.formData.email,
        phone: this.formData.phone,
        message: this.formData.message,
        attachments: attachmentsBase64
      };

      // Envoyer au backend Firebase Functions en JSON
      this.http.post('https://us-central1-studiovert-site.cloudfunctions.net/api/contact', payload).subscribe({
        next: (response: any) => {
          console.log('✅ Email envoyé avec succès:', response);

          // Afficher la validation
          this.formSending = false;
          this.formSubmitted = true;

          // Réinitialiser le formulaire après 2 secondes
          setTimeout(() => {
            this.formData = { name: '', email: '', phone: '', message: '', attachments: [] };
            this.formSubmitted = false;
          }, 2000);
        },
        error: (error) => {
          console.error('❌ Erreur lors de l\'envoi:', error);
          this.formSending = false;

          const errorMessage = error.error?.message || 'Une erreur est survenue lors de l\'envoi';
          alert(errorMessage);
        }
      });
    } catch (error) {
      console.error('❌ Erreur lors de la conversion des fichiers:', error);
      this.formSending = false;
      this.fileUploadError = 'Erreur lors du traitement des images';
    }
  }

  private fileToBase64(file: File): Promise<{name: string, data: string, type: string}> {
    return new Promise((resolve, reject) => {
      // Compresser l'image avant de l'envoyer
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d')!;

      img.onload = () => {
        // Limiter la taille maximale à 1200px
        const maxSize = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Convertir en base64 avec compression JPEG à 85%
        const base64 = canvas.toDataURL('image/jpeg', 0.85).split(',')[1];
        resolve({
          name: file.name.replace(/\.[^.]+$/, '.jpg'), // Changer l'extension en .jpg
          data: base64,
          type: 'image/jpeg'
        });
      };

      img.onerror = reject;

      // Charger l'image
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  togglePhone(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.phoneVisible = !this.phoneVisible;
    if (this.phoneVisible) {
      this.emailVisible = false;
    }
  }

  toggleEmail(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.emailVisible = !this.emailVisible;
    if (this.emailVisible) {
      this.phoneVisible = false;
    }
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }
}
