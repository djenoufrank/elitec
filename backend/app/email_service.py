"""SMTP notifications for quote requests and contact messages."""
import os
import smtplib
from email.message import EmailMessage


def _send_email(message: EmailMessage, reply_to: str | None = None) -> bool:
    """Send an email with the SMTP configuration from backend/.env."""
    host = os.getenv("SMTP_HOST")
    username = os.getenv("SMTP_USERNAME")
    password = os.getenv("SMTP_PASSWORD")
    sender = os.getenv("SMTP_FROM", username or "")
    recipient = os.getenv("QUOTE_NOTIFICATION_EMAIL", "").strip()
    port = int(os.getenv("SMTP_PORT", "587"))

    if not all((host, username, password, sender, recipient)):
        return False

    message["From"] = sender
    message["To"] = recipient
    if reply_to:
        message["Reply-To"] = reply_to

    if port == 465:
        with smtplib.SMTP_SSL(host, port, timeout=20) as smtp:
            smtp.login(username, password)
            smtp.send_message(message)
    else:
        with smtplib.SMTP(host, port, timeout=20) as smtp:
            smtp.starttls()
            smtp.login(username, password)
            smtp.send_message(message)
    return True


def send_quote_request_email(lead: dict, estimate: dict) -> bool:
    """Send a visitor's requested quote to Elitec; return False if SMTP is not configured."""
    breakdown = estimate.get("breakdown") or {}
    lines = [
        "Une demande de devis vient d'être envoyée depuis le calculateur Elitec.",
        "",
        "Nom : {} {}".format(lead.get("first_name", ""), lead.get("last_name", "")).strip(),
        "Email : {}".format(lead.get("email", "")),
        "",
        "Utilisateurs : {}".format(estimate.get("users", "")),
        "Niveau de support : {}".format(estimate.get("support_level", "")),
        "Couverture : {}".format(estimate.get("support_coverage", "")),
        "Services Cloud : {}".format(", ".join(estimate.get("cloud_services") or []) or "Aucun"),
        "Services sécurité : {}".format(", ".join(estimate.get("security_services") or []) or "Aucun"),
        "Serveurs : {}".format(estimate.get("servers", 0)),
        "Postes de travail : {}".format(estimate.get("workstations", 0)),
        "Équipements réseau : {}".format(estimate.get("network_devices", 0)),
        "",
        "Détail mensuel estimatif :",
        *["- {} : {} €".format(name, amount) for name, amount in breakdown.items()],
        "Total estimé : {} € / mois".format(estimate.get("monthly_total", 0)),
        "Total estimé : {} € / an".format(estimate.get("annual_total", 0)),
    ]

    message = EmailMessage()
    message["Subject"] = "Demande de devis calculateur — {} {}".format(
        lead.get("first_name", ""), lead.get("last_name", "")
    ).strip()
    message.set_content("\n".join(lines))
    return _send_email(message, lead.get("email"))


def send_contact_message_email(contact: dict) -> bool:
    """Send the contact form details to Elitec."""
    lines = [
        "Un nouveau message a été envoyé depuis le formulaire de contact Elitec.",
        "",
        "Nom complet : {}".format(contact.get("name", "")),
        "Email professionnel : {}".format(contact.get("email", "")),
        "Société : {}".format(contact.get("company") or "Non renseignée"),
        "Téléphone : {}".format(contact.get("phone") or "Non renseigné"),
        "Service qui intéresse le visiteur : {}".format(contact.get("service") or "Non renseigné"),
        "",
        "Message :",
        contact.get("message", ""),
    ]

    message = EmailMessage()
    message["Subject"] = "Nouveau message de contact — {}".format(contact.get("name", "")).strip()
    message.set_content("\n".join(lines))
    return _send_email(message, contact.get("email"))