import { Component, signal } from '@angular/core';
import { FooterSection, SocialLink } from './interfaces';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  currentYear = new Date().getFullYear();
  newsletterEmail = signal<string>('');
  subscriptionMessage = signal<string>('');

  socialLinks: SocialLink[] = [
    { name: 'Facebook', icon: 'fa-brands fa-facebook', url: 'https://facebook.com' },
    { name: 'Twitter', icon: 'fa-brands fa-twitter', url: 'https://x.com' },
    { name: 'Instagram', icon: 'fa-brands fa-instagram', url: 'https://instagram.com' },
    { name: 'LinkedIn', icon: 'fa-brands fa-linkedin', url: 'https://linkedin.com' },
    { name: 'YouTube', icon: 'fa-brands fa-youtube', url: 'https://youtube.com' },
  ];

  footerSections: FooterSection[] = [
    {
      title: 'Menu',
      links: [
        { title: 'All Dishes', url: '/menu' },
        { title: 'Restaurants', url: '/restaurants' },
        { title: 'Categories', url: '/menu/categories' },
        { title: 'Meal Plans', url: '/subscriptions' },
        { title: 'Promotions', url: '/offers' },
      ],
    },
    {
      title: 'Orders & Support',
      links: [
        { title: 'Track Order', url: '/track-order' },
        { title: 'Delivery Info', url: '/delivery' },
        { title: 'Help Center', url: '/help' },
        { title: 'Returns & Refunds', url: '/returns' },
        { title: 'Contact Support', url: '/contact' },
      ],
    },
    {
      title: 'About Foodify',
      links: [
        { title: 'Our Story', url: '/about' },
        { title: 'Careers', url: '/careers' },
        { title: 'Blog', url: '/blog' },
        { title: 'Sustainability', url: '/sustainability' },
        { title: 'Partnerships', url: '/partners' },
      ],
    },
    {
      title: 'Legal & Policies',
      links: [
        { title: 'Privacy Policy', url: '/privacy' },
        { title: 'Terms of Service', url: '/terms' },
        { title: 'Cookie Policy', url: '/cookies' },
        { title: 'Accessibility', url: '/accessibility' },
        { title: 'Nutrition & Allergens', url: '/nutrition' },
      ],
    },
  ];

  paymentMethods = [
    { name: 'Visa', icon: 'fa-brands fa-cc-visa' },
    { name: 'PayPal', icon: 'fa-brands fa-paypal' },
    { name: 'Apple Pay', icon: 'fa-brands fa-apple-pay' },
  ];

  subscribeNewsletter(): void {
    const email = this.newsletterEmail();
    if (email && this.isValidEmail(email)) {
      // Simulate API call
      console.log('Subscribing email:', email);
      this.subscriptionMessage.set('Thank you for subscribing!');
      this.newsletterEmail.set('');

      // Clear message after 3 seconds
      setTimeout(() => {
        this.subscriptionMessage.set('');
      }, 3000);
    } else {
      this.subscriptionMessage.set('Please enter a valid email address');
      setTimeout(() => {
        this.subscriptionMessage.set('');
      }, 3000);
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
