from core.database import (
    save_lead_db,
    get_all_leads_db,
    get_lead_count_db,
    get_lead_by_session_db
)


def save_lead(
    session_id,
    name=None,
    email=None,
    phone=None,
    business=None,
    intent=None,
    stage=None,
    conversation_summary=None,
    lead_score=None,
    conversation_history=None,
    lead_score_reason=None,
    next_action=None,
    last_user_message=None
):
    return save_lead_db(
        session_id=session_id,
        name=name,
        email=email,
        phone=phone,
        business=business,
        intent=intent,
        stage=stage,
        conversation_summary=conversation_summary,
        lead_score=lead_score,
        conversation_history=conversation_history,
        lead_score_reason=lead_score_reason,
        next_action=next_action,
        last_user_message=last_user_message
    )


def get_all_leads():
    return get_all_leads_db()


def get_lead_by_session(session_id):
    return get_lead_by_session_db(session_id)


def get_lead_count():
    return get_lead_count_db()
