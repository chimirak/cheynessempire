import { CONTACT } from "@/data/site";

export const WHATSAPP_BASE = `https://wa.me/${CONTACT.whatsappNumber}`;

export const GREETING_MESSAGE = "Hello Cheyness Empire, I'd like to begin my Cheyness experience.";

export function waLink(text?: string): string {
  if (!text) return WHATSAPP_BASE;
  return `${WHATSAPP_BASE}?text=${encodeURIComponent(text)}`;
}

export function productMessage(productName: string): string {
  return `Hello Cheyness Empire, I'd like to ask about the ${productName}.`;
}

export function ritualMessage(productNames: string[]): string {
  return `Hello Cheyness Empire, I'd like to ask about: ${productNames.join(", ")}.`;
}

export function consultationMessage(productNames: string[]): string {
  return `Hello Cheyness Empire, I've just done your consultation and I'd love some personal guidance. It suggested: ${productNames.join(", ")}.`;
}

export const mailtoLink = `mailto:${CONTACT.email}`;
