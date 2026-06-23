export interface ProcessStep {
  number: string;
  title: string;
  detail: string;
  duration?: string; // optional time callout
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "Get in touch",
    detail:
      "Fill in our venue enquiry form or give us a call. Tell us about your venue — the type, size, typical footfall on a busy night, and whether you have any thoughts on machine placement. There's no obligation at this stage; we just want to understand if we're a good fit for each other.",
  },
  {
    number: "02",
    title: "We visit your venue",
    detail:
      "One of the Éclat team will come to you at a time that suits — during the day, before service, or after close. We walk the space together, discuss placement options (cloakroom, bar, lobby, corridor), and recommend the right machine model for your layout and footfall volume.",
    duration: "Typically 30–45 minutes",
  },
  {
    number: "03",
    title: "Agree the partnership model",
    detail:
      "We present three ways to work together: Revenue Share (zero upfront cost — we take a small percentage of every transaction and you keep the rest), Lease (a fixed monthly fee with all transaction revenue going to you), or Purchase (a one-off payment and the machine is yours). Most venues opt for Revenue Share — it's zero financial risk with passive income from day one.",
  },
  {
    number: "04",
    title: "Curate the fragrance selection",
    detail:
      "Before installation, we work with you to agree which scents go inside the machine. We match the selection to your venue's atmosphere and guest demographic — a Northern Quarter late-night bar gets a different edit to a Spinningfields hotel lobby. The selection is refreshed seasonally, again in consultation with you.",
  },
  {
    number: "05",
    title: "Installation day",
    detail:
      "Our engineers arrive at a pre-agreed time and install the machine with minimal disruption. All that's needed is a standard 13A mains socket — no venue Wi-Fi, no cabling, no structural work. We configure the cashless payment terminal, run a full test, and brief your front-of-house team before we leave.",
    duration: "Under 2 hours on site",
  },
  {
    number: "06",
    title: "Go live",
    detail:
      "The machine is stocked and ready the moment we leave. Your guests can use it from the first night. We send you a confirmation with your login for the reporting dashboard so you can track transactions in real time.",
  },
  {
    number: "07",
    title: "We handle everything from here",
    detail:
      "Our team monitors stock levels remotely and restocks proactively — you'll never need to chase us. Maintenance and repairs are entirely our responsibility. You receive a monthly earnings summary showing transactions, revenue share, and trends. Your team does nothing; we take care of it all.",
  },
];

export const PROCESS_HEADER = {
  eyebrow: "The Process",
  title: "From first enquiry to first sale",
  subtitle:
    "Most venues are up and running within a week of making contact. Here's exactly what that looks like.",
};
