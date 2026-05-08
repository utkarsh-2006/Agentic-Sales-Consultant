import os
import smtplib
import threading
from email.message import EmailMessage

from openai import OpenAI
from core.database import get_history, update_lead_status
from core.lead_capture import get_lead_by_session
from scripts.query import retrieve_context


QUALIFIED_THRESHOLD = 70
FOLLOWUP_DELAY_SECONDS = 180
openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
followup_timers = {}
followup_timers_lock = threading.Lock()


def normalize_lead_score(raw_score):
    """Normalize legacy 1-10 scores to a 0-100 scale for follow-up logic."""
    try:
        score = float(raw_score)
    except (TypeError, ValueError):
        return 0

    if score <= 10:
        return int(score * 10)
    return int(score)


def is_qualified_lead(lead):
    normalized_score = normalize_lead_score(lead.get("lead_score", 0))
    return normalized_score >= QUALIFIED_THRESHOLD, normalized_score


def build_email_prompt(normalized_score, qualified, calendly_link):
    if qualified:
        return (
            "Write only the main body of a follow-up email for a highly qualified sales lead. "
            "Assume strong interest and invite them to book a strategy call. "
            f"Include a direct booking call-to-action with this Calendly link: {calendly_link}. "
            "Tone: confident, direct, professional. "
            "Do not mention lead score, qualification score, internal scoring, or numbers about how they were evaluated. "
            "Do not include a subject line. "
            "Do not include placeholders like [Name] or [Your Name]. "
            "Do not include a greeting or sign-off. "
            "Return 2 short paragraphs, plain text only."
        )

    return (
        "Write only the main body of a soft exploratory follow-up email for an early-stage sales lead. "
        "Ask whether they would be open to a quick call without being pushy. "
        "Tone: warm, soft, exploratory, low-pressure. "
        "Do not mention lead score, qualification score, internal scoring, or numbers about how they were evaluated. "
        "Do not include a subject line. "
        "Do not include placeholders like [Name] or [Your Name]. "
        "Do not include a greeting or sign-off. "
        "Return 2 short paragraphs, plain text only."
    )


def get_lead_context(lead, conversation_history):
    user_messages = [
        msg["content"] for msg in conversation_history
        if msg.get("role") == "user"
    ]
    transcript = "\n".join(user_messages[-5:]) if user_messages else "No prior user transcript."

    facts = [
        f"Name: {lead.get('name') or 'Unknown'}",
        f"Business: {lead.get('business') or 'Unknown'}",
        f"Email: {lead.get('email') or 'Unknown'}",
        f"Intent: {lead.get('intent') or 'Unknown'}",
        f"Stage: {lead.get('stage') or 'Unknown'}",
    ]
    return "\n".join(facts) + "\nRecent user context:\n" + transcript


def sanitize_email_body(text):
    cleaned = text.strip()
    bad_prefixes = ("subject:", "hi [name]", "hello [name]", "best, [your name]")

    lines = []
    for raw_line in cleaned.splitlines():
        line = raw_line.strip()
        if not line:
            lines.append("")
            continue
        lowered = line.lower()
        if lowered.startswith("subject:"):
            continue
        line = line.replace("[Name]", "").replace("[Your Name]", "GrowthForge Media")
        lines.append(line.strip(" ,"))

    cleaned = "\n".join(lines).strip()
    for prefix in bad_prefixes:
        if cleaned.lower().startswith(prefix):
            cleaned = cleaned.split(" ", 1)[-1].strip()
            break

    cleaned = cleaned.replace("lead score", "interest")
    cleaned = cleaned.replace("Lead score", "Interest")
    cleaned = cleaned.replace("/100", "")
    cleaned = cleaned.replace("10/100", "")
    cleaned = cleaned.replace("20/100", "")
    cleaned = cleaned.replace("30/100", "")
    cleaned = cleaned.replace("40/100", "")
    cleaned = cleaned.replace("50/100", "")
    cleaned = cleaned.replace("60/100", "")
    cleaned = cleaned.replace("70/100", "")
    cleaned = cleaned.replace("80/100", "")
    cleaned = cleaned.replace("90/100", "")
    cleaned = cleaned.replace("100/100", "")

    return cleaned


def generate_email_body_with_rag(lead, conversation_history, qualified, normalized_score, calendly_link):
    knowledge_types = ["onboarding", "case"] if qualified else ["services"]
    knowledge_context = retrieve_context(
        lead.get("business") or "business growth",
        doc_type="onboarding" if qualified else "services",
        knowledge_types=knowledge_types
    )
    lead_context = get_lead_context(lead, conversation_history)
    prompt = build_email_prompt(normalized_score, qualified, calendly_link)

    response = openai_client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "system",
                "content": (
                    "You write polished sales follow-up emails for GrowthForge Media. "
                    "Use only the provided context. "
                    "Never include placeholders. "
                    "Never include a subject line. "
                    "Never include a greeting or sign-off. "
                    "Plain text only."
                )
            },
            {
                "role": "user",
                "content": (
                    f"{prompt}\n\n"
                    f"Lead context:\n{lead_context}\n\n"
                    f"Knowledge context:\n{knowledge_context or 'No extra knowledge retrieved.'}"
                )
            }
        ],
        max_tokens=220,
        temperature=0.6
    )

    return sanitize_email_body(
        response.choices[0].message.content.strip()
    )


def generate_followup_email(lead, session_id, qualified, normalized_score):
    conversation_history = get_history(session_id)
    calendly_link = os.getenv(
        "CALENDLY_LINK",
        "https://calendly.com/your-link"
    )

    email_body = generate_email_body_with_rag(
        lead,
        conversation_history,
        qualified,
        normalized_score,
        calendly_link
    )

    name = (lead.get("name") or "").strip()
    greeting = f"Hi {name}," if name else "Hi,"

    if qualified:
        subject = "Your Strategy Call Is Ready"
        body = (
            f"{greeting}\n\n"
            f"{email_body}\n\n"
            f"Book your strategy call here: {calendly_link}\n\n"
            "Best,\nGrowthForge Media"
        )
    else:
        subject = "Quick Follow-Up From GrowthForge Media"
        body = (
            f"{greeting}\n\n"
            f"{email_body}\n\n"
            "If you're open to a quick call, just reply and we can set one up.\n\n"
            "Best,\nGrowthForge Media"
        )

    return {
        "subject": subject,
        "body": body,
        "normalized_score": normalized_score
    }


def send_email(to_email, subject, body):
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_username = os.getenv("SMTP_USERNAME")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("SMTP_FROM_EMAIL", smtp_username or "noreply@growthforgemedia.com")

    if not smtp_host or not smtp_username or not smtp_password:
        print(
            "FOLLOWUP EMAIL PREVIEW\n"
            f"TO: {to_email}\n"
            f"SUBJECT: {subject}\n"
            f"BODY:\n{body}\n"
        )
        return False

    message = EmailMessage()
    message["Subject"] = subject
    message["From"] = from_email
    message["To"] = to_email
    message.set_content(body)

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_username, smtp_password)
        server.send_message(message)

    return True


def handle_followup(lead, session_id):
    if not lead:
        return {
            "sent": False,
            "reason": "missing_lead"
        }

    if lead.get("status") == "followup_sent":
        return {
            "sent": False,
            "reason": "already_sent"
        }

    to_email = lead.get("email")
    if not to_email:
        return {
            "sent": False,
            "reason": "missing_email"
        }

    qualified, normalized_score = is_qualified_lead(lead)
    email_payload = generate_followup_email(
        lead,
        session_id,
        qualified,
        normalized_score
    )

    try:
        sent = send_email(
            to_email,
            email_payload["subject"],
            email_payload["body"]
        )
        if sent:
            update_lead_status(session_id, "followup_sent")
        return {
            "sent": sent,
            "qualified": qualified,
            "normalized_score": normalized_score,
            "email": to_email
        }
    except Exception as e:
        print(f"Follow-up email error: {e}")
        return {
            "sent": False,
            "qualified": qualified,
            "normalized_score": normalized_score,
            "email": to_email,
            "reason": str(e)
        }


def _run_scheduled_followup(session_id):
    try:
        lead = get_lead_by_session(session_id)
        result = handle_followup(lead, session_id)
        print(f"FOLLOWUP TIMER RESULT for {session_id}: {result}")
    finally:
        with followup_timers_lock:
            followup_timers.pop(session_id, None)


def schedule_followup(session_id, delay_seconds=FOLLOWUP_DELAY_SECONDS):
    if not session_id or session_id == "default":
        return

    with followup_timers_lock:
        existing_timer = followup_timers.get(session_id)
        if existing_timer:
            existing_timer.cancel()

        timer = threading.Timer(
            delay_seconds,
            _run_scheduled_followup,
            args=[session_id]
        )
        timer.daemon = True
        followup_timers[session_id] = timer
        timer.start()

    print(
        f"FOLLOWUP TIMER SCHEDULED for {session_id} "
        f"in {delay_seconds} seconds"
    )
