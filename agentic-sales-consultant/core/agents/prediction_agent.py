from openai import OpenAI
import re


client = OpenAI()


def predict_next_step(intent: str, emotion: str, lead_score: int, history: list):
    # Rule-based baseline
    transitions = {
        "SERVICE": "PRICING",
        "PRICING": "ONBOARDING",
        "CASE": "PRICING",
        "OBJECTION": "CASE"
    }

    next_intent = transitions.get(intent, "SERVICE")

    # Readiness
    readiness = "low"
    if lead_score >= 8:
        readiness = "high"
    elif lead_score >= 5:
        readiness = "medium"

    use_llm = False

    # Use LLM if:
    # 1. Unknown intent OR
    # 2. Medium/long conversation OR
    # 3. High-value signals
    if intent not in transitions:
        use_llm = True
    elif len(history) > 2:
        use_llm = True
    elif lead_score >= 7:
        use_llm = True

    if use_llm:
        print("[Prediction Agent] Using LLM reasoning")
        prompt = f"""
        You are a sales AI.

        Given:
        Intent: {intent}
        Emotion: {emotion}
        Lead score: {lead_score}
        Conversation: {history[-3:]}

        Predict:
        1. Next likely intent
        2. Readiness (low/medium/high)
        3. Best action

        Return JSON:
        {{
          "next_intent": "...",
          "readiness": "...",
          "action": "..."
        }}
        """

        try:
            response = client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}]
            )

            import json
            content = response.choices[0].message.content

            json_match = re.search(r'\{.*\}', content, re.DOTALL)

            if json_match:
                result = json.loads(json_match.group())
            else:
                raise ValueError("No JSON found")

            result["confidence"] = 0.85

            print("[Prediction Agent] LLM used")

            return result

        except Exception:
            pass

    print("[Prediction Agent] Using fast rule-based reasoning")

    # Fallback rule output
    action = "nurture"
    if readiness == "high":
        action = "push_booking"
    elif emotion == "negative":
        action = "handle_objection"

    print("[Prediction Agent] Rule-based used")

    return {
        "next_intent": next_intent,
        "readiness": readiness,
        "action": action,
        "confidence": 0.6
    }
