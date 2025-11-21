import { FAQItem } from '@/types';

export const faqs: FAQItem[] = [
  {
    id: 1,
    question: "How do I register for an event?",
    answer: "To register for an event, simply click the 'Register' button on any event card. You'll be directed to the registration page where you can complete your booking. For this POC, registration is simulated with an alert message.",
    category: "Registration"
  },
  {
    id: 2,
    question: "Can I register for multiple events at once?",
    answer: "Yes! You can browse and register for as many events as you'd like. Each event has its own registration process, and you'll receive confirmation for each separately.",
    category: "Registration"
  },
  {
    id: 3,
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, Mastercard, American Express), PayPal, and Apple Pay. For free events, no payment information is required.",
    category: "Payment"
  },
  {
    id: 4,
    question: "What is your refund policy?",
    answer: "You can cancel and receive a full refund up to 7 days before the event. Cancellations within 7 days will receive a 50% refund. No refunds are available on the day of the event.",
    category: "Payment"
  },
  {
    id: 5,
    question: "How do I access virtual events?",
    answer: "For virtual events, you'll receive an email with a unique access link 24 hours before the event starts. Make sure to check your spam folder if you don't see it in your inbox.",
    category: "Access"
  },
  {
    id: 6,
    question: "Will I receive a certificate of attendance?",
    answer: "Yes! After attending an event, you'll automatically receive a digital certificate of attendance via email within 48 hours. Some workshops also offer completion certificates.",
    category: "Access"
  },
  {
    id: 7,
    question: "Can I transfer my ticket to someone else?",
    answer: "Yes, tickets are transferable up to 24 hours before the event. Contact our support team with the recipient's information to complete the transfer.",
    category: "Support"
  },
  {
    id: 8,
    question: "What should I do if I'm having technical issues?",
    answer: "If you're experiencing technical difficulties, please email support@eventure.com or use the live chat feature. Our support team is available 24/7 to assist you.",
    category: "Support"
  },
  {
    id: 9,
    question: "Are recordings available for virtual events?",
    answer: "Most virtual events are recorded and made available to registered attendees for 30 days after the event. You'll receive an email with the recording link.",
    category: "Access"
  },
  {
    id: 10,
    question: "How early should I arrive for in-person events?",
    answer: "We recommend arriving 15-30 minutes before the scheduled start time for check-in and networking. Doors typically open 30 minutes before the event begins.",
    category: "Access"
  }
];
