// Site-wide copy and contact details. Edit text here, not inside components.

export const CONTACT = {
  whatsappNumber: "2347036772596",
  phoneDisplay: "+234 703 677 2596",
  email: "chinenyejoy29@gmail.com",
  location: "Port Harcourt, Nigeria",
  channelUrl: "https://whatsapp.com/channel/0029vacoyofklahwvs7jro0f",
} as const;

export const BRAND = {
  name: "Cheyness Empire",
  wordmark: "CHEYNESS EMPIRE",
  belief: "Beauty begins with how you treat yourself.",
} as const;

export type NavId = "home" | "philosophy" | "skincare" | "experience" | "contact";

export const NAV_LINKS: { id: NavId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "philosophy", label: "Our Philosophy" },
  { id: "skincare", label: "Skincare" },
  { id: "experience", label: "The Experience" },
  { id: "contact", label: "Contact" },
];

export const HERO_COPY = {
  eyebrow: "Cheyness Empire · Port Harcourt",
  headline: "Your skin deserves / a little more *love.*",
  support:
    "Beauty isn't something you earn. It's something you give yourself, one quiet ritual at a time.",
  primaryCta: "Discover Your Glow",
  secondaryCta: "Explore Our World",
};

export const SELF_LOVE_COPY = {
  lines: ["Make", "yourself your", "favourite", "ritual."],
  emphasis: "favourite",
  sub: "Not a treat. Not a reward. Just a few minutes that belong entirely to you.",
};

export const EXPERIENCE_COPY = {
  eyebrow: "The Cheyness Experience",
  headline: "Care that feels *personal.*",
  body: "From Port Harcourt, Cheyness Empire brings skincare and body care together around one belief: looking after yourself is never something you have to earn. Every product here is part of a ritual that is yours.",
  link: "Meet the ritual",
};

export const EDIT_COPY = {
  eyebrow: "The Edit",
  headline: "Pieces for your *ritual.*",
};

export const CONSULT_COPY = {
  eyebrow: "Your consultation",
  headline: "What would you like to *give attention to?*",
  step2: "How do you like your routine?",
  resultTitle: "A place to begin",
  disclaimer:
    "This is a starting point from our catalogue, not medical advice. Chat with us for personal guidance.",
};

// Client to confirm or edit these three lines before launch.
export const DIFFERENCE_COPY = {
  headline: "The difference is *attention.*",
  columns: [
    { title: "Personal service", body: "Talk to a real person who helps you choose." },
    { title: "A ritual-first approach", body: "We think about your routine, not just your cart." },
    {
      title: "Always within reach",
      body: "Message us on WhatsApp whenever you have a question.",
    },
  ],
};

export const FINAL_COPY = {
  headline: "Because feeling good in your skin *changes everything.*",
  cta: "Begin Your Cheyness Experience",
  back: "Or explore the edit again",
};
