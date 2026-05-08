from core.intent_layer import detect_intent


INTENT_KEYWORDS = {
    "PRICING": ["price", "cost", "budget", "charge", "pricing", "fee", "plan"],
    "SERVICE": ["service", "offer", "what do you do", "help me", "what can you do"],
    "CASE": ["results", "case study", "example", "proof", "success", "clients", "worked with"],
    "ROI": ["roi", "return", "profit"],
    "FAQ": ["how", "process", "time", "duration"],
    "ONBOARDING": ["book", "schedule", "start", "get started", "sign up", "join"],
    "OBJECTION": ["expensive", "not sure", "later", "thinking"],
}

SAFE_INTENTS = ["PRICING", "SERVICE", "CASE", "FAQ", "ONBOARDING"]


def detect_intent_nlp(message: str):
    message = message.lower()
    scores = {}

    for intent, keywords in INTENT_KEYWORDS.items():
        score = 0
        for k in keywords:
            if k in message:
                score += 2

        scores[intent] = score / (len(INTENT_KEYWORDS[intent]) + 1)

    best_intent = max(scores, key=scores.get)
    confidence = scores[best_intent]

    if confidence == 0:
        return "GENERAL", 0.0

    return best_intent, round(confidence, 2)


def hybrid_intent(message: str, history: list):
    intent_nlp, confidence = detect_intent_nlp(message)

    if confidence > 0.2 and intent_nlp in SAFE_INTENTS:
        print("NLP intent used")

        intent = intent_nlp

        intent_map = {
            "PRICING": ["pricing"],
            "SERVICE": ["services"],
            "CASE": ["case"],
            "ROI": ["case"],
            "FAQ": ["faq"],
            "ONBOARDING": ["onboarding"],
            "OBJECTION": ["case"],
            "GENERAL": ["services"],
        }

        knowledge_types = intent_map.get(intent, ["services"])
        tone = "neutral"

        return intent, knowledge_types, tone

    print("LLM fallback used")
    return detect_intent(message, history)
