import {
  Headphones, Cloud, ShieldCheck, Server, Lightbulb, LifeBuoy, Laptop,
} from "lucide-react";
import logo from "@/images/logo.png";
import hero from "@/images/fille.png";

export const COMPANY = {
  name: "Elitec",
  legalName: "Elitec",
  tva: "BE1021.922.417",
  address: "Rue Charles Heuze 38, 5060 Auvelais, Belgique",
  // phone: "+32 492 52 08 87",
  // phoneRaw: "+32492520887",
  email: "Contact@elitec.be",
  // whatsapp: "https://wa.me/0032492520887",
  logo,
};
export const IMAGES = {
  hero,
  team: "https://images.pexels.com/photos/8867266/pexels-photo-8867266.jpeg",
  datacenter: "https://images.pexels.com/photos/5480781/pexels-photo-5480781.jpeg",
};

// Catalogue of services. `titleKey`/`taglineKey`/`itemKeys` map to i18n keys so the UI can render in FR/EN.
export const SERVICE_CATEGORIES = [
  {
    id: "managed-it",
    icon: Headphones,
    titleKey: "svc.managed.title",
    taglineKey: "svc.managed.tagline",
    items: [
      "svc.managed.items.helpdesk",
      "svc.managed.items.remote",
      "svc.managed.items.onsite",
      "svc.managed.items.monitoring",
      "svc.managed.items.assets",
    ],
  },
  {
    id: "cloud",
    icon: Cloud,
    titleKey: "svc.cloud.title",
    taglineKey: "svc.cloud.tagline",
    items: [
      "svc.cloud.items.azure",
      "svc.cloud.items.m365",
      "svc.cloud.items.migration",
      "svc.cloud.items.backup",
      "svc.cloud.items.dr",
    ],
  },
  {
    id: "identity",
    icon: ShieldCheck,
    titleKey: "svc.identity.title",
    taglineKey: "svc.identity.tagline",
    items: [
      "svc.identity.items.entra",
      "svc.identity.items.mfa",
      "svc.identity.items.sso",
      "svc.identity.items.conditional",
      "svc.identity.items.lifecycle",
    ],
  },
  {
    id: "infrastructure",
    icon: Server,
    titleKey: "svc.infra.title",
    taglineKey: "svc.infra.tagline",
    items: [
      "svc.infra.items.servers",
      "svc.infra.items.network",
      "svc.infra.items.virtualization",
      "svc.infra.items.storage",
      "svc.infra.items.datacenter",
    ],
  },
  {
    id: "consulting",
    icon: Lightbulb,
    titleKey: "svc.consulting.title",
    taglineKey: "svc.consulting.tagline",
    items: [
      "svc.consulting.items.strategy",
      "svc.consulting.items.digital",
      "svc.consulting.items.adoption",
      "svc.consulting.items.modernization",
      "svc.consulting.items.cost",
    ],
  },
  {
    id: "continuity",
    icon: LifeBuoy,
    titleKey: "svc.continuity.title",
    taglineKey: "svc.continuity.tagline",
    items: [
      "svc.continuity.items.backup",
      "svc.continuity.items.drplan",
      "svc.continuity.items.ha",
      "svc.continuity.items.testing",
    ],
  },
  {
    id: "workplace",
    icon: Laptop,
    titleKey: "svc.workplace.title",
    taglineKey: "svc.workplace.tagline",
    items: [
      "svc.workplace.items.m365",
      "svc.workplace.items.teams",
      "svc.workplace.items.devices",
      "svc.workplace.items.collab",
    ],
  },
];

export const PARTNERS = [
  "Microsoft Azure", "Microsoft 365", "Microsoft Entra ID", "Windows 365",
  "Microsoft Teams", "Veeam", "Fortinet", "HPE",
];

export const TESTIMONIALS = [
  { quoteKey: "tst.1.q", nameKey: "tst.1.n", roleKey: "tst.1.r" },
  { quoteKey: "tst.2.q", nameKey: "tst.2.n", roleKey: "tst.2.r" },
  { quoteKey: "tst.3.q", nameKey: "tst.3.n", roleKey: "tst.3.r" },
];

export const WHY_ELITEC = [
  { titleKey: "why.247.t", descKey: "why.247.d", icon: "Clock" },
  { titleKey: "why.experts.t", descKey: "why.experts.d", icon: "Award" },
  { titleKey: "why.pricing.t", descKey: "why.pricing.d", icon: "Wallet" },
  { titleKey: "why.response.t", descKey: "why.response.d", icon: "Zap" },
];
