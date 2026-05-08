from nltk.sentiment import SentimentIntensityAnalyzer
import nltk


try:
    nltk.data.find('sentiment/vader_lexicon.zip')
except Exception:
    nltk.download('vader_lexicon')


sia = SentimentIntensityAnalyzer()


def detect_emotion(message: str):
    message_lower = message.lower()

    if any(word in message_lower for word in ["expensive", "costly", "too much", "high price", "pricey", "overpriced"]):
        return {"emotion": "negative", "scores": {}}

    if any(word in message_lower for word in ["not sure", "maybe later", "thinking", "let me think", "i need time"]):
        return {"emotion": "neutral", "scores": {}}

    scores = sia.polarity_scores(message)

    compound = scores["compound"]

    if compound >= 0.3:
        emotion = "positive"
    elif compound <= -0.3:
        emotion = "negative"
    else:
        emotion = "neutral"

    return {
        "emotion": emotion,
        "scores": scores
    }


def map_emotion_to_tone(emotion: str):
    if emotion == "positive":
        return "enthusiastic"
    elif emotion == "negative":
        return "skeptical"
    else:
        return "neutral"
