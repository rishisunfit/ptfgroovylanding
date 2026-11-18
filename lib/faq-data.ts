export interface FaqItem {
  q: string;
  a: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    q: "I'm already on another PT software. How hard is it to migrate?",
    a: "It's super simple. We've built custom integrations for integrations from everfit, trainerize, kahunas, and most other PT software. If you need help, we're happy to walk through the process.",
  },
  {
    q: "Wait, is this really free?",
    a: "Yes. Free forever. Unlimited clients, and unlimited tokens. When you're ready to build out a custom PT app, we hope you consider PTFlow to build out an amazing client experience :)",
  },
  {
    q: "Can I bring my existing tools?",
    a: "Yes. PTFlow connects to Google Sheets, Stripe, typeform, calendly, and most of the other tools you already use.",
  },
  {
    q: "How is my data handled?",
    a: "Data is encrypted in transit and at rest, isolated per workspace, and stored in the region you pick at signup. WE DO NOT SHARE/SELL YOUR DATA.",
  },
  {
    q: "What if I need to cancel?",
    a: "If you've upgraded to a paid plan, you can cancel anytime from billing settings. You keep access through the end of the current period and can export every project, file, and asset as a single archive.",
  },
];
