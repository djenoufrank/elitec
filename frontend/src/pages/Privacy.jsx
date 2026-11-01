import { Link } from "react-router-dom";
import { COMPANY } from "@/lib/data";
import { useT } from "@/lib/i18n";
import PageHeroMedia from "@/components/layout/PageHeroMedia";

const CONTENT = {
  fr: {
    title: "Politique de confidentialité",
    updated: "Mise à jour : 18 octobre 2026",
    intro: "Elitec traite les données nécessaires à l’utilisation du calculateur et au traitement des demandes de devis et de contact.",
    controller: "Responsable du traitement",
    data: "Données traitées",
    dataText: "Les données sont recueillies directement auprès de vous. Pour une simulation : prénom, nom, adresse email, paramètres choisis dans le calculateur, montants estimés et dates de création ou de fin. Pour un message de contact : nom, email et, selon les informations fournies, société, téléphone, service concerné et message.",
    purposes: "Finalités et bases juridiques",
    purposeQuote: "Calculer l’estimation et répondre à une demande de devis explicitement envoyée : mesures précontractuelles prises à la demande de la personne (article 6.1.b du RGPD).",
    purposeIncomplete: "Conserver une simulation commencée mais non terminée afin de permettre son suivi manuel par Elitec : intérêt légitime à donner suite à une démarche initiée sur le site (article 6.1.f du RGPD). Vous pouvez vous opposer à ce suivi en écrivant à l’adresse ci-dessous.",
    purposeContact: "Traiter les messages de contact et y répondre : mesures précontractuelles ou intérêt légitime selon le contenu de la demande.",
    recipients: "Destinataires et hébergement",
    recipientText: "Les données sont accessibles aux personnes autorisées par Elitec et aux prestataires techniques nécessaires au fonctionnement du site, de la base MongoDB et du service d’envoi d’emails. L’hébergement de production et ses prestataires seront précisés lors du déploiement. Les données ne sont pas vendues.",
    retention: "Durée de conservation",
    retentionText: "Les simulations et demandes de contact enregistrées dans cette application sont supprimées automatiquement au plus tard 12 mois après leur création, sauf si une obligation légale ou la gestion d’un litige justifie une conservation plus longue.",
    rights: "Vos droits",
    rightsText: "Vous pouvez demander l’accès à vos données, leur rectification, leur effacement, la limitation du traitement et, lorsque les conditions sont réunies, leur portabilité. Vous pouvez vous opposer au traitement fondé sur l’intérêt légitime. Pour exercer ces droits, contactez Elitec par email. Vous pouvez également introduire une réclamation auprès de l’Autorité de protection des données belge.",
    apd: "Autorité de protection des données belge",
    required: "Champs requis et décisions automatisées",
    requiredText: "Le prénom, le nom et l’adresse email sont requis pour accéder au calculateur et enregistrer la simulation. Sans ces informations, le calculateur n’est pas accessible. Aucune décision produisant un effet juridique n’est prise automatiquement à partir de ces données.",
    email: "Les emails envoyés par le calculateur",
    emailText: "Quand vous cliquez sur « Demander un devis », le site transmet votre demande et le détail de l’estimation à Elitec. Aucune campagne email automatique n’est envoyée aux personnes ayant abandonné une simulation. Une relance email manuelle reste soumise aux règles applicables en matière de prospection électronique ; la présence d’une adresse dans la base ne suffit pas à elle seule à autoriser cet email.",
    back: "Retour à l’accueil",
  },
  en: {
    title: "Privacy policy",
    updated: "Updated: 18 October 2026",
    intro: "Elitec processes the information needed to use the calculator and handle quote and contact requests.",
    controller: "Data controller",
    data: "Data processed",
    dataText: "Data is collected directly from you. For an estimate: first name, last name, email address, calculator selections, estimated amounts, and creation or completion dates. For a contact message: name, email and, where provided, company, phone, service of interest and message.",
    purposes: "Purposes and legal bases",
    purposeQuote: "Calculate an estimate and respond to a quote request you submit: steps taken at your request before entering into a contract (GDPR Article 6(1)(b)).",
    purposeIncomplete: "Keep an estimate that was started but not completed so Elitec can manually follow up on the enquiry initiated on the website: legitimate interests (GDPR Article 6(1)(f)). You can object to this follow-up by emailing the address below.",
    purposeContact: "Handle and reply to contact messages: pre-contractual steps or legitimate interests, depending on the request.",
    recipients: "Recipients and hosting",
    recipientText: "Data is accessible to Elitec staff who need it and technical providers required to operate the website, MongoDB database and email service. Production hosting and its providers will be specified at deployment. Data is not sold.",
    retention: "Retention period",
    retentionText: "Estimates and contact requests stored by this application are automatically deleted no later than 12 months after creation, unless a legal obligation or dispute requires longer retention.",
    rights: "Your rights",
    rightsText: "You can request access, correction, deletion, restriction and, where applicable, portability of your data. You can object to processing based on legitimate interests. To exercise these rights, email Elitec. You may also lodge a complaint with the Belgian Data Protection Authority.",
    apd: "Belgian Data Protection Authority",
    required: "Required fields and automated decisions",
    requiredText: "First name, last name and email address are required to access the calculator and save an estimate. The calculator cannot be used without them. No decision with legal effects is made automatically from this data.",
    email: "Emails sent by the calculator",
    emailText: "When you click “Request a quote”, the website sends your request and estimate details to Elitec. No automatic email campaign is sent to people who leave a simulation unfinished. A manual follow-up email remains subject to applicable electronic marketing rules; having an address in the database alone does not authorize that email.",
    back: "Back to home",
  },
};

export default function Privacy() {
  const { lang } = useT();
  const copy = CONTENT[lang] || CONTENT.fr;

  return (
    <>
      <section className="site-page-hero">
        <PageHeroMedia />
        <header className="site-page-hero__content max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-white">{copy.title}</h1>
          <p className="mt-2 text-sm text-white/75">{copy.updated}</p>
          <p className="mt-5 text-white/85 max-w-3xl">{copy.intro}</p>
        </header>
      </section>
      <main className="py-16">
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <section>
          <h2 className="text-xl font-semibold">{copy.controller}</h2>
          <p className="mt-2 text-muted-foreground">{COMPANY.legalName}<br />{COMPANY.address}<br /><a className="text-[#0057B8] underline" href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a><br />{copy === CONTENT.fr ? "TVA" : "VAT"}: {COMPANY.tva}</p>
        </section>
        <section><h2 className="text-xl font-semibold">{copy.data}</h2><p className="mt-2 text-muted-foreground">{copy.dataText}</p></section>
        <section>
          <h2 className="text-xl font-semibold">{copy.purposes}</h2>
          <ul className="mt-2 list-disc space-y-2 pl-6 text-muted-foreground">
            <li>{copy.purposeQuote}</li><li>{copy.purposeIncomplete}</li><li>{copy.purposeContact}</li>
          </ul>
        </section>
        <section><h2 className="text-xl font-semibold">{copy.recipients}</h2><p className="mt-2 text-muted-foreground">{copy.recipientText}</p></section>
        <section><h2 className="text-xl font-semibold">{copy.retention}</h2><p className="mt-2 text-muted-foreground">{copy.retentionText}</p></section>
        <section>
          <h2 className="text-xl font-semibold">{copy.rights}</h2>
          <p className="mt-2 text-muted-foreground">{copy.rightsText}</p>
          <a className="mt-2 inline-block text-[#0057B8] underline" href="https://www.autoriteprotectiondonnees.be/" target="_blank" rel="noreferrer">{copy.apd}</a>
        </section>
        <section><h2 className="text-xl font-semibold">{copy.required}</h2><p className="mt-2 text-muted-foreground">{copy.requiredText}</p></section>
        <section><h2 className="text-xl font-semibold">{copy.email}</h2><p className="mt-2 text-muted-foreground">{copy.emailText}</p></section>
        <Link to="/" className="inline-block text-[#0057B8] underline">{copy.back}</Link>
      </article>
      </main>
    </>
  );
}
